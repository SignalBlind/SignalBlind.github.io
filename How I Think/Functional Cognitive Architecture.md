---
permalink: /How_I_Think/
layout: page
title: Functional Cognitive Architecture
order: 20
---
Just like most everything else I describe on this site, it never occurred to me that I might *think* different than most other people.  In terms of computers I have a completely different architecture and have to run a different operating system on it.  I don't have some of the hardware (or it is unusable) like other people have, but I have many of the same basic needs for dealing with the world.

We can imagine the hardware and software in a sort of stack where each layer depends on the previous layer.  Signals come in (vision, hearing) and are decoded and processed.  Your conscious thinking sits on top of this:  you make decisions and take actions. There might be some optional systems that could be employed if needed, e.g. you can concentrate on something.

For contrast, let's look at what NT and autistic architectures might look like first.
## NT Cognitive Architecture

Describing neurotypical cognitive architecture in similar terms might look like this:

1. **Hardware:** **Standard Neuro-typical Sensory Array.**
2. **Social Salience (Limbic Hardware):** The "Antenna" is always on and prioritized.
3. **ToM (Automated Simulation):** The brain "mirrors" others' states automatically.
4. **Logic (Optional Overlay):** Used only when "Intuition" fails. (High effort for NTs).
5. **Runtime:** **Associative Heuristics.** (Consciousness lives in "Vibes" and "Feelings").

Note that the first 3 layers are all "implemented in hardware" and are thus very low effort and indeed below the level of conscious thought.
## Autism Cognitive Architecture

Autistic cognitive architecture might look something like this:

1. **Hardware:** **Standard Neuro-typical Sensory Array.**
2. **Social Salience (Limbic Hardware):** The "Antenna" is always on and prioritized, **but may be noisy and often highly sensitive**
3. **ToM (Manual Simulation):** The social signal is received but has to be decoded and **manually processed, e.g. by Theory-Theory**.  This is mentally costly and causes social lag.  Theory-theory is a type of [Propositional Logic](Propositional%20Logic.md).
4. **Manual Frame Construction:** Autistic people use social scripting as ways to [Mask](../Experience/Masking.md) and avoid social issues.
5. **Runtime:** **Associative Heuristics.** (Consciousness lives in "Vibes" and "Feelings").

Here only the first 2 layers are hardware and the Social Salience layer is feeding noisy data to the rest of the system.  Layer 3 (ToM) is thus very expensive to run.
## My Hardware and Software

At the lowest level I have the 5 normal senses, but they are hooked up to my conscious thoughts.  My lack of [Social Salience](../Experience/Social%20Salience.md) means that the low level connection (layers 1 and 2 in the above architectures) are missing.  My imagination, which might provide some workarounds, is [Hypophantasia](../Experience/Hypophantasia.md), which turns into an amplifying factor.  My only inputs are explicit facts -- things that people tell me.  I can observe physical facts (the car is red) and can draw logical conclusions (X said they like cats, Y is a cat, X probably likes Y).

Note: this is a *logical* model.  I don't literally have these parts.  It may not work exactly like this, it is a model for the purposes of understanding and predicting.
#### [Propositional Logic](Propositional%20Logic.md) (ISA)

The lowest layer of my model is propositional logic.  At the lowest layer this is the ISA (instruction set architecture) -- these are the low level instructions I can execute.  Basically if/then/else with some comparisons possible :

```
IF Input(Factual Error) == True THEN Action(Correction)
IF Utility(action) < Cost(action) THEN SKIP
```

There is a set of "software" built using these instructions that I use to actually make decisions and perform actions -- per asking an LLM it might be a few hundred "lines of code".

| Component               | Estimated Quantity | Mechanical Function                                                                   |
| ----------------------- | ------------------ | ------------------------------------------------------------------------------------- |
| **Axiomatic Kernel**    | 5–8 Constants      | Hard-coded ethical/logical values (e.g., Truth > Harmony).                            |
| **Active Scripts**      | 15–20 Libraries    | Loaded frameworks for specific environments (Work, Child, Stranger).                  |
| **Peephole Optimizers** | 40–60 Macros       | "Fast-fail" rules for common interactions (The "Nice" Protocol, The "Bathroom" Exit). |
| **Manual Logic Gates**  | 200–400 Gates      | Discrete IF/THEN decisions executed during an interaction.                            |
I can translate real world data into straightforward logic (but like real software it can be both and imperfect and leaky abstraction).
#### [Axiomatic Deontology](Ethical%20Systems.md#Axiomatic%20Deontology) / [Ethics](Ethics.md)

These are the rules I follow -- what is right and wrong.  To some extent, what are my low level goals in life.  These are fixed rules, evaluated in priority order.  A higher priority rule may override a lower priority rule, but violation of the rules is not possible.  They are rigid.

