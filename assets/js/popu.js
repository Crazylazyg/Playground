var chnPopu = [],
    chnCapita = [],
    chnLife = [];

d3.csv('assets/js/data/life_expectancy.csv')
  .row(function(d){return {
    name: d.geo,
    year: +(d.time),
    life: +(d.life),
    };}).get(function(error, data){
    if (error) throw error;

    for (var i = 0; i < data.length; i++) {
      if (data[i].name == 'chn' && data[i].year < 2020 && data[i].year > 1819) {
        chnLife.push([data[i].year, data[i].life]);
      }
    }
  });

d3.csv('assets/js/data/capita.csv')
  .row(function(d){return {
    name: d.geo,
    year: +(d.time),
    gdp: +(d.gdp),
    };}).get(function(error, data){
    if (error) throw error;
    for (var i = 0; i < data.length; i++) {
      if (data[i].name == 'chn' && data[i].year < 2020 && data[i].year > 1819) {
        chnCapita.push([data[i].year, data[i].gdp]);
      }
    }
  });
d3.csv('assets/js/data/popu.csv')
  .row(function(d){return {
    name: d.Area,
    year: +(d.Year),
    populat: +(d.Population),
    };}).get(function(error, data){
    if (error) throw error;
    for (var i = 0; i < data.length; i++) {
      if (data[i].name == 'China' && data[i].year < 2020 && data[i].year > 1819) {
        chnPopu.push([data[i].year, data[i].populat]);
      }
    }

  });

function start() {
  if (chnPopu[0]){
    var margin = {
          top: 40,
          bottom: 40,
          left: 40,
          right: 0,
        },
        width = window.innerWidth - margin.left - margin.right - 240,
        height = window.innerHeight-margin.top-margin.bottom-140;

    var i = 0;
    var maxY = d3.max(chnLife, function(d){return d[1];});
    var minY = d3.min(chnLife, function(d){return d[1];});
    var maxX = d3.max(chnCapita, function(d){return d[1];});
    var maxR = d3.max(chnPopu, function(d){return d[1];});
    var y = d3.scaleLinear()
          .domain([0,maxY+20])
          .range([height,0]),
        x = d3.scaleLinear()
          .domain([0,maxX])
          .range([0,width]),
        r = d3.scaleLinear()
          .domain([0,maxR])
          .range([0,100]);
    //svg
    var yAxis = d3.axisLeft(y),
        xAxis = d3.axisBottom(x);
    var svg = d3.select('#wrap').append('svg')
          .attr('width',width+margin.left+margin.right)
          .attr('height',height+margin.top+margin.bottom)
          .attr('transform','translate('+ (margin.left)+','+margin.top+')');
    svg.append('g').attr('class','axis y').call(yAxis);
    svg.append('g').attr('class','axis x').attr('transform','translate(0,'+height+')').call(xAxis);
    var textYear = d3.select('svg').append('text')
      .attr("class",'text_year')
      .attr('transform','translate('+ (width-240) +','+(height-20)+')');
    d3.select('svg').append('text')
      .attr("class",'life_expectancy')
      .html("Life Expectancy")
      .attr('transform','translate('+ margin.left +','+margin.top+')');
    d3.select('svg').append('text')
      .attr("class",'gdp')
      .html("GDP")
      .attr('transform','translate('+ (width-margin.left) +','+(height+margin.top)+')');

    svg.append('circle')
      .attr("class",'move')
       .attr("r",5)
       .attr("fill","rgba(220,10,30,0.8)")
       .attr("cx",x(chnPopu[0][0]))
       .attr("cy",y(chnPopu[0][1]))
       .each(move);

    function move() {
      var newR = chnPopu[i][1],
          newX = chnCapita[i][1],
          newY = chnLife[i][1];
      d3.select(this)
        .transition()
        .ease(d3.easeLinear)
        .duration(110)
        .attr("r", r(newR))
        .attr("cx", x(newX))
        .attr("cy", y(newY))
        .on('end', move);
      if (i<197) {
        if (chnPopu[i][0] == chnCapita[i][0] && chnPopu[i][0] == chnLife[i][0]){
          setTimeout(function(){
            textYear.html(chnPopu[i][0]);
          }, 110);
        }
        i++;
      }
    }
  }
}

setTimeout(start, 1500);
