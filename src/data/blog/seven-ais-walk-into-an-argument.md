---
title: "Seven AIs Walk Into an Argument"
author: Rocky G
pubDatetime: 2026-06-10T00:00:00Z
description: "One model gives you an opinion. I needed a forecast a real-estate broker could defend to a buyer. So I made seven AI personas debate over evidence, and a judge write the verdict, dissent included."
featured: false
draft: true
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

<svg viewBox="0 0 680 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Evidence fans out to seven parallel personas, their arguments fan in to a judge, and the judge writes a verdict with a dissent log" style="width:100%;height:auto;margin:1.5rem 0">
  <style>.s7a{stroke-dasharray:6 5;animation:s7aflow 1.2s linear infinite}@keyframes s7aflow{to{stroke-dashoffset:-11}}@media (prefers-reduced-motion:reduce){.s7a{animation:none}}</style>
  <g font-family="sans-serif" font-size="11" font-weight="700">
    <rect x="20" y="85" width="120" height="60" rx="10" fill="var(--accent)" fill-opacity="0.08" stroke="var(--accent)" stroke-width="1.5"/>
    <text x="80" y="110" text-anchor="middle" fill="currentColor">EVIDENCE</text>
    <text x="80" y="126" text-anchor="middle" fill="currentColor" opacity="0.65" font-size="9" font-weight="400">govt prices · RERA · news</text>
    <g stroke="currentColor" opacity="0.4" stroke-width="1.5">
      <line x1="140" y1="95" x2="215" y2="35" class="s7a"/>
      <line x1="140" y1="105" x2="215" y2="75" class="s7a"/>
      <line x1="140" y1="115" x2="215" y2="115" class="s7a"/>
      <line x1="140" y1="125" x2="215" y2="155" class="s7a"/>
      <line x1="140" y1="135" x2="215" y2="195" class="s7a"/>
    </g>
    <g font-size="10">
      <rect x="220" y="20" width="130" height="30" rx="8" fill="var(--accent)" fill-opacity="0.14"/><text x="285" y="39" text-anchor="middle" fill="currentColor">infra optimist</text>
      <rect x="220" y="60" width="130" height="30" rx="8" fill="var(--accent)" fill-opacity="0.14"/><text x="285" y="79" text-anchor="middle" fill="currentColor">data skeptic</text>
      <rect x="220" y="100" width="130" height="30" rx="8" fill="var(--accent)" fill-opacity="0.14"/><text x="285" y="119" text-anchor="middle" fill="currentColor">builder-risk hawk</text>
      <rect x="220" y="140" width="130" height="30" rx="8" fill="var(--accent)" fill-opacity="0.14"/><text x="285" y="159" text-anchor="middle" fill="currentColor">jobs analyst</text>
      <rect x="220" y="180" width="130" height="30" rx="8" fill="var(--accent)" fill-opacity="0.14"/><text x="285" y="199" text-anchor="middle" fill="currentColor">+ 3 more, in parallel</text>
    </g>
    <g stroke="var(--accent)" stroke-width="1.5" opacity="0.8">
      <line x1="350" y1="35" x2="425" y2="100" class="s7a"/>
      <line x1="350" y1="75" x2="425" y2="108" class="s7a"/>
      <line x1="350" y1="115" x2="425" y2="115" class="s7a"/>
      <line x1="350" y1="155" x2="425" y2="122" class="s7a"/>
      <line x1="350" y1="195" x2="425" y2="130" class="s7a"/>
    </g>
    <rect x="430" y="85" width="105" height="60" rx="10" fill="var(--accent)"/>
    <text x="482" y="111" text-anchor="middle" fill="var(--background)">JUDGE</text>
    <text x="482" y="127" text-anchor="middle" fill="var(--background)" opacity="0.85" font-size="9" font-weight="400">synthesizes, does not vote</text>
    <line x1="535" y1="115" x2="570" y2="115" stroke="currentColor" opacity="0.4" stroke-width="1.5" class="s7a"/>
    <rect x="575" y="60" width="95" height="110" rx="10" fill="var(--background)" stroke="currentColor" stroke-width="1.5"/>
    <g font-size="9.5" fill="currentColor" font-weight="400">
      <text x="622" y="82" text-anchor="middle" font-weight="800">VERDICT</text>
      <text x="622" y="100" text-anchor="middle">bold number</text>
      <text x="622" y="116" text-anchor="middle">confidence range</text>
      <text x="622" y="132" text-anchor="middle">evidence trail</text>
      <text x="622" y="150" text-anchor="middle" font-weight="800" fill="var(--accent)">dissent log</text>
    </g>
  </g>
