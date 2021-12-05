(function(hiddenTaxes, undefined){

/* To get jshint off my case */
/* globals d3help: true */

hiddenTaxes.visualize = function(rawData) {

  var maxX = 500000;

  var processedData = d3help.sheetToObj(rawData, "province", {key: "incomeadjusted", value: maxX});

  // A very specific sorting of the lines so that the provincs of interest are plotted last
  var sortArr = [];
  var provArr = ["Quebec", "Ontario", "British Columbia"];

  _.each(provArr, function(prov, index, list) {
    var checkName = function(obj) {
      return obj.province === prov;
    };
    var i = _.findIndex(processedData, checkName);
    if (i > -1) {
      var item = processedData.splice(i, 1)[0];
      sortArr.unshift(item);
    }
  });
  // Add the rest to the beginning
  processedData = processedData.concat(sortArr);

  // Chart options
  var DEFAULT_OPTIONS = {
    margin: {top: 60, right: 60, bottom: 90, left: 60},
    initialWidth: 'auto'
  };
  // Set up the d3Kit chart skeleton. We add more properties to it later once we've defined some other functions.
  var chart = new d3Kit.Skeleton('#hiddenTaxes', DEFAULT_OPTIONS);

  // Create some layers to organize the visualization
  var layers = chart.getLayerOrganizer();
  layers.create(
    ['content',
     'x-axis',
     'y-axis',
     'voronoi']
   );

  var width = chart.getInnerWidth();
  var height = chart.getInnerHeight();

  // Scales for the margin sizes and axis-label placement
  var maxWidthApprox = 750;
  var minWidthApprox = 320;
  var xAxisScale = d3.scale.pow()
    .exponent(0.5)
    .domain([minWidthApprox, maxWidthApprox])
    .range([0,15]);
  var yAxisScale = d3.scale.pow()
    .exponent(0.5)
    .domain([minWidthApprox, maxWidthApprox])
    .range([0,10]);

  chart.margin({
    top: 10, // Selected by trial and error
    right: 20, // Same
    bottom: 60 + yAxisScale(width),
    left: 40 + xAxisScale(width)
  }, true); // Do not dispatch the resize event

  // The above impacted the width and height, so we grab the new values here
  width = chart.getInnerWidth();
  height = chart.getInnerHeight();

  // Scales for the data
  var margins = chart.margin();
  var x = d3.scale.linear()
    .range([0, width]);
  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .tickFormat(d3.format("$s"));
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .tickFormat(function(d) {
      return parseInt(d, 10) + "%";
    });

  // X-Axis Label
  layers.get('x-axis')
    .append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", 40 + yAxisScale(width))
    .text("Income (2016 Dollars)");

  // Y-Axis Label
  layers.get('y-axis')
    .append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("y", -40 - xAxisScale(width))
    .attr("x", height / -2 )
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Effective Income Tax (Prov Only)");

  var lineGen = d3.svg.line()
    .x(function(d) { return x(d.incomeadjusted); })
    .y(function(d) { return y(d.effectiveincometax); });

  // The main visualization function. Debounce keeps it from rendering too many times per second during updates.
  var visualize = d3Kit.helper.debounce(function(){
    if(!chart.hasData()) {
      // If for some reason the chart doesn't have data, remove all the visual elements
      d3Kit.helper.removeAllChildren(layers.get('content'));
    }

    // Grab them in case they've changed
    width = chart.getInnerWidth();
    height = chart.getInnerHeight();
    chart.margin({
      top: 10,
      right: 20,
      bottom: 60 + yAxisScale(width),
      left: 40 + xAxisScale(width)
    }, true);
    // Get the new values
    width = chart.getInnerWidth();
    height = chart.getInnerHeight();

    var data = chart.data();
    x.domain([0, maxX]) // $500k
      .range([0, width]);
    y.domain([0, 25]) // 17% tax
      .range([height, 0]);

    layers.get('x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
    .selectAll(".tick text")
      .attr("y", 0)
      .attr("x", -4)
      .style("transform", "rotate(-45deg)")
      .style("text-anchor", "end");
    layers.get('y-axis')
      .call(yAxis);

    // Draw the lines
    var selection = layers.get('content')
      .selectAll('.line')
      .data(data, function(d) {
        return d.province;
      });

    selection.transition()
      .attr("d", function(d) {
        return lineGen(d.values);
      });

    selection.enter()
      .append('path')
      .attr('class', function(d) {
        // Return a province colour class if the province is one of interest, and a grey one if not
        var ind = provArr.indexOf(d.province);
        if (ind >= 0) {
          return "line " + d3help.cleanString(d.province);
        } else {
          return "line bgprov";
        }
      })
      .attr('id', function(d) {
        // Add a class for formatting each
        return "hidden-" + d3help.cleanString(d.province);
      })
      .attr("d", function(d) {
        // Include itself in its data. Used for voronoi hover.
        d.line = this;
        return lineGen(d.values);
      });

    // X-Axis Label
    layers.get('x-axis')
      .select('.x')
      .attr("x", width / 2)
      .attr("y", 50 + yAxisScale(width));

    // Y-Axis Label
    layers.get('y-axis')
      .select('.y')
      .attr("y", -40 - xAxisScale(width))
      .attr("x", height / -2 );

    ///// Add the voronoi layer

    // Set up the voronoi generator
    var voronoi = d3.geom.voronoi()
      .x(function(d) {
        return x(d.incomeadjusted);
      })
      .y(function(d) {
        return y(d.effectiveincometax);
      })
      .clipExtent([
        [-margins.left, -margins.top],
        [width + margins.right, height + margins.bottom]
      ]);

    // This configures the hover tip
    var focus = layers.get('voronoi')
      .append("g")
      .attr("transform", "translate(-9000,-9000)")
      .attr("class", "tooltip tt-box");

    focus.append("circle")
      .attr('class', 'tooltip tt-circle')
      .attr("stroke", "black")
      .attr("stroke-width", "1")
      .attr("fill", "white")
      .attr("r", 6);

    focus.append("text")
      .attr('class', 'tooltip tt-title')
      .attr("y", -40);

    focus.append("text")
      .attr('class', 'tooltip tt-valueA')
      .attr("y", -25);

    focus.append("text")
      .attr('class', 'tooltip tt-valueB')
      .attr("y", -10);

    // First set up some mouse functions
    var mouseover = function(d) {
      // Make the line turn black
      d3.select(d.parentObj.line)
        .classed("line-hover", true);
      d.parentObj.line.parentNode.appendChild(d.parentObj.line);
      // Move the label and text into view and change the label
      focus.attr("transform", "translate(" + x(d.incomeadjusted) + "," + y(d.effectiveincometax) + ")");

      // Update the tooltip
      focus.select(".tt-title")
        .text(d.parentObj.province);
      focus.select(".tt-valueA")
        .text("Income Tax: " + d.effectiveincometax + "%");
      focus.select(".tt-valueB")
      .text("Income: $" + d.incomeadjusted);
    };

    var mouseout = function(d) {
      d3.select(d.parentObj.line).classed("line-hover", false);
      focus.attr("transform", "translate(-9000, -9000)");
    };

    var voronoiGroup = layers.get('voronoi')
      .selectAll("path")
      .data(voronoi(
        d3.nest()
        // Group the data by its x/y coords
        .key(function(d) {
          return x(d.incomeadjusted) + "," + y(d.effectiveincometax);
        })
        // Return the first value if there's multiple. This is necessary for the voronoi function to work properly
        .rollup(function(v) {
          return v[0];
        })
        // Flatten the data out so you can feed it into the nest function. This grabs all the xy values from each separate line's array of objects, and merges them into one giant array of objects.
        .entries(
          d3.merge(data.map(
            function(d) {
              return d.values;
            }
          ))
        )
        // Turn the result of the above into an array of objects that can be fed to the voronoi generator
        .map(function(d) {
          return d.values;
        })
      ));

    voronoiGroup.attr("d", function(d) {
        return "M" + d.join("L") + "Z";
      })
      .datum(function(d) {
        return d.point;
      });

    voronoiGroup.enter().append("path")
      // Draw the polygon (invisibly) by joining the points together with a path
      .attr("d", function(d) {
        return "M" + d.join("L") + "Z";
      })
      // Assign the polygon the data from the point it surrounds
      .datum(function(d) {
        return d.point;
      })
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

  }, 10); // Debounce at 10 milliseconds

  // Line labels
  layers.get('content')
   .append("text")
    .attr("dy", "-3")
    .attr("class", "curve-text")
   .append("textPath")
    .attr("class", "hidden-quebec-label")
    .attr("xlink:href", "#hidden-quebec")
    .attr("startOffset", "90%")
    .text("Quebec");

  layers.get('content')
   .append("text")
    .attr("dy", "13")
    .attr("class", "curve-text")
   .append("textPath")
    .attr("class", "hidden-ontario-label")
    .attr("xlink:href", "#hidden-ontario")
    .attr("startOffset", "90%")
    .text("Ontario");

  layers.get('content')
   .append("text")
    .attr("dy", "-3")
    .attr("class", "curve-text")
   .append("textPath")
    .attr("class", "hidden-britishcolumbia-label")
    .attr("xlink:href", "#hidden-britishcolumbia")
    .attr("startOffset", "83%")
    .text("British Columbia");

  chart
    .autoResize(true)
    .autoResizeToAspectRatio(1.5)
    .on('resize', visualize)
    .on('data', visualize)
    .data(processedData);

};

}(window.hiddenTaxes = window.hiddenTaxes || {}));
