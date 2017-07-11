//svg
var margin = {
      top: 40,
      bottom: 0,
      left: 0,
      right: 0,
    },
    width = window.innerWidth - margin.left - margin.right - 10,
    height = Math.min(500, window.innerHeight-margin.top-margin.bottom-10);

var svg = d3.select('#wrap').append('svg')
      .attr('width',width+margin.left+margin.right)
      .attr('height',height+margin.top+margin.bottom)
      .attr('transform','translate('+ (-margin.left)+','+margin.top+')');

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
      return {
      name: d.Area,
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
  var nestLife = d3.nest()
      .key(function(d){
        return d['year'];
      }).sortKeys(d3.ascending)
      .key(function(d){
        return d['name'];
      })
      .rollup(function(d){
        return {
          'life': d[0].life,
        }
      })
      .entries(dataLife),
      nestCap = d3.nest()
          .key(function(d){
            return d['year'];
          }).sortKeys(d3.ascending)
          .key(function(d){
            return d['name'];
          })
          .entries(dataCapita),
      nestPop = d3.nest()
          .key(function(d){
            return d['year'];
          }).sortKeys(d3.ascending)
          .rollup(function(d){
            return {
              'name':d['name'],
              'pop': d['population'],
            }
          })
          .entries(dataPop);
  function key_func(d) {return d['key'];}

  var filtered = nestLife.filter(function(d){
    return d['key'] === '1949';
  });

  var test = svg.selectAll('circle')
        .data(filtered,key_func)
        .enter().append('cirlce')
        .attr("class",'move')
         .attr("r",function(d){debugger; return d.values['life'];})
         .each(gdp);
  debugger;
  function gdp(){

  }
}
