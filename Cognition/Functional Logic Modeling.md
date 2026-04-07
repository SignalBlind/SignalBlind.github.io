---
layout: page
title: Functional Logic Modeling
permalink: /Cognition/Functional_Logic_Modeling/
order: 1130
---
Time for a plan.

I don't have [Social Salience](../Experience/Social%20Salience.md), so I treat other humans as [Black Boxes](../Experience/Black%20Box.md) with some [attached facts](Truth%20and%20Facts.md).  I may know their stated preferences, stated ideas, etc.  Given a goal I can construct a logical model of the situation where I can compute the inputs that I think will give the desired output(s).

This involves:

- retrieving facts and opinions from [associative memory](../Experience/Hypophantasia.md#My%20Experience%20Memory)
- computing expected value for uncertain variables
	- OK, I am not literally doing math here but estimating something like `P(50%) * HIGH > P(90%) * LOW`
- more [Propositional Logic](Propositional%20Logic.md) to model everything

Obviously this is expensive, perhaps more so than Theory-Theory.  Luckily I have developed some optimizations:

- familiar situations, e.g. going to lunch, have a script (zero cost)
	- plug in the people present
	- proceed
- low fidelity models can be used for many situations (low cost)
	- if the cost of mistakes are low use a low fidelity model
		- e.g. other situations that had some similarity
		- not considering all the people and factors involved: usually a logical argument will suffice
	- own the cost of a mistake -- accept that they can happen
	- understand that the data is incomplete
		- use risk management strategies if needed
		- make a conscious decision to proceed
	- adjust via feedback
	- typical random situations
- high fidelity models can be used when needed (high cost)
	- for example, a presentation to another group to convince them to do a certain project
	- consider the available data, logical arguments, how people may react, what are their likely needs and desires given what their group does, etc.
	- I need to model complex black boxes that represent people with enough fidelity that I can predict which inputs will produce the desired outputs
		- without the input of vibes or other social salience
		- just data and logical arguments
		- person A's stated goals
		- known constraints of the environment
		- logical causal chains ("Given Person A's stated facts and constraints, a logical agent would produce Y if given input X.")
	- this is not dissimilar to NT people planning the same meeting, just focusing on pure information and logic
		- NT people need to consider social and emotional aspects as well
	- this is not used real-time, this is planning for a meeting or other even and asynchronous

### Feedback Loop

There is one additional heuristic:

- replan if necessary (low to medium cost)
	- if new information is presented or I detect the current plan failing
	- come up with a new focused low fidelity plan
		- not nearly as fast as NT social signals ([double empathy](../Experience/Double%20Empathy.md))
		- but usable with some computational lag in a conversation

See [Typical Example](Examples.md#Typical%20Example) for a replan -- it can be done during a conversation if simple enough.

### Limitations

And some disadvantages:

- the replan trigger requires explicit information
	- if the NT people around me have decided on a new, not explicitly stated, plan I will still be on the old plan
	- in social situations this might mean unstructured shopping time when I think it is time to go to the next destination
	- this is a significant source of social [Friction](../Experience/Friction.md) with NT people -- I appear stubborn or stuck
- if the task requires an emotional plea I likely cannot accomplish it
	- I can represent my own emotions but I have no [affect empathy](../Emotions/Empathy.md) and cannot adjust

### Next Step: Propositional Logic (Runtime)

The model produces a plan for how to achieve my goals -- the instructions I need to execute to achieve the desired result via [Propositional Logic](Propositional%20Logic.md).  Those are the instructions I need to evaluate in the next step -- some small subset of my available instructions.
