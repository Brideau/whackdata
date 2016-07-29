---
layout: post
title: Build Your Own Online Dashboard for Finding Pokemon
---

Yesterday's tutorial covered getting up and running with Tableau using Pokelyzer, and today's will build on that. I had ambitions to get a tutorial on using the date and time tables done today, but I think I found something even better: how to build an interactive, online dashboard where you can see how Pokemon spawn individually or based on their _type_. Or, frankly, anything else you want!

To give you an idea of where we're heading, here's the final result (click to go to the full map):

<a href="https://public.tableau.com/views/PokemonTest/Sheet2?:embed=y&:display_count=yes" target="_blank">![Tableau Map Link](http://imgur.com/a/z4rUq.png)</a>

*Thank you to [/u/superhanss_](https://www.reddit.com/user/superhanss_) for letting me know that Tableau could do this.* I'm really hoping that anybody running Pokelyzer for a city could set one of these puppies up for everyone else to use.

If you haven't set up Pokelyzer yet, check out the setup instructions available [here](https://github.com/Brideau/pokelyzer/wiki) and follow the first Tableau tutorial [here](https://github.com/Brideau/pokelyzer/wiki/Mapping-with-Tableau) before continuing.

If you **have** set up Pokelyzer already, apply the newest patches available in the [Pokelyzer repo](https://github.com/Brideau/pokelyzer) described in the Readme. Without them, you won't be able to complete this.

OK, let's get started.

## Using Pokemon Dimensions to Slice Data

What the patch above did was populate a table that we already had kicking around, but was empty. This newly populated table, `pokemon_info`, contains a row for every Pokemon and their various attributes:

![Pokemon Table](http://i.imgur.com/XUQH511.png)

The columns `name`, `classification`, `type_1` and `type_2` are all _dimensions_. That is, you can use them to group your data or to filter it like we did last time. For example, you can now page through a series of maps, where each one shows all the Pokemon by their _type_ instead of just their name.

The `weight` and `height` columns are kind of hybrid dimension/measure. They are _measures_ in that you can add them up and average them and such. (In my city, for example, the total mass of Pidgeys that have been spotted since Monday is 47,725 kilos.) At the same time, you can also use these like _dimensions_ to filter data, where you may chose to only show Pokemon types that typically weigh above 20 kg to see where all the big ones are hanging out. The choice is yours

Enough semantics though, let's get to work.

To begin using this table, open up the workbook from the last tutorial and go to the Data Source tab at the bottom. Drag the `pokemon_info` table into the joining area, and change its join type to Left just like the other two.

<div align="center"><img src="http://i.imgur.com/pDY2rve.png"></div>

We're going to do something a bit different this time before we go back into the worksheet so that we can host our online dashboard. Instead of having a live connection to the data, we'll do an extract. In the top right of the screen, click the Extract radio button and click `Edit...`

<div align="center"><img src="http://i.imgur.com/EzNMmmY.png"></div>

Click `Add...` to add a filter, choose `Time Until Hidden Ms` and select `At least` and put `0` in the box and click OK.

<div align="center"><img src="http://i.imgur.com/qhbldeC.png"></div>

What this will do is prevent us from downloading bad data that we have stored in the database.

Next, if you want to import all of your data, choose `All rows` and check off `Incremental refresh` to regularly import new data. Use the `Id` column to identify when new data has been added since that's the primary key on the main table that everything else branches off and is guaranteed to be unique.

<p class="message">
<strong>WARNING</strong><br>
Depending on how much data you have, this could take a while. With 130,000 rows it took me 40s for Tableau to download the data, and then another 3 minutes for it to turn it into its optimized local datastore. If you have a lot more than that, consider adding another filter to only get data for the last day, or use a sample of your total data set if you don't need perfectly accurate results.
</p>

<div align="center"><img src="http://imgur.com/1Sj8PGx.png"></div>

Click OK and then switch back to your worksheet. You'll be prompted to save the extract somewhere, so pick a spot, click save, and wait.

You should now be back to the map you started with, only now you have shiny new measures and dimensions on the left hand menu, each titled `pokemon_info`.

<div align="center"><img src="http://imgur.com/WEslQRX.png"></div>

If you still have your `Time Until Hidden Ms` filter turned on, you can now safely drag that out of the box to delete it since we already filtered out that data when we imported everything from the database.

Next, right click the `Sheet 1` tab at the bottom and rename it to something meaningful, and then right click it again and click `Duplicate sheet`.

<div align="center"><img src="http://imgur.com/WEslQRX.png"></div>

Name the new sheet something along the lines of "MapByType".

In this new worksheet, we're going to remove `Name` from the Pages box in the Filters box by dragging it out of the box or by right clicking and selecting Remove.

Now get `Type 1` from the `spotted_pokemon` table and drag it into Filters. Select "All" and click OK.

<div align="center"><img src="http://imgur.com/FJtiluN.png"></div>

Now right click the `Type 1` you just dragged in and select Show Filter. This will bring up a series of check boxes on the right hand side. Let's make it so that you can only choose one at a time: hover over the top of the box that has the checkboxes, choose the small down arrow, and pick "Single value (list)". You should now have a radio button menu.

<div align="center"><img src="http://imgur.com/2swiUR1.png"></div>

<p class="message">
<strong>Side Note</strong><br>
For now we'll ignore that some Pokemon can be two types at the same time since that complicates things more than we need in an intro tutorial, but know that it is certainly possible to handle that problem.
</p>

Since many Pokemon can be the same type, there's currently no way to tell the difference between points just from looking at the map currently. In my case, all the points are blue, regardless of the Pokemon they represent. Let's change that.

Drag the `Name` field from either the `pokemon_info` table or the `spotted_pokemon` table over the Color item in the "Marks" box. It doesn't matter which `Name` field you use because I duplicated them in the database to make the workflow a bit smoother. If you get a warning about having too many items, disregard it and use all the values. You should now have a map covered in different colored dots, which will change depending on which `Type 1` item you have selected.

<div align="center"><img src="http://imgur.com/SQVU0uJ.png"></div>

Just to remove any ambiguity, let's do one more thing. Go back to the Dimensions pane and drag _another_ `Name` field over, but this time onto the `Tooltip` item in the Marks box. The box should now look like this:

<div align="center"><img src="http://imgur.com/cNhcigE.png"></div>

What this did is add the name of the Pokemon to the popup that shows up when you mouse over the points. Now instead of having to match the colors to the legend, you can just hover your mouse over any point to find out which Pokemon it is.

<div align="center"><img src="http://imgur.com/v9tCBpX.png"></div>

Let's do one more thing before we publish this. Drag the `Hidden Time UTC` dimension from the `spotted_pokemon` table over to the filters. Select "Range of dates" then click Next and OK to close the window. In the filter box, right-click the `Hidden Time UTC` item and select "Show filter". This will make a date picker show up on the right hand side of the screen.

<div align="center"><img src="http://imgur.com/SvbXprW.png"></div>

You can either drag the sliders or click the dates to pick a range of dates to filter the data by. Give it a try.

Finally, let's drag the color legend over the right hand side by dragging the box over so that it looks like this:

<div align="center"><img src="http://imgur.com/822eNas"></div>

The only thing we have left to do is publish this! Visit [Tableau Public](https://public.tableau.com/s/) and set up a free account, which comes with 10GB of data storage. When that's done, come back to Tableau and go to `Server > Tableau Public > Save to Tableau Public...`

<div align="center"><img src="http://imgur.com/WOgRmVT.png"></div>

Sign in, and let the upload begin! When it's done it should automatically open a browser window for you where you can view your handiwork. If you haven't noticed already, you can even click the legend itself filter out which Pokemon show up.

Now, go share this with everyone you know and become their instant best friend.

-Ryan
