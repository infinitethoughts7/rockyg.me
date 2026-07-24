---
title: "Building a WhatsApp AI Receptionist a Hospital Can Trust"
author: Rocky G
pubDatetime: 2026-07-24T00:00:00Z
description: "ClinicBot answers patients on WhatsApp, books appointments, and knows when to shut up. A visual tour of the six engineering decisions that make an AI agent trustworthy enough for healthcare."
featured: true
tags:
  - technical
  - ai-agents
  - clinicbot
---

## Table of contents

## The stakes

A clinic's front desk in India misses calls all day. Patients call during lunch, at midnight, on Sundays. They switch to WhatsApp because that is where India actually talks. So we built ClinicBot, a WhatsApp AI receptionist that books appointments, answers questions, and sends reminders. It is in production today with a paying clinic in Hyderabad.

Here is the thing nobody tells you about AI in healthcare.

The hard part is not making the bot answer. Gemini answers anything. The hard part is making it answer like an employee who knows the rules, admits what it does not know, and never, ever invents a consultation fee.

A chatbot that hallucinates a price in an e-commerce store loses you a sale. A chatbot that hallucinates in a hospital loses you the hospital.

So this post is not about prompts. It is about the six engineering decisions that make the difference between a demo and a product a clinic pays for.

## The whole system in one picture

Every AI agent, stripped of hype, is a loop: perceive, think, act, check.

<svg viewBox="0 0 680 150" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;margin:1rem 0">
  <style>.cbdash{stroke-dasharray:7 5;animation:cbd 1.2s linear infinite}@keyframes cbd{to{stroke-dashoffset:-12}}</style>
  <g font-family="sans-serif" font-size="12" font-weight="700">
    <rect x="10" y="50" width="115" height="50" rx="10" fill="#ccfbf1" stroke="#0d9488" stroke-width="2"/>
    <text x="67" y="72" text-anchor="middle" fill="#115e59">patient msg</text>
    <text x="67" y="88" text-anchor="middle" fill="#0f766e" font-size="9.5">WhatsApp webhook</text>
    <line x1="125" y1="75" x2="175" y2="75" stroke="#4f6d68" stroke-width="2" class="cbdash"/>
    <rect x="180" y="35" width="135" height="80" rx="10" fill="#0d9488"/>
    <text x="247" y="65" text-anchor="middle" fill="#fff">BOT BRAIN</text>
    <text x="247" y="82" text-anchor="middle" fill="#ccfbf1" font-size="9.5">guardrails → intent</text>
    <text x="247" y="96" text-anchor="middle" fill="#ccfbf1" font-size="9.5">→ flows → grounded QA</text>
    <line x1="315" y1="75" x2="365" y2="75" stroke="#4f6d68" stroke-width="2" class="cbdash"/>
    <rect x="370" y="50" width="115" height="50" rx="10" fill="#ccfbf1" stroke="#0d9488" stroke-width="2"/>
    <text x="427" y="72" text-anchor="middle" fill="#115e59">action</text>
    <text x="427" y="88" text-anchor="middle" fill="#0f766e" font-size="9.5">book · answer · escalate</text>
    <line x1="485" y1="75" x2="535" y2="75" stroke="#4f6d68" stroke-width="2" class="cbdash"/>
    <rect x="540" y="50" width="130" height="50" rx="10" fill="#fff" stroke="#134e4a" stroke-width="2"/>
    <text x="605" y="72" text-anchor="middle" fill="#134e4a">save state</text>
    <text x="605" y="88" text-anchor="middle" fill="#4f6d68" font-size="9.5">only AFTER send succeeds</text>
  </g>
</svg>

One conversation flows left to right in about two seconds. Everything interesting in this post lives inside those boxes.

## Decision 1: the bot answers only from facts it was given

When a patient asks "what are your timings?", ClinicBot never asks the model to recall anything. Recall is where hallucination lives. Instead it constructs the answer from a small card of verified clinic facts injected into the context at request time, under one hard constraint: answer only from this card, and if the answer is not on it, say so. This is grounding, and it matters more than model size. A grounded small model beats an ungrounded large one on the only axis a clinic cares about, which is whether the sentence it just sent a patient is true. Grounding also keeps facts in data, not in weights. When a clinic changes its consultation fee, we edit one row. Nobody retrains anything.

