var width = window.innerWidth;
var height = window.innerHeight;

var toolTip = d3.select('body').append('div').attr('id','toolTip');

var vertices = d3.range(100).map(function(d){return [Math.random()*width,Math.random()*height];});

var voronoi = d3.voronoi().size([width,height]).extent([[1,1],[width-1,height-1]]);
var svg = d3.select('body').append('svg').attr('width','100vw').attr('height','100vh');

svg.append('g').attr('class','polygons').selectAll('path')
  .data(voronoi.polygons(vertices))
  .enter().append('path')
    .attr('d',function(d){
      return 'M'+d.join('L')+'Z';
    })
    .on('mousemove',function(d){
      toolTip.style("opacity",'1')
      .style('left',d3.event.pageX+6+'px')
      .style('top',d3.event.pageY+10+'px');
      toolTip.html("Number of sides: "+d.length);
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
