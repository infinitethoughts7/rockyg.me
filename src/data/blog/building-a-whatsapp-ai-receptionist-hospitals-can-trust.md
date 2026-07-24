---
title: "Building Caira: a WhatsApp AI Receptionist a Hospital Can Trust"
author: Rocky G
pubDatetime: 2026-07-24T00:00:00Z
description: "Caira answers patients on WhatsApp, books appointments, and knows when to say 'let me check.' A plain-English tour of how you make an AI agent trustworthy enough for healthcare: grounding it so it cannot lie, walling off every clinic, and keeping it cheap and alive when the model goes down."
featured: true
tags:
  - technical
  - ai-agents
  - caira
---

## Table of contents

## The stakes

A clinic's front desk in India misses calls all day. Patients call during lunch, at midnight, on the Sunday a baby's fever spikes. And when nobody picks up, they do the most natural thing in the country. They open WhatsApp and send a message.

So we built Caira, a WhatsApp receptionist for clinics. A patient messages the clinic's number, and Caira answers questions, books appointments, sends reminders, and runs the waitlist, with no human picking up. It runs in production for a paying clinic in Hyderabad, on one codebase built to serve many clinics at once.

Here is the thing nobody tells you about putting AI in a hospital.

The hard part is not making the bot answer. Any modern model answers anything, instantly and beautifully. The hard part is making it answer like an employee who knows the rules, admits what she does not know, and never, ever invents a consultation fee.

A chatbot that makes up a price in an online store costs you a sale. A chatbot that makes up a price in a hospital costs you the hospital.

So this post is not really about prompts or models. It is about the boring, careful engineering that turns a clever demo into something a clinic will actually hand its patients. I have kept the code to a minimum, because the ideas are the real story.

## What Caira is, in one picture

Caira is one system serving many clinics. A patient sends a WhatsApp message to a clinic's number. Caira works out which clinic that is, understands what the patient wants, and either answers from that clinic's real facts or walks them through booking, then sends the reply. Usually in under two seconds.

Under the hood it is deliberately ordinary infrastructure, chosen so the interesting risk lives in the design and not in the plumbing:

- **The channel** is the official WhatsApp Cloud API.
- **The brain** is Google's Gemini, used carefully and only where it belongs.
- **The memory** is a Postgres database (on Supabase), the single source of truth.
- **The speed layer** is a Redis cache (Upstash) for answers that repeat.
- **The home** is stateless functions on Vercel, so it scales by simply running more copies.
- Plus translation, payments, and tracing, each of which I will get to.

<svg viewBox="0 0 700 190" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;margin:1rem 0">
  <g font-family="sans-serif" font-size="11" font-weight="700">
    <rect x="8" y="70" width="112" height="50" rx="10" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
    <text x="64" y="92" text-anchor="middle" fill="#166534">patient message</text>
    <text x="64" y="107" text-anchor="middle" fill="#15803d" font-size="9">on WhatsApp</text>
    <line x1="120" y1="95" x2="150" y2="95" stroke="#4f6d68" stroke-width="2"/>
    <rect x="152" y="70" width="112" height="50" rx="10" fill="#ccfbf1" stroke="#0d9488" stroke-width="2"/>
    <text x="208" y="92" text-anchor="middle" fill="#115e59">find the clinic</text>
    <text x="208" y="107" text-anchor="middle" fill="#0f766e" font-size="9">by its number</text>
    <line x1="264" y1="95" x2="294" y2="95" stroke="#4f6d68" stroke-width="2"/>
    <rect x="296" y="70" width="110" height="50" rx="10" fill="#0d9488"/>
    <text x="351" y="91" text-anchor="middle" fill="#fff">understand</text>
    <text x="351" y="106" text-anchor="middle" fill="#ccfbf1" font-size="9">what do they want?</text>
    <line x1="406" y1="88" x2="440" y2="55" stroke="#4f6d68" stroke-width="2"/>
    <line x1="406" y1="102" x2="440" y2="135" stroke="#4f6d68" stroke-width="2"/>
    <rect x="442" y="30" width="132" height="46" rx="10" fill="#ccfbf1" stroke="#0d9488" stroke-width="2"/>
    <text x="508" y="50" text-anchor="middle" fill="#115e59">answer a question</text>
    <text x="508" y="65" text-anchor="middle" fill="#0f766e" font-size="9">only from clinic facts</text>
    <rect x="442" y="114" width="132" height="46" rx="10" fill="#fff" stroke="#134e4a" stroke-width="2"/>
    <text x="508" y="134" text-anchor="middle" fill="#134e4a">book an appointment</text>
    <text x="508" y="149" text-anchor="middle" fill="#4f6d68" font-size="9">no AI, just the calendar</text>
    <line x1="574" y1="53" x2="600" y2="88" stroke="#4f6d68" stroke-width="2"/>
    <line x1="574" y1="137" x2="600" y2="102" stroke="#4f6d68" stroke-width="2"/>
    <rect x="602" y="70" width="90" height="50" rx="10" fill="#ccfbf1" stroke="#0d9488" stroke-width="2"/>
    <text x="647" y="98" text-anchor="middle" fill="#115e59">reply sent</text>
  </g>
