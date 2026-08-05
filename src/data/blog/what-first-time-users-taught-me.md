---
title: "What First-Time Users Taught Me About Building AI Products"
author: Rocky G
pubDatetime: 2026-05-15T00:00:00Z
description: "I taught AI to school girls who had never touched a laptop, and I ship AI products to clinic staff who never asked for AI. Same users, same lessons. The classroom turned out to be my best product research."
featured: false
tags:
  - ai-literacy
  - product
  - technical
---

## Table of contents

## Two jobs, one user

By day I build AI products: a WhatsApp receptionist that clinic staff in Hyderabad rely on, order-intelligence software for medication repackagers. Earlier this year I also led an AI literacy program across 40 minority schools in Telangana, where 2,051 students, 9th standard girls, most of whom had never touched a laptop, learned to use AI in four days.

I thought I was doing two different jobs. I was doing one.

A 14-year-old opening ChatGPT for the first time and a 45-year-old clinic receptionist meeting an AI bot in her WhatsApp are the same user. No mental model of the technology. No patience for jargon. No reason to trust you yet. And most of the world's next billion AI users look exactly like them, not like the people building the products.

The classroom, it turns out, was the best product research I have ever done. Here is what it taught me.

<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The classroom student and the clinic receptionist converge into the same first-time user, who stands for the next billion users" style="width:100%;height:auto;margin:1.5rem 0">
  <style>.ft1{stroke-dasharray:6 5;animation:ft1flow 1.2s linear infinite}@keyframes ft1flow{to{stroke-dashoffset:-11}}@media (prefers-reduced-motion:reduce){.ft1{animation:none}}</style>
  <g font-family="sans-serif">
    <rect x="30" y="30" width="190" height="64" rx="10" fill="var(--background)" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.5"/>
    <text x="125" y="52" text-anchor="middle" font-size="9" font-weight="800" letter-spacing="1.5" fill="var(--accent)">THE CLASSROOM</text>
    <text x="125" y="70" text-anchor="middle" font-size="10" fill="currentColor">9th standard girl,</text>
    <text x="125" y="84" text-anchor="middle" font-size="10" fill="currentColor">first laptop ever</text>
    <rect x="30" y="146" width="190" height="64" rx="10" fill="var(--background)" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.5"/>
    <text x="125" y="168" text-anchor="middle" font-size="9" font-weight="800" letter-spacing="1.5" fill="var(--accent)">THE CLINIC</text>
    <text x="125" y="186" text-anchor="middle" font-size="10" fill="currentColor">receptionist, AI arrives</text>
    <text x="125" y="200" text-anchor="middle" font-size="10" fill="currentColor">in her WhatsApp</text>
    <line x1="220" y1="62" x2="280" y2="110" stroke="currentColor" opacity="0.45" stroke-width="1.5" class="ft1"/>
    <line x1="220" y1="178" x2="280" y2="130" stroke="currentColor" opacity="0.45" stroke-width="1.5" class="ft1"/>
    <rect x="285" y="66" width="190" height="108" rx="12" fill="var(--accent)" fill-opacity="0.06" stroke="var(--accent)" stroke-width="1.5"/>
    <text x="380" y="92" text-anchor="middle" font-size="10.5" font-weight="800" fill="currentColor">THE SAME USER</text>
    <text x="380" y="114" text-anchor="middle" font-size="10" fill="currentColor">no mental model</text>
    <text x="380" y="134" text-anchor="middle" font-size="10" fill="currentColor">no patience for jargon</text>
    <text x="380" y="154" text-anchor="middle" font-size="10" fill="currentColor">no reason to trust you yet</text>
    <line x1="475" y1="120" x2="525" y2="120" stroke="var(--accent)" stroke-width="2" class="ft1"/>
    <rect x="530" y="90" width="120" height="60" rx="10" fill="var(--accent)"/>
    <text x="590" y="115" text-anchor="middle" font-size="10.5" font-weight="800" fill="var(--background)">THE NEXT</text>
    <text x="590" y="131" text-anchor="middle" font-size="10.5" font-weight="800" fill="var(--background)">BILLION USERS</text>
  </g>
</svg>

## Lesson 1: nobody trusts a thing they cannot predict

In the classroom, the moment that unlocked everything was never the flashy demo. It was when a girl typed a question, got an answer, typed a similar question, and got a similar answer. You could see it on her face: I know what this thing will do. Only after that did she get adventurous.

Clinic staff are identical. What made them accept our bot was not intelligence, it was consistency. The bot always greets the same way. Always asks for the same details in the same order. Always says "let me check with the clinic" when it does not know, instead of improvising something new each time.

In my code this became a design rule: deterministic flows wherever the stakes are high, and the LLM confined to controlled slots inside them, never left to drive the conversation on its own. Predictability is a property you design in, not a lucky side effect of a good model. Users do not want a creative receptionist. They want a reliable one with a warm voice.

