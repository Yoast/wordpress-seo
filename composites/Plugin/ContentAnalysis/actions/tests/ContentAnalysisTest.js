import {
	UPDATE_SEO_RESULT,
	UPDATE_READABILITY_RESULT,
	REMOVE_KEYWORD,
	SET_SEO_RESULTS,
	SET_READABILITY_RESULTS,
	SET_SEO_RESULTS_FOR_KEYWORD,
	updateSeoResult,
	updateReadabilityResult,
	setSeoResults,
	removeKeyword,
	setReadabilityResults,
	setSeoResultsForKeyword,
} from "../contentAnalysis";

describe( "setSeoResultsForKeyword action creator", function() {
	it( "creates the setSeoResultsForKeyword action", function() {
		let results = [
			{ id: "result", score: 9, description: "This is a great score!", markingIsActive: true },
			{ id: "result", score: 3, description: "This is a bad score!", markingIsActive: true },
		];
		let keyword = "keyword";

		const expected = {
			type: SET_SEO_RESULTS_FOR_KEYWORD,
			keyword: keyword,
			results: results,
		};
		const actual = setSeoResultsForKeyword( "keyword", results );
		expect( actual ).toEqual( expected );
	} );
} );

describe( "updateSeoResult action creator", function() {
	it( "creates the updateSeoResult action", function() {
		let result = { id: "result", score: 9, description: "This is a great score!", markingIsActive: true };
		let keyword = "keyword";

		const expected = {
			type: UPDATE_SEO_RESULT,
			keyword: keyword,
			result: result,
		};
		const actual = updateSeoResult( "keyword", result );
		expect( actual ).toEqual( expected );
	} );
} );

describe( "updateReadabilityResult action creator", function() {
	it( "creates the readabilitySeoResult action", function() {
		let result = { id: "result", score: 3, description: "This is a bad score!", markingIsActive: false };

		const expected = {
			type: UPDATE_READABILITY_RESULT,
			result: result,
		};
		const actual = updateReadabilityResult( result );
		expect( actual ).toEqual( expected );
	} );
} );

describe( "setSeoResults function", function() {
	it( "creates the setSeoResults action", function() {
		let keyword = "keyword";
		let resultsPerKeyword = [ {
			keyword: keyword,
			results: [ { id: "result", score: 3, description: "This is a bad score!", markingIsActive: false } ],
		} ];

		const expected = {
			type: SET_SEO_RESULTS,
			resultsPerKeyword: resultsPerKeyword,
		};
		const actual = setSeoResults( resultsPerKeyword );
		expect( actual ).toEqual( expected );
	} );
} );

describe( "setReadabilityResults function", function() {
	it( "creates the setReadabilityResults action", function() {
		let results = [ { id: "result", score: 3, description: "This is a bad score!", markingIsActive: false } ];

		const expected = {
			type: SET_READABILITY_RESULTS,
			results: results,
		};
		const actual = setReadabilityResults( results );
		expect( actual ).toEqual( expected );
	} );
} );

describe( "removeKeyword function", function() {
	it( "creates the removeKeywordsAction", function() {
		let keyword = "keyword";

		const expected = {
			type: REMOVE_KEYWORD,
			keyword: keyword,
		};
		const actual = removeKeyword( keyword );
		expect( actual ).toEqual( expected );
	} );
} );
