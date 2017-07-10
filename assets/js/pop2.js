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

d3.csv('assets/js/data/life_expectancy.csv', first);

function first(dataLife) {
  var nested = d3.nest()
        .key(function(d){
          return d['time'];
        })
        .key(function(d){
          return d['geo'];
        })
        .rollup(function(d){
          return {
            'life': +(d[0]['life'])
          }
        })
        .entries(dataLife);

  var filtered = nested[0]['values'];

  var test = svg.selectAll('text')
          .data(filtered)
          .enter().append('text')
            .attr('x',function(d,i) { return i*40;} )
            .attr('y','100')
            .text(function(d){ return d['key'] +':'+ d['value']['life'];});

  // debugger;
}
