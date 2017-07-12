//svg
var margin = {
      top: 40,
      bottom: 0,
      left: 0,
      right: 0,
    },
    width = window.innerWidth - margin.left - margin.right - 100,
    height = Math.min(500, window.innerHeight-margin.top-margin.bottom-10);
var c20c = d3.scaleSequential(d3.interpolateMagma).domain([0,220]);
var svg = d3.select('#wrap').append('svg')
      .attr('width',width+margin.left+margin.right)
      .attr('height',height+margin.top+margin.bottom)
      .attr('transform','translate('+ (-margin.left)+','+margin.top+')');
var textYear = svg.append('text')
  .attr("class",'textYear')
  .attr('text-anchor','middle')
  .attr('transform','translate('+ width/2 +','+(height/2 + 40)+')'),
  yText = svg.append('text')
    .attr('class','tipText')
    .attr('transform',"translate("+20+","+20+")")
    .html('Life expectancy/year'),
  xText = svg.append('text')
    .attr('class','tipText')
    .attr('text-anchor','end')
    .attr('transform','translate('+ width +','+ (height-20) +')')
    .html('GDP/$');

var nameDic;
d3.csv('assets/js/data/geoName.csv').get(function(error, data){
  if (error) throw error;
  nameDic = data
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
      var geo;
      for (i in nameDic) {
        // debugger;
        if (nameDic[i].name == d.Area) {
          geo = nameDic[i].geo
        }
      }
      return {
        name: geo,
        year: +d.Year,
        population: +d.Population,
      };
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

  var x = d3.scalePow().exponent(0.25)
          .domain([0,capMax])
          .range([0,width]),
      y = d3.scaleLinear()
          .domain([lifeMin,lifeMax])
          .range([height,0]),
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
      xAxis = d3.axisBottom(x).tickArguments([6, "s"]);

  svg.append('g').attr('class','axis y').call(yAxis);
  svg.append('g').attr('class','axis x').attr('transform','translate(0,'+height+')').call(xAxis);
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
              }
            }
          }
        })
        .entries(dataAll);
  // debugger;
  var start = true;
  function update(year) {
    var filtered = nested.filter(function(d){
      return d['key'] == year;
    });
    // debugger;
    var dataG = filtered[0].values;
    var country = svg.selectAll('circle');
    if (start) {
      country.data(dataG,function(d){return d.key;})
        .enter().append('circle')
          .attr('class',function(d){return d.key + ' host'})
          .attr('fill', function(d,i){ return c20c(i);})
          .attr("cx",function(d){
            // debugger;
            if(d.value){
              // debugger;
              return x(d.value['gdp']);
            }else{
              return 0;
            }
          })
          .attr("cy",function(d){
           //  debugger;
            if(d.value){
             //  debugger;
              return y(d.value['life']);
            }else{
              return y(0);
            }
          })
          .attr("r",function(d){
          //  debugger;
           if(d.value){
            //  debugger;
             return r(d.value['pop']);
           }else{
             return 0;
           }
          });
      start = false;
    }else{
      country.data(dataG,function(d){return d.key;})
        .attr('class',function(d){return d.key + ' host'})
        .transition()
          .attr("cx",function(d){
            // debugger;
            if(d.value){
              // debugger;
              return x(d.value['gdp']);
            }
          })
          .attr("cy",function(d){
           //  debugger;
            if(d.value){
             //  debugger;
              return y(d.value['life']);
            }
          })
          .attr("r",function(d){
          //  debugger;
           if(d.value){
            //  debugger;
             return r(d.value['pop']);
           }
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

  var yearIndex = 1950;
  var yearInterval = setInterval(function(){
    update(yearIndex);
    textYear.html(yearIndex);
    yearIndex++;
    if (yearIndex > 2016){
      clearInterval(yearInterval);
    }
  }, 500);
}