</svg>

Everything a patient can do flows through that one trip. The rest of this post opens up each interesting box along the way. A few things to hold onto before we start:

- One codebase, many clinics, each fully walled off from the others.
- A typical AI answer costs a fraction of a rupee. A repeated one costs nothing.
- A booking costs zero AI. It is just the calendar and the database.
- When the model is rate-limited or down, Caira keeps answering anyway.

## The one hard problem: a receptionist that cannot lie

This is a healthcare product. If Caira invents a doctor, a fee, or a set of timings, that is not a cute glitch. That is a patient shown wrong medical information under a clinic's name. So the central decision was never which model to use. It was how to make the model structurally unable to answer outside the facts it was handed.

The mental model is a receptionist with a binder. She does not answer from memory, or from something she read on the internet. She answers from the clinic's own binder on the desk, and when the question is not in the binder, she says "let me check and get back to you." Caira works exactly like that.

Three things enforce it, and no single one is trusted on its own.

**One: we only hand it the facts.** For every question, Caira is given a small card of that clinic's verified facts (timings, fees, services, doctors) and one hard rule: answer only from this card, nothing else is authoritative. The facts live in the database, not inside the model, so when a clinic changes its fee, someone edits one row and nobody retrains anything.

**Two: we make it answer on a form, not in a paragraph.** Caira must reply with a small structured object, and the field that matters is a flag: did I actually answer this from the facts, yes or no?

```json
{ "answered": true,  "reply": "We're open Mon to Sat, 9am to 7pm." }
{ "answered": false, "reply": "Let me check with the clinic and get back to you." }
```

When that flag comes back false, Caira does not improvise. It tells the patient a human will check, and hands the conversation to staff. It never bluffs to fill a silence.

**Three: we refuse to trust what comes back.** The model's reply is inspected before anything uses it. It is capped in length, so an injected essay cannot get through, and any web link the model tries to slip in is stripped out. A link in a grounded answer is either a hallucination or an attack, never something the model should be producing. The clinic's real map link is attached afterwards by our own code, not by the model.

> **The one guarantee.** Every path that could go wrong ends the same way: "a human will check," never "here is a made-up number." That single property is what a clinic is actually buying. They did not ask us for a smarter bot. They asked whether they can trust what it tells their patients, which is a much harder thing to promise.

## One bot, many clinics, and never a mix-up

Caira serves many clinics from one codebase, which raises the scariest question in the whole system. What stops clinic A's data from ever reaching clinic B?

Two answers, and the second is the one that lets me sleep.

First, Caira works out the clinic from the WhatsApp number the message physically arrived on, never from anything inside the message. A patient cannot pretend to be a different clinic. The worst they can do is message a number that maps to nothing, and get ignored.

Second, and this is the important one, the wall between clinics is enforced by the database itself, not by the bot's code. Every clinic's rows are locked, and each request can unlock only the one clinic it is serving. Engineers call this row-level security. The plain version: even if the bot's code has a bug and forgets to filter, the database still refuses to hand over another clinic's rows.

That is the difference between "we are careful" and "it is impossible." A lock you have to remember to click is not a lock. This one clicks itself, and healthcare needs exactly that.

## The move that makes it fast and almost free

The same handful of questions arrive thousands of times a day. "Timings?" "Where are you?" "How much is the consultation?" Sending every one of those to the AI would be slow and wasteful, because the answer never changes.