<svg viewBox="0 0 680 170" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;margin:1rem 0">
  <g font-family="sans-serif" font-size="12" font-weight="700">
    <rect x="10" y="60" width="140" height="46" rx="10" fill="#ccfbf1" stroke="#0d9488" stroke-width="2"/>
    <text x="80" y="80" text-anchor="middle" fill="#115e59">"do you take</text>
    <text x="80" y="96" text-anchor="middle" fill="#115e59">insurance?"</text>
    <line x1="150" y1="83" x2="205" y2="83" stroke="#4f6d68" stroke-width="2"/>
    <rect x="210" y="20" width="230" height="130" rx="12" fill="#fff" stroke="#0d9488" stroke-width="2.5"/>
    <text x="325" y="42" text-anchor="middle" fill="#134e4a" font-size="11">THE FACTS CARD</text>
    <g font-size="10.5" font-weight="600" fill="#0f766e">
      <text x="230" y="64">✓ timings: 9am to 8pm</text>
      <text x="230" y="82">✓ fee: ₹300</text>
      <text x="230" y="100">✓ services: general, pediatrics</text>
      <text x="230" y="118">✗ insurance: not on the card</text>
    </g>
    <text x="325" y="142" text-anchor="middle" fill="#4f6d68" font-size="9.5">nothing else is authoritative</text>
    <line x1="440" y1="60" x2="500" y2="45" stroke="#0d9488" stroke-width="2.5"/>
    <line x1="440" y1="105" x2="500" y2="125" stroke="#134e4a" stroke-width="2.5"/>
    <rect x="505" y="22" width="165" height="42" rx="9" fill="#0d9488"/>
    <text x="587" y="48" text-anchor="middle" fill="#fff" font-size="11">on the card → answer</text>
    <rect x="505" y="108" width="165" height="42" rx="9" fill="#fff" stroke="#134e4a" stroke-width="2"/>
    <text x="587" y="127" text-anchor="middle" fill="#134e4a" font-size="11">not on the card →</text>
    <text x="587" y="141" text-anchor="middle" fill="#134e4a" font-size="11">"let me check with staff"</text>
  </g>
</svg>

Every reply comes back with a self-reported flag, answered true or false. I treat that flag as a routing signal, not a guarantee, because a model that will hallucinate an answer will just as happily hallucinate its confidence in it. The real safety property sits upstream: the context contains nothing unverified, so the model has nothing false to reach for. A model can only be as wrong as the context you hand it. When the flag comes back false, the bot says "let me check with the clinic and get back to you" and hands the thread to a human. It never bluffs to fill a silence.

This reads like a limitation. It is the product. Clinics never asked us for a smarter bot. They asked whether they could trust what it tells their patients, which is a different and much harder specification.

## Decision 2: emergencies skip everything

Before intent detection, before booking flows, before the LLM is even called, one deterministic check runs first: does this message look like an emergency? Chest pain, breathlessness, heavy bleeding. If the triage layer fires, every other feature steps aside, the bot tells the patient to call 108, and the clinic is alerted. No model creativity is welcome in that moment.

Two choices make this real. First, the check is deterministic and sits ahead of the LLM, so nothing the model does, and nothing a patient can type to jailbreak it, can suppress it. A safety layer that lives inside the thing it is guarding against is not a safety layer. Second, it is tuned for recall over precision on purpose. A false positive tells a healthy patient to call an ambulance they did not need. A false negative routes a real emergency into a booking flow. Those two errors are not equal in cost, so the threshold that separates them is not set at the midpoint.

The ordering is the whole point. Safety checks that run after the clever features are decoration. Ours run first, deterministically, on every single message.

## Decision 3: the model fills forms, not essays

When Gemini reads "kal Dr. Rao se milna hai", a code-switched mix of Hindi and English that a rule-based parser would choke on, we do not accept a paragraph back. We force a form:

```json
{ "intent": "book_appointment", "doctor": "dr_rao", "day": "tomorrow", "time": null, "confidence": 0.93 }
```

Every model response is validated against a schema (Zod) at the boundary, before a single line of business logic touches it. The schema is a contract: the model is free to be creative inside the fields and forbidden from changing their shape. A response that does not fit is a typed failure, not something we parse hopefully, and a failure does not crash the conversation. It routes to a repair attempt or a clarifying question, never a silent guess.

Two details in that small object carry real weight. `confidence: 0.93` is a gate, not decoration: a low score routes to a confirming question instead of an action, so the bot asks before it books. And `time: null` is not a gap, it is dialog state. The bot now knows exactly which slot is unfilled, and therefore exactly what to ask next. Structured extraction turns a vague sentence into a checklist that code can finish deterministically.

Code can trust forms. Code cannot trust essays. Most agent bugs I have seen in the wild are essays being parsed with fingers crossed.

## Decision 4: when the brain fails, a smaller brain takes over

Gemini rate-limits. Gemini times out. Networks flake. Any component you do not control is a component that will be down at the worst possible moment, and a patient mid-booking does not care whose fault it was.

