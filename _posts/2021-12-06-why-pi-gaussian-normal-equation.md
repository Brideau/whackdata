---
layout: post
title: Why Does Pi Show up in the Normal Distribution?
description: Description
image: ./images/whypi/why_pi_title.png
author: Ryan Brideau
lang: en_us
tags: placeholder
---

<div>
<img src="/images/whypi/why_pi_title.png" alt="The words Why Pi over top of a bell curve.">
</div>

While recently looking through an old stats textbook, I came across the familiar equation for the normal distribution:

<div>
\[ f(x) = \frac{1}{\sigma\sqrt{2\pi}}e^{-\frac{1}{2}(\frac{x-\mu}{\sigma})^{2}} \]
</div>

Anyone that's taken a statistics course in university has come across this equation. I had seen it many times myself, but looking at it fresh this time, two questions immediately came to mind:

 1. How exactly does this thing form a normal distribution?
 2. What the hell is <span>\\( \pi \\)</span> doing in there?

The first question seemed simple enough to figure out: I would just have to trace back the history of the equation and put it together piece by piece. But the second question absolutely stumped me: what in the world does a bell curve have to do with a circle? 

I read through all of the [Math Stackexchange solutions](https://math.stackexchange.com/q/28558/424609), searched around, and asked on Twitter, but never felt like any of the answers gave me the intuition I was looking for. They relied too heavily on analytical solutions, or when visual techniques were employed, the connections felt hand-wavy to me. After doing a bit of my own research, here's my attempt at explaining the connection without resorting to any advanced math.

<div>
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Math friends: without resorting to doing a proof, what’s an intuitive reason for why pi shows up in the normalizing constant for the Normal pmf? What’s the connection to a circle? <a href="https://t.co/4D1qchgItK">pic.twitter.com/4D1qchgItK</a></p>&mdash; Ryan Brideau (@Brideau) <a href="https://twitter.com/Brideau/status/1462970015662153734?ref_src=twsrc%5Etfw">November 23, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 
</div>

## First what exactly is a bell curve?

Before we get to the <span>\\( \pi \\)</span> part, it helps to gain some insight into how exactly a bell curve is formed. Let's start with the exponential function, which you can see within the equation above. Here it is standing on its own:

<div>
\[ f(x) = e^{x} \]
<img src="/images/whypi/exponential.png" alt="A chart showing the exponential function.">
</div>

If we square the value of <span>\\( x \\)</span>, it turns into something that looks kind of like a quadratic, but isn't one. Instead, it's a function that grows much faster than a quadratic, but has some similar properties such as being symmetric about its lowest point. Adding it to the plot above for comparison, you can see that they have the same value at <span>\\( x=0 \\)</span> and <span>\\( x=1 \\)</span>:

<div>
\[ f(x) = e^{x^2} \]
<img src="/images/whypi/exponential_x2.png" alt="A chart showing the exponential function and the exponential function raised to x-squared.">
</div>

Finally, let's make the exponent negative, and like magic, we get the bell curve shown in red below:

<div>
\[ f(x) = e^{-x^2} \]
<img src="/images/whypi/exponential_min_x2.png" alt="A chart showing the exponential function, Euler's number function raised to x-squared, and Euler's number raised to negative x-squared.">
</div>

This function, <span>\\( f(x) = e^{-x^2} \\)</span>, is just one particular bell curve of an infinite number of possibilities. In general, you can raise <span>\\( e \\)</span> to any quadratic you like. However, it is only when that quadratic is concave (that is, it "opens" downwards) that you get a bell curve. Above, that quadratic was <span>\\( -x^2 \\)</span>, which does indeed open downwards.

For example, the equation <span>\\( f(x) = x^2 + x + 2 \\)</span>  plotted in blue below is not concave, and when <span>\\( e \\)</span> is raised to it, you get the green curve, which is obviously not a bell curve:

<div>
<img src="/images/whypi/not_a_bell_curve.png" alt="">
</div>

If we switch the equation to be <span>\\( f(x) = -2x^2 + 3x + 2 \\)</span>, though, we get a concave function, and <span>\\( e \\)</span> raised to that forms the bell curve shape:

<div>
<img src="/images/whypi/is_a_bell_curve.png" alt="">
</div>
<br>
For this reason, the general equation of a equation of a bell curve is <span>\\( e \\)</span> raised to a quadratic:

<div>
\[ f(x) = e^{\alpha x^2 + \beta x + \gamma} \]
</div>

To help constrain it to only concave quadratics, you can perform the following replacements:

<div>
\[ \alpha = \frac{-1}{2\sigma^{2}} \]
\[ \beta = \frac{\mu}{\sigma^{2}} \]
\[ \gamma = \ln(a) - \frac{\mu^2}{2\sigma^2} \]
</div>

After you substitue these in and rearrange, you'll find that you get the following, which is almost exactly the equation we started with at the top, only with an <span>\\( a \\)</span> in front of it:

<div>
\[ f(x) = ae^{-\frac{1}{2}(\frac{x-\mu}{\sigma})^{2}} \textbf{  vs  } f(x) = \frac{1}{\sigma\sqrt{2\pi}}e^{-\frac{1}{2}(\frac{x-\mu}{\sigma})^{2}} \]
</div>

The <span>\\( a \\)</span> is chosen in the equation on the right so that no matter what shape the bell curve takes, the area underneath it is always exactly 1. This is because for a statistical distribution, 1 is equivalent to 100% of the possible outcomes, and the area should always sum to that value.

So, in other words, the connection between the bell curve and that <span>\\( \pi \\)</span> term must have something to do with the area of the curve itself. But what exactly is that connection?

## How Pi is related to the bell curve

Before I get to _how_ <span>\\( \pi \\)</span> is related, let me first state a fact and let you chew on it for a moment: if we return to one of the equations above, <span>\\( f(x) = e^{-x^2} \\)</span>, it turns out that the area under this curve is _exactly_ <span>\\( \sqrt{\pi}\\)</span>.

<div>
<img src="/images/whypi/area.png" alt="A graph of e to the power of minux x squared, showing that the area below it is equal to the square root of Pi.">
</div>

Let's take stock of what just happened there. We took a [transcendental](https://en.wikipedia.org/wiki/Transcendental_number) number, <span>\\( e \\)</span>, and raised it to the power of a quadratic. When we calculate the area under that curve, we get _another_ transcendental number, Pi.

It turns out that these two numbers are related in a few ways, including their relationship in the complex number system via one of the most beautiful equations in math: <a href="https://en.wikipedia.org/wiki/Euler%27s_formula"> <span>\\( e^{i\pi} + 1 = 0 \\)</span></a>. But that equation doesn't play a role here. 

Instead, as we'll see, <span>\\( \pi \\)</span> comes out of the way that we have to go about calculating the area. In a roundabout way, we can get this area by working with the square of <span>\\( e^{-x^2} \\)</span>, and then taking the square root. In other words:

<div>
\[ \sqrt{( \text{Area of } e^{-x^2})\cdot (\text{Area of } e^{-x^2})} \]
</div>

The reason we have to do this has to do with the calculus technique that we need to employ to get the area. There's plenty of [examples online](https://en.wikipedia.org/wiki/Gaussian_integral) that show how to do this, but I want to instead provide the visual intuition that these analytic solutions don't necessarily convey.

Since the variable we use to calculate the area is arbitrary, we can just as easily represent the above equation as the following, where we replaced the second <span>\\( x \\)</span> with a <span>\\( y \\)</span>:

<div>
\[ \sqrt{( \text{Area of } e^{-x^2})\cdot (\text{Area of } e^{-y^2})} \]
</div>

You can now think of this as putting one of these bell curves on the x-axis and the other on the y-axis, and then getting all combinations of their heights and plotting it in 3 dimensions:

<div>
<img src="/images/whypi/3d_bell_curve.png" alt="A 3d chart showing a bell curve along the x and y axes, forming a uniform hill along the z-axis.">
</div>

To get the area of one of the curves, you just need to get the volume of the "hill" that forms, and then take the square root of that value. An analogy to this with fewer dimensions is knowing the area of a square, and then getting its side length by taking the square root.

But, how do we get the volume? One way would be to chunk up the hill into squares like above, and then get the height of each in the middle of the square. You could then calculate the volume of these square pillars as <span>\\( (\text{Area of Each Square}) \cdot (\text{Height}) \\)</span> and then add up all those smaller volumes. The smaller you make the squares, the better the approximation.

However, this hides where the <span>\\( \pi \\)</span> comes from. So instead, imagine that instead of using squares, we divide it up radially. In this diagram, we are looking down from the top and we see the contour lines of the hill:

<div>
<img src="/images/whypi/volume_radial.png" alt="A top down view of a 3d chart of a bell curve, showing a small chunk of area of a concentric circle.">
</div>

Here, you divide up the hill into "slices" represented by the black dotted lines. Those slices are further divided into pieces as highlighted in blue. As above, you multiply the area of each of these blue pieces by the height of the hill at that point to get the volume.

<div>
\[ r \Delta \theta \Delta r \cdot \text{Height} \]
</div>

In this case, though, you repeat this along the "slice" to get the volume of the entire slice, and then multiply that by the total number of slices to get the entire volume of the hill.

If you make the angle <span>\\( \theta \\)</span> small enough so that it's barely a sliver, then for all intents and purposes, you can multiply the volume of a slice by <span>\\( 2 \pi  \text{ radians}\\)</span>, the number of radians in a circle.

If you actually do this math (again, the calculus is covered [here](https://en.wikipedia.org/wiki/Gaussian_integral#By_polar_coordinates) for those that want to see it in action) you'll find that each slice has an area of exactly <span>\\( \frac{1}{2} \\)</span>. Multiplying that by <span>\\( 2 \pi  \text{ radians}\\)</span> and you get a volume that exactly equals <span>\\( \pi \\)</span>. 

**So there you have it: <span>\\( \pi \\)</span> comes out of the fact that we find the volume by making radial slices, and then stitching them all together around a circle.**

As it turns out, anything that is symmetric through rotation can be thought of as involving circles, and naturally, circles imply that <span>\\( \pi \\)</span> is lurking somewhere in the math.

While this isn't a rigorous proof and I skipped over a lot of details (e.g. the jump to the 3D plot of the two bell curves doesn't generally work for all functions, but it does for the ones we used) I hope that this gives readers an intuition for why <span>\\( \pi \\)</span> seems to show up out of nowhere in a curve that has seemingly little to do with it.