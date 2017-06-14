var width = 960;
var height = 500;

var vertices = d3.range(100).map(function(d){return [Math.random()*width,Math.random()*height];});

var voronoi = d3.voronoi().size([width,height]);
var svg = d3.select('body').append('svg').attr('width','100%').attr('height','100vh');

svg.append('g').attr('class','polygons').selectAll('path')
  .data(voronoi.polygons(vertices))
  .enter().append('path')
    .attr('d',function(d){
      return 'M'+d.join('L')+'Z';
    });

svg.append('g').attr('class','links').selectAll('path')
  .data(voronoi.links(vertices))
  .enter().append('path')
    .attr('d',function(d){
      // console.log(d);
      return 'M'+d.source[0]+','+d.source[1]+'L'+d.target[0]+','+d.target[1];
    });

svg.append('g').attr('class','dots').selectAll('circle')
  .data(vertices)
  .enter().append('circle')
  .attr('cx',function(d){return d[0];})
  .attr('cy',function(d){return d[1];})
  .attr('r','3');
