let analysis = require( "./analysis" );

var filepath = process.argv[ 2 ];
var locale = process.argv[ 3 ];
var runs = process.argv[ 4 ];

analysis.doAnalysis({
	filepath,
	locale,
	runs
});