So Caira remembers. The first time a question is answered, the answer is saved. The next patient who asks the same thing gets it instantly, for free, with no AI call at all.

The entire risk in a memory like this is one thing: in a multi-tenant system, a careless memory is a data leak between clinics. So how each answer is filed matters enormously. Caira stamps every saved answer with a fingerprint of that clinic's fact sheet:

```txt
memory key = fingerprint(this clinic's facts) + the cleaned-up question
```

That one line quietly does two important jobs. Clinic A's facts fingerprint differently from clinic B's, so A's saved answers can never be served to B; the isolation is baked into the key, not left to a rule someone might forget. And the moment a clinic edits a fee or a timing, its fingerprint changes, so every stale answer stops matching and quietly retires itself. Nobody ever has to remember to clear the cache.

One deliberate choice: Caira never saves an "I don't know." If it filed a handoff, then a one-off hiccup with the model would get stuck, and the bot would keep handing off long after the model recovered. Only real, grounded, successful answers are worth remembering.

## What a conversation actually costs

"AI is expensive" is a vibe, not a number. So every model call is metered: tokens counted, time measured, turned into a cost, and tagged so one message's costs group together. Here is the honest economics of a turn, using Gemini's published rates. The token counts are typical estimates, labelled as such.

| What happens | Uses the AI? | Roughly costs |
|---|---|---|
| Understanding what the patient wants | yes, briefly | a paisa or two |
| Answering a question, first time | yes | a fraction of a rupee |
| Answering a repeat question | no, it is remembered | nothing |
| Booking an appointment | no AI at all | nothing |

The punchline is the bottom two rows. The expensive, hallucination-prone part, answering a free-text question, is the one part that caches beautifully. And booking, the actual point of the product, uses zero AI. The whole booking form runs on plain database reads, with the model only classifying the single message that opens it. So at steady state, most patient interactions cost a fraction of a rupee, and a large share cost exactly nothing.

## Every supplier is a plug, not a weld

A product like this leans on a lot of outside companies: the AI model, WhatsApp, the database, a payment provider, a translation service. Every one of them can change its prices, break, or need replacing. So the rule in the code is strict. The core of Caira never talks to any of them directly. It talks to a plug, and each vendor sits behind that plug.

<svg viewBox="0 0 700 285" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;margin:1rem 0">
  <g font-family="sans-serif" font-size="11" font-weight="700">
    <polygon points="350,92 412,127 412,177 350,212 288,177 288,127" fill="#0d9488"/>
    <text x="350" y="148" text-anchor="middle" fill="#fff" font-size="13">Caira core</text>
    <text x="350" y="165" text-anchor="middle" fill="#ccfbf1" font-size="8.5">talks to plugs, not vendors</text>
    <line x1="288" y1="132" x2="182" y2="92" stroke="#4f6d68" stroke-width="1.5"/>
    <rect x="60" y="68" width="122" height="46" rx="9" fill="#ccfbf1" stroke="#0d9488" stroke-width="2"/>
    <text x="121" y="88" text-anchor="middle" fill="#115e59">AI model</text>
    <text x="121" y="103" text-anchor="middle" fill="#0f766e" font-size="9">Gemini, swappable</text>
    <line x1="288" y1="172" x2="182" y2="212" stroke="#4f6d68" stroke-width="1.5"/>
    <rect x="60" y="190" width="122" height="46" rx="9" fill="#ccfbf1" stroke="#0d9488" stroke-width="2"/>
    <text x="121" y="210" text-anchor="middle" fill="#115e59">database</text>
    <text x="121" y="225" text-anchor="middle" fill="#0f766e" font-size="9">Postgres, the vault</text>
    <line x1="412" y1="132" x2="518" y2="92" stroke="#4f6d68" stroke-width="1.5"/>
    <rect x="518" y="68" width="122" height="46" rx="9" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
    <text x="579" y="88" text-anchor="middle" fill="#166534">WhatsApp</text>
    <text x="579" y="103" text-anchor="middle" fill="#15803d" font-size="9">the channel</text>
    <line x1="412" y1="172" x2="518" y2="212" stroke="#4f6d68" stroke-width="1.5"/>
    <rect x="518" y="190" width="122" height="46" rx="9" fill="#ccfbf1" stroke="#0d9488" stroke-width="2"/>
    <text x="579" y="210" text-anchor="middle" fill="#115e59">payments</text>
    <text x="579" y="225" text-anchor="middle" fill="#0f766e" font-size="9">Razorpay, swappable</text>
    <line x1="350" y1="212" x2="350" y2="242" stroke="#134e4a" stroke-width="1.5"/>
    <rect x="248" y="242" width="204" height="32" rx="8" fill="#fff" stroke="#134e4a" stroke-width="2"/>
    <text x="350" y="262" text-anchor="middle" fill="#134e4a" font-size="10">one file picks each plug</text>
  </g>
