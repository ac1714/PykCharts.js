PykCharts.multiD.bar = function(options){
  var that = this;
  var theme = new PykCharts.Configuration.Theme({});

  var multiDimensionalCharts = theme.multiDimensionalCharts;
  this.execute = function () {
    that = new PykCharts.multiD.processInputs(that, options, "column");

    that.grid_y_enable =  options.chart_grid_y_enable ? options.chart_grid_y_enable.toLowerCase() : theme.stylesheet.chart_grid_y_enable;
    that.grid_color = options.chart_grid_color ? options.chart_grid_color : theme.stylesheet.chart_grid_color;
    that.panels_enable = "no";
    that.data_sort_enable = options.data_sort_enable ? options.data_sort_enable.toLowerCase() : multiDimensionalCharts.data_sort_enable;
    that.data_sort_type = PykCharts['boolean'](that.data_sort_enable) && options.data_sort_type ? options.data_sort_type.toLowerCase() : multiDimensionalCharts.data_sort_type;
    that.data_sort_order = PykCharts['boolean'](that.data_sort_enable) && options.data_sort_order ? options.data_sort_order.toLowerCase() : multiDimensionalCharts.data_sort_order;

    try {
      if(that.data_sort_order === "ascending" || that.data_sort_order === "descending") {
      } else {
        that.data_sort_order = multiDimensionalCharts.data_sort_order;
        throw "data_sort_order";
      }
    }
    catch(err) {
      that.k.warningHandling(err,"9");
    }

    if(that.stop)
      return;

      if(that.mode === "default") {
        that.k.loading();
      }
      that.multiD = new PykCharts.multiD.configuration(that);

      that.executeData = function (data) {
        var validate = that.k.validator().validatingJSON(data);
        if(that.stop || validate === false) {
          $(that.selector+" #chart-loader").remove();
          $(that.selector).css("height","auto")
          return;
        }

        that.data = that.k.__proto__._groupBy("bar",data);
        that.compare_data = that.k.__proto__._groupBy("bar",data);

        $(that.selector+" #chart-loader").remove();
        $(that.selector).css("height","auto")
        PykCharts.multiD.barFunctions(options,that,"bar");
        that.render();
      }
      that.k.dataSourceFormatIdentification(options.data,that,"executeData");
    };
  }

  PykCharts.multiD.groupedBar = function(options){
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});
    var multiDimensionalCharts = theme.multiDimensionalCharts;
    this.execute = function () {
      that = new PykCharts.multiD.processInputs(that, options, "column");
      that.grid_y_enable =  options.chart_grid_y_enable ? options.chart_grid_y_enable.toLowerCase() : theme.stylesheet.chart_grid_y_enable;
      that.grid_color = options.chart_grid_color ? options.chart_grid_color : theme.stylesheet.chart_grid_color;
      that.panels_enable = "no";
      that.data_sort_enable = options.data_sort_enable ? options.data_sort_enable.toLowerCase() : multiDimensionalCharts.data_sort_enable;
      that.data_sort_type = PykCharts['boolean'](that.data_sort_enable) && options.data_sort_type ? options.data_sort_type.toLowerCase() : multiDimensionalCharts.data_sort_type;
      that.data_sort_order = PykCharts['boolean'](that.data_sort_enable) && options.data_sort_order ? options.data_sort_order.toLowerCase() : multiDimensionalCharts.data_sort_order;

      try {
        if(that.data_sort_order === "ascending" || that.data_sort_order === "descending") {
        } else {
          that.data_sort_order = multiDimensionalCharts.data_sort_order;
          throw "data_sort_order";
        }
      }
      catch(err) {
        that.k.warningHandling(err,"9");
      }

      if(that.stop)
        return;

        if(that.mode === "default") {
          that.k.loading();
        }
        that.multiD = new PykCharts.multiD.configuration(that);

        that.executeData = function (data) {
          var validate = that.k.validator().validatingJSON(data);
          if(that.stop || validate === false) {
            $(that.selector+" #chart-loader").remove();
            $(that.selector).css("height","auto")
            return;
          }

          that.data = that.k.__proto__._groupBy("bar",data);
          that.compare_data = that.k.__proto__._groupBy("bar",data);
          that.axis_x_data_format = that.k.xAxisDataFormatIdentification(that.data);
          $(that.selector+" #chart-loader").remove();
          $(that.selector).css("height","auto")
          PykCharts.multiD.barFunctions(options,that,"group_bar");
          that.render();
        };
        that.k.dataSourceFormatIdentification(options.data,that,"executeData");
      };
    };

    PykCharts.multiD.barFunctions = function (options,chartObject,type) {
      var that = chartObject;
      that.refresh = function () {
        that.executeRefresh = function (data) {
          that.data = that.k.__proto__._groupBy("bar",data);
          that.refresh_data = that.k.__proto__._groupBy("bar",data);
          var compare = that.k.checkChangeInData(that.refresh_data,that.compare_data);
          that.compare_data = compare[0];
          var data_changed = compare[1];
          if(data_changed) {
            that.k.lastUpdatedAt("liveData");
          }
          that.map_group_data = that.multiD.mapGroup(that.data);
          that.data = that.dataTransformation();

          that.data = that.emptygroups(that.data);

          var fD = that.flattenData();
          that.the_bars = fD[0];
          that.the_keys = fD[1];
          that.the_layers = that.buildLayers(that.the_bars);
          if(that.no_of_groups === 1) {
            that.legends_enable = "no";
          }

          that.optionalFeatures()
          .createChart()
          .legends()
          .ticks();
          that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,undefined,undefined,that.x_tick_values,that.legendsGroup_height);
        };

        that.k.dataSourceFormatIdentification(options.data,that,"executeRefresh");
      };
      that.render = function(){
        var that = this;
        var l = $(".svgcontainer").length;
        that.container_id = "svgcontainer" + l;
        that.map_group_data = that.multiD.mapGroup(that.data);
        that.data = that.dataTransformation();
        that.data = that.emptygroups(that.data);
        try {
          if(that.no_of_groups > 1 && type === "bar") {
            throw "";
          }
        }
        catch (err) {
          console.error('%c[Error - Pykih Charts] ', 'color: red;font-weight:bold;font-size:14px', " at "+that.selector+". \"Invalid data in the JSON\"  Visit www.chartstore.io/docs#error_9");
          return;
        }

        var fD = that.flattenData();
        that.the_bars = fD[0];
        that.the_keys = fD[1];
        that.the_layers = that.buildLayers(that.the_bars);
        that.transitions = new PykCharts.Configuration.transition(that);
        that.mouseEvent1 = new PykCharts.multiD.mouseEvent(that);
        that.fillColor = new PykCharts.Configuration.fillChart(that,null,options);
        that.border = new PykCharts.Configuration.border(that);
        if(that.no_of_groups === 1) {
          that.legends_enable = "no";
        }
        if(that.mode === "default") {

          that.k.title()
          .backgroundColor(that)
          .export(that,"#"+that.container_id,"barChart")
          .emptyDiv()
          .subtitle()
          .makeMainDiv(that.selector,1);
          that.optionalFeatures()
          .svgContainer(1)
          .legendsContainer(1);

          that.k.liveData(that)
          .tooltip()
          .createFooter()
          .lastUpdatedAt()
          .credits()
          .dataSource();

          that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

          that.optionalFeatures()
          .legends()
          .createGroups()
          .createChart()
          .axisContainer()
          .ticks()
          .highlightRect();

        } else if(that.mode === "infographics") {
          that.k.backgroundColor(that)
          .export(that,"#"+that.container_id,"barChart")
          .emptyDiv()
          .makeMainDiv(that.selector,1);

          that.optionalFeatures().svgContainer(1)
          .legendsContainer(1)
          .createGroups()
          .createChart()
          .axisContainer()
          .ticks()
          .highlightRect();

          that.k.tooltip();
          that.mouseEvent = new PykCharts.Configuration.mouseEvent(that);

        }
        that.k.xAxis(that.svgContainer,that.xGroup,that.xScale,undefined,undefined,that.x_tick_values,that.legendsGroup_height)
        .xAxisTitle(that.xGroup,that.legendsGroup_height,that.legendsGroup_width);

        that.k.exportSVG(that,"#"+that.container_id,"barChart")
        if(PykCharts['boolean'](that.legends_enable)) {
          $(document).ready(function () { return that.k.resize(that.svgContainer,"",that.legendsContainer); })
          $(window).on("resize", function () { return that.k.resize(that.svgContainer,"",that.legendsContainer); });
        } else {
          $(document).ready(function () { return that.k.resize(that.svgContainer,""); })
          $(window).on("resize", function () { return that.k.resize(that.svgContainer,""); });
        }
      };

      that.optionalFeatures = function() {
        var that = this;
        var optional = {
          svgContainer: function (i) {
            $(that.selector).attr("class","PykCharts-twoD");
            that.svgContainer = d3.select(that.selector + " #tooltip-svg-container-" + i)
            .append("svg:svg")
            .attr("width",that.width )
            .attr("height",that.height)
            .attr("id",that.container_id)
            .attr("class","svgcontainer")
            .attr("preserveAspectRatio", "xMinYMin")
            .attr("viewBox", "0 0 " + that.width + " " + that.height);

            return this;
          },
          createGroups: function () {
            that.group = that.svgContainer.append("g")
            .attr("id","svggroup")
            .attr("class","svggroup")
            .attr("transform","translate(" + that.margin_left + "," + (that.margin_top + that.legendsGroup_height) +")");

            return this;
          },
          legendsContainer: function (i) {
            if(PykCharts['boolean'](that.legends_enable)&&that.mode === "default") {
              that.legendsGroup = that.svgContainer.append("g")
              .attr("id","legends")
              .attr("class","legends")
              .style("visibility","hidden")
              .attr("transform","translate(0,10)");

            } else {
              that.legendsGroup_height = 0;
              that.legendsGroup_width = 0;
            }

            return this;
          },
          axisContainer : function () {
            if(PykCharts['boolean'](that.axis_y_enable)) {

              var axis_line = that.group.selectAll(".axis-line")
              .data(["line"]);

              axis_line.enter()
              .append("line");

              axis_line.attr("class","axis-line")
              .attr("x1",0)
              .attr("y1",0)
              .attr("x2",0)
              .attr("y2",that.height-that.margin_top-that.margin_bottom - that.legendsGroup_height)
              .attr("stroke",that.axis_y_line_color)
              .attr("stroke-width","1px");

              axis_line.exit().remove();
              if(that.axis_y_position === "right") {
                axis_line.attr("x1",(that.width-that.margin_left-that.margin_right-that.legendsGroup_width))
                .attr("x2",(that.width-that.margin_left-that.margin_right - that.legendsGroup_width));
              }
            }
            if(that.axis_y_title) {
              if(that.axis_y_position === "left") {
                that.yGroup = that.group.append("g")
                .attr("id","yaxis")
                .attr("class", "y axis")
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("x",-(that.height-that.margin_top-that.margin_bottom - that.legendsGroup_height)/2)
                .attr("y", -60)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .style("fill",that.axis_y_title_color)
                .style("font-weight",that.axis_y_title_weight)
                .style("font-family",that.axis_y_title_family)
                .style("font-size",that.axis_y_title_size +"px")
                .text(that.axis_y_title);

              } else if(that.axis_y_position === "right") {

                that.yGroup = that.group.append("g")
                .attr("id","yaxis")
                .attr("class", "y axis")
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("x",-(that.height-that.margin_top-that.margin_bottom-that.legendsGroup_height)/2)
                .attr("y", (that.width-that.margin_left-that.margin_right-that.legendsGroup_width)+12)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .style("fill",that.axis_y_title_color)
                .style("font-weight",that.axis_y_title_weight)
                .style("font-family",that.axis_y_title_family)
                .style("font-size",that.axis_y_title_size+"px")
                .text(that.axis_y_title);
              }
            }
            if(PykCharts['boolean'](that.axis_x_enable) || that.axis_x_title) {
              that.xGroup = that.group.append("g")
              .attr("id","xaxis")
              .attr("class","x axis");
            }
            return this;
          },
          createChart: function() {
            var w = that.width - that.margin_left - that.margin_right - that.legendsGroup_width,
            j = that.no_of_groups + 1,
            h = that.height - that.margin_top - that.margin_bottom - that.legendsGroup_height;

            var the_bars = that.the_bars;
            var keys = that.the_keys;
            that.layers = that.the_layers;
            var groups= that.getGroups();

            that.stack_layout = d3.layout.stack() // Create default stack
            .values(function(d){ // The values are present deep in the array, need to tell d3 where to find it
              return d.values;
            })(that.layers);
            that.layers = that.layers.map(function (group) {
              return {
                name : group.name,
                values : group.values.map(function (d) {
                  return {
                    x: d.y,
                    y: d.x,
                    x0: d.y0,
                    tooltip : d.tooltip ? d.tooltip : d.y,
                    color: d.color,
                    group: d.group,
                    name:d.name
                  };
                })
              };
            })

            var x_data = [];
            that.layers.map(function(e, i){ // Get all values to create scale
              for(i=0;i < e.values.length;i++){
                var d = e.values[i];
                x_data.push(d.x + d.x0); // Adding up y0 and y to get total height
              }
            });

            that.yScale = d3.scale.ordinal()
            .domain(the_bars.map(function(e, i){
              return e.id || i; // Keep the ID for bars and numbers for integers
            }))
            .rangeBands([0,h]);

            that.x_tick_values = that.k.processXAxisTickValues();
            var min_x_tick_value,max_x_tick_value;

            var x_domain = [0,d3.max(x_data)];
            x_domain = that.k.__proto__._domainBandwidth(x_domain,1);

            min_x_tick_value = d3.min(that.x_tick_values);
            max_x_tick_value = d3.max(that.x_tick_values);

            if(x_domain[0] > min_x_tick_value) {
              x_domain[0] = min_x_tick_value;
            }
            if(x_domain[1] < max_x_tick_value) {
              x_domain[1] = max_x_tick_value;
            }

            that.xScale = d3.scale.linear().domain(x_domain).range([0, w]);

            var group_arr = [];

            for(var i in groups){
              var g = groups[i];
              var y = that.yScale(g[0]);
              var totalHeight = that.yScale.rangeBand() * g.length;
              y = y + (totalHeight/2);
              group_arr.push({y: y, name: i});
            }
            that.domain = group_arr.map(function (d) {
              return d.name;
            });
            that.y0 = d3.scale.ordinal()
            .domain(group_arr.map(function (d,i) { return d.name; }))
            .rangeRoundBands([0, h], 0.1);

            that.y1 = d3.scale.ordinal()
            .domain(that.barName.map(function(d) { return d; }))
            .rangeRoundBands([0, that.y0.rangeBand()]) ;

            that.y_factor = 0;
            that.height_factor = 0;
            if(that.no_of_groups === 1) {
              that.y_factor = that.yScale.rangeBand()/4;
              that.height_factor = (that.yScale.rangeBand()/(2*that.no_of_groups));
            };
            that.highlight_y_positions = [];
            that.highlight_x_positions = [];


            that.bars = that.group.selectAll(".bars")
            .data(that.layers);

            that.bars.enter()
            .append("g")
            .attr("class", "bars");

            var rect = that.bars.selectAll("rect")
            .data(function(d,i){
              return d.values;
            });

            rect.enter()
            .append("svg:rect")
            .attr("class","rect")
            rect.attr("width", 0).attr("x", 0)
            .attr("fill", function(d,i){
              if(that.no_of_groups === 1) {
                return that.fillColor.colorPieMS(d);
              } else {
                return that.fillColor.colorGroup(d);
              }
            })
            .attr("fill-opacity", function (d,i) {
              if (that.color_mode === "saturation"){
                if(j>1){
                  j--;
                  return j/that.no_of_groups;
                } else {
                  j = that.no_of_groups+1;
                  j--;
                  return j/that.no_of_groups;
                }
              } else {
                return 1;
              }
            })
            .attr("data-fill-opacity",function () {
              return $(this).attr("fill-opacity");
            })
            .attr("stroke",that.border.color())
            .attr("stroke-width",that.border.width())
            .attr("stroke-dasharray", that.border.style())
            .attr("stroke-opacity",1)
            .on('mouseover',function (d) {
              if(that.mode === "default") {
                that.mouseEvent.tooltipPosition(d);
                that.mouseEvent.tooltipTextShow(d.tooltip ? d.tooltip : d.y);
                that.mouseEvent.axisHighlightShow(d.name,that.selector + " .axis-text",that.domain,"bar");
                if(PykCharts['boolean'](that.onhover_enable)) {
                  that.mouseEvent.highlight(that.selector + " .rect", this);
                }
              }
            })
            .on('mouseout',function (d) {
              if(that.mode === "default") {
                that.mouseEvent.tooltipHide(d);
                that.mouseEvent.axisHighlightHide(that.selector + " .axis-text","bar");
                if(PykCharts['boolean'](that.onhover_enable)) {
                  that.mouseEvent.highlightHide(that.selector + " .rect")
                }
              }
            })
            .on('mousemove', function (d) {
              if(that.mode === "default") {
                that.mouseEvent.tooltipPosition(d);
              }
            });

            rect
            .transition()
            .duration(that.transitions.duration())
            .attr("x", function(d){
              return that.xScale(d.x0);
            })
            .attr("width", function(d){
              if(that.highlight.toLowerCase() === d.name.toLowerCase()) {
                that.highlight_x_positions.push(that.xScale(d.x));
              }
              return that.xScale(d.x);
            })
            .attr("height", function(d){
              return that.yScale.rangeBand()+that.height_factor;
            })
            .attr("y", function(d){
              if(that.highlight.toLowerCase() === d.name.toLowerCase()) {
                that.highlight_y_positions.push(that.yScale(d.y)-that.y_factor);
              }
              return that.yScale(d.y)-that.y_factor;
            });

            that.bars.exit()
            .remove();

            if(PykCharts['boolean'](that.axis_y_enable)) {
              var yAxis_label = that.group.selectAll("text.axis-text")
              .data(group_arr);

              yAxis_label.enter()
              .append("text")

              yAxis_label.attr("class", "axis-text")
              .attr("y", function(d){
                return d.y;
              })
              .attr("x", function(d){
                return -10;
              })
              .style("font-size",that.axis_y_pointer_size + "px")
              .style("fill",that.axis_y_pointer_color)
              .style("font-weight",that.axis_y_pointer_weight)
              .style("font-family",that.axis_y_pointer_family)

              .text(function(d){
                return d.name;
              })
              .text(function (d) {
                if(this.getBBox().width > (0.8*that.margin_left)) {
                  return d.name.substr(0,2) + "..";
                } else {
                  return d.name;
                }
              })
              .on('mouseover',function (d) {
                that.mouseEvent.tooltipPosition(d);
                that.mouseEvent.tooltipTextShow(d.name);
              })
              .on('mouseout',function (d) {
                that.mouseEvent.tooltipHide(d);
              })
              .on('mousemove', function (d) {
                that.mouseEvent.tooltipPosition(d);
              });
              if(that.axis_y_position === "right") {
                yAxis_label.attr("x", function () {
                  return (that.width-that.margin_left-that.margin_right-that.legendsGroup_width) + 10;
                });
              }
              if(that.axis_y_position === "left" && that.axis_y_pointer_position === "right") {
                yAxis_label.attr("x", function (d) {
                  return 10;
                });
              }
              if(that.axis_y_position === "right" && that.axis_y_pointer_position === "left") {
                yAxis_label.attr("x", function (d) {
                  return (that.width-that.margin_left-that.margin_right-that.legendsGroup_width) - 10;
                });
              }
              if(that.axis_y_pointer_position === "right") {
                yAxis_label.attr("text-anchor","start");
              } else if(that.axis_y_pointer_position === "left") {
                yAxis_label.attr("text-anchor","end");
              }
              yAxis_label.exit().remove();
            }
            return this;
          },
          ticks: function () {
            if(that.pointer_size) {
              that.txt_width;
              that.txt_height;
              that.ticksElement = that.bars.selectAll("g")
              .data(that.layers);

              var tick_label = that.bars.selectAll(".ticksText")
              .data(function(d) {
                return d.values;
              });

              tick_label.enter()
              .append("text")
              .attr("class","ticksText");

              tick_label.attr("class","ticksText")
              .text("");

              setTimeout(function() {
                tick_label.text(function(d) {
                  if(d.x) {
                    return d.x;
                  }
                })
                .style("font-weight", that.pointer_weight)
                .style("font-size", that.pointer_size + "px")
                .attr("fill", that.pointer_color)
                .style("font-family", that.pointer_family)
                .text(function(d) {
                  if(d.x) {
                    that.txt_width = this.getBBox().width;
                    that.txt_height = this.getBBox().height;
                    if(d.x && (that.txt_width< that.xScale(d.x)) && (that.txt_height < (that.yScale.rangeBand()+that.height_factor ))) {
                      return d.x;
                    }
                  }
                })
                .attr("x", function(d){
                  var bar_width  = that.xScale(d.x);
                  return that.xScale(d.x0) + that.xScale(d.x)+ 5;
                })
                .attr("y",function(d){
                  return that.yScale(d.y)-that.y_factor+(that.yScale.rangeBand()/2);
                })
                .attr("dy",function(d){
                  if(that.no_of_groups ===1) {
                    return that.yScale.rangeBand()/2;
                  } else {
                    return that.yScale.rangeBand()/4;
                  }
                })
                .style("font-size",function(d) {
                  return that.pointer_size + "px";
                });
              }, that.transitions.duration());

              tick_label.exit().remove();
            }
            return this;
          },
          highlightRect : function () {
            if(that.no_of_groups > 1 && PykCharts['boolean'](that.highlight)) {
              setTimeout(function() {
                function ascending( a, b ) {
                  return a - b;
                }
                that.highlight_x_positions.sort(ascending)
                that.highlight_y_positions.sort(ascending);
                var x_len = that.highlight_x_positions.length,
                y_len = that.highlight_y_positions.length,
                x = -5,
                y = (that.highlight_y_positions[0] - 5),
                width = (that.highlight_x_positions[x_len - 1] + 15 + that.txt_width),
                height;
                height = (that.highlight_y_positions[y_len - 1] - that.highlight_y_positions[0] + 10 + that.yScale.rangeBand()+that.height_factor);
                that.group.append("rect")
                .attr("class","highlight-rect")
                .attr("x", x)
                .attr("y", y)
                .attr("width", width)
                .attr("height", height)
                .attr("fill","none")
                .attr("stroke", that.highlight_color)
                .attr("stroke-width", "1.5px")
                .attr("stroke-dasharray", "5,5")
                .attr("stroke-opacity",1);
              }, that.transitions.duration());
            }
            return this;
          },
          legends: function () {
            if(PykCharts['boolean'](that.legends_enable)) {
              var params = that.getParameters(),color;
              color = params.map(function (d) {
                return d.color;
              });
              params = params.map(function (d) {
                return d.name;
              });

              params = _.uniq(params);
              var j = 0,k = 0;
              j = params.length;
              k = params.length;

              if(that.legends_display === "vertical" ) {
                that.legendsGroup_height = 0;
                text_parameter1 = "x";
                text_parameter2 = "y";
                rect_parameter1 = "width";
                rect_parameter2 = "height";
                rect_parameter3 = "x";
                rect_parameter4 = "y";
                rect_parameter1value = 13;
                rect_parameter2value = 13;
                text_parameter1value = function (d,i) { return 36; };
                rect_parameter3value = function (d,i) { return 20; };
                var rect_parameter4value = function (d,i) { return i * 24 + 12;};
                var text_parameter2value = function (d,i) { return i * 24 + 23;};
              }
              else if(that.legends_display === "horizontal") {
                that.legendsGroup_height = 50;
                final_rect_x = 0;
                final_text_x = 0;
                legend_text_widths = [];
                temp_text = temp_rect = 0;
                text_parameter1 = "x";
                text_parameter2 = "y";
                rect_parameter1 = "width";
                rect_parameter2 = "height";
                rect_parameter3 = "x";
                rect_parameter4 = "y";
                var text_parameter1value = function (d,i) {
                  legend_text_widths[i] = this.getBBox().width;
                  legend_start_x = 16;
                  final_text_x = (i === 0) ? legend_start_x : (legend_start_x + temp_text);
                  temp_text = temp_text + legend_text_widths[i] + 30;
                  return final_text_x;
                };
                text_parameter2value = 30;
                rect_parameter1value = 13;
                rect_parameter2value = 13;
                var rect_parameter3value = function (d,i) {
                  final_rect_x = (i === 0) ? 0 : temp_rect;
                  temp_rect = temp_rect + legend_text_widths[i] + 30;
                  return final_rect_x;
                };
                rect_parameter4value = 18;
              }

              var legend = that.legendsGroup.selectAll(".legends-rect")
              .data(params);

              that.legends_text = that.legendsGroup.selectAll(".legends_text")
              .data(params);

              that.legends_text.enter()
              .append('text');

              that.legends_text.attr("class","legends_text")
              .attr("pointer-events","none")
              .text(function (d) { return d; })
              .attr("fill", that.legends_text_color)
              .attr("font-family", that.legends_text_family)
              .attr("font-size",that.legends_text_size +"px")
              .attr("font-weight", that.legends_text_weight)
              .attr(text_parameter1, text_parameter1value)
              .attr(text_parameter2, text_parameter2value);

              legend.enter()
              .append("rect");

              legend.attr("class","legends-rect")
              .attr(rect_parameter1, rect_parameter1value)
              .attr(rect_parameter2, rect_parameter2value)
              .attr(rect_parameter3, rect_parameter3value)
              .attr(rect_parameter4, rect_parameter4value)
              .attr("fill", function (d,i) {
                if(that.color_mode === "color")
                  return color[i];
                  else return color[0];
                })
                .attr("fill-opacity", function (d,i) {
                  if(that.color_mode === "saturation"){
                    return (that.no_of_groups-i)/that.no_of_groups;
                  }
                });

                var legend_container_width = that.legendsGroup.node().getBBox().width,translate_x;
                if(that.legends_display === "vertical") {
                  that.legendsGroup_width = legend_container_width + 20;
                } else  {
                  that.legendsGroup_width = 0;
                }

                translate_x = (that.legends_display === "vertical") ? (that.width - that.legendsGroup_width) : (that.width - legend_container_width - 20);

                if (legend_container_width < that.width) { that.legendsGroup.attr("transform","translate("+translate_x+",10)"); }
                that.legendsGroup.style("visibility","visible");

                that.legends_text.exit().remove();
                legend.exit().remove();
              }
              return this;
            }
          }
          return optional;
        };

        that.getGroups = function(){
          var groups = {};
          for(var i=0;i<that.the_bars.length;i++) {
            var bar = that.the_bars[i];
            if(!bar.id) continue;
            if(groups[bar.group]){
              groups[bar.group].push(bar.id);
            }else{
              groups[bar.group] = [bar.id];
            }
          }
          return groups;
        };

        that.buildLayers = function(the_bars){
          var layers = [];

          function findLayer(l){
            for(var i = 0;i<layers.length;i++){
              var layer = layers[i];
              if (layer.name == l) return layer;
            }
            return addLayer(l);
          }

          function addLayer(l){
            var new_layer = {
              "name": l,
              "values": []
            };
            layers.push(new_layer);
            return new_layer;
          }
          for(var i=0;i<the_bars.length;i++) {
            var bar = the_bars[i];
            if(!bar.id) continue;
            var id = bar.id;
            for(var k in bar){
              if(k === "id") continue;
              var icings = bar[k];
              for(var j=0;j<icings.length;j++) {
                var icing = icings[j];
                if(!icing.name) continue;
                var layer = findLayer(icing.name);
                var index_group = that.unique_group.indexOf(that.keys[id])
                layer.values.push({
                  "x": id,
                  "y": icing.val,
                  "group": that.keys[id],
                  "color": icing.color,
                  "tooltip": icing.tooltip,
                  "name": bar.group
                });
              }
            }
          }
          return layers;
        };
        that.flattenData = function(){
          var the_bars = [-1];
          that.keys = {};
          for(var i=0; i<that.data.length; i++) {
            var d = that.data[i];
            for(var cat_name in d){
              for(var j = 0; j < d[cat_name].length; j++) {
                var id = "i" + i + "j" + j;
                if(typeof d[cat_name][j] !== "object"){
                  continue;
                }
                var key = Object.keys(d[cat_name][j])[0];
                that.keys[id] = key;
                d[cat_name][j].id = id;
                d[cat_name][j].group = cat_name;

                the_bars.push(d[cat_name][j]);
              }
              the_bars.push(i); // Extra seperator element for gaps in segments
            }
          }
          return [the_bars, that.keys];
        };

        that.getParameters = function () {
          var p = [];
          for(var i = 0; i<that.the_layers.length;i++){
            if(!that.the_layers[i].name) continue;
            var name = that.the_layers[i].name, color;
            for(var j = 0; j<that.the_layers[i].values.length;j++) {
              var name = that.the_layers[i].values[j].group, color;
              if(that.color_mode === "saturation") {
                color = that.saturation_color;
              } else if(that.color_mode === "color" && that.the_layers[0].values[j].color){
                color = that.the_layers[0].values[j].color;
              }
              p.push({
                "name": name,
                "color": color
              });
            }
          }
          return p;
        };
        that.emptygroups = function (data) {

          that.no_of_groups = that.unique_group.length;

          that.group_data;

          for(var i =0; i<that.no_of_groups;i++) {
            if(_.values(data[i])[0].length === that.no_of_groups) {
              that.group_data = _.values(data[i])[0];
              break;
            }
          }

          that.get_unique_group = _.map(that.group_data,function(d,i) {
            return _.keys(d)[0];
          });

          that.unique_color = _.map(that.group_data, function (d,i) {
            return d[_.keys(d)][0].color;
          });

          for(var i = 0;i<data.length;i++) {
            var value = _.values(data[i]);
            var group = value[0];
            if(value[0].length < that.no_of_groups) {
              for(var k=0; k<that.no_of_groups;k++) {
                var value = _.values(data[i]);
                var group = value[0];
                if(_.keys(group[k])[0] != that.get_unique_group[k]) {
                  var stack = { "name": "stack", "tooltip": "null", "color": that.unique_color[k], "val": 0, /*highlight: false*/ };
                  var missing_group = that.get_unique_group[k];
                  _.values(data[i])[0].splice(k, 0, {});
                  _.values(data[i])[0][k][missing_group] = [stack];
                }
              }
            }
          }
          return data;
        };

        that.dataTransformation = function () {

          var data_tranform = [], column_to_be_sorted = "";
          that.barName = [];

          var data_length = that.data.length;
          that.unique_group = _.uniq(that.data, function (d) {
            return d.group;
          });

          if(that.unique_group.length === 1) {
            try {
              if(that.data_sort_type === "alphabetically" || that.data_sort_type === "numerically" || that.data_sort_type === "date") {
              } else {
                that.data_sort_type = multiDimensionalCharts.data_sort_type;
                throw "data_sort_type";
              }
            }
            catch(err) {
              that.k.warningHandling(err,"8");
            }
          } else {
            try {
              if(that.data_sort_type === "alphabetically" || that.data_sort_type === "date") {
              } else {
                that.data_sort_type = multiDimensionalCharts.data_sort_type;
                throw "data_sort_type";
              }
            }
            catch(err) {
              that.k.warningHandling(err,"8");
            }
          }

          switch (that.data_sort_type) {
            case "alphabetically":
              case "date":            column_to_be_sorted = "y";
              break;
              case "numerically":     column_to_be_sorted = "x";
              break;
            }
            that.data = that.k.__proto__._sortData(that.data,that.unique_group,column_to_be_sorted,"group",that); // data_sort

            for(var i=0; i < data_length; i++) {
              var group = {},
              bar = {},
              stack;

              if(!that.data[i].group) {
                that.data[i].group = "group" + i;
              }

              if(!that.data[i].stack) {
                that.data[i].stack = "stack";
              }

              that.barName[i] = that.data[i].group;
              group[that.data[i].y] = [];
              bar[that.data[i].group] = [];
              stack = { "name": that.data[i].stack, "tooltip": that.data[i].tooltip, "color": that.data[i].color, "val": that.data[i].x/*, highlight: that.data[i].highlight */};
              if(i === 0) {
                data_tranform.push(group);
                data_tranform[i][that.data[i].y].push(bar);
                data_tranform[i][that.data[i].y][i][that.data[i].group].push(stack);

              } else {
                var data_tranform_lenght = data_tranform.length;
                var j=0;
                for(j=0;j < data_tranform_lenght; j++) {
                  if ((_.has(data_tranform[j], that.data[i].y))) {
                    var barr = data_tranform[j][that.data[i].y];
                    var barLength = barr.length;
                    var k = 0;
                    for(k =0; k<barLength;k++) {
                      if(_.has(data_tranform[j][that.data[i].y][k],that.data[i].group)) {
                        break;
                      }
                    }
                    if(k < barLength) {
                      data_tranform[j][that.data[i].y][k][that.data[i].group].push(stack);
                    } else {
                      data_tranform[j][that.data[i].y].push(bar);
                      data_tranform[j][that.data[i].y][k][that.data[i].group].push(stack);
                    }
                    break;
                  }
                }
                if(j === data_tranform_lenght) {
                  data_tranform.push(group);
                  data_tranform[j][that.data[i].y].push(bar);
                  data_tranform[j][that.data[i].y][0][that.data[i].group].push(stack);
                }
              }
            }
            that.barName = _.unique(that.barName);
            return data_tranform;
          };
          return this;
        };
