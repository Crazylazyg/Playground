//svg
var margin = {
      top: 40,
      bottom: 0,
      left: 0,
      right: 0,
    },
    width = window.innerWidth - margin.left - margin.right - 100,
    height = Math.min(560, window.innerHeight-margin.top-margin.bottom-10);

//countryTip
var countryTip = d3.select('#wrap').append('div').attr('id','countryTip').html('The Wealth & Health of Nations');

var c20c = d3.scaleSequential(d3.interpolateMagma).domain([0,220]);

var svg = d3.select('#wrap').append('svg')
      .attr('width',width+margin.left+margin.right)
      .attr('height',height+margin.top+margin.bottom)
      .attr('transform','translate('+ (-margin.left)+','+margin.top+')');

var textYear = svg.append('text')
  .attr("class",'textYear')
  .attr('text-anchor','end')
  .attr('transform','translate('+ width +','+(height - 60)+')'),
  yText = svg.append('text')
    .attr('class','tipText')
    .attr('transform',"translate("+20+","+20+")")
    .html('Life expectancy/year'),
  xText = svg.append('text')
    .attr('class','tipText')
    .attr('text-anchor','end')
    .attr('transform','translate('+ width +','+ (height-20) +')')
    .html('GDP Income/person');

var nameDic;
var regionDic;
d3.csv('assets/js/data/region.csv').get(function(error, data){
  if (error) throw error;
  regionDic = data;
});
d3.csv('assets/js/data/geoName.csv').row(function(d){
  for (i in regionDic){
    // debugger;
    if (regionDic[i].Entity == d.name){
      return {
        name: d.name,
        geo: d.geo,
        group: regionDic[i].Group,
      }
    }
  }
})
.get(function(error, data){
  if (error) throw error;
  // debugger;
  nameDic = data;
});

d3.csv('assets/js/data/life_expectancy.csv').row(function(d){
    if(+d.time > 1919){
      return {
      name: d.geo,
      year: +d.time,
      life: +d.life,
      }
    }
  }).get(function(error, data){
  if (error) throw error;
  first(data);
});

function first(dataLife){
  d3.csv('assets/js/data/capita.csv')    .row(function(d){
    if(+d.time > 1919) {
      return {
        name: d.geo,
        year: +d.time,
        gdp: +d.gdp,
      };
    }
  })
  .get(function(error, data){
      if (error) throw error;
      second(dataLife,data);
  });

}
function second(dataLife,dataCapita) {
  d3.csv('assets/js/data/popu.csv').row(function(d){
    if(+d.Year > 1919){
      for (i in nameDic) {
          // debugger;
        if (nameDic[i].name == d.Area) {
          var geo = nameDic[i].geo;
          var group = nameDic[i].group;
          // debugger;
          return {
            name: geo,
            year: +d.Year,
            population: +d.Population,
            group: group.slice(1,-1),
          };
        }
      }

    }
  })
  .get(function(error, data){
    if (error) throw error;
    draw(dataLife,dataCapita,data);
  });
}


