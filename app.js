var d3DemoApp = angular.module('d3DemoApp', []);

// controller business logic
// controller business logic
d3DemoApp.controller('AppCtrl', function AppCtrl ($scope, $http) {

  // initialize the model
  $scope.searchKey = 'Washington';

  $scope.getCommitData = function () {
	  
	 $http.jsonp('https://en.wikipedia.org/w/api.php/?action=query&list=search&format=json&srsearch=' + $scope.searchKey + '&callback=JSON_CALLBACK').
    success(function (data) {
      // attach this data to the scope
      $scope.data = data.query.search;

      // clear the error messages
      $scope.error = '';
    }).
    error(function (data, status) {
      if (status === 404) {
        $scope.error = 'That repository does not exist';
      } else {
        $scope.error = 'Error: ' + status;
      }
    });
  };

  // get the commit data immediately
  $scope.getCommitData();
});

d3DemoApp.directive('d3Graph', function () {

  // constants
  var margin = 20,
    width = 960,
    height = 500 - .5 - margin,
    color = d3.interpolateRgb("#f77", "#77f");

  return {
    restrict: 'E',
    scope: {
      val: '=',
      grouped: '='
    },
    link: function (scope, element, attrs) {

      // set up initial svg object
      var margin = {top: 20, right: 20, bottom: 30, left: 80},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

		var x = d3.scale.ordinal()
			.rangeRoundBands([0, width], .1);

		var y = d3.scale.linear()
			.range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.ticks(10, "%");

		var svg = d3.select(element[0]).append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)

		
      scope.$watch('val', function (newVal, oldVal) {

			 if(newVal){ 	
					var data = newVal;
				
					d3.select("svg").selectAll("*").remove();
					var width = 420,
						barHeight = 20;

					var x = d3.scale.linear()
						.domain([0, d3.max(data, function(d) { return d.wordcount; })])
						.range([0, width]);

					var chart = d3.select("svg")
						.attr("width", width)
						.attr("height", barHeight * data.length);

						
					var bar = chart.selectAll("g")
						.data(data)
					  .enter().append("g")
						.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

					bar.append("rect")
						.attr("width", function(d) { return x(d.wordcount); })
						.attr("height", barHeight - 1);

					bar.append("text")
						.attr("x", function(d) { return x(d.wordcount) - 3; })
						.attr("y", barHeight / 2)
						.attr("dy", ".35em")
						.text(function(d) { return d.wordcount; });
							
			}
			
			function type(d) {
				d.wordcount = +d.wordcount; // coerce to number
				return d;
			}
	

      });
    }
  }
});