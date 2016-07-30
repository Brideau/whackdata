---
layout: post
title: Pokemon Go - Finding Nests and Testing Theories
---

I've developed some tooling for doing date/time and geospatial analysis on Pokemon Go data, which can be used for testing different theories based on historical data.

If you're interested in contributing to The Silph Road's brand new [Global Nest Atlas](https://www.reddit.com/r/TheSilphRoad/comments/4ujm48/the_global_nest_atlas_join_us_in_mapping_the/), for example, you can plug QGIS into it and use it to find nests, as I did today when I found a Diglett nest in a park in my city:

![QGIS Screenshot](http://i.imgur.com/WxzV0pb.png)

Or you can plug Tableau into it to find out if certain Pokemon only show up at certain times of day, days of the week or anything else. For example, here are the Venomoths that were discovered in my area over the last 12 hours (apologies for the lack of data - the servers have been down in Canada for most of the morning):

![Tableau Screenshot of Time of Day Analysis](http://i.imgur.com/nd87JXS.png)

And here's a visualization of all the Pokemon found in my downtown, coloured in clusters based on their spawn point id, which helps to find Pokemon dead zones:

![Tableau Screenshot of Spawn Points](http://i.imgur.com/xRY8bLn.png)

The system works by forking the [PokemonGo-Map](https://github.com/AHAAAAAAA/PokemonGo-Map) data and sending it into a Postgres database with PostGIS installed. It can be re-written to work directly with the source API, but this was the quickest way I could think to build a cheap-and-dirty version.

In the database itself, I've built a dimensional model with special time and date tables that allow you to slice and dice the data however you want using dates and times. You could add additional tables that would allow you to do the analysis based on Pokemon rarity or anything else you'd like.

Before I put any more work into this, I just wanted to get a feeling from the community if this would be useful to you. If so, I can throw it up on Github with some instructions for how to get it working.

<p class="message">
<strong>UPDATE</strong><br>
I've since released the code for this, along with instructions for how to set it up. In you're interested, check out the wiki here: <a href="https://github.com/Brideau/pokelyzer/wiki">https://github.com/Brideau/pokelyzer/wiki</a>.<br>
Or if you're like to see some early results from the tool, have a look at <a href="/2016/07/27/finding-locally-rare-pokemon/">Finding Hotpots for Locally Rare Pokemon Using Tableau</a>.
</p>

-Ryan
