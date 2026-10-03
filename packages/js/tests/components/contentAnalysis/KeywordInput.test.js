import { KeywordInput } from "../../../src/components/contentAnalysis/KeywordInput";
import { fireEvent, render, screen } from "../../test-utils";

const baseProps = {
	location: "sidebar",
	keyword: "",
	handleChange: jest.fn(),
	onFocusKeyword: jest.fn(),
	onBlurKeyword: jest.fn(),
	validation: null,
};

beforeAll( () => {
	global.wpseoAdminL10n = { "shortlinks.focus_keyword_info": "https://example.com/focus_keyword_info" };
} );

afterAll( () => {
	delete global.wpseoAdminL10n;
} );

describe( "KeywordInput (presentational)", () => {
	let props;

	beforeEach( () => {
		props = { ...baseProps, handleChange: jest.fn(), onFocusKeyword: jest.fn(), onBlurKeyword: jest.fn() };
	} );

	it( "renders the TextField with a location-scoped id, placeholder and autoComplete=off", () => {
		render( <KeywordInput { ...props } location="metabox" /> );

		const input = document.getElementById( "focus-keyword-input-metabox" );
		expect( input ).toBeInTheDocument();
		expect( input ).toHaveAttribute( "placeholder", "Type here" );
		expect( input ).toHaveAttribute( "autocomplete", "off" );
	} );

	it( "forwards the keyword value into the input", () => {
		render( <KeywordInput { ...props } keyword="my phrase" /> );

		expect( document.getElementById( "focus-keyword-input-sidebar" ) ).toHaveValue( "my phrase" );
	} );

	it( "calls handleChange with the raw event when the input changes", () => {
		let receivedValue = null;
		const handleChange = jest.fn( ( event ) => {
			receivedValue = event.target.value;
		} );

		render( <KeywordInput { ...props } handleChange={ handleChange } /> );

		const input = document.getElementById( "focus-keyword-input-sidebar" );
		fireEvent.change( input, { target: { value: "next" } } );

		expect( handleChange ).toHaveBeenCalledTimes( 1 );
		expect( receivedValue ).toBe( "next" );
	} );

	it( "calls onFocusKeyword on focus and onBlurKeyword on blur", () => {
		render( <KeywordInput { ...props } /> );

		const input = document.getElementById( "focus-keyword-input-sidebar" );
		fireEvent.focus( input );
		fireEvent.blur( input );

		expect( props.onFocusKeyword ).toHaveBeenCalledTimes( 1 );
		expect( props.onBlurKeyword ).toHaveBeenCalledTimes( 1 );
	} );

	it( "renders the validation message when validation is provided", () => {
		const validation = {
			variant: "error",
			message: <span role="alert">Something is wrong</span>,
		};

		render( <KeywordInput { ...props } validation={ validation } /> );

		const alert = screen.getByRole( "alert" );
		expect( alert ).toBeInTheDocument();
		expect( alert.textContent ).toBe( "Something is wrong" );
	} );

	it( "renders no validation message when validation is null", () => {
		render( <KeywordInput { ...props } validation={ null } /> );

		expect( screen.queryByRole( "alert" ) ).not.toBeInTheDocument();
	} );

	it( "renders the description with an outbound learn-more link to the configured shortlink", () => {
		render( <KeywordInput { ...props } /> );

		const link = screen.getByRole( "link", { name: /Learn more about best practices for keyphrases/i } );
		expect( link ).toHaveAttribute( "href", "https://example.com/focus_keyword_info" );
		expect( link ).toHaveAttribute( "target", "_blank" );
		expect( link ).toHaveAttribute( "rel", "noopener noreferrer" );
	} );
} );
