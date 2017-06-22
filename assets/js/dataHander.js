d3.xml("assets/js/data.xml").get(function(error,data){

var xmlLetter = data.documentElement.getElementsByTagName("letter");
var letterNodes = d3.select(data).selectAll("letter")._groups;
console.log(letterNodes);

});
  
