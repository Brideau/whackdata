---
layout: post
title: It's About Time&#58; Using Pokelyzer for Date and Time Analysis
---

<div align="center"><img src="http://imgur.com/bCL3aC7.png"></div>

This tutorial's going to cover how to do time-based analysis on your Pokemon Go data. I promised it a while ago, but I wasn't happy with where Pokelyzer's time capabilities were and didn't want to do this twice. Since then, I've added local time support, and things in general have stabilized, so I think now is a good, well, _time_ to do this.

First, what's the difference between what Pokelyzer can do and what you can do with any other database that has a column of time stamps? Well, try this: take all of your data in your other database, and write some code to do a count of rare Pokemon grouped into 15 minute intervals for the entire day. If you've ever tried this, you know how much it sucks.

In Pokelyzer, I've done all the heavy lifting by creating so-called "time and date dimension tables" to make this much, much easier. Let's walk through a quick example.

## Getting Things Set Up

If you've already got Pokelyzer set up and have followed the previous tutorials, make sure you've applied the [newest patch](https://github.com/Brideau/pokelyzer/wiki/Patches#aug-5-2016) that supports local time zones and any patch since your original installation. If this is your first time using Pokelyzer, have a look at the [wiki](https://github.com/Brideau/pokelyzer/wiki) to get started.

Once you have that set up, go to your Data Source tab in Tableau, and set up your joins using the new `time_dimension_local` and `date_dimension_local` tables so it looks like this:

<div align="center"><img src="http://imgur.com/3XK8TQC.png"></div>

Before we go any further, if you look closely at the data in these time and date tables in pgAdmin, it'll help you gain an intuition for the purpose of them.

Take the `time_dimension` and `time_dimension_local` tables for example. Each of them has 1440 rows: one row for every minute of a 24 hour day. And each of those minutes belongs to some "part" of the day. Let's imagine a Pokemon that appeared 12 seconds after 3:42PM, for example. If you were thinking of how to categorize this time, you could do so in countless ways:

 - it falls into the 3PM hour-block in a 12-hour clock
 - it's in the 15-minute interval that starts at 3:30PM and ends at 3:44PM, which is the 62nd 15-minute interval of the day
 - it falls on the 42nd minute past the hour
 - it's in the "late afternoon"
 - it occurs within the 3:42PM minute of the day

When you create a "time dimension table" like Pokelyzer has, all you're really doing is labeling each minute of the day with all the labels you can think of for that minute. Each of those labels gets its own column in the table, like in this table where I implemented a few of the possible labels mentioned above. Take a moment to look at this set of records until you really 'get' this.

<div align="center"><img src="http://imgur.com/18BGhXu.png"></div>

When you have a row of data that occurs at a given timestamp, like a Pokemon spotting, you use this table to label that row with all the time-of-day categories it falls into. At a bigger scale, the same principles apply to the date tables as well - they just have one row per day instead of one row per minute. (E.g. January 1st 2016 is each of New Years day, the first day of the year, the first day of a month, a Friday, a member of the January month, and a bunch of other things.)

Let's see how to use this in Tableau.

## Using the Time Dimension in Tableau

Let's say you know that a specific rare Pokemon always shows up in the same place, but you want to find out if it usually shows up at a particular time of day, or part of an hour. To begin, create a new worksheet and drag the `name` element from the `pokemon_info` table into the filter panel. Accept the defaults and click OK, then right-click the filter and click 'Show filter' to show the full list on the right-hand-side of the screen.

<div align="center"><img src="http://imgur.com/FCalX63.png"></div>

Pick a Pokemon that you're interested in from the selection box. Then drag "Label 15Min 12" (translation: labels for each 15-minute interval for a 12-hour clock) from the `time dimension` table and drag it into the "columns" pane.

<div align="center"><img src="http://imgur.com/zD6F0I9.png"></div>

Think of 'columns' as the x-axis of the chart you're going to make. If we have time on the x-axis, we probably want a count of things on the y-axis. To do this, go to the 'Measures' pane and find "Number of Records" and drag it into the rows pane. Although in this case the _sum_ of the number of records of a given Pokemon is the same as the _count_, that won't always be true, so right click the item you just dragged in, and go to Measures and choose Count. You now have a chart of the count of your Pokemon, grouped by 15 minute intervals!

<div align="center"><img src="http://imgur.com/jSg7Xrh.png"></div>

But there's one problem: this only shows the 15-minute intervals that had at least one thing in it, so there's entire sections of the x-axis missing. To fix this, go to the Analysis menu, then to "Table layout", and choose 'Show empty columns'. This will show all the time intervals, regardless of whether they had a Pokemon spotting in them or not.

<div align="center"><img src="http://imgur.com/gxGP6Uq.png"></div>

If you want to get a bit fancier, try dragging another "Name" dimension into the row item, but put it to the left of the earlier "Count" field. Now, if you check more than one Pokemon, you get a different chart for each one. In effect, you now have a y-axes with multi levels to it, but a common x-axis.

<div align="center"><img src="http://imgur.com/DLp5VbM.png"></div>

Try playing around with the date and time dimensions yourself to see how the other ones work. The only other big thing that might trip you up is if Tableau tried to be a bit over-reaching and pick the 'type' of some of them to be something other than string. For example, notice how the "Month Number" item in mine has a `#` symbol next to it - this means Tableau treats it as an integer.

<div align="center"><img src="http://imgur.com/XJgLtEn.png"></div>

But since we won't be summing month numbers, it's better as a string. Just click that symbol, and any others in your time or date tables that don't have `Abc` next to them, and change them to strings.

<div align="center"><img src="http://imgur.com/L78HW7N.png"></div>

There's certainly more to this, but hopefully this gives you enough to get started.

For those interested in the underlying SQL, creating a schema in this way lets us accomplish the earlier challenge of doing complex time groupings using queries of the form:

```
SELECT td.label_15min_24, COUNT(sp.id)
FROM time_dimension AS td
LEFT JOIN spotted_pokemon AS sp ON sp.time_key = td.time_key AND sp.pokemon_id = 19
GROUP BY td.label_15min_24
ORDER BY td.label_15min_24;
```

I mean, for doing something as complicated as we are, it doesn't get much simpler than that. And this is the exact form it takes, regardless of the time grouping we are doing - we just do the hard work ahead of time when we create our time and date dimensions.

-Ryan
