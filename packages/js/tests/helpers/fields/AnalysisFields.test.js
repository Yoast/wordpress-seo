import AnalysisFields from "../../../src/helpers/fields/AnalysisFields";
import { mockWindow } from "../../test-utils";

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

describe( "keyphrase", () => {
	const id = {
		terms: "hidden_wpseo_focuskw",
		posts: "yoast_wpseo_focuskw",
	};

	describe( "get keyphraseElement", () => {
		it( "returns null when no element is present", () => {
			expect( AnalysisFields.keyphraseElement ).toBeNull();
		} );

		it( "gets the element for non-posts by default", () => {
			const inputElement = createInputElement( id.terms );

			expect( AnalysisFields.keyphraseElement ).toBe( inputElement );

			inputElement.remove();
		} );

		it( "gets the element for posts", () => {
			const inputElement = createInputElement( id.posts );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: true } } );

			expect( AnalysisFields.keyphraseElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );

		it( "gets the element for non-posts", () => {
			const inputElement = createInputElement( id.terms );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: false } } );

			expect( AnalysisFields.keyphraseElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );
	} );

	describe( "get keyphrase", () => {
		it( "returns an empty string when no element is present", () => {
			expect( AnalysisFields.keyphrase ).toBe( "" );
		} );

		it( "gets the keyphrase", () => {
			const inputElement = createInputElement( id.terms );
			inputElement.value = "foo";

			expect( AnalysisFields.keyphrase ).toBe( "foo" );

			inputElement.remove();
		} );
	} );

	describe( "set keyphrase", () => {
		it( "does nothing when no element is present", () => {
			AnalysisFields.keyphrase = "foo";
			expect( AnalysisFields.keyphraseElement ).toBeNull();
		} );

		it( "sets the keyphrase", () => {
			const inputElement = createInputElement( id.terms );

			AnalysisFields.keyphrase = "foo";
			expect( AnalysisFields.keyphrase ).toBe( "foo" );

			inputElement.remove();
		} );
	} );
} );

describe( "isCornerstone", () => {
	const id = {
		terms: "hidden_wpseo_is_cornerstone",
		posts: "yoast_wpseo_is_cornerstone",
	};

	describe( "get isCornerstoneElement", () => {
		it( "returns null when no element is present", () => {
			expect( AnalysisFields.isCornerstoneElement ).toBeNull();
		} );

		it( "gets the element for non-posts by default", () => {
			const inputElement = createInputElement( id.terms );

			expect( AnalysisFields.isCornerstoneElement ).toBe( inputElement );

			inputElement.remove();
		} );

		it( "gets the element for posts", () => {
			const inputElement = createInputElement( id.posts );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: true } } );

			expect( AnalysisFields.isCornerstoneElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );

		it( "gets the element for non-posts", () => {
			const inputElement = createInputElement( id.terms );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: false } } );

			expect( AnalysisFields.isCornerstoneElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );
	} );

	describe( "get isCornerstone", () => {
		it( "returns false when no element is present", () => {
			expect( AnalysisFields.isCornerstone ).toBe( false );
		} );

		it( "gets isCornerstone", () => {
			const inputElement = createInputElement( id.terms );
			inputElement.value = "1";

			expect( AnalysisFields.isCornerstone ).toBe( true );

			inputElement.remove();
		} );
	} );

	describe( "set isCornerstone", () => {
		it( "does nothing when no element is present", () => {
			AnalysisFields.isCornerstone = true;
			expect( AnalysisFields.isCornerstoneElement ).toBeNull();
		} );

		test.each( [
			// Happy path with boolean.
			[ true, "1", true ],
			[ false, "0", false ],
			// Truthy with different types.
			[ true, "1", "string" ],
			[ true, "1", {} ],
			[ true, "1", [] ],
			[ true, "1", Object ],
			// Falsy with different types.
			[ false, "0", "" ],
			[ false, "0", null ],
			[ false, "0", undefined ],
		] )( "should return %s with the value %s when setting %s", ( expected, expectedValue, input ) => {
			const inputElement = createInputElement( id.terms );

			AnalysisFields.isCornerstone = input;
			expect( AnalysisFields.isCornerstone ).toBe( expected );
			expect( AnalysisFields.isCornerstoneElement?.value ).toBe( expectedValue );

			inputElement.remove();
		} );
	} );
} );

