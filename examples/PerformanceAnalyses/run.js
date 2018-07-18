#!/usr/bin/env node

const merge = require( "lodash/merge" );
const analysis = require( "./analysis" );

const texts = [
	{
		name: "Text1",
		filepath: "text1.html",
	},
	{
		name: "Text2",
		filepath: "text2.html",
	},
	{
		name: "Text3 - A huge text with a ton of HTML elements.",
		filepath: "text3.html",
		runs: 1, // Long text.
	},
];

texts.forEach( ( text ) => {

	let analysisArguments = merge( {
		locale: "en_US",
		runs: 10,
	}, text );

	console.log( "Running performance test for text with name '" + text.name + "' " + analysisArguments.runs + " time(s)" );

	analysis.doAnalysis( analysisArguments );
} );
