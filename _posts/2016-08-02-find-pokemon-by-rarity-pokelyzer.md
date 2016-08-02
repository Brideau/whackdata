---
layout: post
title: Finding Pokemon by Their Rarity with Pokelyzer
---

At long last, I've added a simple patch that lets you group Pokemon by rarity in Pokelyzer! (Thanks Niklas and [ferazambuja](https://github.com/ferazambuja) for the help!)

<div align="center"><img src="http://imgur.com/WrxwCOp.png"></div>

If you're just joining, have a look at [Finding Hotpots for Locally Rare Pokemon Using Tableau](http://www.whackdata.com/2016/07/27/finding-locally-rare-pokemon/) and [Help Others Find Rare Pokemon Nearby](http://www.whackdata.com/2016/07/29/help-others-find-rare-pokemon-nearby/) before continuing.

And if you already have Pokelyzer set up, have a look at the latest patches in the [readme](https://github.com/Brideau/pokelyzer) and install the new [webhook listener](http://www.whackdata.com/2016/07/31/pokelyzer-webhook-integration-pokemongo-map/) which you'll need before continuing.

One last thing: if you Tableau trial is running out, have a look at this [PowerBI tutorial](https://github.com/Brideau/pokelyzer/wiki/Basic-Charting-and-Mapping) put together by [/u/daymanelite](https://www.reddit.com/user/daymanelite). It's still young, but it looks very promising.

This one's gonna be quick, so let's jump in.

After you apply the newest `pokemon_info` table patch, go to the Data Sources tab, go to the Data menu, and click Refresh.

<div align="center"><img src="http://imgur.com/DRXeIXt.png"></div>

Go back to one of your worksheets and check your `pokemon_info` table and you should find a new entry for rarity.

<div align="center"><img src="http://imgur.com/JDiuoRO.png"></div>

If you have an red Name fields like the following showing, let me explain.

<div align="center"><img src="http://imgur.com/QOKqSpk.png"></div>

In the latest release, the `name` field became redundant because it was in the `pokemon_info` table as well, which we can just join to our main `spotted_pokemon` table based on the `pokemon_id` field. This is good practice because if the spelling gets messed up on one of the Pokemon's names (it happens), instead of having to edit hundreds of thousands of rows in the database, you update one line of the `pokemon_info` table. Easy and efficient.

To fix the red field, just drag the name field from the `pokemon_info` table over top of it, and all should be better.

Now just duplicate the map you made in [Help Others Find Rare Pokemon Nearby](http://www.whackdata.com/2016/07/29/help-others-find-rare-pokemon-nearby/). Drag the `rarity` field over top of the current filter to replace it.

<div align="center"><img src="http://imgur.com/N2KK2ny.png"></div>

Check all the boxes in the dialog that comes up, and click ok.

<div align="center"><img src="http://imgur.com/WNMZ2jp.png"></div>

Right-click the filter, select "Show filter", and change the dropdown to "Single value (list)".

<div align="center"><img src="http://imgur.com/gPp37Pj.png"></div>

Select the button for "rare", and there you go! Only the rare ones show up on the map.

<div align="center"><img src="http://imgur.com/tOg6Z3I.png"></div>

Just to be sure you have good data since the the nest switch, see my post [The Era of Eras - Updating Pokelyzer for the Nest Switch-a-Roo](http://www.whackdata.com/2016/07/29/the-era-of-eras-pokemon-go-pokelyzer/) and add a filter for Era.

<div align="center"><img src="http://imgur.com/RqwKnxM.png"></div>

Finally, drag the Pokemon name over the Color box and again over the Label box (drag twice from the left menu or it'll just move it). You'll now have all the points colored and labelled.

<div align="center"><img src="http://imgur.com/FDj9PtF.png"></div>

If you want, click the Label area and adjust the setting as you see fit.

## Next Up...

I would still like to do some tutorials on time-based analysis, but I'm actually waiting until after I finish the next major addition to Pokelyzer, which is support for local timezones. Timezones are tougher than they sounds (check out my explanation [here](https://github.com/Brideau/pokelyzer/issues/39) if you're interested), but I'll hopefully have that out the door in the next few days. Stay tuned!

-Ryan