</svg>

Independence is the load-bearing word. The calls run in parallel and never see each other, so no persona anchors on another's answer and their errors do not line up. It is the same reason an ensemble beats its average member: uncorrelated mistakes cancel, correlated ones compound. Run the seven in sequence, each reading the last, and you would not get a panel. You would get an echo.

<svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="In sequence each persona reads the last and agrees, producing an echo. In parallel each reads the same evidence alone and they disagree, producing a panel" style="width:100%;height:auto;margin:1.5rem 0">
  <style>.s7b{stroke-dasharray:6 5;animation:s7bflow 1.2s linear infinite}@keyframes s7bflow{to{stroke-dashoffset:-11}}@media (prefers-reduced-motion:reduce){.s7b{animation:none}}</style>
  <g font-family="sans-serif">
    <line x1="335" y1="30" x2="335" y2="252" stroke="currentColor" opacity="0.15" stroke-width="1"/>
    <text x="40" y="32" font-size="9" font-weight="800" letter-spacing="2" fill="var(--accent)">IN SEQUENCE</text>
    <g stroke="currentColor" opacity="0.5" stroke-width="1.5">
      <line x1="105" y1="78" x2="105" y2="97" class="s7b"/>
      <line x1="105" y1="133" x2="105" y2="152" class="s7b"/>
      <line x1="105" y1="188" x2="105" y2="207" class="s7b"/>
    </g>
    <g fill="currentColor" opacity="0.5">
      <polygon points="101,95 109,95 105,102"/>
      <polygon points="101,150 109,150 105,157"/>
      <polygon points="101,205 109,205 105,212"/>
    </g>
    <g font-size="10" font-weight="700">
      <rect x="40" y="44" width="130" height="34" rx="8" fill="var(--background)" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.5"/><text x="105" y="65" text-anchor="middle" fill="currentColor">A: growth</text>
      <rect x="40" y="99" width="130" height="34" rx="8" fill="var(--background)" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.5"/><text x="105" y="120" text-anchor="middle" fill="currentColor">B reads A: agrees</text>
      <rect x="40" y="154" width="130" height="34" rx="8" fill="var(--background)" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.5"/><text x="105" y="175" text-anchor="middle" fill="currentColor">C reads B: agrees</text>
      <rect x="40" y="209" width="130" height="34" rx="8" fill="var(--background)" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.5"/><text x="105" y="230" text-anchor="middle" fill="currentColor">D: agrees. echo.</text>
    </g>
    <text x="105" y="266" text-anchor="middle" font-size="9.5" fill="currentColor" opacity="0.65">mistakes line up</text>
    <text x="400" y="32" font-size="9" font-weight="800" letter-spacing="2" fill="var(--accent)">IN PARALLEL</text>
    <g stroke="var(--accent)" opacity="0.7" stroke-width="1.5">
      <line x1="505" y1="80" x2="430" y2="120" class="s7b"/>
      <line x1="505" y1="80" x2="590" y2="120" class="s7b"/>
      <line x1="505" y1="80" x2="430" y2="175" class="s7b"/>
      <line x1="505" y1="80" x2="590" y2="175" class="s7b"/>
    </g>
    <rect x="430" y="44" width="150" height="36" rx="8" fill="var(--accent)" fill-opacity="0.08" stroke="var(--accent)" stroke-width="1.5"/>
    <text x="505" y="66" text-anchor="middle" font-size="10" font-weight="700" fill="currentColor">same evidence</text>
    <g font-size="10" font-weight="700">
      <rect x="360" y="120" width="140" height="34" rx="8" fill="var(--accent)" fill-opacity="0.14"/><text x="430" y="141" text-anchor="middle" fill="currentColor">A: growth</text>
      <rect x="520" y="120" width="140" height="34" rx="8" fill="var(--accent)" fill-opacity="0.14"/><text x="590" y="141" text-anchor="middle" fill="currentColor">B: doubts the data</text>
      <rect x="360" y="175" width="140" height="34" rx="8" fill="var(--accent)" fill-opacity="0.14"/><text x="430" y="196" text-anchor="middle" fill="currentColor">C: builder risk</text>
      <rect x="520" y="175" width="140" height="34" rx="8" fill="var(--accent)" fill-opacity="0.14"/><text x="590" y="196" text-anchor="middle" fill="currentColor">D: growth, slower</text>
    </g>
    <text x="510" y="266" text-anchor="middle" font-size="9.5" fill="currentColor" opacity="0.65">mistakes cancel</text>
  </g>
</svg>

