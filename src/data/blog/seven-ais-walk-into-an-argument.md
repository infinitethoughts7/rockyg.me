---
title: "Seven AIs Walk Into an Argument"
author: Rocky G
pubDatetime: 2026-07-22T00:00:00Z
description: "One model gives you an opinion. I needed a forecast a real-estate broker could defend to a buyer. So I made seven AI personas debate over evidence, and a judge write the verdict, dissent included."
featured: false
tags:
  - technical
  - ai-agents
  - multi-agent
---

## Table of contents

## The problem with one opinion

Ask an LLM "will property prices in Kokapet grow?" and it will answer. Confidently. Beautifully. And you have no idea what that answer is worth.

That was the problem behind Kshetra, a tool I built for real-estate brokers in Hyderabad. A broker's job is to stand in front of a buyer and say, this locality will grow, here is why. If the "why" is "an AI told me," the broker looks like a fool. The forecast needs to survive questioning.

Humans solved this problem long ago. It is called a debate.

## The design: a panel, not an oracle

Kshetra runs seven AI personas as independent, parallel Claude calls. Each one receives the same folder of evidence about a locality: government registration prices, RERA filings, infrastructure news, listing-portal trends. Each reads it through a different pair of eyes.

An infrastructure optimist. A data skeptic. A builder-risk hawk. A jobs-and-migration analyst. And so on. Seven specialists, each paid to care about exactly one thing, and each nothing more than the same base model steered by a different system prompt and a different mandate for which evidence to trust. That is the cheap, controllable way to buy diversity: not seven models, but one model wearing seven briefs.

Independence is the load-bearing word. The calls run in parallel and never see each other, so no persona anchors on another's answer and their errors do not line up. It is the same reason an ensemble beats its average member: uncorrelated mistakes cancel, correlated ones compound. Run the seven in sequence, each reading the last, and you would not get a panel. You would get an echo.

<svg viewBox="0 0 680 230" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;margin:1rem 0">
  <style>.ksd{stroke-dasharray:6 5;animation:ksda 1.2s linear infinite}@keyframes ksda{to{stroke-dashoffset:-11}}</style>
  <g font-family="sans-serif" font-size="11" font-weight="700">
    <rect x="20" y="85" width="120" height="60" rx="10" fill="#ccfbf1" stroke="#0d9488" stroke-width="2"/>
    <text x="80" y="110" text-anchor="middle" fill="#115e59">EVIDENCE</text>
    <text x="80" y="126" text-anchor="middle" fill="#0f766e" font-size="9">govt prices · RERA · news</text>
    <g stroke="#4f6d68" stroke-width="1.8">
      <line x1="140" y1="95" x2="215" y2="35" class="ksd"/>
      <line x1="140" y1="105" x2="215" y2="75" class="ksd"/>
      <line x1="140" y1="115" x2="215" y2="115" class="ksd"/>
      <line x1="140" y1="125" x2="215" y2="155" class="ksd"/>
      <line x1="140" y1="135" x2="215" y2="195" class="ksd"/>
    </g>
    <g font-size="10">
      <rect x="220" y="20" width="130" height="30" rx="8" fill="#99f6e4"/><text x="285" y="39" text-anchor="middle" fill="#134e4a">infra optimist</text>
      <rect x="220" y="60" width="130" height="30" rx="8" fill="#99f6e4"/><text x="285" y="79" text-anchor="middle" fill="#134e4a">data skeptic</text>
      <rect x="220" y="100" width="130" height="30" rx="8" fill="#99f6e4"/><text x="285" y="119" text-anchor="middle" fill="#134e4a">builder-risk hawk</text>
      <rect x="220" y="140" width="130" height="30" rx="8" fill="#99f6e4"/><text x="285" y="159" text-anchor="middle" fill="#134e4a">jobs analyst</text>
      <rect x="220" y="180" width="130" height="30" rx="8" fill="#99f6e4"/><text x="285" y="199" text-anchor="middle" fill="#134e4a">+ 3 more, in parallel</text>
    </g>
    <g stroke="#0d9488" stroke-width="1.8">
      <line x1="350" y1="35" x2="425" y2="100" class="ksd"/>
      <line x1="350" y1="75" x2="425" y2="108" class="ksd"/>
      <line x1="350" y1="115" x2="425" y2="115" class="ksd"/>
      <line x1="350" y1="155" x2="425" y2="122" class="ksd"/>
      <line x1="350" y1="195" x2="425" y2="130" class="ksd"/>
    </g>
    <rect x="430" y="85" width="105" height="60" rx="10" fill="#0d9488"/>
    <text x="482" y="111" text-anchor="middle" fill="#fff">JUDGE</text>
    <text x="482" y="127" text-anchor="middle" fill="#ccfbf1" font-size="9">synthesizes, does not vote</text>
    <line x1="535" y1="115" x2="570" y2="115" stroke="#4f6d68" stroke-width="2" class="ksd"/>
    <rect x="575" y="60" width="95" height="110" rx="10" fill="#fff" stroke="#134e4a" stroke-width="2"/>
    <g font-size="9.5" fill="#134e4a">
      <text x="622" y="82" text-anchor="middle" font-weight="800">VERDICT</text>
      <text x="622" y="100" text-anchor="middle">bold number</text>
      <text x="622" y="116" text-anchor="middle">confidence range</text>
      <text x="622" y="132" text-anchor="middle">evidence trail</text>
      <text x="622" y="150" text-anchor="middle" font-weight="800">dissent log</text>
    </g>
  </g>
