var dataArray = [5,11,18];

var svg = d3.select('body').append('svg')
                             .attr("width","100%")
                             .attr("height","300%");

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