Then a Judge agent reads all seven arguments and writes the verdict: a bold number, a confidence range, the evidence trail behind it, and the part I am proudest of, a dissent log.

Architecturally this is a scatter-gather. The evidence is scattered to seven workers that run concurrently and in isolation, and their outputs are gathered by a single reducer. It is map-reduce, with two twists that matter: the mappers are opinionated on purpose, each carrying a different bias so the map step produces diversity instead of seven copies of one answer, and the reducer is paid to preserve disagreement rather than average it away. Get either twist wrong and the architecture collapses back into an expensive way to run one model.

## The dissent log is the product

Most AI products hide disagreement. Kshetra publishes it.

If the data skeptic thinks the listing-portal prices are inflated and says so, that objection ships with the forecast. The broker sees "6 of 7 panelists expect growth; the skeptic flags that verified registration data lags the hype by two quarters."

<svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The verdict card the broker sees: six of seven panelists expect growth, one dissents, and the dissent log ships with the forecast" style="width:100%;height:auto;margin:1.5rem 0">
  <style>.s7c{animation:s7cpulse 2.4s ease-in-out infinite}@keyframes s7cpulse{0%,100%{fill-opacity:0.05}50%{fill-opacity:0.14}}@media (prefers-reduced-motion:reduce){.s7c{animation:none}}</style>
  <g font-family="sans-serif">
    <rect x="40" y="16" width="600" height="208" rx="14" fill="var(--background)" stroke="currentColor" stroke-width="1.5"/>
    <text x="70" y="48" font-size="9" font-weight="800" letter-spacing="2" fill="var(--accent)">THE VERDICT · WHAT THE BROKER SEES</text>
    <text x="70" y="84" font-size="17" font-weight="800" fill="currentColor">6 of 7 panelists expect growth</text>
    <g fill="var(--accent)">
      <circle cx="78" cy="108" r="7"/>
      <circle cx="104" cy="108" r="7"/>
      <circle cx="130" cy="108" r="7"/>
      <circle cx="156" cy="108" r="7"/>
      <circle cx="182" cy="108" r="7"/>
      <circle cx="208" cy="108" r="7"/>
    </g>
    <circle cx="234" cy="108" r="7" fill="none" stroke="var(--accent)" stroke-width="2"/>
    <text x="234" y="130" text-anchor="middle" font-size="8.5" font-weight="700" fill="var(--accent)">the skeptic</text>
    <text x="610" y="100" text-anchor="end" font-size="9.5" fill="currentColor" opacity="0.65">confidence range: printed</text>
    <text x="610" y="116" text-anchor="end" font-size="9.5" fill="currentColor" opacity="0.65">evidence trail: attached</text>
    <rect x="70" y="142" width="540" height="60" rx="10" fill="var(--accent)" fill-opacity="0.08" stroke="var(--accent)" stroke-width="1.5" class="s7c"/>
    <text x="90" y="164" font-size="9" font-weight="800" letter-spacing="1.5" fill="var(--accent)">DISSENT LOG · SHIPS WITH THE FORECAST</text>
    <text x="90" y="186" font-size="11" font-style="italic" fill="currentColor">"Verified registration data lags the hype by two quarters."</text>
  </g>
</svg>

Think about what that does for trust. A forecast with a printed objection is more believable than a forecast with none, because it proves somebody looked for problems. It is the same reason a good engineering design review includes the rejected alternatives.

One model cannot give you real dissent. Sample it twice and you get two draws from the same distribution, correlated by construction. It agrees with itself because it is itself. Genuine disagreement has to be engineered: separate calls with separate mandates and separate incentives, so the conflict on the page is real rather than performed.

## Evidence is tagged, not trusted

The second honesty rule: not all data is equal, and the system says so out loud. Every input carries a provenance tag. Government registration prices and consultancy reports are tagged verified. Listing-portal numbers and broker blogs are tagged directional. The personas see the tags, the judge weights each argument by them, and the final pitch prints them, so a claim that leans on a broker blog can never quietly borrow the authority of a registered sale.

