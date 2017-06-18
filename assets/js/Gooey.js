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
//hex
var SQRT3 = Math.sqrt(3),
    hexRadius = Math.min(width,height)/2,
    hexWidth = hexRadius*SQRT3,
    hexHeight = hexRadius*2,
    hexPoly = [[0,-1],[SQRT3/2,0.5],[0,1],[-SQRT3/2,0.5],[-SQRT3/2,-0.5],[0,-1],[SQRT3/2,-0.5]],
    hexPath = 'm' + hexPoly.map(function(p){return [p[0]*hexRadius,p[1]*hexRadius];}).join('l') + 'z';
//filter
var defs = svg.append('defs'),
    filter = defs.append('filter').attr('id','gooeyFilter');

filter.append('feGaussianBlur').attr('in','SourceGraphic')
  .attr('stdDeviation','10')
  .attr("color-interpolation-filters","sRGB")
  .attr('result','blur');
filter.append('feColorMatrix')
  .attr('in','blur')
  .attr('mode','matrix')
  .attr('values','1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9')
  .attr('reslut','gooey');

//Gradient
var colors = ["#490A3D","#BD1550","#E97F02","#F8CA00","#8A9B0F"];
defs.append('linearGradient')
  .attr('id','gradientRainbow')
  .attr('gradientUnits','userSpaceOnUse')
  .attr('x1',-hexWidth/2).attr('y1','0')
  .attr('x2',hexWidth/2).attr('y2','0')
  .selectAll('stop')
  .data(d3.range(colors.length))
  .enter().append('stop')
    .attr('offset',function(d,i){return (i/(colors.length-1)*100) + '%';})
    .attr('stop-color',function(d){return colors[d];});

//Create a clip path that is the same as the top hexagon
defs.append("clipPath")
  .attr("id", "clip")
  .append("path")
  .attr("d", "M" + (width/2) + "," + (height/2) + hexPath);

var circleWrapper = svg.append('g')
      .attr('clip-path','url(#clip)')
      .style('clip-path','url(#clip)')
      .append('g')
        .attr('transform','translate('+ width/2 +','+ height/2 +')')
        .style('filter','url(#gooeyFilter)');

var randomStart = [];
for (var i = 0; i < 30; i++){
  randomStart.push({
    rHex: Math.random()*hexWidth,
    theta: Math.random() * 2 * Math.PI,
		r: 15 + Math.random() * 25
  });
}

var circle = circleWrapper.selectAll(".dots")
  .data(randomStart)
  .enter().append("circle")
    .attr("class", "dots")
    .attr("cx", function(d) { return d.rHex * Math.cos(d.theta); })
    .attr("cy", function(d) { return d.rHex * Math.sin(d.theta); })
    .attr("r", 0)
    .style("fill", "url(#gradientRainbow)")
    .style("opacity", '1')
    .each(move);

circle.transition("grow")
  .duration(function(d,i) { return Math.random()*2000+500; })
  .delay(function(d,i) { return Math.random()*3000;})
  .attr("r", function(d,i) { return d.r; });

svg.append("path")
  .attr("class", "hexagon")
  .attr("d", "M" + (width/2) + "," + (height/2) + hexPath)
  .style("stroke", "#F2F2F2")
  .style("stroke-width", "4px")
  .style("fill", "none");


  //General idea from Maarten Lambrecht's block: http://bl.ocks.org/maartenzam/f35baff17a0316ad4ff6
function move(d) {
	var currentx = parseFloat(d3.select(this).attr("cx")),
		radius = d.r;

	//Randomly define which quadrant to move next
	var sideX = currentx > 0 ? -1 : 1,
		sideY = Math.random() > 0.5 ? 1 : -1,
		randSide = Math.random();

	var newx,
      newy;

	//Move new locations along the vertical sides in 33% of the cases
	if (randSide > 0.66) {
		newx = sideX * 0.5 * SQRT3 * hexRadius - sideX*radius;
		newy = sideY * Math.random() * 0.5 * hexRadius - sideY*radius;
	} else {
		//Choose a new x location randomly,
		//the y position will be calculated later to lie on the hexagon border
		newx = sideX * Math.random() * 0.5 * SQRT3 * hexRadius;
		//Otherwise calculate the new Y position along the hexagon border
		//based on which quadrant the random x and y gave
		if (sideX > 0 && sideY > 0) {
			newy = hexRadius - (1/SQRT3)*newx;
		} else if (sideX > 0 && sideY <= 0) {
			newy = -hexRadius + (1/SQRT3)*newx;
		} else if (sideX <= 0 && sideY > 0) {
			newy = hexRadius + (1/SQRT3)*newx;
		} else if (sideX <= 0 && sideY <= 0) {
			newy = -hexRadius - (1/SQRT3)*newx;
		}//else

		//Take off a bit so it seems that the circles truly only touch the edge
		var offSetX = radius * Math.cos( 60 * Math.PI/180),
			offSetY = radius * Math.sin( 60 * Math.PI/180);
		newx = newx - sideX*offSetX;
		newy = newy - sideY*offSetY;
	}//else

	//Transition the circle to its new location
	d3.select(this)
		.transition()
    .ease(d3.easeLinear)
		.duration(3000 + 2000*Math.random())
		.attr("cy", newy)
		.attr("cx", newx)
		.on('end', move);

}//function move
