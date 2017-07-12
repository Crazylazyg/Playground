var margin = {
      top: 40,
      bottom: 0,
      left: 0,
      right: 0,
    },
    width = window.innerWidth - margin.left - margin.right,
    height = Math.min(500, window.innerHeight-margin.top-margin.bottom);
//svg
var svg = d3.select('#wrap').append('svg')
      .attr('width',width+margin.left+margin.right)
      .attr('height',height+margin.top+margin.bottom)
      .append('g')
      .attr('transform','translate('+ (-margin.left)+','+margin.top+')');

var h2 = d3.select('#wrap').append('h2');

d3.json('assets/js/data/countries.geo.json', draw);

function draw(geo_data){
  var projection = d3.geoMercator()
        .scale(180)
        .translate([width / 2, height / 1.2]);

  var path = d3.geoPath(projection);
  // debugger;
  var maps = svg.selectAll('path')
        .data(geo_data.features)
        .enter().append('path')
          .attr('class','maps')
          .attr('d', path);

  //data
  var parseTime = d3.timeParse("%d-%m-%Y (%H:%M h)" );
  d3.tsv('assets/js/data/world_cup_geo.tsv', function(d){
    d['attendance'] = +d['attendance'];
    d['date'] = parseTime(d['date']);
    return d;
  },countriesP);

  function countriesP(data){
    function agg_year(leaves) {
      var total = d3.sum(leaves, function(d){
        return d['attendance'];
      });

      var coords = leaves.map(function(d){
        return projection([+d.long, +d.lat]);
      });

      var center_x = d3.mean(coords, function(d) {
          return d[0];
      });
      var center_y = d3.mean(coords, function(d) {
          return d[1];
      });

      var teams = d3.set();
      leaves.forEach(function(d){
        teams.add(d['team1']);
        teams.add(d['team2']);
      });
      return {
        'attendance': total,
        'x': center_x,
        'y': center_y,
        'teams': teams.values()
      };
    }
    // debugger;
    var nested = d3.nest()
          .key(function(d){
            return d['date'].getUTCFullYear();
          })
          .rollup(agg_year)
          .entries(data);

    var attendance_max = d3.max(nested, function(d) {
      return d.value['attendance'];
    });
    var radius = d3.scalePow().exponent(0.5)
        .domain([0,attendance_max])
        .range([1,18]);

    function key_func(d) {return d['key'];}

    svg.append('g')
      .selectAll('circle')
      .data(nested.sort(function(a,b){
        return b.value['attendance'] - a.value['attendance'];
      }),key_func)
      .enter().append('circle')
        .attr('class','host')
        .attr('cx', function(d){return d.value['x'];})
        .attr('cy', function(d){return d.value['y'];})
        .attr('r', function(d){return radius(d.value['attendance']);})

    function update(year){

      var filtered = nested.filter(function(d){
        return new Date(d['key']).getUTCFullYear() === year;
      });
      var circles = svg.selectAll('circle')
          .data(filtered, key_func);

      circles.exit().remove();
      circles.enter().append('circle')
        .attr('class','host')
        .attr('cx', function(d){return d.value['x'];})
        .attr('cy', function(d){return d.value['y'];})
        .attr('r', function(d){return radius(d.value['attendance']);});
      debugger;
      h2.html(`World Cup <span>${year}</span>`);
      var countries = filtered[0].value['teams'];
      function update_countries(d) {
        if(countries.indexOf(d.properties.name) !== -1) {
          return 'maps active';
        }else{
          return 'maps inactive';
        }
      }
      svg.selectAll('path')
        .attr('class', update_countries);
    }
    //years_arr
    var years = [];
    for (var i = 1930; i < 2015; i +=4){
      if (i !== 1942 && i !== 1946) {
        years.push(i);
      }
    }
    //interval
    var yearIndex = 0;
    var year_interval = setInterval(function(){
      update(years[yearIndex]);
      yearIndex++;
      if (yearIndex >= years.length){
        clearInterval(year_interval);

        var buttons = d3.select('#wrap').append('div')
            .attr('class','years_buttons')
            .selectAll('div')
            .data(years)
              .enter().append('div')
              .attr('class','button inactive')
              .text(function(d){return d;});

        buttons.on('click', function(){
          d3.select('.years_buttons').selectAll('.button')
            .attr('class','button inactive');
          d3.select(this)
            .attr('class','button active');
          // debugger;
          update(+d3.select(this).text());
        });
      }
    }, 1200);



  }
}