<svg viewBox="0 0 680 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Verified sources flow to the judge on a heavy line, directional sources on a thin dashed line, and the final pitch prints both tags" style="width:100%;height:auto;margin:1.5rem 0">
  <style>.s7d{stroke-dasharray:6 5;animation:s7dflow 1.2s linear infinite}@keyframes s7dflow{to{stroke-dashoffset:-11}}@media (prefers-reduced-motion:reduce){.s7d{animation:none}}</style>
  <g font-family="sans-serif">
    <rect x="30" y="36" width="180" height="56" rx="10" fill="var(--background)" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.5"/>
    <text x="120" y="62" text-anchor="middle" font-size="10" fill="currentColor">govt registrations</text>
    <text x="120" y="78" text-anchor="middle" font-size="10" fill="currentColor">RERA reports</text>
    <rect x="42" y="26" width="64" height="16" rx="8" fill="var(--accent)"/>
    <text x="74" y="37.5" text-anchor="middle" font-size="8.5" font-weight="800" fill="var(--background)">VERIFIED</text>
    <rect x="30" y="136" width="180" height="56" rx="10" fill="var(--background)" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.5"/>
    <text x="120" y="162" text-anchor="middle" font-size="10" fill="currentColor">listing portals</text>
    <text x="120" y="178" text-anchor="middle" font-size="10" fill="currentColor">broker blogs</text>
    <rect x="42" y="126" width="86" height="16" rx="8" fill="var(--background)" stroke="var(--accent)" stroke-width="1.5"/>
    <text x="85" y="137.5" text-anchor="middle" font-size="8.5" font-weight="800" fill="var(--accent)">DIRECTIONAL</text>
    <line x1="210" y1="64" x2="305" y2="104" stroke="var(--accent)" stroke-width="3" class="s7d"/>
    <line x1="210" y1="164" x2="305" y2="126" stroke="currentColor" opacity="0.45" stroke-width="1.5" class="s7d"/>
    <rect x="305" y="85" width="130" height="60" rx="10" fill="var(--accent)" fill-opacity="0.1" stroke="var(--accent)" stroke-width="1.5"/>
    <text x="370" y="110" text-anchor="middle" font-size="10.5" font-weight="700" fill="currentColor">PANEL + JUDGE</text>
    <text x="370" y="126" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.65">weighs every claim by tag</text>
    <line x1="435" y1="115" x2="490" y2="115" stroke="currentColor" opacity="0.4" stroke-width="1.5" class="s7d"/>
    <rect x="495" y="55" width="160" height="120" rx="10" fill="var(--background)" stroke="currentColor" stroke-width="1.5"/>
    <text x="575" y="80" text-anchor="middle" font-size="10" font-weight="800" fill="currentColor">THE PITCH</text>
    <text x="575" y="96" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.65">every claim prints its tag</text>
    <rect x="515" y="108" width="56" height="16" rx="8" fill="var(--accent)"/>
    <text x="543" y="119.5" text-anchor="middle" font-size="8.5" font-weight="800" fill="var(--background)">verified</text>
    <rect x="515" y="132" width="76" height="16" rx="8" fill="var(--background)" stroke="var(--accent)" stroke-width="1.5"/>
    <text x="553" y="143.5" text-anchor="middle" font-size="8.5" font-weight="800" fill="var(--accent)">directional</text>
  </g>
</svg>

Three localities went through the engine as pilots, chosen as a deliberate spectrum: an established corridor with clean data, an emerging jobs-led corridor with noisy data, and a purely speculative one. This was not a test of whether the forecasts come true, which nobody can know for years. It was a test of calibration, which you can check today: does the system's confidence track the quality of the evidence rather than the volume of the hype? It does. The speculative corridor gets a wide range and a low-confidence stamp even when every headline is euphoric, and the established corridor gets a tight range because the data earns it.

That distinction is the honest answer to the obvious objection. For a forecast you cannot verify for years, the thing you can actually evaluate now is whether the system is appropriately uncertain when the data is thin. Long-horizon real-estate prediction is hard, and anyone who hands you a single number without a range is selling something.

## What this taught me about agents

Building this changed how I think about "multi-agent" systems, which in 2026 is a phrase attached to a lot of demos.

Multi-agent is not a performance trick. Because the seven run in parallel, the latency cost is only the slowest persona plus the judge, not seven times a single call, but the token cost is genuinely sevenfold. You pay that money for exactly one thing: **structured disagreement**. If your agents do not have genuinely different jobs and genuinely different incentives, you do not have a panel. You have one agent with extra steps and a bigger bill.

The judge matters more than the panel. Synthesis is the hard part: weighting a verified-data argument above a vibes argument, and preserving the dissent instead of averaging it away. A judge that simply mean-pools the seven opinions destroys the exact variance the panel was built to produce. The value lives in the disagreement, so the one thing the judge must never do is smooth it out.

And the same principle showed up later in my healthcare work: Caira, my WhatsApp clinic receptionist, refuses to answer outside its verified facts. Different domain, same belief. An AI system earns trust by showing its evidence and admitting its doubts, not by sounding sure.

Seven AIs walk into an argument. That is not the setup of a joke. It is the closest thing I have found to honesty at inference time.
