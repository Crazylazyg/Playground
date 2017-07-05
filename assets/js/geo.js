var margin = {
      top: 40,
      bottom: 0,
      left: 0,
      right: 0,
    },
    width = window.innerWidth - margin.left - margin.right - 10,
    height = Math.min(500, window.innerHeight-margin.top-margin.bottom-10);
//svg
var svg = d3.select('#wrap').append('svg')
      .attr('width',width+margin.left+margin.right)
      .attr('height',height+margin.top+margin.bottom)
      .append('g')
      .attr('transform','translate('+ (-margin.left)+','+margin.top+')');

d3.json('assets/js/data/countries.geo.json', draw);

function draw(geo_data){
  var projection = d3.geoMercator()
        .scale(180);
  var path = d3.geoPath(projection);
  // debugger;
  var maps = svg.selectAll('path')
        .data(geo_data.features)
        .enter().append('path')
          .attr('class','maps')
          .attr('d', path);

  //data
  var parseTime = d3.timeParse("%d-%m-%Y (%H:%M h)" );
  d3.tsv('assets/js/data/world_cup_geo.tsv', function(d){
    d['attendance'] = +d['attendance'];
    d['date'] = parseTime(d['date']);
    return d;
  },countriesP);

  function countriesP(data){
    var nested = d3.nest()
          .key(function(d){
            return d['date'].getUTCFullYear();
          })
          .rollup(function(leaves){
            var total = d3.sum(leaves, function(d){return d['attendance'];});
            var coords = leaves.map(function(d){return projection([+d.long,+d.lat])});
          })
          .entries(data);
  }
}