<svg viewBox="0 0 680 160" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;margin:1rem 0">
  <style>.cbdash2{stroke-dasharray:7 5;animation:cbd2 1.2s linear infinite}@keyframes cbd2{to{stroke-dashoffset:-12}}</style>
  <g font-family="sans-serif" font-size="12" font-weight="700">
    <rect x="10" y="55" width="110" height="46" rx="10" fill="#ccfbf1" stroke="#0d9488" stroke-width="2"/>
    <text x="65" y="82" text-anchor="middle" fill="#115e59">message</text>
    <line x1="120" y1="78" x2="180" y2="78" stroke="#4f6d68" stroke-width="2" class="cbdash2"/>
    <rect x="185" y="52" width="110" height="52" rx="10" fill="#fff" stroke="#134e4a" stroke-width="2"/>
    <text x="240" y="74" text-anchor="middle" fill="#134e4a">ROUTER</text>
    <text x="240" y="92" text-anchor="middle" fill="#4f6d68" font-size="9.5">one interface</text>
    <line x1="295" y1="65" x2="360" y2="35" stroke="#0d9488" stroke-width="2.5" class="cbdash2"/>
    <line x1="295" y1="92" x2="360" y2="122" stroke="#0f766e" stroke-width="2.5" class="cbdash2"/>
    <rect x="365" y="14" width="150" height="44" rx="9" fill="#0d9488"/>
    <text x="440" y="34" text-anchor="middle" fill="#fff" font-size="11">Gemini, healthy day</text>
    <text x="440" y="49" text-anchor="middle" fill="#ccfbf1" font-size="9.5">smart, grounded answers</text>
    <rect x="365" y="102" width="150" height="44" rx="9" fill="#99f6e4"/>
    <text x="440" y="122" text-anchor="middle" fill="#134e4a" font-size="11">keyword brain, bad day</text>
    <text x="440" y="137" text-anchor="middle" fill="#134e4a" font-size="9.5">simpler, free, always alive</text>
    <text x="595" y="75" text-anchor="middle" fill="#0f766e" font-size="10.5">the clinic</text>
    <text x="595" y="91" text-anchor="middle" fill="#134e4a" font-size="10.5" font-weight="800">never goes silent</text>
  </g>
</svg>

So the bot runs two brains behind one interface. Primary is Gemini: smart, grounded, expensive. Fallback is a deterministic keyword matcher: simpler, free, and effectively impossible to take down. Both satisfy the same internal contract, so the rest of the system neither knows nor cares which one answered. On a 429 or a timeout, traffic degrades to the keyword brain instead of throwing an error into a patient's chat.

The real move is decoupling availability from intelligence. Most designs bind the two together, so when the smart path is down the whole product is down. Splitting them puts a floor under quality that never falls to zero. The clinic stays open on its worst infrastructure day, just with plainer answers.

Degrade, do not die. Patients forgive a plain reply. They do not forgive silence.

## Decision 5: retries can never double-book

WhatsApp delivery is at-least-once by design. If Meta's webhook does not get a fast acknowledgement, it assumes failure and resends the same message. That is correct behavior for a delivery network and a trap for a naive bot, which cheerfully books the appointment twice.

You cannot make the channel deliver exactly once. That guarantee does not exist over an unreliable network. So instead you make your own processing idempotent, and two rules do it. First, every Meta message carries a unique id, and we refuse to act on an id we have already seen, so a redelivery becomes a no-op rather than a second booking. Second, we persist conversation state only after a reply has actually been sent, never before. That ordering makes each turn atomic with respect to its side effect: a crash mid-flight leaves the patient exactly where they were, not half-booked in limbo.

Nobody demos idempotency on a stage. It is also the first thing that breaks in production, the moment real traffic and real retries arrive.

## Decision 6: one codebase, every tenant isolated at the database

ClinicBot is multi-tenant from the first line, even though one paying clinic is live on it today. That is deliberate. Retrofitting isolation onto a single-tenant system later is a rewrite, so the tenant boundary belongs in the design from the start. Every table carries a clinic id, the tenant is resolved from the incoming WhatsApp number on the way in, and every query runs through Postgres row-level security scoped to that tenant. What matters is where the boundary lives. Isolation is enforced by the database, not by application code, so even a bug in a query cannot leak one clinic's patients into another's. The database itself refuses. Security you can forget to apply is not security, and RLS is the version you cannot forget.

The system is also built on ports and adapters. The core domain logic never touches Gemini, WhatsApp, or the translation service directly. It talks only to interfaces the domain owns, and each vendor lives behind an adapter that implements one. Every vendor is a plug. Swapping Gemini for another model is a new adapter file and one changed line in the composition root, the single place where concrete implementations get wired in. The booking logic never learns anything changed. That decoupling is also what lets the two-brain fallback from Decision 4 exist at all: the keyword brain is just a second adapter behind the same port.

## What I am building next

The system above earns trust by construction. The next layer earns it by measurement, and that work is in progress right now.

- **Evals.** A versioned test set of real patient questions with known correct answers, scored on every change and wired into CI as a regression gate, so a deploy that makes the bot measurably worse never ships. Prompts are code, and code without tests rots.
- **Tracing.** Every message gets an x-ray: each step timed, each token counted, cost attributed per conversation. You cannot debug or price a system you cannot see, and a distributed prompt pipeline is exactly the kind of thing that hides its own cost.
- **Model routing.** Intent detection is a small, cheap job that does not deserve the flagship model. It moves to a smaller model, and the expensive one is reserved for the grounded answers that actually need it. A cascade, rather than one model for everything, is how you keep quality high and cost sane at the same time.

## What I believe

Everyone is building AI agents this year. Most of them are demos wearing product clothing.

The difference is not the model. Everyone has the same models. The difference is the boring machinery around the model: the facts card, the triage gate, the schema, the fallback, the idempotency key, the tenant wall. That machinery is what lets a real clinic hand its front desk to software.

Trust is not a feature you add later. It is the architecture.