<svg viewBox="0 0 680 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A fixed rail of steps: greet, collect details, answer, and hand off, with the LLM confined to small slots inside the steps" style="width:100%;height:auto;margin:1.5rem 0">
  <style>.ft2{stroke-dasharray:6 5;animation:ft2flow 1.2s linear infinite}@keyframes ft2flow{to{stroke-dashoffset:-11}}@media (prefers-reduced-motion:reduce){.ft2{animation:none}}</style>
  <g font-family="sans-serif">
    <text x="30" y="26" font-size="9" font-weight="800" letter-spacing="2" fill="var(--accent)">THE RAIL IS FIXED · THE MODEL RIDES IN SLOTS</text>
    <g stroke="currentColor" opacity="0.5" stroke-width="2">
      <line x1="178" y1="80" x2="196" y2="80" class="ft2"/>
      <line x1="344" y1="80" x2="362" y2="80" class="ft2"/>
      <line x1="510" y1="80" x2="528" y2="80" class="ft2"/>
    </g>
    <rect x="30" y="44" width="148" height="72" rx="10" fill="var(--background)" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.5"/>
    <text x="104" y="68" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">greet</text>
    <text x="104" y="84" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.65">always the same words</text>
    <rect x="196" y="44" width="148" height="72" rx="10" fill="var(--background)" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.5"/>
    <text x="270" y="66" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">collect details</text>
    <text x="270" y="80" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.65">same order, every time</text>
    <rect x="222" y="90" width="96" height="18" rx="6" fill="var(--accent)" fill-opacity="0.15" stroke="var(--accent)" stroke-width="1" stroke-dasharray="3 3"/>
    <text x="270" y="102.5" text-anchor="middle" font-size="8.5" font-weight="700" fill="var(--accent)">LLM slot</text>
    <rect x="362" y="44" width="148" height="72" rx="10" fill="var(--background)" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.5"/>
    <text x="436" y="66" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">answer</text>
    <text x="436" y="80" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.65">from verified facts only</text>
    <rect x="388" y="90" width="96" height="18" rx="6" fill="var(--accent)" fill-opacity="0.15" stroke="var(--accent)" stroke-width="1" stroke-dasharray="3 3"/>
    <text x="436" y="102.5" text-anchor="middle" font-size="8.5" font-weight="700" fill="var(--accent)">LLM slot</text>
    <rect x="528" y="44" width="122" height="72" rx="10" fill="var(--background)" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.5"/>
    <text x="589" y="68" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">stuck?</text>
    <text x="589" y="84" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.65">say so, hand to a human</text>
    <text x="340" y="140" text-anchor="middle" font-size="9.5" fill="currentColor" opacity="0.65">the model never drives · it fills the slots the rail allows</text>
  </g>
</svg>

## Lesson 2: the first wrong answer costs you everything

With first-time users there is no benefit of the doubt in the bank. In week one of the program, if ChatGPT had confidently told a student something false about her own textbook, the teachers watching would have written off the whole technology, and forty schools would have heard about it.

That is why Caira, my clinic bot, is grounded: it answers only from verified clinic facts, and when the answer is not there, it says so and hands off to a human. I used to describe that as a safety feature. The classroom taught me it is an adoption feature. Trust compounds like interest, and a single early hallucination is a withdrawal you cannot afford.

<svg viewBox="0 0 680 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Trust climbs in small steps with every consistent answer, falls off a cliff at the first wrong answer, and restarts near zero" style="width:100%;height:auto;margin:1.5rem 0">
  <style>.ft3a{stroke-dasharray:460;stroke-dashoffset:460;animation:ft3draw 2s ease-out forwards}.ft3b{stroke-dasharray:100;stroke-dashoffset:100;animation:ft3draw 0.5s ease-in 2s forwards}.ft3c{opacity:0;animation:ft3show 0.4s ease 2.4s forwards}@keyframes ft3draw{to{stroke-dashoffset:0}}@keyframes ft3show{to{opacity:1}}@media (prefers-reduced-motion:reduce){.ft3a,.ft3b{animation:none;stroke-dashoffset:0}.ft3c{animation:none;opacity:1}}</style>
  <g font-family="sans-serif">
    <text x="30" y="26" font-size="9" font-weight="800" letter-spacing="2" fill="var(--accent)">TRUST, WITH FIRST-TIME USERS</text>
    <text x="64" y="80" font-size="9.5" fill="currentColor" opacity="0.65">every consistent answer is a deposit</text>
    <path d="M60,190 H140 V168 H220 V146 H300 V124 H380 V102 H420" fill="none" stroke="currentColor" stroke-width="2.5" class="ft3a"/>
    <path d="M420,102 L448,196" fill="none" stroke="var(--accent)" stroke-width="3" class="ft3b"/>
    <g class="ft3c">
      <circle cx="420" cy="102" r="5" fill="var(--accent)"/>
      <text x="490" y="72" text-anchor="middle" font-size="10.5" font-weight="800" fill="var(--accent)">the first wrong answer</text>
      <line x1="470" y1="80" x2="432" y2="96" stroke="var(--accent)" opacity="0.6" stroke-width="1.5"/>
      <path d="M448,196 H630" fill="none" stroke="currentColor" opacity="0.5" stroke-width="2" stroke-dasharray="5 5"/>
      <text x="455" y="216" font-size="9.5" fill="currentColor" opacity="0.65">starting from zero, if they stay at all</text>
    </g>
  </g>
