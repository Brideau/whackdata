---
layout: post
title: Converting Geospatial Files Using ogr2ogr in Scala
description: A tutorial on how to use ogr2ogr from your Scala code
image: ./images/ogr2ogr.png
author: Ryan Brideau
lang: en_us
tags: geospatial scala gdal ogr2ogr
---

<img src="/images/ogr2ogr.png" alt="ogr2ogr over top of the Scala logo">

Converting geospatial files from one format to another is one of the most common tasks when starting a new project. This process has been made significantly easier by GDAL's [ogr2ogr](http://www.gdal.org/ogr2ogr.html), a command line tool for doing exactly that. Using it from within your Scala code isn't hard, but it can be tricky. I'll show you how below.

<div class="message">
<div class="note"><strong>Note</strong></div>
If you'd like to see the full working example ahead of time, see: <a href="https://github.com/Brideau/scalaogr2ogr" rel="noopener" target="_blank">https://github.com/Brideau/scalaogr2ogr</a>
</div>

## GDAL Setup

First, since ogr2ogr depends on GDAL, you'll need the GDAL Java Bindings set up before you get started. See my previous post, [Find a Geospatial File's SRID Using Scala and GDAL](/2017/11/23/finding-srs-srid-geospatial-file-scala-gdal/#gdal-setup), for some guidance on that.

## Project Setup

Add the following to your project's `build.sbt` file to get the Boundless Geo resolver and to load the GDAL library (I'm running Scala 2.12.4 and SBT 1.0.3 for the record):

 {% gist Brideau/ea1c98c089208fa363e12b2f8ee55154 build.sbt %}

Download [this sample file](https://github.com/Brideau/findsrid/blob/master/src/main/resources/Canada3573.gpkg?raw=true) and save it in your project under the ```/src/main/resources``` folder, creating it if it doesn't already exist.

## Merging the ogr2ogr Java Port with Scala

Next, you have to track down the version of ogr2ogr that has been ported to Java. This is buried inside OSGeo's Github repo under the SWIG bindings folder, which you can find [here](https://github.com/OSGeo/gdal/blob/trunk/gdal/swig/java/apps/ogr2ogr.java). It doesn't have the prettiest API as you'll see (even the author admits so in the source code comments), but it does the trick.

Create a new folder in your project ```src/main/java``` to store this file, and put it in a package ```org.gdal.apps``` to keep things organized. Finally, rename the ```main``` class to ```execute``` as shown below (this should be on line 99 or so of the file) to keep it from confusing the JVM later.

{% gist Brideau/ea1c98c089208fa363e12b2f8ee55154 ogr2ogr.java %}

## Calling ogr2ogr

We'll be using Futures to keep things nice and asynchronous, so you'll need to import them and a few other things a the top of your class:

{% gist Brideau/ea1c98c089208fa363e12b2f8ee55154 imports.scala %}

Next, add this function that will be used to create a folder to hold your output and to call ogr2ogr to perform the conversion:

{% gist Brideau/ea1c98c089208fa363e12b2f8ee55154 convertUsingOgr2Ogr.scala %}

Finally, build up your ogr2ogr command using [their documentation](http://www.gdal.org/ogr2ogr.html) and the output driver's specific documentation, just as you would if running it from the command line. Store it as an array of strings. For example, to output as a Shapefile, just Google _ogr2ogr driver shapefile_ to find [this page](http://www.gdal.org/drv_shapefile.html).

{% gist Brideau/ea1c98c089208fa363e12b2f8ee55154 callogr2ogr.scala %}

Now you can build and run it, and it should create and store a shapefile in a new temp directory within the folder you ran it from. You may see a large number of warnings about the fields being too wide using the example file, but the conversion should still complete successfully.

## Passing Additional Parameters

Some drivers, such as the [CSV Driver](http://www.gdal.org/drv_csv.html), take a number of additional parameters to configure the output format. These can be added as shown here:

{% gist Brideau/ea1c98c089208fa363e12b2f8ee55154 additionalparameter.scala %}

__

_Ryan Brideau_
