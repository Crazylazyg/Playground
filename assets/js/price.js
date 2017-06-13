var parseDate = d3.timeParse("%m/%d/%Y");

d3.csv("assets/js/prices.csv")
    .row(function(d){ return {month: parseDate(d.month), price:Number(d.price.trim().slice(1))}; })
    .get(function(error,data){
    console.log(data);
    var height = 300,
        width = 500;
    var max = d3.max(data,function(d){return d.price;}),
        maxDate = d3.max(data,function(d){return d.month;}),
        minDate = d3.min(data,function(d){return d.month;});
    var y = d3.scaleLinear()
          .domain([0,max])
          .range([height,0]);
    var x = d3.scaleTime()
          .domain([minDate,maxDate])
          .range([0,width]);
    var yAxis = d3.axisLeft(y),
        xAxis = d3.axisBottom(x);
    var svg = d3.select('body').append('svg').attr('height','100vh').attr('width','100%');
    var margin = {left:60,right:60,top:50,bottom:0};

    var chartGroup = svg.append('g')
      .attr('transform','translate('+margin.left+','+margin.top+')');

    var line = d3.line()
      .x(function(d,i){return x(d.month);})
      .y(function(d,i){return y(d.price);});

    chartGroup.append("path").attr("d",line(data));
    chartGroup.append('g').attr('class','axis y').call(yAxis);
    chartGroup.append('g').attr('class','axis x').attr('transform','translate(0,'+height+')').call(xAxis);


  });