</svg>

Engineers call this ports and adapters. The plain version: the AI model is a plug, WhatsApp is a plug, the database is a plug. Swapping Gemini for another model, or Razorpay for another payment provider, means building one new plug and changing one line in the single file that decides which plugs to use. The booking logic never even finds out.

This is not theory. Two of the plugs in the codebase, a different calendar provider and a different dashboard, are built but not switched on, which is the clearest proof that "swap without touching the core" is real and not a nice thing I say in interviews. It is also what makes the whole thing testable: the entire core can run on harmless stand-in plugs with no real accounts and no secrets, so the logic is tested without ever calling a real vendor.

## The two bugs that cost me real days

Anyone can wire an AI to a webhook in an afternoon. The days went into two failures that a happy-path demo never shows, and both taught the same lesson.

**The booking form that died on the last screen.** Pick a doctor, and the appointment form instantly showed "Couldn't load content." Only on the slot-picking screen. Only against the real database. The tests were green. The cause was speed wearing a disguise: the screen checked a week of availability one day at a time, in sequence, seven slow trips to the database, and blew past WhatsApp's deadline for that screen. WhatsApp renders a missed deadline as a generic load failure, which is why it looked like a content bug. The fix was to check all seven days at once instead of one after another. The results are identical; it just stopped waiting in line. Six seconds became under two.

**The reminder job that failed every single night.** Every night, the reminders never went out. The cause, in plain terms, was that a date was handed to the database in a format that one particular query could not read. Booking worked fine, because that path converted the date correctly; this one raw query did not, which is exactly why the stand-in tests passed while the real thing was dead on arrival.

> **The lesson that changed how I test.** In both bugs, the stand-in passed while the real thing was broken. Tests over stand-ins protect your logic. They do not protect your wiring to the outside world. A thin layer of tests against the real database is not optional. A green test suite is necessary, not sufficient.

## Two patients, one appointment slot

The moment a system is real, two people tap the last 4pm slot at the same instant. Who gets it?

The honest answer is that hopeful code inside the bot cannot be trusted to decide this correctly under a race. Only the database can truly settle a tie, so the database is the referee. Every booking carries a key that is unique per doctor-and-time, and if two patients somehow reach the finish line together, the database rejects the second one and Caira tells them to pick another slot. Correctness is defended in the one place that can actually enforce it, not in wishful thinking.

## When the AI goes down, the clinic stays open

Models get rate-limited. Networks flake. Any company you do not control will be unavailable at the worst possible moment, and a patient mid-booking does not care whose fault it is.

So Caira runs two brains behind the same plug. The primary is Gemini: smart, grounded, and it costs money. The backup is a simple keyword matcher: plainer, free, and effectively impossible to take down. When the model is rate-limited or times out, traffic quietly drops to the backup. Answers get simpler. The clinic never goes silent.

That is the whole philosophy in one line: the availability of the product should not depend on the availability of any single vendor. Combined with the memory from earlier, a large share of traffic never needs the model at all.

Degrade, do not die. Patients forgive a plain answer. They do not forgive silence.

## What I actually learned

Everyone is building AI agents this year. Most of them are demos wearing a product's clothes.

The model is the easy part, and honestly the swappable part. Everyone has the same models. The engineering that turns one into a product a clinic will trust is all the unglamorous machinery around it: grounding it so it cannot lie, walling off each clinic so it cannot leak, metering it so it cannot surprise you on the bill, and degrading gracefully so the product outlives the vendor.

Trust is not a feature you sprinkle on at the end. It is the architecture. That is the whole job.
