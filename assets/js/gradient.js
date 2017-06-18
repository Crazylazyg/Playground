var margin = {
      top: 40,
      bottom: 0,
      left: 40,
      right: 40,
    },
    width = window.innerWidth-margin.left-margin.right-10,
    height = Math.min(500, window.innerHeight-margin.top-margin.bottom-10);
//svg
var svg = d3.select('#wrap').append('svg')
      .attr('width',width+margin.left+margin.right)
      .attr('height',height+margin.top+margin.bottom)
      .append('g')
      .attr('transform','translate('+ (-margin.left)+','+margin.top+')');

var defs = svg.append('defs');

var colors = ["#490A3D","#BD1550","#E97F02","#F8CA00","#8A9B0F"];
defs.append('linearGrandient')
  .attr('id','Rainbow')
  .attr('gradientUnits','userSpaceOnUse')
  .attr('x1',-width/2*0.85).attr('y1',height/2)
  .attr('x2',width/2*0.85).attr('y2',height/2)
  .selectAll('stop')
  .data(d3.range(colors.length))
  .enter().append('stop')
    .attr('offset',function(d,i){return (i/(colors.length-1)*100) + '%';})
    .attr('stop-color',function(d){return colors[d];});

var ran = svg.selectAll('circle')
      .data(colors)
      .enter().append('circle')
      .attr('class','dots')
      .attr('cx',width/2)
      .attr('cy',height/2)
      .attr('r',30);
