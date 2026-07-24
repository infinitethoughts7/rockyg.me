---
title: "What 2,051 First-Time Users Taught Me About Building AI Products"
author: Rocky G
pubDatetime: 2026-07-23T00:00:00Z
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

## Lesson 1: nobody trusts a thing they cannot predict

In the classroom, the moment that unlocked everything was never the flashy demo. It was when a girl typed a question, got an answer, typed a similar question, and got a similar answer. You could see it on her face: I know what this thing will do. Only after that did she get adventurous.

Clinic staff are identical. What made them accept our bot was not intelligence, it was consistency. The bot always greets the same way. Always asks for the same details in the same order. Always says "let me check with the clinic" when it does not know, instead of improvising something new each time.

In my code this became a design rule: deterministic flows wherever the stakes are high, and the LLM confined to controlled slots inside them, never left to drive the conversation on its own. Predictability is a property you design in, not a lucky side effect of a good model. Users do not want a creative receptionist. They want a reliable one with a warm voice.

## Lesson 2: the first wrong answer costs you everything

With first-time users there is no benefit of the doubt in the bank. In week one of the program, if ChatGPT had confidently told a student something false about her own textbook, the teachers watching would have written off the whole technology, and forty schools would have heard about it.

That is why my clinic bot is grounded: it answers only from verified clinic facts, and when the answer is not there, it says so and hands off to a human. I used to describe that as a safety feature. The classroom taught me it is an adoption feature. Trust compounds like interest, and a single early hallucination is a withdrawal you cannot afford.

## Lesson 3: meet people inside the tools they already know

We did not teach the girls "computer science" and then AI. We put them straight into tools where they could make something real in minutes. The energy came from building, not from theory.

Same reason ClinicBot lives in WhatsApp. Not an app to download, not a portal with a password. The patient already knows how to send a message. The entire learning curve is zero because we borrowed an interface they had already mastered.

If your AI product needs a tutorial, you have already lost the users who matter most.

## Lesson 4: watch what they build, learn what they need

On the final day, the students built projects. Nobody told them what to make. A career guidance site, because no one had guided them. A platform connecting surplus food to hungry people. A tool that reads a health report and explains deficiencies in plain language, built by girls whose families cannot afford a doctor's explanation.

Their first instinct with technology was to solve problems they had personally seen, for people more vulnerable than themselves.

That reset my bar for what counts as a real product. The question is not "what can this model do." The question the 9th standard girls asked instinctively is "who is hurting, and what would actually help them." Every good thing I have shipped since traces back to a specific person with a specific problem: a receptionist drowning in calls, a broker who cannot defend a forecast, a family misreading a blood test.

## Lesson 5: measure, or you are just performing

We tested every student before the program and after. Average score went from 3.8 to 8.3 out of 10. That number is why the program is expanding, why it was worth sixty trainers' time, why a newspaper wrote about it.

I brought the same habit back to engineering: my bots now sit exams too. A fixed evaluation set of real questions with known correct answers, scored on every change, wired to raise an alarm the moment a change makes things worse. It is a pre-and-post test for software, the same instrument that turned 3.8 into 8.3, pointed at a model instead of a classroom. Teaching taught me that "it feels like they learned" is worthless, and "3.8 to 8.3" moves ministries. "The bot feels smarter" is worthless in exactly the same way. Scores, or it did not happen.

## The same job

There is a girl named Ameena who asked me, on day two of the program, that if AI can answer everything, what is left for her to study, what will she become.

I think about her question when I ship products, because every first-time user is silently asking a version of it: what does this thing mean for me, can I trust it, will it make me smaller or bigger.

Good AI products and good AI classrooms give the same answer. This thing is a tool. It shows you its evidence. It admits what it does not know. It is predictable enough to lean on, and it exists to make you more capable, not to replace your judgment.

Teaching 2,051 students and shipping to one clinic taught me the same lesson from both ends: the model was never the product. Trust is the product. The model is just the engine under it.