function draw(dataLife,dataCapita,dataPop) {
// scale
  var lifeMax = d3.max(dataLife, function(d){return d.life}),
      lifeMin = d3.min(dataLife, function(d){return d.life}),
      capMax = d3.max(dataCapita, function(d){return d.gdp}),
      capMin = d3.min(dataCapita, function(d){return d.gdp}),
      popMax = d3.max(dataPop, function(d){return d.population}),
      popMin = d3.min(dataPop, function(d){return d.population});

  var x = d3.scalePow().exponent(0.333)
          .domain([0,capMax])
          .range([0,width])
          .clamp(true),
      y = d3.scalePow().exponent(1.2  )
          .domain([lifeMin,lifeMax])
          .range([height,0])
          .clamp(true),
      r = d3.scalePow().exponent(0.5)
          .domain([popMin,popMax])
          .range([1,72]);
  // debugger;
  // var nestLife = d3.nest()
  //     .key(function(d){
  //       return d['year'];
  //     }).sortKeys(d3.ascending)
  //     .key(function(d){
  //       return d['name'];
  //     })
  //     .rollup(function(d){
  //       return {
  //         'life': d[0].life,
  //       }
  //     })
  //     .entries(dataLife);
  var yAxis = d3.axisLeft(y),
      xAxis = d3.axisBottom(x).scale(x).tickArguments([6, "s"]);

  svg.append('g').attr('class','axis y').call(yAxis);
  svg.append('g').attr('class','axis x').attr('transform','translate(0,'+height+')').call(xAxis);
  var barHeight = 32;
  var yearSelector = svg.append('rect')
        .attr('class','selector')
        .attr('x',0)
        .attr('y', height + 40)
        .attr("width", width)
        .attr("height", barHeight);

  var yearBar = svg.append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', height + 40)
        .attr("height", barHeight);

  var overlay = svg.append('rect')
        .attr('class','overlay')
        .attr('x',0)
        .attr('y', height + 40)
        .attr("width", width)
        .attr("height", barHeight)
        .on("mouseover", enableInteraction);

  // cleaing data
  var dataAll = dataLife.concat(dataCapita).concat(dataPop);

  var nested = d3.nest()
        .key(function(d){
          return d['year'];
        }).sortKeys(d3.ascending)
        .key(function(d){
          return d['name'];
        })
        .rollup(function(d){
          // console.log(d[2].population);
          // debugger;
          if (d[0] && d[1] && d[2]) {
            if (d[2].population != 0){
              return {
                life: d[0].life,
                gdp: d[1].gdp,
                pop: d[2].population,
                group: d[2].group,
              }
            }
          }
        })
        .entries(dataAll);
  // debugger;
  var start = true;
  function key_func(d){return d['key'];}
  function update(year) {
    var filtered = nested.filter(function(d) {
      return d['key'] == year ;
    });
    // debugger;
    // var dataS = filtered[0].values;
    var dataF = filtered[0].values.filter(function(d){
      return d.value;
      });
    var dataG = dataF.sort(function(a,b){
      if (a.value['group'] != b.value['group']){
        return d3.ascending(b.value['group'], a.value['group']);
      }else{
        return d3.ascending(b.value['pop'],a.value['pop']);
      }
    });

    var country = svg.selectAll('circle');
    // debugger;
    setTimeout(textYear.html(year), 400);
    if (start) {
      country.data(dataG, key_func)
        .enter().append('circle')
          .attr('class', function(d){return "host";})
          .attr('fill', function(d,i){ return c20c(i);})
          .attr("cx",function(d){return x(d.value['gdp']);})
          .attr("cy",function(d){return y(d.value['life']);})
          .attr("r",function(d){return r(d.value['pop']);
          }).on('mousemove', function(d){
            var name;
            for (i in nameDic) {
              // debugger;
              if (nameDic[i].geo == d.key) {
                name = nameDic[i].name
              }
            }
            countryTip
              .html(name);
          });

      start = false;
    }else{
      country.data(dataG,key_func)
        .transition()
        .duration(400)
        .ease(d3.easeLinear)
          .attr("cx",function(d){
            if (!x(d.value['gdp'])){
            debugger;
          }else{
            return x(d.value['gdp']);
          }})
          .attr("cy",function(d){
            return y(d.value['life']);})
          .attr("r",function(d){
            return r(d.value['pop']);
          });
    }
    // debugger;

    // var filtered = nestCap.filter(function(d){
    //   return d['key'] == year;
    // });
    // var countries = filtered[0].values;

    // debugger;

  }
  // debugger;
  var widthScale = d3.scaleLinear()
      .domain([1951, 2016])
      .range([0, width]);

  var yearIndex = 1951;
  var yearInterval = setInterval(function(){
    update(yearIndex);
    yearBar
    .transition()
    .ease(d3.easeLinear)
      .attr('width', widthScale(yearIndex));
    yearIndex++;
    if (yearIndex > 2016){
      clearInterval(yearInterval);
    }
  }, 410);


  function enableInteraction(){
      var yearScale = d3.scaleLinear()
          .domain([0, width])
          .range([1951, 2016]);
      // debugger;
      // Cancel the current transition, if any.
      overlay
          .on("mousemove", mousemove)
          .on("touchmove", mousemove);

      function mouseover() {
        // setStart(true);
      }

      function mouseout() {
        // setStart(Math.round(yearScale(d3.mouse(this)[0])));
      }

      function mousemove() {
        clearInterval(yearInterval);
        var width = widthScale(yearScale(d3.mouse(this)[0]));

        yearBar
          .transition().duration(60)
          .attr('width', width);
        // console.log(yearScale(d3.mouse(this)[0]));
        update(Math.round(yearScale(d3.mouse(this)[0])));
      }
  }
}
