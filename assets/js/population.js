var parseYear = d3.timeParse("%Y");
var chnPopulation = [];

d3.csv('assets/js/data/population.csv')
  .row(function(d){return {
    name: d.Area,
    year: parseYear(d.Year),
    populat: +(d.Population.replace(/,/g,''))
  };}).get(function(error,data){
    if (error) throw error;
    for (var i = 0; i < data.length; i++) {
      if (data[i].name == 'China' && data[i].populat) {
       chnPopulation.push([
         data[i].year, data[i].populat]
       );
      }
    }
    var maxR = d3.max(chnPopulation,function(d){
      return d[1];
    })
    var pop = d3.scaleLinear()
      .domain([0,maxR])
      .range([1,100]);


    var china = svg.selectAll('.China')
      .data(chnPopulation[,1])
      .enter().append("circle")
      .attr('class','China')
      .attr('cx',width/2)
      .attr('cy',height/2)
      .attr('r',function(d){console.log(d[1]);return pop(d[1]);});
  });



//svg
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
      .attr('transform','translate('+ (-margin.left)+','+margin.top+')');
