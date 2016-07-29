---
layout: post
title: Doing Data Analysis With Pokemon Go - Pokelyzer Set Up Instructions
---

![Tableau Screenshot of Spawn Points](http://i.imgur.com/xRY8bLn.png)

<p class="message">
<strong>TL;DR</strong><br>
We're going to make a database you can plug things like QGIS, ArcGIS, or Tableau into to find nests and spawn points for rare Pokemon. You'll need a server, and will be setting up PostgreSQL, PostGIS, PokemonGo-Map, and importing a set of tables and database settings I've already created.
</p>

So you want to do some Pokemon Go data analysis, eh? Great, let's get started.

Yesterday I did a short post on some tooling I created that allowed me to do some [data analysis and visualization using historical Pokemon Go data](http://www.whackdata.com/2016/07/25/tool-for-analyzing-mapping-pokemon-go/), like this visualization of spawn clusters above, or this one of a Diglett nest:

![QGIS Screenshot](http://i.imgur.com/WxzV0pb.png)

What do I mean by "tooling", exactly? Well, basically it's a database. It depends on other people's software to send data into it, and other people's software to plug into it to perform the analysis. What makes it special is that follows [dimensional modeling](https://en.wikipedia.org/wiki/Dimensional_modeling) techniques to make data analysis dead simple, flexible and fast, and automatically creates spatial objects that make the data easy to use with GIS software. You can find the GitHub repo here: [https://github.com/Brideau/pokelyzer](https://github.com/Brideau/pokelyzer)

In this post, I'll walk through how to get it up and running. This is meant to be understood by beginners to data analysis that have some experience running their own web server, but not a ton of experience setting up databases. It's been a little while since I was new to this, however, so I might gloss over areas that need a bit more explaining. If I do, leave a comment below to let me know and I'll update the post. If you want to be really helpful, submit a [pull request to this post](https://github.com/Brideau/whackdata/blob/gh-pages/_posts/2016-07-26-instructions-analyzing-pokemon-go-data.md) with recommended additions (same goes for typos).

## Database Setup

First, of course, you'll need a server of some kind. Pokelyzer should run on any operating system that runs PostgreSQL, but these instructions will be for Ubuntu because that's what I have handy.  If you just want to run it locally to see how it works, try this mac client or this multi-os client Postgres/PostGIS and skip installation steps below (but not the configuration ones). If you're on Windows, Reddit user [Matteng0](https://www.reddit.com/user/Matteng0) put together an amazingly detailed guide [here](https://github.com/Brideau/pokelyzer/wiki/Windows-Setup-Instructions) so you can just follow that.

Before you do anything, you need to make sure your system locale is correct or else you'll get errors later accepting the names of Pokemon with symbols in their name (damn you Nidoran♂). Run these three lines in your terminal to avoid this:

    export LANGUAGE="en_US.UTF-8"
    export LANG="en_US.UTF-8"
    export LC_ALL="en_US.UTF-8"

Next, install PostgreSQL:

{% highlight bash %}
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
wget -q https://www.postgresql.org/media/keys/ACCC4CF8.asc -O - | sudo apt-key add -
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
{% endhighlight %}

By default, PostgreSQL does not allow remote connections. But if we want to use something like QGIS or Tableau, we'll need to allow them. Open `pg_hba.conf` and scroll to the very bottom of the file (if this is in the future and a newer version has been released, replace the 9.5):

{% highlight bash %}
sudo nano /etc/postgresql/9.5/main/pg_hba.conf
{% endhighlight %}

Add the following line with [your IP address](https://whatismyipaddress.com/?u=TRUE), and save:
{% highlight bash %}
host     all       all      [YOUR IP ADDRESS]/32         md5
{% endhighlight %}

The `/32` after the IP address means only your specific IP address will be allowed to connect to the database. If your IP address changes frequently and you know the approximate range of addresses, you can use [this tool](http://www.ipaddressguide.com/cidr#range) to generate the proper address to use.

Next, change the database configuration so that it listens on all its connections. Edit the `postgresql.conf` file:

{% highlight bash %}
sudo nano /etc/postgresql/9.5/main/postgresql.conf
{% endhighlight %}

And scroll down, uncommenting the line with `listen_address` on it, changing it to:

{% highlight bash %}
listen_addresses = '*'
{% endhighlight %}

Now restart the server to make the changes active:

{% highlight bash %}
sudo /etc/init.d/postgresql restart
{% endhighlight %}

Although we've now opened ports on the database to allow outside access, the server itself may not have those ports opened. There are too many hosting options for me to possibly give detailed instructions for each of them here, but assuming you know your way around your own server, just make sure that port 5432 is open to the same IP addresses you used above.

As a final installation step, install PostGIS:

{% highlight bash %}
sudo apt-get install -y postgis postgresql-9.5-postgis-2.2
{% endhighlight %}

Now we have to create a role we can use to log in and set everything up. Change to the postgres user and open the psql prompt.

{% highlight bash %}
sudo su - postgres
psql
{% endhighlight %}

And then create a role with all the permissions you need, using a secure password:

{% highlight SQL %}
CREATE ROLE pokemon_go_role WITH CREATEDB SUPERUSER LOGIN ENCRYPTED PASSWORD '[YOUR PASSWORD]';
{% endhighlight %}

Let's now connect to the database and start setting things up. Download and install [pgAdmin](https://www.pgadmin.org/), and create a new connection as follows:

<div align="center"><img src="http://i.imgur.com/ju1OwzW.png"></div>

Now try connecting to the database. If your connection times out, read the above instructions closely again as it is likely a firewall or database security configuration issue.

Once you've successfully connected, right-click Databases and click `New Database...`. Name the database `pokemon_go` and make yourself the owner. Go to the definition tab and for "Encoding" select UTF8.

![Create and Name a Database](http://i.imgur.com/o4vhe5e.png)

Once it's created, right click the database and click `Restore...`. Here's where we actually import all of the tables and configuration I've pre-created for you.

Download the [pokemon\_go\_db\_backup.tar file](https://github.com/Brideau/pokelyzer/raw/master/pokemon_go_db_backup.tar) from the [Pokelyzer Github repo](https://github.com/Brideau/pokelyzer). From the Restore dialog, look up the file you just downloaded. If you're on a mac, you might have an issue selecting the file - just change this drop-down to `All Files`:

<div align="center"><img src="http://i.imgur.com/53GLa3I.png" width="300"></div>

Now just click restore, and everything should go smoothly! Check that everything went well by going to _pokemon\_go > Schemas > public > Tables_ in the tree menu. You should see 5 tables like below:

<div align="center"><img src="http://i.imgur.com/0HvWBiu.png" width="300"></div>

## The Data Source

To do any analysis, we'll need data. When I made this, I already had a PokemonGo-Map server running for my city and it was working quite well, so I chose that. If you have some programming chops and would like to use some other way to access their Pokemon Go API to get the data you need, feel free to do that as well. What matters is that you send the expected fields into the database, which are shown in the code below.

**Also, please note: this is a big hack on a rapidly developing project. If you are a developer for PokemonGo-Map and would like to integrate this in a cleaner way, please let me know.**

To get started, make sure you have git installed on your server.

{% highlight bash %}
sudo apt-get install git
{% endhighlight %}

Then clone the PokemonGo-Map repository from Github. We'll be using the _master_ branch because it's a bit more stable than the _develop_ one at the moment.

{% highlight bash %}
git clone https://github.com/AHAAAAAAA/PokemonGo-Map.git
{% endhighlight %}

Change directories to the Pokemon-Go repository you just downloaded and follow their instructions for getting things working before continuing: [https://github.com/AHAAAAAAA/PokemonGo-Map/wiki](https://github.com/AHAAAAAAA/PokemonGo-Map/wiki)

If you have some trouble with this, don't worry, it didn't go very smoothly for me on one of my machines either. Work through any issues until you successfully get it working and displaying a map for your area, and then shut it down.

Next we're going to modify the program to fork the data into our database. As you go through these steps, check the [sample files in the Github repo](https://github.com/Brideau/pokelyzer) if things aren't clear.

In the repository, go into the `pogom` directory and find the `utils.py` file. In the `get_args()` function, after all the `add_argument` lines, but just before `parser.set_defaults(DEBUG=Flase)` add one more line for `--pokel-pass`:

{% highlight python %}
parser.add_argument('--pokel-pass', help='Password for Pokelizer database')
{% endhighlight %}

See [this file](https://github.com/Brideau/pokelyzer/blob/master/sample_utils.py) as an example if you're having trouble understanding the above.

This will allow us to pass in our database password when we start PokemonGo-Map so that we don't need to store a record of it.

Next, go to the file `customLog.py` in the `pogom` directory. At the top, add a line to import the `psycopg2` and `random` libraries:

{% highlight python %}
from .utils import get_pokemon_name
from pogom.utils import get_args
from datetime import datetime
import psycopg2
import random
{% endhighlight %}

Next run the following commands to install everything that Python will need to reach the database:

{% highlight python %}
sudo apt-get install python-psycopg2
sudo apt-get install libpq-dev
sudo pip install psycopg2
{% endhighlight %}

Back in the `customLog.py` file, add the following lines after `args = get_args()`. It will create the cursor used to access the database:

{% highlight python %}
conn = psycopg2.connect(dbname="pokemon_go", user="pokemon_go_role", password=args.pokel_pass, host="127.0.0.1")
conn.autocommit = True
cursor = conn.cursor()
{% endhighlight %}

And add the following function at the bottom of the same file. This function transforms the data from each discovered Pokemon and stores it in the database. The database itself is equipped with triggers that automatically update all of the remaining columns not listed near the bottom of this function.

{% highlight python %}
def logPokemonDb(p):
    pokemon_id = int(p['pokemon_data']['pokemon_id'])
    pokemon_name = get_pokemon_name(str(pokemon_id)).lower()

    last_modified_time = int(p['last_modified_timestamp_ms'])
    time_until_hidden_ms = int(p['time_till_hidden_ms'])

    hidden_time_unix_s = int((p['last_modified_timestamp_ms'] + p['time_till_hidden_ms']) / 1000.0)
    hidden_time_utc = datetime.utcfromtimestamp(hidden_time_unix_s)

    encounter_id = str(p['encounter_id'])
    spawnpoint_id = str(p['spawnpoint_id'])

    longitude = float(p['longitude'])
    latitude = float(p['latitude'])
    longitude_jittered = longitude + (random.gauss(0, 0.3) - 0.15) * 0.0005
    latitude_jittered = latitude + (random.gauss(0, 0.3) - 0.15) * 0.0005

    query =  "INSERT INTO spotted_pokemon (name, encounter_id, last_modified_time, time_until_hidden_ms, hidden_time_unix_s, hidden_time_utc, spawnpoint_id, longitude, latitude, pokemon_id, longitude_jittered, latitude_jittered) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"
    data = (pokemon_name, encounter_id, last_modified_time, time_until_hidden_ms, hidden_time_unix_s, hidden_time_utc, spawnpoint_id, longitude, latitude, pokemon_id, longitude_jittered, latitude_jittered)

    cursor.execute(query, data)
{% endhighlight %}

Open the `models.py` file in the `pogom` folder, and modify the line near the top that imports `.customLog` to import our new function:

{% highlight python %}
  from .customLog import printPokemon, logPokemonDb
{% endhighlight %}

Finally, find the `parse_map()` function in `models.py`, and put `logPokemonDb(p)` just under where it says `printPokemon(...)` in the cell loop. This will call our function any time a Pokemon is found.

{% highlight python %}
def parse_map(map_dict, iteration_num, step, step_location):
    pokemons = {}
    pokestops = {}
    gyms = {}
    scanned = {}

    cells = map_dict['responses']['GET_MAP_OBJECTS']['map_cells']
    for cell in cells:
        for p in cell.get('wild_pokemons', []):
            d_t = datetime.utcfromtimestamp(
                (p['last_modified_timestamp_ms'] +
                 p['time_till_hidden_ms']) / 1000.0)
            printPokemon(p['pokemon_data']['pokemon_id'],p['latitude'],p['longitude'],d_t)
            logPokemonDb(p)
            pokemons[p['encounter_id']] = {
                'encounter_id': b64encode(str(p['encounter_id'])),
                'spawnpoint_id': p['spawnpoint_id'],
                'pokemon_id': p['pokemon_data']['pokemon_id'],
                'latitude': p['latitude'],
                'longitude': p['longitude'],
                'disappear_time': d_t
            }

  [More code...]
{% endhighlight %}

Now if you save everything and run the PokemonGo-Map server with the `--pokel-pass` parameter, it should start logging everything to your database!

{% highlight bash %}
python runserver.py -a ptc -u [YOUR USERNAME] -p [YOUR PASS] -l "45.95845 -66.662327" -st 25 -H 0.0.0.0  --gmaps-key [YOUR GOOGLE MAPS KEY] --pokel-pass "[YOUR DB PASSWORD]"
{% endhighlight %}

If you go back into pgAdmin, right click the `spotted_pokemon` table and view the top 100 rows of data, you should see it being populated!

![Imgur](http://i.imgur.com/eY6UBPi.png)

To help with geovisualization, I've added some columns that store the points with some random "jitter" added to them. This is because the Pokemon all spawn in the exact same spots every time, and if you try to visualize that, all the points overlap. When you're visualizing this data, feel free to use either the original, accurate points, or the jittered ones - whichever works best for your needs.

## Future Instructions

Now that you have this up and running, if you already have experience using QGIS, ArcGIS, Tableau, or any other analysis tool, and an idea of how dimensional modeling works, you can now plug it in and start crunching data. For Tableau specifically, just join the time_dimension and date_dimension tables to the spotted_pokemon table on their respective keys using a left-join.

If all that sounded like gibberish to you - fear not - I'll put putting up future parts in the coming days that show how I created some of the original visualizations. Stay tuned!

<p class="message">
<strong>UPDATE</strong><br>
If you've got this running and would like to use it with Tableau, check out this more recent post: <a href="/2016/07/27/finding-locally-rare-pokemon/">Finding Hotpots for Locally Rare Pokemon Using Tableau</a>
</p>

-Ryan
