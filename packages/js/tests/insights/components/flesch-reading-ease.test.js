import { useSelect } from "@wordpress/data";
import { DIFFICULTY } from "yoastseo";
import FleschReadingEase from "../../../src/insights/components/flesch-reading-ease";
import { render, screen } from "../../test-utils";

jest.mock( "@wordpress/data", () => ( { useSelect: jest.fn() } ) );

/**
 * Mocks the WordPress `useSelect` hook.
 *
 * @param {number} score The Flesch reading ease score to use.
 * @param {DIFFICULTY} difficulty The Flesch reading ease difficulty to use.
 *
 * @returns {function} The mock.
 */
const mockSelect = ( score, difficulty ) => useSelect.mockImplementation( select => select( () => ( {
	getFleschReadingEaseScore: () => score,
	getFleschReadingEaseDifficulty: () => difficulty,
} ) ) );

beforeAll( () => {
	global.wpseoAdminL10n = {
		"shortlinks-insights-flesch_reading_ease": "https://example.org/link",
		"shortlinks-insights-flesch_reading_ease_article": "https://example.org/article",
	};
} );
afterAll( () => {
	delete global.wpseoAdminL10n;
} );

describe( "FleschReadingEase", () => {
	afterEach( () => {
		useSelect.mockRestore();
	} );

	it( "renders the title, help link and unit", () => {
		mockSelect( 0, DIFFICULTY.NO_DATA );

		render( <FleschReadingEase /> );

		expect( screen.getByText( "Flesch reading ease" ) ).toBeInTheDocument();

		const link = screen.getByText( "Learn more about Flesch reading ease" );
		expect( link ).toBeInTheDocument();
		expect( link.parentElement ).toBeInstanceOf( HTMLAnchorElement );
		expect( link.parentElement.href ).toBe( "https://example.org/link" );

		expect( screen.getByText( "out of 100" ) ).toBeInTheDocument();
	} );

	test.each( [
		[ "very easy", 90, DIFFICULTY.VERY_EASY, "The copy scores 90 in the test, which is considered very easy to read. Good job!", "" ],
		[ "easy", 80, DIFFICULTY.EASY, "The copy scores 80 in the test, which is considered easy to read. Good job!", "" ],
		[ "fairly easy", 70, DIFFICULTY.FAIRLY_EASY, "The copy scores 70 in the test, which is considered fairly easy to read. Good job!", "" ],
		[ "okay", 60, DIFFICULTY.OKAY, "The copy scores 60 in the test, which is considered okay to read. Good job!", "" ],
		[
			"fairly difficult",
			50,
			DIFFICULTY.FAIRLY_DIFFICULT,
			"The copy scores 50 in the test, which is considered fairly difficult to read.",
			"Try to make shorter sentences, using less difficult words to improve readability.",
		],
		[
			"difficult",
			30,
			DIFFICULTY.DIFFICULT,
			"The copy scores 30 in the test, which is considered difficult to read.",
			"Try to make shorter sentences, using less difficult words to improve readability.",
		],
		[
			"very difficult",
			10,
			DIFFICULTY.VERY_DIFFICULT,
			"The copy scores 10 in the test, which is considered very difficult to read.",
			"Try to make shorter sentences, using less difficult words to improve readability.",
		],
	] )( "renders the component when the text is considered %s.", ( title, score, difficulty, description, ctaText ) => {
		mockSelect( score, difficulty );

		render( <FleschReadingEase /> );

		// Test the description feedback string.
		expect( screen.getByText( description ) ).toBeInTheDocument();

		// Test the call to action string of the feedback.
		if ( ctaText ) {
			const cta = screen.getByText( ctaText );
			expect( cta ).toBeInTheDocument();
			expect( cta ).toBeInstanceOf( HTMLAnchorElement );
			expect( cta.href ).toBe( "https://example.org/article" );
		}

		// Test the score.
		expect( screen.getByText( score.toString() ) ).toBeInTheDocument();
	} );
} );
