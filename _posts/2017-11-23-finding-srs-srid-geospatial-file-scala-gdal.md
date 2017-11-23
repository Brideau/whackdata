---
layout: post
title: Find a Geospatial File's SRID Using Scala and GDAL
---

<img src="https://i.imgur.com/fIpqtJO.png">

On occasion, you might find yourself working with a new spatial data set where it would be really handy to figure out what the current SRID is. Luckily, the smart people at [GDAL.org](http://www.gdal.org/) have done the hard work for you. Here's how you do it in Scala using the GDAL Java Bindings.

## GDAL Setup

First, you have to set up GDAL with the Java bindings on your machine. It's not as simple as just having GDAL installed. There's instructions to do this [here](https://trac.osgeo.org/gdal/wiki/GdalOgrInJava) for various systems, and [here](https://trac.osgeo.org/gdal/wiki/BuildingOnMac) for mac, but in my experience these aren't very up to date and you may have a date with StackOverflow to get through this part. The following worked for me on macOS High Sierra:

 - First, [disable System Integrity Protection](http://osxdaily.com/2015/10/05/disable-rootless-system-integrity-protection-mac-os-x/s). The rest of this won't work if you don't do that.
 - Run:
 {% gist Brideau/b96aa05d719fb764d38bb9d75b48aa9d install.sh %}
 - Follow the instructions that show in your terminal in the output of the previous command to update your .zshrc or .bashrc or whatever file it is your terminal uses.
 - Add the following to the same file as in the previous step:
 {% gist Brideau/b96aa05d719fb764d38bb9d75b48aa9d DYLD_LIBRARY_PATH %}
 - Restart any terminals you have open or run ```source [the file from above]``` in your terminal

## Project Setup

Add the following to your project's `build.sbt` file to get the Boundless Geo resolver and to load the GDAL library (I'm running Scala 2.12.4 and SBT 1.0.3 for the record):

 {% gist Brideau/b96aa05d719fb764d38bb9d75b48aa9d build.sbt %}

Download [this sample file](https://github.com/Brideau/findsrid/blob/master/src/main/resources/Canada3573.gpkg?raw=true) and save it in your project under the ```/src/main/resources``` folder, creating it if it doesn't already exist. Add the contents of the Main class below to whichever class you're working with:

{% gist Brideau/b96aa05d719fb764d38bb9d75b48aa9d Main.scala %}

That's it! Build, run, and enjoy. If it's possible to identify your SRID from the file you have, there's a good chance the ```AutoIdentifyEPSG``` method will do it.

__

_Ryan Brideau_