</svg>

## Lesson 3: meet people inside the tools they already know

We did not teach the girls "computer science" and then AI. We put them straight into tools where they could make something real in minutes. The energy came from building, not from theory.

Same reason Caira lives in WhatsApp. Not an app to download, not a portal with a password. The patient already knows how to send a message. The entire learning curve is zero because we borrowed an interface they had already mastered.

If your AI product needs a tutorial, you have already lost the users who matter most.

## Lesson 4: watch what they build, learn what they need

On the final day, the students built projects. Nobody told them what to make. A career guidance site, because no one had guided them. A platform connecting surplus food to hungry people. A tool that reads a health report and explains deficiencies in plain language, built by girls whose families cannot afford a doctor's explanation.

Their first instinct with technology was to solve problems they had personally seen, for people more vulnerable than themselves.

That reset my bar for what counts as a real product. The question is not "what can this model do." The question the 9th standard girls asked instinctively is "who is hurting, and what would actually help them." Every good thing I have shipped since traces back to a specific person with a specific problem: a receptionist drowning in calls, a broker who cannot defend a forecast, a family misreading a blood test.

## Lesson 5: measure, or you are just performing

We tested every student before the program and after. Average score went from 3.8 to 8.3 out of 10. That number is why the program is expanding, why it was worth sixty trainers' time, why a newspaper wrote about it.

I brought the same habit back to engineering: my bots now sit exams too. A fixed evaluation set of real questions with known correct answers, scored on every change, wired to raise an alarm the moment a change makes things worse. It is a pre-and-post test for software, the same instrument that turned 3.8 into 8.3, pointed at a model instead of a classroom. Teaching taught me that "it feels like they learned" is worthless, and "3.8 to 8.3" moves ministries. "The bot feels smarter" is worthless in exactly the same way. Scores, or it did not happen.

<svg viewBox="0 0 680 255" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Every code change runs the exam of real questions with known answers, gets a score, ships if the score holds, and raises an alarm if the score drops" style="width:100%;height:auto;margin:1.5rem 0">
  <style>.ft4{stroke-dasharray:6 5;animation:ft4flow 1.2s linear infinite}@keyframes ft4flow{to{stroke-dashoffset:-11}}@media (prefers-reduced-motion:reduce){.ft4{animation:none}}</style>
  <g font-family="sans-serif">
    <text x="30" y="26" font-size="9" font-weight="800" letter-spacing="2" fill="var(--accent)">EVERY CHANGE SITS THE SAME EXAM</text>
    <rect x="40" y="60" width="150" height="54" rx="10" fill="var(--background)" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.5"/>
    <text x="115" y="82" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">a code change</text>
    <text x="115" y="98" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.65">prompt, model, logic</text>
    <line x1="190" y1="87" x2="265" y2="87" stroke="currentColor" opacity="0.5" stroke-width="2" class="ft4"/>
    <rect x="265" y="60" width="180" height="54" rx="10" fill="var(--accent)" fill-opacity="0.1" stroke="var(--accent)" stroke-width="1.5"/>
    <text x="355" y="82" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">the exam runs</text>
    <text x="355" y="98" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.65">real questions, known answers</text>
    <line x1="445" y1="87" x2="510" y2="87" stroke="currentColor" opacity="0.5" stroke-width="2" class="ft4"/>
    <rect x="510" y="60" width="130" height="54" rx="10" fill="var(--background)" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.5"/>
    <text x="575" y="82" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">the score</text>
    <text x="575" y="98" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.65">same scale, every time</text>
    <line x1="545" y1="114" x2="445" y2="168" stroke="var(--accent)" stroke-width="2" class="ft4"/>
    <rect x="265" y="164" width="180" height="54" rx="10" fill="var(--accent)" fill-opacity="0.07" stroke="var(--accent)" stroke-width="1.5"/>
    <text x="355" y="188" text-anchor="middle" font-size="11" font-weight="800" fill="var(--accent)">score drops: alarm</text>
    <text x="355" y="204" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.65">the change never ships</text>
    <path d="M575,114 L575,232 L115,232 L115,120" fill="none" stroke="currentColor" opacity="0.45" stroke-width="1.5" class="ft4"/>
    <polygon points="109,124 121,124 115,112" fill="currentColor" opacity="0.45"/>
    <text x="345" y="248" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.65">score holds · ship it, take the next change</text>
  </g>
</svg>

## The same job

There is a girl named Ameena who asked me, on day two of the program, that if AI can answer everything, what is left for her to study, what will she become.

I think about her question when I ship products, because every first-time user is silently asking a version of it: what does this thing mean for me, can I trust it, will it make me smaller or bigger.

Good AI products and good AI classrooms give the same answer. This thing is a tool. It shows you its evidence. It admits what it does not know. It is predictable enough to lean on, and it exists to make you more capable, not to replace your judgment.

Teaching 2,051 students and shipping to one clinic taught me the same lesson from both ends: the model was never the product. Trust is the product. The model is just the engine under it.
