import AnalysisFields from "../../../src/helpers/fields/AnalysisFields";
import {
	REMOVE_KEYWORD,
	removeKeyword,
	SET_INCLUSIVE_LANGUAGE_RESULTS,
	SET_OVERALL_INCLUSIVE_LANGUAGE_SCORE,
	SET_OVERALL_READABILITY_SCORE,
	SET_OVERALL_SEO_SCORE,
	SET_READABILITY_RESULTS,
	SET_SEO_RESULTS,
	SET_SEO_RESULTS_FOR_KEYWORD,
	setInclusiveLanguageResults,
	setOverallInclusiveLanguageScore,
	setOverallReadabilityScore,
	setOverallSeoScore,
	setReadabilityResults,
	setSeoResults,
	setSeoResultsForKeyword,
	UPDATE_INCLUSIVE_LANGUAGE_RESULT,
	UPDATE_READABILITY_RESULT,
	UPDATE_SEO_RESULT,
	updateInclusiveLanguageResult,
	updateReadabilityResult,
	updateSeoResult,
} from "../../../src/redux/actions/contentAnalysis";

/**
 * Creates an input element.
 * @param {string} id The ID.
 * @returns {HTMLInputElement} The input element.
 */
const createInputElement = ( id ) => {
	const inputElement = document.createElement( "input" );
	inputElement.id = id;
	document.body.appendChild( inputElement );

	return inputElement;
};

describe( "SEO", () => {
	describe( "setSeoResultsForKeyword action creator", () => {
		it( "creates the setSeoResultsForKeyword action", () => {
			const results = [
				{ id: "result", score: 9, description: "This is a great score!", markingIsActive: true },
				{ id: "result", score: 3, description: "This is a bad score!", markingIsActive: true },
			];
			const keyword = "keyword";

			const expected = {
				type: SET_SEO_RESULTS_FOR_KEYWORD,
				keyword: keyword,
				results: results,
			};
			const actual = setSeoResultsForKeyword( "keyword", results );
			expect( actual ).toEqual( expected );
		} );
	} );

	describe( "updateSeoResult action creator", () => {
		it( "creates the updateSeoResult action", () => {
			const result = { id: "result", score: 9, description: "This is a great score!", markingIsActive: true };
			const keyword = "keyword";

			const expected = {
				type: UPDATE_SEO_RESULT,
				keyword: keyword,
				result: result,
			};
			const actual = updateSeoResult( "keyword", result );
			expect( actual ).toEqual( expected );
		} );
	} );

	describe( "setSeoResults action creator", () => {
		it( "creates the setSeoResults action", () => {
			const keyword = "keyword";
			const resultsPerKeyword = [
				{
					keyword: keyword,
					results: [ { id: "result", score: 3, description: "This is a bad score!", markingIsActive: false } ],
				},
			];

			const expected = {
				type: SET_SEO_RESULTS,
				resultsPerKeyword: resultsPerKeyword,
			};
			const actual = setSeoResults( resultsPerKeyword );
			expect( actual ).toEqual( expected );
		} );
	} );

	describe( "removeKeyword action creator", () => {
		it( "creates the removeKeywordsAction", () => {
			const keyword = "keyword";

			const expected = {
				type: REMOVE_KEYWORD,
				keyword: keyword,
			};
			const actual = removeKeyword( keyword );
			expect( actual ).toEqual( expected );
		} );
	} );

	describe( "setOverallScore SEO action creator", () => {
		it( "creates the setOverallScore for SEO results action", () => {
			const keyword = "keyword1";
			const overallScore = "3";

			const expected = {
				type: SET_OVERALL_SEO_SCORE,
				keyword: keyword,
				overallScore: overallScore,
			};
			const actual = setOverallSeoScore( overallScore, keyword );
			expect( actual ).toEqual( expected );
		} );

		it( "updates the SEO score element's value", () => {
			const keyword = "keyword1";
			const overallScore = 3;

			const inputElement = createInputElement( "hidden_wpseo_linkdex" );

			setOverallSeoScore( overallScore, keyword );
			expect( AnalysisFields.seoScore ).toEqual( "3" );
			expect( inputElement.value ).toEqual( "3" );

			inputElement.remove();
		} );
	} );
} );

describe( "Readability", () => {
	describe( "setReadabilityResults action creator", () => {
		it( "creates the setReadabilityResults action", () => {
			const results = [ { id: "result", score: 3, description: "This is a bad score!", markingIsActive: false } ];

			const expected = {
				type: SET_READABILITY_RESULTS,
				results: results,
			};
			const actual = setReadabilityResults( results );
			expect( actual ).toEqual( expected );
		} );
	} );

	describe( "updateReadabilityResult action creator", () => {
		it( "creates the updateReadabilitySeoResult action", () => {
			const result = { id: "result", score: 3, description: "This is a bad score!", markingIsActive: false };

			const expected = {
				type: UPDATE_READABILITY_RESULT,
				result: result,
			};
			const actual = updateReadabilityResult( result );
			expect( actual ).toEqual( expected );
		} );
	} );

	describe( "setOverallScore readability action creator", () => {
		it( "creates the setOverallScore for readability results action", () => {
			const overallScore = 3;

			const expected = {
				type: SET_OVERALL_READABILITY_SCORE,
				overallScore: overallScore,
			};
			const actual = setOverallReadabilityScore( overallScore );
			expect( actual ).toEqual( expected );
		} );

		it( "updates the readability score element's value", () => {
			const overallScore = 3;

			const inputElement = createInputElement( "hidden_wpseo_content_score" );

			setOverallReadabilityScore( overallScore );
			expect( AnalysisFields.readabilityScore ).toEqual( "3" );
			expect( inputElement.value ).toEqual( "3" );

			inputElement.remove();
		} );
	} );
} );

describe( "Inclusive language", () => {
	describe( "setInclusiveLanguageResults action creator", () => {
		it( "creates the setInclusiveLanguageResults action", () => {
			const results = [ { id: "result", score: 3, description: "This is a bad score!", markingIsActive: false } ];

			const expected = {
				type: SET_INCLUSIVE_LANGUAGE_RESULTS,
				results: results,
			};
			const actual = setInclusiveLanguageResults( results );
			expect( actual ).toEqual( expected );
		} );
	} );

	describe( "updateInclusiveLanguageResult action creator", () => {
		it( "creates the updateInclusiveLanguageResult action", () => {
			const result = { id: "result", score: 3, description: "This is a bad score!", markingIsActive: false };

			const expected = {
				type: UPDATE_INCLUSIVE_LANGUAGE_RESULT,
				result: result,
			};
			const actual = updateInclusiveLanguageResult( result );
			expect( actual ).toEqual( expected );
		} );
	} );

	describe( "setOverallScore inclusive language action creator", () => {
		it( "creates the setOverallScore for inclusive language results action", () => {
			const overallScore = 3;

			const expected = {
				type: SET_OVERALL_INCLUSIVE_LANGUAGE_SCORE,
				overallScore: overallScore,
			};
			const actual = setOverallInclusiveLanguageScore( overallScore );
			expect( actual ).toEqual( expected );
		} );

		it( "updates the inclusive language score element's value", () => {
			const overallScore = 3;

			const inputElement = createInputElement( "hidden_wpseo_inclusive_language_score" );

			setOverallInclusiveLanguageScore( overallScore );
			expect( AnalysisFields.inclusiveLanguageScore ).toEqual( "3" );
			expect( inputElement.value ).toEqual( "3" );

			inputElement.remove();
		} );
	} );
} );
