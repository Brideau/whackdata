---
layout: post
title: You Should be Using Precision Top K for your Fraud and Lead Generation Models
description: 
image: 
author: Ryan Brideau
lang: en_us
tags: data science, metrics, sales, fraud
---

TODO: Can you auto-add the description at the top?

Both while I was working as a data scientist on Shopify's Retail go-to-market team, and now on Wealthsimple's fraud team, I ran into the same problem: the models we build often produce too much output for our colleagues to process. In sales, for instance, on any given day there might be 1,000 potential cross-sells that could be processed. But if you only have 5 sales people, they may only be able to get to a small fraction of those during the workday.

The metrics we use, however, often compute performance of the model over the entire set of leads without taking into account 

I'd like to highlight the metrics Precision Top-K (aka Precision@k or P@k in shorthand) and Card Precision Top-K as solutions to this problem.

k - the maximum number of alerts that can be checked. Useful when k is much smaller than the total number of things.

Card Precision Top-K focuses on fraudulent cards as opposed to transactions. Is this an important distinction? Maybe not. Just highlight Precision Top-K and tell them to think carefully about what metric to use.

Dot-based images showing a random bag of leads

Used for operationalization and monitoring.

Why would this be better than lift?
 - it is a practical metric. Can be monitored daily based on actual results. Able to operationalize.
 - it is a single number, as opposed to a range of numbers or an average
 - make some kind of direct comparison to lift. Also, you're still allowed to use that.

Start by showing reality (you know who is which category) to what you're able to observe initially

Use thin, tall rectangles to represent leads or fraud causes. Makes it easier to show how it relates to percentiles

Include a short snippet showing how to calculate precision top k. Use a fake classification algo - no need to specify which. Check out maker_scorer: https://stackoverflow.com/questions/31645314/custom-precision-at-k-scoring-object-in-sklearn-for-gridsearchcv

Multiple days. You take the P@k for each day and take the average.

<div>
<img src="/images/whypi/why_pi_title.png" alt="The words Why Pi over top of a bell curve.">
</div>

While recently looking through an old stats textbook, I came across the familiar equation for the normal distribution:

<div>
\[ f(x) = \frac{1}{\sigma\sqrt{2\pi}}e^{-\frac{1}{2}(\frac{x-\mu}{\sigma})^{2}} \]
</div>



<div>
\[ f(x) = e^{x} \]
<img src="/images/whypi/exponential.png" alt="A chart showing the exponential function.">
</div>
