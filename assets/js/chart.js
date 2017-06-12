var dataArray = [5,11,18];

var svg = d3.select('body').append('svg')
                             .attr("width","100%")
                             .attr("height","100vh");

svg.selectAll('rect')
   .data(dataArray)
   .enter().append('rect')
             .attr("height",function(d,i){return d*10;})
             .attr("width","40")
             .attr("fill","#999")
             .attr("x",function(d,i){return i*60;})
             .attr("y",function(d,i){return 300-(d*10);});

var newX = 300;
svg.selectAll('circle')
   .data(dataArray)
   .enter().append('circle')
             .attr("r",function(d,i){return d*5;})
             .attr("fill","#666")
             .attr("cx",function(d,i){newX = newX+d*10;return newX;})
             .attr("cy",function(d,i){return 150;});

var newX = 900;
svg.selectAll('line')
  .data(dataArray)
  .enter().append('line')
            .attr("x1",newX)
            .attr("x2",function(d,i){return newX+d*15;})
            .attr("y1",function(d,i){return 150+i*30;})
            .attr("y2",function(d,i){return 150+i*30;})
            .attr("stroke-width","4");

var textArray = ['start','middle','end'];
svg.append('text').selectAll('tspan')
  .data(textArray)
  .enter().append('tspan')
    .attr('x',newX)
    .attr('y',function(d,i){return 220+i*30;})
    .attr('text-anchor',function(d,i){return d;})
    .attr('font-size','30')
    .text(function(d,i){return d;});
