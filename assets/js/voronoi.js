var width = window.innerWidth;
var height = window.innerHeight;

var toolTip = d3.select('body').append('div').attr('id','toolTip');

var vertices = d3.range(88).map(function(d){return [Math.random()*width,Math.random()*height];});

var voronoi = d3.voronoi().size([width,height]).extent([[1,1],[width-1,height-1]]);
var svg = d3.select('body').append('svg').attr('width','99.6vw').attr('height','99.6vh');

var polygonNet = svg.append('g').attr('class','polygons').attr('transform','translate(-1,-1)').selectAll('path')
  .data(voronoi.polygons(vertices))
  .enter().append('path')
    .attr('d',function(d){
      return 'M'+d.join('L')+'Z';
    })
    .on('mousemove',function(d){
      toolTip.style("opacity",'1');
      var tipWidth = parseFloat(d3.select('#toolTip').style('width'));
      var tipHeight = parseFloat(d3.select('#toolTip').style('height'));
      var cursorX = d3.event.pageX,
          cursorY = d3.event.pageY;

      if (width-cursorX > tipWidth*1.6){
        toolTip.style('left',cursorX+12+'px');
      }else{
        toolTip.style('left',(cursorX-tipWidth*1.4)+'px');
      }
      if (height-cursorY > tipHeight*2.8){
        toolTip.style('top',cursorY+24+'px');
      }else{
        toolTip.style('top',(cursorY-tipHeight*2)+'px');
      }

      toolTip.html("Number of sides: "+d.length);
    });


var linkNet = svg.append('g').attr('class','links').selectAll('path')
  .data(voronoi.links(vertices))
  .enter().append('path')
    .attr('d',function(d){
      // console.log(d);
      return 'M'+d.source[0]+','+d.source[1]+'L'+d.target[0]+','+d.target[1];
    });


//dots d3.scale.category20c()
svg.append('g').attr('class','dots').selectAll('circle')
  .data(vertices)
  .enter().append('circle')
  .attr('cx',function(d){return d[0];})
  .attr('cy',function(d){return d[1];})
  .attr('r','5.4')
  .call(d3.drag()
    .on('start', dragstarted)
    .on('drag', draged)
    .on('end', dragended)
  );

//drag function
function dragstarted(d) {
  d3.select(this).raise().classed("active", true);
}
function draged(d,i) {
  d3.select(this).attr('cx', d[0]=d3.event.x).attr('cy',d[1]=d3.event.y);
  polygonNet.data(voronoi.polygons(vertices)).attr('d',function(d){
    return 'M'+d.join('L')+'Z';
  });
  linkNet.data(voronoi.links(vertices)).attr('d',function(d){
    return 'M'+d.source[0]+','+d.source[1]+'L'+d.target[0]+','+d.target[1];
  });
  toolTip.html("draged");
}

function dragended(d, i) {
  d3.select(this).classed("active", false);
  toolTip.html("dragended");
}