describe( "seoScore", () => {
	const id = {
		terms: "hidden_wpseo_linkdex",
		posts: "yoast_wpseo_linkdex",
	};

	describe( "get seoScoreElement", () => {
		it( "returns null when no element is present", () => {
			expect( AnalysisFields.seoScoreElement ).toBeNull();
		} );

		it( "gets the element for non-posts by default", () => {
			const inputElement = createInputElement( id.terms );

			expect( AnalysisFields.seoScoreElement ).toBe( inputElement );

			inputElement.remove();
		} );

		it( "gets the element for posts", () => {
			const inputElement = createInputElement( id.posts );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: true } } );

			expect( AnalysisFields.seoScoreElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );

		it( "gets the element for non-posts", () => {
			const inputElement = createInputElement( id.terms );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: false } } );

			expect( AnalysisFields.seoScoreElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );
	} );

	describe( "get seoScore", () => {
		it( "returns an empty string when no element is present", () => {
			expect( AnalysisFields.seoScore ).toBe( "" );
		} );

		it( "gets the seoScore", () => {
			const inputElement = createInputElement( id.terms );
			inputElement.value = "9";

			expect( AnalysisFields.seoScore ).toBe( "9" );

			inputElement.remove();
		} );
	} );

	describe( "set seoScore", () => {
		it( "does nothing when no element is present", () => {
			AnalysisFields.seoScore = "9";
			expect( AnalysisFields.seoScoreElement ).toBeNull();
		} );

		it( "sets the seoScore", () => {
			const inputElement = createInputElement( id.terms );

			AnalysisFields.seoScore = "9";
			expect( AnalysisFields.seoScore ).toBe( "9" );

			inputElement.remove();
		} );
	} );
} );

describe( "readabilityScore", () => {
	const id = {
		terms: "hidden_wpseo_content_score",
		posts: "yoast_wpseo_content_score",
	};

	describe( "get readabilityScoreElement", () => {
		it( "returns null when no element is present", () => {
			expect( AnalysisFields.readabilityScoreElement ).toBeNull();
		} );

		it( "gets the element for non-posts by default", () => {
			const inputElement = createInputElement( id.terms );

			expect( AnalysisFields.readabilityScoreElement ).toBe( inputElement );

			inputElement.remove();
		} );

		it( "gets the element for posts", () => {
			const inputElement = createInputElement( id.posts );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: true } } );

			expect( AnalysisFields.readabilityScoreElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );

		it( "gets the element for non-posts", () => {
			const inputElement = createInputElement( id.terms );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: false } } );

			expect( AnalysisFields.readabilityScoreElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );
	} );

	describe( "get readabilityScore", () => {
		it( "returns an empty string when no element is present", () => {
			expect( AnalysisFields.readabilityScore ).toBe( "" );
		} );

		it( "gets the readabilityScore", () => {
			const inputElement = createInputElement( id.terms );
			inputElement.value = "9";

			expect( AnalysisFields.readabilityScore ).toBe( "9" );

			inputElement.remove();
		} );
	} );

	describe( "set readabilityScore", () => {
		it( "does nothing when no element is present", () => {
			AnalysisFields.readabilityScore = "9";
			expect( AnalysisFields.readabilityScoreElement ).toBeNull();
		} );

		it( "sets the readabilityScore", () => {
			const inputElement = createInputElement( id.terms );

			AnalysisFields.readabilityScore = "9";
			expect( AnalysisFields.readabilityScore ).toBe( "9" );

			inputElement.remove();
		} );
	} );
} );

describe( "inclusiveLanguageScore", () => {
	const id = {
		terms: "hidden_wpseo_inclusive_language_score",
		posts: "yoast_wpseo_inclusive_language_score",
	};

	describe( "get inclusiveLanguageScoreElement", () => {
		it( "returns null when no element is present", () => {
			expect( AnalysisFields.inclusiveLanguageScoreElement ).toBeNull();
		} );

		it( "gets the element for non-posts by default", () => {
			const inputElement = createInputElement( id.terms );

			expect( AnalysisFields.inclusiveLanguageScoreElement ).toBe( inputElement );

			inputElement.remove();
		} );

		it( "gets the element for posts", () => {
			const inputElement = createInputElement( id.posts );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: true } } );

			expect( AnalysisFields.inclusiveLanguageScoreElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );

		it( "gets the element for non-posts", () => {
			const inputElement = createInputElement( id.terms );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: false } } );

			expect( AnalysisFields.inclusiveLanguageScoreElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );
	} );

	describe( "get inclusiveLanguageScore", () => {
		it( "returns an empty string when no element is present", () => {
			expect( AnalysisFields.inclusiveLanguageScore ).toBe( "" );
		} );

		it( "gets the inclusiveLanguageScore", () => {
			const inputElement = createInputElement( id.terms );
			inputElement.value = "9";

			expect( AnalysisFields.inclusiveLanguageScore ).toBe( "9" );

			inputElement.remove();
		} );
	} );

	describe( "set inclusiveLanguageScore", () => {
		it( "does nothing when no element is present", () => {
			AnalysisFields.inclusiveLanguageScore = "9";
			expect( AnalysisFields.inclusiveLanguageScoreElement ).toBeNull();
		} );

		it( "sets the inclusiveLanguageScore", () => {
			const inputElement = createInputElement( id.terms );

			AnalysisFields.inclusiveLanguageScore = "9";
			expect( AnalysisFields.inclusiveLanguageScore ).toBe( "9" );

			inputElement.remove();
		} );
	} );
} );
