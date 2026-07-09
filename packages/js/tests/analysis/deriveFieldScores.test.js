import { deriveMetaDescriptionScore, deriveSeoTitleScore, saveFieldScores } from "../../src/analysis/deriveFieldScores";
import AnalysisFields from "../../src/helpers/fields/AnalysisFields";

/**
 * Creates a minimal transported AssessmentResult stand-in.
 *
 * @param {string} identifier The assessment identifier.
 * @param {number} score      The 0-9 assessment score.
 *
 * @returns {Object} The result stand-in.
 */
const createResult = ( identifier, score ) => ( {
	_identifier: identifier,
	getScore: () => score,
	hasScore: () => true,
	hasText: () => true,
} );

describe( "deriveSeoTitleScore", () => {
	it( "averages the title assessments normalized to 0-100", () => {
		const results = [
			createResult( "titleWidth", 9 ),
			createResult( "keyphraseInSEOTitle", 9 ),
			// Unrelated results are ignored.
			createResult( "metaDescriptionLength", 1 ),
			createResult( "introductionKeyword", 3 ),
		];

		expect( deriveSeoTitleScore( results ) ).toBe( 100 );
	} );

	it( "rounds the normalized average", () => {
		// (6 + 9) / (2 * 9) * 100 = 83.33... -> 83.
		const results = [
			createResult( "titleWidth", 6 ),
			createResult( "keyphraseInSEOTitle", 9 ),
		];

		expect( deriveSeoTitleScore( results ) ).toBe( 83 );
	} );

	it( "computes the minimum possible score from the worst assessment results", () => {
		// (1 + 2) / (2 * 9) * 100 = 16.66... -> 17: a real score is never 0.
		const results = [
			createResult( "titleWidth", 1 ),
			createResult( "keyphraseInSEOTitle", 2 ),
		];

		expect( deriveSeoTitleScore( results ) ).toBe( 17 );
	} );

	it( "derives from a single matching result when the other is missing", () => {
		expect( deriveSeoTitleScore( [ createResult( "titleWidth", 9 ) ] ) ).toBe( 100 );
	} );

	it( "returns 0 when no results match", () => {
		expect( deriveSeoTitleScore( [ createResult( "introductionKeyword", 9 ) ] ) ).toBe( 0 );
	} );

	it( "returns 0 for empty or missing results", () => {
		expect( deriveSeoTitleScore( [] ) ).toBe( 0 );
		expect( deriveSeoTitleScore( undefined ) ).toBe( 0 );
	} );

	it( "ignores results without a score or text", () => {
		const invalid = {
			_identifier: "titleWidth",
			getScore: () => 9,
			hasScore: () => false,
			hasText: () => false,
		};

		expect( deriveSeoTitleScore( [ invalid ] ) ).toBe( 0 );
	} );
} );

describe( "deriveMetaDescriptionScore", () => {
	it( "averages the meta description assessments normalized to 0-100", () => {
		// (3 + 6) / (2 * 9) * 100 = 50.
		const results = [
			createResult( "metaDescriptionKeyword", 3 ),
			createResult( "metaDescriptionLength", 6 ),
			createResult( "titleWidth", 9 ),
		];

		expect( deriveMetaDescriptionScore( results ) ).toBe( 50 );
	} );

	it( "returns 0 when no results match", () => {
		expect( deriveMetaDescriptionScore( [ createResult( "titleWidth", 9 ) ] ) ).toBe( 0 );
	} );
} );

describe( "saveFieldScores", () => {
	/**
	 * Creates a hidden input element.
	 *
	 * @param {string} id The ID.
	 *
	 * @returns {HTMLInputElement} The input element.
	 */
	const createInputElement = ( id ) => {
		const inputElement = document.createElement( "input" );
		inputElement.id = id;
		document.body.appendChild( inputElement );

		return inputElement;
	};

	it( "writes both derived scores to their hidden fields", () => {
		const titleElement = createInputElement( "hidden_wpseo_seo_title_score" );
		const descriptionElement = createInputElement( "hidden_wpseo_meta_description_score" );

		saveFieldScores( [
			createResult( "titleWidth", 9 ),
			createResult( "keyphraseInSEOTitle", 9 ),
			createResult( "metaDescriptionKeyword", 3 ),
			createResult( "metaDescriptionLength", 6 ),
		] );

		expect( AnalysisFields.seoTitleScore ).toBe( "100" );
		expect( AnalysisFields.metaDescriptionScore ).toBe( "50" );

		titleElement.remove();
		descriptionElement.remove();
	} );

	it( "does not overwrite a saved score with the not-derivable 0", () => {
		const titleElement = createInputElement( "hidden_wpseo_seo_title_score" );
		titleElement.value = "63";

		saveFieldScores( [] );

		expect( AnalysisFields.seoTitleScore ).toBe( "63" );

		titleElement.remove();
	} );
} );
