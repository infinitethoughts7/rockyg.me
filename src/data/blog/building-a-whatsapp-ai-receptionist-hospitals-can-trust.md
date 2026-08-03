---
title: "Building Caira: a WhatsApp AI Receptionist a Hospital Can Trust"
author: Rocky G
pubDatetime: 2026-07-24T00:00:00Z
modDatetime: 2026-08-02T00:00:00Z
description: "Caira answers patients on WhatsApp, books appointments, and knows when to say 'let me check.' Take the animated tour: the architecture, the guardrails, and seven interactive playgrounds you can poke at."
featured: true
tags:
  - technical
  - ai-agents
  - caira
---

A patient texts a clinic. About 1.6 seconds later they have a confirmed
appointment, and the AI that got them there was never allowed to invent a
single fact.

That is Caira, a WhatsApp receptionist for clinics. She answers questions,
books appointments, sends reminders, and runs the waitlist, in English, Hindi,
Telugu or Hinglish, at 3 am, to a hundred people at once. One codebase serves
many clinics, which is the decision that causes almost every hard problem in
the story.

The hard part was never making a bot answer. Any modern model answers
anything, instantly and beautifully. The hard part is making it answer like an
employee who knows the rules, admits what she does not know, and never, ever
invents a consultation fee.

I rebuilt this story as something better than a wall of text: animated
architecture maps, a message you can watch travel through the system, and
seven interactive playgrounds. Try to trick the guardrails. Kill the AI model
and watch the fallback catch the conversation. Run the eval exam and trip the
regression alarm.

**[Take the animated tour →](/caira)**

It is written so a non-engineer can enjoy every screen, and there are "For
engineers" boxes wherever the real depth lives.
