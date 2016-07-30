---
layout: post
title: The Era of Eras - Updating Pokelyzer for the Nest Switch-a-Roo
---

As you might have heard, nests have [suddenly and dramatically switched around](https://www.reddit.com/r/TheSilphRoad/comments/4v78mw/psa_nests_have_changed/).

I know what you're thinking: "what a great time to learn a good lesson about the power of dimensional models!" Exactly!

See, if you go hunting for nests using all the data from before the switch, you'll find nests mixed with both kinds of Pokemon. What a mess.

![Blended era image](http://i.imgur.com/g7jCMJw.png)

Luckily, the schema we are using in Pokelyzer is designed to handle such situations. All we have to do is

  - Stop our map server for a moment.
  - Run this bit of SQL:

  {% highlight bash %}
  ALTER TABLE public.spotted_pokemon ADD COLUMN pokemon_go_era integer;

  UPDATE public.spotted_pokemon
  SET pokemon_go_era = '1'
  WHERE hidden_time_utc < '2016-07-29 15:00:00';

  UPDATE public.spotted_pokemon
  SET pokemon_go_era = '2'
  WHERE hidden_time_utc >= '2016-07-29 15:00:00';
  {% endhighlight %}

  - Add this line below where you added `--pokel-pass` in `utils.py`:

{% highlight python %}
parser.add_argument('--pokel-era', help='Current Migration Era',type=int, default=2)
{% endhighlight %}

  - Modify the bottom of the `logPokemonDb()` function in `customLog.py` to this (make sure it's all indented 4 spaces/1 tab):

{% highlight python %}
pokemon_go_era = args.pokel_era

query =  "INSERT INTO spotted_pokemon (name, encounter_id, last_modified_time, time_until_hidden_ms, hidden_time_unix_s, hidden_time_utc, spawnpoint_id, longitude, latitude, pokemon_id, longitude_jittered, latitude_jittered, pokemon_go_era) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (encounter_id) DO UPDATE SET last_modified_time = EXCLUDED.last_modified_time, time_until_hidden_ms = EXCLUDED.time_until_hidden_ms, hidden_time_unix_s = EXCLUDED.hidden_time_unix_s, hidden_time_utc = EXCLUDED.hidden_time_utc;"

data = (pokemon_name, encounter_id, last_modified_time, time_until_hidden_ms, hidden_time_unix_s, hidden_time_utc, spawnpoint_id, longitude, latitude, pokemon_id, longitude_jittered, latitude_jittered, pokemon_go_era)

  - Turn your server back on, this time just add an extra parameter, `--pokel-era 2`, which identifies the current "era" as 2.
{% endhighlight %}

And after that, we're back in action: you'll now have a field you can use in Tableau or any other tool to choose whether you're interested in data from era "1" or era "2".

If somebody names these eras something special in the future, we can just create a new table like we did for the Pokemon Info table and join them to give them names. And if there's a big change in the future, we can just follow the same procedure and switch the "2" to a "3".

## This Could Have Been Easier

The SQL to update this was really easy, but all this "insert a new line into a Python file" kind of sucks. When I started this project, this was just something I hacked together and I honestly didn't expect the uptake it has received. I'll be reaching out to the PokemonGo-Map team to hopefully get this integration built in to make this easier in the future.
