import { useSelect } from "@wordpress/data";
import TextLength from "../../../src/insights/components/text-length";
import { render, screen } from "../../test-utils";

jest.mock( "@wordpress/data", () => ( { useSelect: jest.fn() } ) );

/**
 * Mocks the WordPress `useSelect` hook.
 *
 * @param {Object} textLength The result of text length research.
 *
 * @returns {function} The mock.
 */
const mockSelect = textLength => useSelect.mockImplementation( select => select( () => ( {
	getTextLength: () => textLength,
} ) ) );

beforeAll( () => {
	global.wpseoAdminL10n = {
		"shortlinks-insights-word_count": "https://example.com/link",
	};
} );
afterAll( () => {
	delete global.wpseoAdminL10n;
} );

describe( "TextLength", () => {
	it( "renders the text length measurements for words", () => {
		mockSelect( { count: 300, unit: "words" } );
		render( <TextLength /> );

		expect( screen.getByText( "Word count" ) ).toBeInTheDocument();

		const link = screen.getByText( "Learn more about word count" );
		expect( link ).toBeInTheDocument();
		expect( link.parentElement ).toBeInstanceOf( HTMLAnchorElement );
		expect( link.parentElement.href ).toBe( "https://example.com/link" );

		expect( screen.getByText( "300" ) ).toBeInTheDocument();
		expect( screen.getByText( "words" ) ).toBeInTheDocument();
	} );

	it( "renders the text length measurements for characters", () => {
		mockSelect( { count: 300, unit: "character" } );
		render( <TextLength /> );

		expect( screen.getByText( "Character count" ) ).toBeInTheDocument();

		const link = screen.getByText( "Learn more about character count" );
		expect( link ).toBeInTheDocument();
		expect( link.parentElement ).toBeInstanceOf( HTMLAnchorElement );
		expect( link.parentElement.href ).toBe( "https://example.com/link" );

		expect( screen.getByText( "300" ) ).toBeInTheDocument();
		expect( screen.getByText( "characters" ) ).toBeInTheDocument();
	} );
} );