Well, of course anything is possible.  One of my rules is about [Facts and Truth](Facts%20and%20Truth.md) and it is physically possible for me to lie, I just won't do it.  Could something force my hand?  Maybe, maybe not.  It would be a BIG DEAL and QUITE TRAUMATIC for me to be forced into something like that.  In realistic situations, no, these are fixed rules.
#### [Manual Frame Construction](Manual%20Frame%20Construction.md)

Understanding the situation and determining:

- What are the specifications and requirements?
- What is my role? What is their goal? What are the rules here?
- This is a static computation -- figuring out the config file to apply
#### [Functional Logic Modeling](Functional%20Logic%20Modeling.md)

I don't have [Social Salience](../Experience/Social%20Salience.md), so I treat other humans as Black Boxes with some attached data.  I may know their stated preferences, stated ideas, etc.  Given a goal I can construct a logical model of the situation where I can compute the inputs that I think will give the desired output(s).  I believe that I construct mini propositional logic models given the data I have for each of the people or systems involved and work backward from that.

Obviously this is expensive, perhaps more so than Theory-Theory.  Luckily I have developed some optimizations:

- full quality models sometimes needed
	- e.g. a presentation at work where I need to understand how to convince another team to do something
- I have a library of heuristics for common situations
	- lunchtime, let's go to the cafeteria
	- picking a movie with my family
- perfect data is rarely available
	- do not stall the process -- if action is needed work with the data we have
	- understand that the data is incomplete
		- use risk management strategies if needed
		- make a conscious decision to proceed
	- best effort given available data
- resource allocation strategy
	- if the effort is much greater than the estimated value of a mistake then use a low fidelity model (incomplete data, best guess, etc.)
	- if the cost of a mistake is low, same -- choosing a restaurant is very low stakes (for me anyway)
	- own the cost of a mistake -- accept that they can happen

These optimizations might not be possible or make sense in people with more traditional mental architectures.  For me they make everyday situations [Zero Lag](../Experience/Zero%20Lag.md) and friction free.
#### [Propositional Logic](Propositional%20Logic.md) (Runtime)

The Functional Logic Modeling identified the appropriate "instructions" to evaluate from my Propositional Logic and this layer actually executes them.

## My Cognitive Architecture

If we put those pieces together

1. **Sensing Hardware** (turned off): [Pure A-salience](../Experience/Pure%20A-salience.md) / no [Social Salience](../Experience/Social%20Salience.md) / [Hypophantasia](../Experience/Hypophantasia.md)
2. **Low Level CPU / ISA** (hardware): [Propositional Logic](Propositional%20Logic.md) 
3. **Ethics, rules, policy** (software): [Axiomatic Deontology](Ethical%20Systems.md#Axiomatic%20Deontology) / [Ethics](Ethics.md)
4. **Initialization** (software): [[Manual Frame Construction]]
5. **Database & Model** (software): [Functional Logic Modeling](Functional%20Logic%20Modeling)
6. **Execution** (software): [Propositional Logic](Propositional%20Logic.md) -- this is where I live

When I enter a room (let's say at a conference) something like this happens:

- [Manual Frame Construction](Manual%20Frame%20Construction.md) -- understand the situation, "professional context, rule: protocol over personality"
- [Functional Logic Modeling](Functional%20Logic%20Modeling.md) -- model the situation with people as black boxes and produce a logical model based on my goals, "goal: factual exchange.  input: standard greeting, ask questions", which produces the instructions.
- [Propositional Logic](Propositional%20Logic.md) (runtime) -- execute the instructions:  "**if** greeting accepted **then** ask question" (probably dropping the if/then for brevity).

These layers and probably ethics are all managed manually by me executing my [Inner Speech](../Experience/Hypophantasia.md#Inner%20Speech).  There are a number of shortcuts I employ in the Functional Logic Modeling -- this isn't as expensive as it sounds.  My entire "stack" is software.

Perhaps surprisingly this gives me a [Zero Lag](../Experience/Zero%20Lag.md) system that worked well enough that I [didn't even know it was a thing](../Experience/Everybody%20is%20the%20Same.md).  I don't try to emulate NT [Theory of Mind](../Experience/Theory%20of%20Mind.md), I didn't know that was a thing until [recently](../Experience/History.md) either.  This is quite a different mechanism than autism, though there is some overlap in [social communication](../Experience/Not%20Autism.md).

What does this feel like?  [Hypophantasia](../Experience/Hypophantasia.md) describes part of it, including my memory and what the experience is like.  I try to explain the rest in [What Thoughts Looks Like](What%20Thoughts%20Looks%20Like.md).