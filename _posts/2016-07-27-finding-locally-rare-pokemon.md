---
layout: post
title: Finding Hotpots for Locally Rare Pokemon Using Tableau
---

<p class="message">
<strong>TL;DR</strong><br>
We're going to use Tableau to analyze Pokemon Go data for a local area, in order to find spawn patterns for relatively rare Pokemon. First I'll show some of my own results, and then describe how you can do it yourself.
</p>

Yesterday I [published a piece](http://www.whackdata.com/2016/07/26/instructions-analyzing-pokemon-go-data/) on how to get Pokelyzer - a database for doing data analysis on Pokemon Go data - up and running. Today, we'll use it with Tableau to find some rare Pokemon. This doesn't work for _all_ Pokemon necessarily, but if they spawn in a specific pattern or place, this will help you find them.

Let's start with some examples.

In my town, Magmars are hard to track down. As it turns out, that's simply because they almost exclusively show up at a large cathedral downtown. (Perhaps because they look like Satan as some kind of joke? I'd like someone else to help verify!) Here's three days worth of Magmar spottings on a map:

![Magmar spottings on a map](http://i.imgur.com/dAXL8Zw.png)

Now contrast that with Pidgeys:

![Pidgey spottings on a map](http://i.imgur.com/hfGQtie.png)

Similarly, while Magikarps show up in random locations, they consistently show up in higher numbers near small streams, and they show up in the same spots along those streams every time:

![Magikarps](http://i.imgur.com/5dSkMUC.png)

This same pattern can be found on maps of Psyducks and Staryus.

In the case of Digletts and Tangelas, they only really show up in a large park. The Digletts are scattered through the park, while the Tangelas keep to the Botanical Gardens:

![Digletts Staryus](http://i.imgur.com/YLNmGOv.png)

And Exeggcutes keep to their own, separate park:

![Exeggcutes](http://i.imgur.com/m5K6ras.png)

If you wanted to know what time of day you should go catch an Exeggcute, you can break down their sightings by hour and add it to a dashboard with the map:

![Hour breakdown](http://i.imgur.com/jKPdhcR.png)

Or even by 15 minute interval to find out if there's a particular part of the hour where they show up:

![15 minute interval](http://i.imgur.com/9hnduwl.png)

Basically, you can look at whatever you like! The data is modeled in a way that gives you incredible flexibility, so long as you're willing to learn the tool.

Speaking of which, let's run through an example of that now.

## Using Tableau to create maps

Before you get started with Tableau, you'll have to follow my guide from yesterday on [getting Pokelyzer set up](https://github.com/Brideau/pokelyzer/wiki). If you tried yesterday and couldn't get it to work, I've added some instructions on how to get it set up on your own computer instead of a server, so give it another look. If you _did_ get it working, I found a bug late last night so you'll want to run the patching SQL code mentioned in the [Readme](https://github.com/Brideau/pokelyzer) or else this tutorial won't work.

To get started, you'll need Tableau. If you want to connect it to a PostgreSQL database, it will cost you some money after the trial. (If it's not available during the trial period, let me know and I will write a script to export data from the database to a CSV file.) Or if you're a student like me, you can get a free license [here](http://www.tableau.com/academic/students). I'm planning to put up tutorials with free alternatives shortly, but bear with me for now.

Once you get Tableau installed, install the appropriate drivers for PostgreSQL from [their website](http://www.tableau.com/support/drivers).

Now with everything set up, we can get started!

Open Tableau and select PostgreSQL from the left sidebar and put in your credentials:

<div align="center"><img src="http://i.imgur.com/tBAY16P.png" width="400"></div>

On the next screen, drag the `spotted_pokemon` table into the center area first, followed by the `date_dimension` and `time_dimension` tables. The result should look like this:

![Initial Tableau setup](http://i.imgur.com/zKRnkxH.png)

Now click each of the pairs of circles that connect the tables and choose Left Join for both:

![Left join](http://i.imgur.com/7YMAAyW.png)

When you're done, click Update Now and wait while the data loads. The table should look like this when you're done:

![Update Now](http://i.imgur.com/xDZAtZ2.png)

Since Tableau doesn't have direct support for geospatial data objects, we're going to hide the columns that have that kind of data. Scroll right on the table until you find the `Geo Point` and `Geo Point Jittered` columns. Hover over their column headers, select the arrow in the top right, and click hide:

![Hide columns](http://i.imgur.com/Ef5QblU.png)

Luckily we have separate Latitude and Longitude columns that Tableau _can_ use, so this isn't a big deal.

Next, click "Sheet 1" at the bottom left of the screen to open your first Workbook. Along the left hand hide, you'll see all of the measures and dimensions available to do the analysis. Thing of measures as "stuff we want to count or average" and dimensions as "things we'll use to slice the data up". For example, if you wanted to find the average "Time Until Hidden" of all Pokemon by their name, "Time Until Hidden" would be the measure, and "Name" would be a dimension.

Tableau did it's best to guess which columns of data were measures and which were dimensions, but it doesn't do a perfect job so we'll need to move a couple things. Drag each of the items under the time_dimension in the Measures section up to the Dimensions section:

<div align="center"><img src="http://i.imgur.com/2af1bmX.png" width="400"></div>

And do the same for each of `Longitude`, `Latitude`, `Longitude Jittered` and `Latitude Jittered`. If you collapse the `date_dimension` and `time_dimension` menus, the final result should look like this:

<div align="center"><img src="http://i.imgur.com/bREz8hu.png" width="350"></div>

OK, now we're good to get started! Let's build the worksheet I used to find the Pokemon clusters above. First drag `Longitude Jittered` into the "Columns" area on the workbook, and `Latitude Jittered` into the "Rows":

![Long and Lat](http://i.imgur.com/6kEqC1H.png)

We're using the "jittered" longitude and latitude because a lot of the points are exactly on top of each other. The jittered values have had their locations randomized by a few metres and will make overlapping points easier to see.

Next, we're going to filter out some potentially bad data. I noticed that some of the data points had a "Time Until Hidden" value that was giant negative number. To get rid of those points, drag the `Time Until Hidden Ms` measure into the Filters pane, select "All values" and click next:

<div align="center"><img src="http://i.imgur.com/j2tWO4n.png" width="400"></div>

Then select "At least" and enter `0` in the box and click OK:

<div align="center"><img src="http://i.imgur.com/5KrWLq5.png" width="400"></div>

Finally, drag the `Name` dimension into the Pages pane. Think of Pages as "pages of a book": we want each Pokemon, based on their name, to have a their own page in a book that shows where they're been found. The screen should now look like this:

![Name](http://i.imgur.com/KgEWdi1.png)

Using the dropdown or the left and right arrows next to them in the pane below pages, you can now flip through maps of all the Pokemon that have been discovered! Give it a try.

The background map doesn't have a lot of detail, though, so you can't zoom in very far. To fix that, download one of the zipped TMS file from [this post](https://community.tableau.com/thread/137641) over at the Tableau community. Unzip it, and then go to the `Map > Background Maps > Map Services..` menu in Tableau, and import the unzipped file.  Your workbook now uses OpenStreetMaps as a background instead of the default Tableau map:

![OSM](http://i.imgur.com/1SBd8eu.png)

## Until next time...

This is probably a good place to stop for today, but if you're interested in me doing another tutorial on how to do the time-based visualizations I mentioned above let me know, and feel free to explore Tableau in the meantime. If you're looking to dive deeper, [Pluralsight has a great tutorial](https://www.pluralsight.com/courses/data-analysis-fundamentals-tableau) as well, so check it out!

-Ryan
