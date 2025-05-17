import { isFunction } from "lodash";
import { colors } from "@yoast/style-guide";
import { AssessmentResult, interpreters } from "yoastseo";
import mapResults, { getIconForScore } from "../../../src/components/contentAnalysis/mapResults";


const analysisResults = [
	new AssessmentResult( {
		_identifier: "error",
		score: -1,
		text: "feedback string",
		_hasBetaBadge: false,
		_hasJumps: false,
		_hasAIFixes: false,
		editFieldName: "keyphrase",
	} ),
	new AssessmentResult( {
		_identifier: "problem",
		score: 0,
		text: "feedback string",
		_hasBetaBadge: false,
		_hasJumps: false,
		_hasAIFixes: false,
		editFieldName: "keyphrase",
	} ),
	new AssessmentResult( {
		_identifier: "improvement",
		score: 3,
		text: "feedback string",
		_hasBetaBadge: false,
		_hasJumps: false,
		_hasAIFixes: false,
		editFieldName: "keyphrase",
	} ),
	new AssessmentResult( {
		_identifier: "consideration",
		score: 6,
		text: "feedback string",
		_hasBetaBadge: true,
		_hasJumps: true,
		_hasAIFixes: false,
		editFieldName: "keyphrase",
	} ),
	new AssessmentResult( {
		_identifier: "good",
		score: 9,
		text: "feedback string",
		_hasBetaBadge: false,
		_hasJumps: false,
		_hasAIFixes: false,
		editFieldName: "",
	} ),
	new AssessmentResult( {
		_identifier: "empty text",
		score: 0,
		text: "",
		_hasBetaBadge: false,
		_hasJumps: false,
		_hasAIFixes: false,
		editFieldName: "",
	} ),
];

describe( "mapResults", () => {
	it( "splits results into groups based on their score", () => {
		const results = mapResults( analysisResults );

		expect( results ).toBeDefined();
		expect( results.errorsResults ).toBeDefined();
		expect( results.problemsResults ).toBeDefined();
		expect( results.improvementsResults ).toBeDefined();
		expect( results.goodResults ).toBeDefined();
		expect( results.considerationsResults ).toBeDefined();

		// Check the result amounts to verify the empty text result is skipped.
		expect( results.errorsResults.length ).toBe( 1 );
		expect( results.problemsResults.length ).toBe( 1 );
		expect( results.improvementsResults.length ).toBe( 1 );
		expect( results.goodResults.length ).toBe( 1 );
		expect( results.considerationsResults.length ).toBe( 1 );
	} );

	it( "splits results into groups based on their score, even without any input results", () => {
		const results = mapResults( false );

		expect( results ).toBeDefined();
		expect( results.errorsResults ).toBeDefined();
		expect( results.problemsResults ).toBeDefined();
		expect( results.improvementsResults ).toBeDefined();
		expect( results.goodResults ).toBeDefined();
		expect( results.considerationsResults ).toBeDefined();
		expect( results.errorsResults.length ).toBe( 0 );
		expect( results.problemsResults.length ).toBe( 0 );
		expect( results.improvementsResults.length ).toBe( 0 );
		expect( results.goodResults.length ).toBe( 0 );
		expect( results.considerationsResults.length ).toBe( 0 );
	} );

	it( "maps a result", () => {
		const results = mapResults( analysisResults );
		const result = results.goodResults[ 0 ];
		const expectedResult = analysisResults[ 4 ];

		expect( result.score ).toBe( expectedResult.score );
		expect( result.rating ).toBe( interpreters.scoreToRating( expectedResult.score ) );
		expect( result.hasMarks ).toBe( false );
		expect( isFunction( result.marker ) ).toBe( true );
		expect( result.marker() ).toEqual( [] );
		expect( result.id ).toBe( expectedResult._identifier );
		expect( result.text ).toBe( expectedResult.text );
		expect( result.markerId ).toBe( expectedResult._identifier );
		expect( result.hasBetaBadge ).toBe( expectedResult._hasBetaBadge );
		expect( result.hasJumps ).toBe( expectedResult._hasJumps );
		expect( result.editFieldName ).toBe( expectedResult.editFieldName );
		expect( result.hasAIFixes ).toBe( expectedResult._hasAIFixes );
	} );

	it( "maps a result, using a keywordKey", () => {
		const results = mapResults( analysisResults, "something" );
		const result = results.goodResults[ 0 ];
		const expectedResult = analysisResults[ 4 ];

		expect( result.score ).toBe( expectedResult.score );
		expect( result.rating ).toBe( interpreters.scoreToRating( expectedResult.score ) );
		expect( result.hasMarks ).toBe( false );
		expect( isFunction( result.marker ) ).toBe( true );
		expect( result.marker() ).toEqual( [] );
		expect( result.id ).toBe( expectedResult._identifier );
		expect( result.text ).toBe( expectedResult.text );
		expect( result.markerId ).toBe( `something:${expectedResult._identifier}` );
		expect( result.hasBetaBadge ).toBe( expectedResult._hasBetaBadge );
		expect( result.hasJumps ).toBe( expectedResult._hasJumps );
		expect( result.editFieldName ).toBe( expectedResult.editFieldName );
	} );
} );

describe( "getIconForScore", () => {
	it( "has a fallback (default) icon", () => {
		const expected = { icon: "seo-score-bad", color: colors.$color_red };
		const actual = getIconForScore( "non-existing score" );

		expect( actual.icon ).toBe( expected.icon );
		expect( actual.color ).toBe( expected.color );
	} );

	it( "has a loading icon", () => {
		const expected = { icon: "loading-spinner", color: colors.$color_green_medium_light };
		const actual = getIconForScore( "loading" );

		expect( actual.icon ).toBe( expected.icon );
		expect( actual.color ).toBe( expected.color );
	} );

	it( "has a good icon", () => {
		const expected = { icon: "seo-score-good", color: colors.$color_green_medium };
		const actual = getIconForScore( "good" );

		expect( actual.icon ).toBe( expected.icon );
		expect( actual.color ).toBe( expected.color );
	} );

	it( "has an ok icon", () => {
		const expected = { icon: "seo-score-ok", color: colors.$color_ok };
		const actual = getIconForScore( "ok" );

		expect( actual.icon ).toBe( expected.icon );
		expect( actual.color ).toBe( expected.color );
	} );

	it( "has a bad icon", () => {
		const expected = { icon: "seo-score-bad", color: colors.$color_red };
		const actual = getIconForScore( "bad" );

		expect( actual.icon ).toBe( expected.icon );
		expect( actual.color ).toBe( expected.color );
	} );
} );
