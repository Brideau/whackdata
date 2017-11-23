---
layout: post
title: Pokelyzer Webhook Integration with PokemonGo-Map (aka Making Your Life Significantly Easier)
---

![Webhooks!](http://imgur.com/btp5OCc.png)

**Note:** _If this is your first time hearing of Pokelyzer, check out [Pokemon Go - Finding Nests and Testing Theories](http://www.whackdata.com/2016/07/25/tool-for-analyzing-mapping-pokemon-go/) [Finding Hotpots for Locally Rare Pokemon Using Tableau](http://www.whackdata.com/2016/07/27/finding-locally-rare-pokemon/) first._

Since I first created Pokelyzer, it's been a hack job. For the dozens of people that made it though the painful steps of modifying the PokemonGo-Map code and got it working: thank you for your patience. But after today, that should no longer be necessary.

Earlier this week, the PokemonGo-Map team released a "webhook" interface. Basically all this means is that instead of having to modify their code, you can write a separate app and they send you data whenever they discover a new Pokemon or anything else. So that's what I did. You can install it by [following the instructions here](https://github.com/Brideau/pokelyzer). Look mom, no code changes required!

Give the installation a shot and let me know how it goes. If you're interested in what the app itself looks like, the entire thing is only about 100 lines of code and is available [here](https://github.com/Brideau/pokelyzer/blob/master/app.js).

Also, as a side node, it looks like [Pokevision is officially toast](https://www.reddit.com/r/TheSilphRoad/comments/4vga8d/pokevision_shuts_down_we_are_respecting_niantic/), and Niantic has started blacklisting just about every major server provider that tries to get data from them. You can still run your own map service as of today using PokemonGo-Map, but not from services like AWS. If you get a 403 error when trying to connect, that's why.

-Ryan