</svg>

Then a Judge agent reads all seven arguments and writes the verdict: a bold number, a confidence range, the evidence trail behind it, and the part I am proudest of, a dissent log.

## The dissent log is the product

Most AI products hide disagreement. Kshetra publishes it.

If the data skeptic thinks the listing-portal prices are inflated and says so, that objection ships with the forecast. The broker sees "6 of 7 panelists expect growth; the skeptic flags that verified registration data lags the hype by two quarters."

Think about what that does for trust. A forecast with a printed objection is more believable than a forecast with none, because it proves somebody looked for problems. It is the same reason a good engineering design review includes the rejected alternatives.

One model cannot give you real dissent. Sample it twice and you get two draws from the same distribution, correlated by construction. It agrees with itself because it is itself. Genuine disagreement has to be engineered: separate calls with separate mandates and separate incentives, so the conflict on the page is real rather than performed.

## Evidence is tagged, not trusted

The second honesty rule: not all data is equal, and the system says so out loud. Every input carries a provenance tag. Government registration prices and consultancy reports are tagged verified. Listing-portal numbers and broker blogs are tagged directional. The personas see the tags, the judge weights each argument by them, and the final pitch prints them, so a claim that leans on a broker blog can never quietly borrow the authority of a registered sale.

Three localities went through the engine as pilots, chosen as a deliberate spectrum: an established corridor with clean data, an emerging jobs-led corridor with noisy data, and a purely speculative one. This was not a test of whether the forecasts come true, which nobody can know for years. It was a test of calibration, which you can check today: does the system's confidence track the quality of the evidence rather than the volume of the hype? It does. The speculative corridor gets a wide range and a low-confidence stamp even when every headline is euphoric, and the established corridor gets a tight range because the data earns it.

That distinction is the honest answer to the obvious objection. For a forecast you cannot verify for years, the thing you can actually evaluate now is whether the system is appropriately uncertain when the data is thin. Long-horizon real-estate prediction is hard, and anyone who hands you a single number without a range is selling something.

## What this taught me about agents

Building this changed how I think about "multi-agent" systems, which in 2026 is a phrase attached to a lot of demos.

Multi-agent is not a performance trick. Because the seven run in parallel, the latency cost is only the slowest persona plus the judge, not seven times a single call, but the token cost is genuinely sevenfold. You pay that money for exactly one thing: **structured disagreement**. If your agents do not have genuinely different jobs and genuinely different incentives, you do not have a panel. You have one agent with extra steps and a bigger bill.

The judge matters more than the panel. Synthesis is the hard part: weighting a verified-data argument above a vibes argument, and preserving the dissent instead of averaging it away. A judge that simply mean-pools the seven opinions destroys the exact variance the panel was built to produce. The value lives in the disagreement, so the one thing the judge must never do is smooth it out.

And the same principle showed up later in my healthcare work: my WhatsApp clinic bot refuses to answer outside its verified facts. Different domain, same belief. An AI system earns trust by showing its evidence and admitting its doubts, not by sounding sure.

Seven AIs walk into an argument. That is not the setup of a joke. It is the closest thing I have found to honesty at inference time.
