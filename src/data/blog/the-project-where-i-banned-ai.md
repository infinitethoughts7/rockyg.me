---
title: "The Project Where I Banned AI"
author: Rocky G
pubDatetime: 2026-07-20T00:00:00Z
description: "I build LLM agents for a living. On CPA Desk, a money-advisory tool for real-estate partners, I made the opposite call: zero AI in the trust path. Knowing when not to use AI is also an AI skill."
featured: false
draft: true
tags:
  - technical
  - engineering-judgment
---

## Table of contents

## An uncomfortable decision

I spend most of my time building LLM systems. A WhatsApp AI receptionist for clinics. A multi-agent forecasting engine. So when I started CPA Desk, an advisory tool for real-estate channel partners in Bangalore, everyone assumed the interesting parts would be AI.

I banned it instead. Zero LLM calls anywhere near the numbers.

CPA Desk tells a partner which client to call today, which properties to pitch, and whether a client should hold and rent or sell and reinvest. Every one of those outputs moves someone's money. And that changes the engineering question completely.

## The question that decides it

Here is the test I now run on every feature: **what does a wrong answer cost, and can I explain the answer afterwards?**

A chatbot suggesting a restaurant: wrong answer costs a mediocre dinner, no explanation needed. LLM away.

A tool telling a family to sell a property and reinvest: a wrong answer costs lakhs, and "the model felt bullish" is not an explanation anyone can stand behind. When a client asks why, the advisor needs to walk them through the exact reasoning, line by line, and get the same answer twice.

LLMs are probabilistic by construction. Same question today, a slightly different answer tomorrow, with no guarantee the reasoning in between stays fixed. For creative work that variance is a feature. For financial reasoning it is disqualifying, and not because the model is dumb. It is disqualifying because the output cannot be audited or reproduced. You cannot walk a client through a chain of reasoning that will not be the same chain next week, and you cannot write a test for a function whose answer drifts. Money needs determinism twice over: once to explain the number, and once to trust the number will not move on its own.

<svg viewBox="0 0 680 190" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;margin:1rem 0">
  <g font-family="sans-serif" font-size="11.5" font-weight="700">
    <rect x="230" y="15" width="220" height="44" rx="10" fill="#fff" stroke="#134e4a" stroke-width="2"/>
    <text x="340" y="34" text-anchor="middle" fill="#134e4a">what does a wrong answer cost?</text>
    <text x="340" y="49" text-anchor="middle" fill="#4f6d68" font-size="9.5">and must I explain it afterwards?</text>
    <line x1="290" y1="59" x2="180" y2="105" stroke="#0d9488" stroke-width="2"/>
    <line x1="390" y1="59" x2="500" y2="105" stroke="#134e4a" stroke-width="2"/>
    <rect x="60" y="110" width="240" height="64" rx="10" fill="#ccfbf1" stroke="#0d9488" stroke-width="2"/>
    <text x="180" y="132" text-anchor="middle" fill="#115e59">cheap + no audit needed</text>
    <text x="180" y="150" text-anchor="middle" fill="#0f766e" font-size="10">→ use the LLM, add guardrails</text>
    <text x="180" y="166" text-anchor="middle" fill="#0f766e" font-size="9.5">chat, drafts, summaries, intent</text>
    <rect x="380" y="110" width="240" height="64" rx="10" fill="#fff" stroke="#134e4a" stroke-width="2.5"/>
    <text x="500" y="132" text-anchor="middle" fill="#134e4a">expensive + must be explained</text>
    <text x="500" y="150" text-anchor="middle" fill="#134e4a" font-size="10">→ deterministic engine, sourced</text>
    <text x="500" y="166" text-anchor="middle" fill="#4f6d68" font-size="9.5">money, medicine, legal, ranking</text>
  </g>
</svg>

## What I built instead

The unglamorous answer: engines. Plain, deterministic, testable TypeScript, built as pure functions. Same inputs, same outputs, no hidden state, and no network call anywhere in the path that produces a number. That property is the architecture, not a detail of it, because a pure function is one you can audit by reading it and pin down with a test. The moment an LLM enters that path, both of those guarantees are gone.

A matching engine that scores properties for a client using nine weight matrices, one for each combination of intent and risk appetite, with a five-level relaxation cascade when nothing fits perfectly. A returns model where every input is written down: cash out of pocket as the denominator, amortised interest over full tenure, stamp duty at possession, a post-possession slowdown factor, capital-gains tax at the documented rates. The model's output was verified against a fully worked real case before anything shipped, and that check is only possible because the engine is deterministic. A fixed set of inputs produces exactly one output, so the whole calculation can be pinned in a test that fails loudly the day someone changes a rate by accident. Determinism is not only about trust for the client. It is what makes the thing testable at all.

And one page I insisted on: a public methodology page. Every assumption, every rate, every threshold, with its source. When the tool says "sell and reinvest crosses over in year 4," the advisor can click through to exactly why.

Some rules we enforced that sound almost rude in 2026:

- No AI prose anywhere near recommendations.
- No blended "quality score" magic numbers. Composite scores exist internally but are never displayed as if they were truth.
- Ranges are never shown as guarantees.
- Missing data is shown as missing. Projects without verified prices sit in an explicit "unpriced" lane instead of being quietly filled in by a model.

That last one matters most. The temptation with LLMs is to let them paper over gaps in your data. The gap is information. Hiding it is lying with extra steps.

## Where the judgment actually lives

People read "banned AI" as anti-AI. It is the opposite. It is the same discipline that makes my AI systems trustworthy.

Caira, my clinic receptionist, answers only from verified facts and escalates the rest to humans. Kshetra tags evidence as verified or directional and ships its own dissent. CPA Desk takes the logical next step: where answers must be reproducible and auditable, the right amount of LLM is zero.

One system, three positions on the same dial. The dial is not "how much AI can I add." The dial is "how much unexplainable variance can this decision tolerate." Chat tolerates a lot. Triage tolerates some, behind guardrails. Money tolerates none.

The most senior engineering skill in AI right now is not prompting, not fine-tuning, not agent frameworks. It is knowing where to set that dial, and having the spine to set it to zero when the domain demands it, even when AI is the reason clients came to you in the first place.

Every tool wants to be a hammer this year. The judgment is in knowing which problems are not nails.
