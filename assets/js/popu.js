var chnPopu = [];

d3.csv('assets/js/data/popu.csv')
  .row(function(d){return {
    name: d.Area,
    year: +(d.Year),
    populat: +(d.Population),
};}).get(function(error, data){
    if (error) throw error;
    for (var i = 0; i < data.length; i++) {
      if (data[i].name == 'China' && data[i].year < 2020 && data[i].year > 1819) {
        chnPopu.push( [data[i].year, data[i].populat]);
      }
    }
    var i = 1;
    var maxY = d3.max(chnPopu, function(d){return d[1];});
    var y = d3.scaleLinear()
          .domain([400000000,maxY])
          .range([height,0]),
        x = d3.scaleLinear()
          .domain([1819,2020])
          .range([0,width]);

    svg.selectAll('.dots')
    .data(chnPopu)
    .enter().append('circle')
      .attr("class",'dotss')
       .attr("r",1)
       .attr("fill","#ccc")
       .attr("cx",function(d){return x(d[0]);})
       .attr("cy",function(d){return y(d[1]);});

    svg.append('circle')
      .attr("class",'move')
       .attr("r",5)
       .attr("fill","#666")
       .attr("cx",x(chnPopu[0][0]))
       .attr("cy",y(chnPopu[0][1]))
       .each(move);

    function move() {
      var newP = chnPopu[i];
      d3.select(this)
        .transition()
        .ease(d3.easeLinear)
        .duration(100)
        .attr("cx", x(newP[0]))
        .attr("cy", y(newP[1]))
        .on('end', move);
      i++;
    }
  });

var margin = {
      top: 40,
      bottom: 0,
      left: 0,
      right: 0,
    },
    width = window.innerWidth - margin.left - margin.right - 10,
    height = window.innerHeight-margin.top-margin.bottom-10;
//svg

var svg = d3.select('#wrap').append('svg')
      .attr('width',width+margin.left+margin.right)
      .attr('height',height+margin.top+margin.bottom)
      .attr('transform','translate('+ (-margin.left)+','+margin.top+')');
