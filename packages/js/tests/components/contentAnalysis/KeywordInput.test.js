import { LocationProvider } from "@yoast/externals/contexts";
import KeywordInputDefault, { KeywordInput } from "../../../src/components/contentAnalysis/KeywordInput";
import { fireEvent, render, screen } from "../../test-utils";

jest.mock( "../../../src/containers/SEMrushRelatedKeyphrasesModal", () => {
	const { createElement } = require( "@wordpress/element" );
	return {
		__esModule: true,
		"default": ( { location, keyphrase } ) => createElement( "div", {
			"data-testid": "semrush-modal",
			"data-location": location,
			"data-keyphrase": keyphrase,
		} ),
	};
} );

jest.mock( "../../../src/components/MetaboxCollapsible", () => {
	const { createElement } = require( "@wordpress/element" );
	return {
		__esModule: true,
		"default": ( { children, title, id, initialIsOpen } ) => createElement(
			"div",
			{
				"data-testid": "metabox-collapsible",
				"data-id": id,
				"data-title": title,
				"data-initial-open": String( initialIsOpen ),
			},
			children
		),
	};
} );

jest.mock( "../../../src/components/SidebarCollapsible", () => {
	const { createElement } = require( "@wordpress/element" );
	return {
		__esModule: true,
		"default": ( { children, title, id, initialIsOpen } ) => createElement(
			"div",
			{
				"data-testid": "sidebar-collapsible",
				"data-id": id,
				"data-title": title,
				"data-initial-open": String( initialIsOpen ),
			},
			children
		),
	};
} );

jest.mock( "@wordpress/data", () => {
	const { createElement } = require( "@wordpress/element" );
	const mockSetFocusKeyword = jest.fn();
	const mockSetMarkerPauseStatus = jest.fn();
	const mockGetFocusKeyphrase = jest.fn( () => "store keyphrase" );
	const mockGetSEMrushNoKeyphraseMessage = jest.fn( () => false );
	const mockHasWincherNoKeyphrase = jest.fn( () => false );
	const mockGetFocusKeyphraseErrors = jest.fn( () => [] );

	return {
		__esModule: true,
		withSelect: ( mapSelect ) => ( Component ) => ( props ) => {
			const select = () => ( {
				getFocusKeyphrase: mockGetFocusKeyphrase,
				getSEMrushNoKeyphraseMessage: mockGetSEMrushNoKeyphraseMessage,
				hasWincherNoKeyphrase: mockHasWincherNoKeyphrase,
				getFocusKeyphraseErrors: mockGetFocusKeyphraseErrors,
			} );
			return createElement( Component, { ...mapSelect( select ), ...props } );
		},
		withDispatch: ( mapDispatch ) => ( Component ) => ( props ) => {
			const dispatch = () => ( {
				setFocusKeyword: mockSetFocusKeyword,
				setMarkerPauseStatus: mockSetMarkerPauseStatus,
			} );
			return createElement( Component, { ...mapDispatch( dispatch ), ...props } );
		},
		__mockSetFocusKeyword: mockSetFocusKeyword,
		__mockSetMarkerPauseStatus: mockSetMarkerPauseStatus,
		__mockGetFocusKeyphrase: mockGetFocusKeyphrase,
	};
} );

const dataMock = jest.requireMock( "@wordpress/data" );

beforeAll( () => {
	global.wpseoAdminL10n = { "shortlinks.focus_keyword_info": "https://example.com/focus_keyword_info" };
} );

afterAll( () => {
	delete global.wpseoAdminL10n;
} );

const renderWithLocation = ( ui, location ) => {
	if ( ! location ) {
		return render( ui );
	}
	return render( <LocationProvider value={ location }>{ ui }</LocationProvider> );
};

describe( "KeywordInput", () => {
	let props;

	beforeEach( () => {
		props = {
			onFocusKeyword: jest.fn(),
			onFocusKeywordChange: jest.fn(),
			onBlurKeyword: jest.fn(),
		};
	} );

	describe( "validation", () => {
		it( "shows the SEMrush 'no keyphrase' message when the keyphrase is empty and the flag is set", () => {
			render( <KeywordInput { ...props } displayNoKeyphraseMessage={ true } /> );

			const alert = screen.getByRole( "alert" );
			expect( alert ).toBeInTheDocument();
			expect( alert.textContent ).toBe( "Please enter a focus keyphrase first to get related keyphrases" );
		} );

		it( "shows the Wincher 'no keyphrase for tracking' message when the keyphrase is empty and the flag is set", () => {
			render( <KeywordInput { ...props } displayNoKeyphrasForTrackingMessage={ true } /> );

			const alert = screen.getByRole( "alert" );
			expect( alert ).toBeInTheDocument();
			expect( alert.textContent ).toBe( "Please enter a focus keyphrase first to track keyphrase performance" );
		} );

		it( "shows the comma error when the keyphrase contains a comma", () => {
			render( <KeywordInput { ...props } keyword="yoast seo," /> );

			const alert = screen.getByRole( "alert" );
			expect( alert ).toBeInTheDocument();
			expect( alert.textContent ).toBe( "Are you trying to use multiple keyphrases? You should add them separately below." );
		} );

		it( "shows the length error when the keyphrase exceeds 191 characters", () => {
			render( <KeywordInput
				{ ...props }
				keyword={ "yoast seo wordpress plugin to help improve your SEO through WordPress" +
					"yoast seo wordpress plugin to help improve your SEO through WordPress" +
					"yoast seo wordpress plugin to help improve your SEO through WordPress" }
			/> );

			const alert = screen.getByRole( "alert" );
			expect( alert ).toBeInTheDocument();
			expect( alert.textContent ).toBe( "Your keyphrase is too long. It can be a maximum of 191 characters." );
		} );

		it( "preserves errors that are passed in via the errors prop", () => {
			render( <KeywordInput { ...props } keyword="yoast seo" errors={ [ "Custom store error" ] } /> );

			const alert = screen.getByRole( "alert" );
			expect( alert ).toBeInTheDocument();
			expect( alert.textContent ).toBe( "Custom store error" );
		} );

		it( "renders multiple alerts when multiple validation rules trigger at once", () => {
			const longKeywordWithComma = "yoast seo,".repeat( 25 );

			render( <KeywordInput { ...props } keyword={ longKeywordWithComma } errors={ [ "Custom store error" ] } /> );

			const alerts = screen.getAllByRole( "alert" );
			expect( alerts ).toHaveLength( 3 );
			expect( alerts[ 0 ].textContent ).toBe( "Custom store error" );
			expect( alerts[ 1 ].textContent ).toBe( "Are you trying to use multiple keyphrases? You should add them separately below." );
			expect( alerts[ 2 ].textContent ).toBe( "Your keyphrase is too long. It can be a maximum of 191 characters." );
		} );

		it( "doesn't render any alerts when the keyphrase is valid and the store has no errors", () => {
			render( <KeywordInput { ...props } keyword="yoast seo" /> );

			expect( screen.queryByRole( "alert" ) ).not.toBeInTheDocument();
		} );

		it( "does not show the 'no keyphrase' messages when the keyphrase is not empty", () => {
			render( <KeywordInput
				{ ...props }
				keyword="yoast seo"
				displayNoKeyphraseMessage={ true }
				displayNoKeyphrasForTrackingMessage={ true }
			/> );

			expect( screen.queryByRole( "alert" ) ).not.toBeInTheDocument();
		} );

		it( "shows both 'no keyphrase' messages when keyphrase is empty and both flags are set", () => {
			render( <KeywordInput
				{ ...props }
				displayNoKeyphraseMessage={ true }
				displayNoKeyphrasForTrackingMessage={ true }
			/> );

			const alerts = screen.getAllByRole( "alert" );
			expect( alerts ).toHaveLength( 2 );
			expect( alerts[ 0 ].textContent ).toBe( "Please enter a focus keyphrase first to get related keyphrases" );
			expect( alerts[ 1 ].textContent ).toBe( "Please enter a focus keyphrase first to track keyphrase performance" );
		} );

		it( "treats a whitespace-only keyphrase as empty", () => {
			render( <KeywordInput { ...props } keyword="   " displayNoKeyphraseMessage={ true } /> );

			const alert = screen.getByRole( "alert" );
			expect( alert ).toBeInTheDocument();
			expect( alert.textContent ).toBe( "Please enter a focus keyphrase first to get related keyphrases" );
		} );
	} );

	describe( "collapsible selection", () => {
		it( "renders within the metabox collapsible when the location is metabox", () => {
			renderWithLocation( <KeywordInput { ...props } />, "metabox" );

			const collapsible = screen.getByTestId( "metabox-collapsible" );
			expect( collapsible ).toBeInTheDocument();
			expect( collapsible.getAttribute( "data-id" ) ).toBe( "yoast-focus-keyphrase-collapsible-metabox" );
			expect( collapsible.getAttribute( "data-title" ) ).toBe( "Focus keyphrase" );
			expect( collapsible.getAttribute( "data-initial-open" ) ).toBe( "true" );
			expect( screen.queryByTestId( "sidebar-collapsible" ) ).not.toBeInTheDocument();
			expect( document.getElementById( "focus-keyword-input-metabox" ) ).toBeInTheDocument();
		} );

		it( "renders within the sidebar collapsible when the location is sidebar", () => {
			renderWithLocation( <KeywordInput { ...props } />, "sidebar" );

			const collapsible = screen.getByTestId( "sidebar-collapsible" );
			expect( collapsible ).toBeInTheDocument();
			expect( collapsible.getAttribute( "data-id" ) ).toBe( "yoast-focus-keyphrase-collapsible-sidebar" );
			expect( collapsible.getAttribute( "data-title" ) ).toBe( "Focus keyphrase" );
			expect( collapsible.getAttribute( "data-initial-open" ) ).toBe( "true" );
			expect( screen.queryByTestId( "metabox-collapsible" ) ).not.toBeInTheDocument();
			expect( document.getElementById( "focus-keyword-input-sidebar" ) ).toBeInTheDocument();
		} );

		it( "falls back to the sidebar collapsible when no location is provided", () => {
			render( <KeywordInput { ...props } /> );

			expect( screen.getByTestId( "sidebar-collapsible" ) ).toBeInTheDocument();
			expect( screen.queryByTestId( "metabox-collapsible" ) ).not.toBeInTheDocument();
		} );

		it( "renders with an unknown location by defaulting to the sidebar collapsible", () => {
			renderWithLocation( <KeywordInput { ...props } />, "custom-location" );

			expect( screen.getByTestId( "sidebar-collapsible" ) ).toBeInTheDocument();
			expect( screen.queryByTestId( "metabox-collapsible" ) ).not.toBeInTheDocument();
			expect( document.getElementById( "focus-keyword-input-custom-location" ) ).toBeInTheDocument();
		} );
	} );

	describe( "SEMrush integration", () => {
		it( "renders the SEMrush modal when the integration is active", () => {
			renderWithLocation(
				<KeywordInput { ...props } keyword="yoast seo" isSEMrushIntegrationActive={ true } />,
				"sidebar"
			);

			const modal = screen.getByTestId( "semrush-modal" );
			expect( modal ).toBeInTheDocument();
			expect( modal.getAttribute( "data-location" ) ).toBe( "sidebar" );
			expect( modal.getAttribute( "data-keyphrase" ) ).toBe( "yoast seo" );

			const wrapper = modal.parentElement;
			expect( wrapper ).toHaveClass( "yst-root" );
			expect( wrapper ).toHaveClass( "yst-flex" );
			expect( wrapper ).toHaveClass( "yst-flex-col" );
			expect( wrapper ).toHaveClass( "yst-gap-2" );
		} );

		it( "renders the SEMrush modal with the metabox location", () => {
			renderWithLocation(
				<KeywordInput { ...props } keyword="test" isSEMrushIntegrationActive={ true } />,
				"metabox"
			);

			const modal = screen.getByTestId( "semrush-modal" );
			expect( modal ).toBeInTheDocument();
			expect( modal.getAttribute( "data-location" ) ).toBe( "metabox" );
			expect( modal.getAttribute( "data-keyphrase" ) ).toBe( "test" );
		} );

		it( "doesn't render the SEMrush modal when the integration is inactive and uses the basic wrapper class", () => {
			renderWithLocation( <KeywordInput { ...props } keyword="yoast seo" />, "sidebar" );

			expect( screen.queryByTestId( "semrush-modal" ) ).not.toBeInTheDocument();

			const input = document.getElementById( "focus-keyword-input-sidebar" );
			const wrapper = input.closest( ".yst-root" );
			expect( wrapper ).toHaveClass( "yst-root" );
			expect( wrapper ).not.toHaveClass( "yst-flex" );
			expect( wrapper ).not.toHaveClass( "yst-flex-col" );
			expect( wrapper ).not.toHaveClass( "yst-gap-2" );
		} );
	} );

	describe( "input event handlers", () => {
		it( "forwards the new value to onFocusKeywordChange when the input changes", () => {
			renderWithLocation( <KeywordInput { ...props } />, "sidebar" );

			const input = document.getElementById( "focus-keyword-input-sidebar" );
			fireEvent.change( input, { target: { value: "new keyphrase" } } );

			expect( props.onFocusKeywordChange ).toHaveBeenCalledTimes( 1 );
			expect( props.onFocusKeywordChange ).toHaveBeenCalledWith( "new keyphrase" );
		} );

		it( "calls onFocusKeyword when the input is focused", () => {
			renderWithLocation( <KeywordInput { ...props } />, "sidebar" );

			const input = document.getElementById( "focus-keyword-input-sidebar" );
			fireEvent.focus( input );

			expect( props.onFocusKeyword ).toHaveBeenCalledTimes( 1 );
		} );

		it( "calls onBlurKeyword when the input is blurred", () => {
			renderWithLocation( <KeywordInput { ...props } />, "sidebar" );

			const input = document.getElementById( "focus-keyword-input-sidebar" );
			fireEvent.blur( input );

			expect( props.onBlurKeyword ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( "description", () => {
		it( "renders the outbound learn-more link with the configured href", () => {
			render( <KeywordInput { ...props } /> );

			const link = screen.getByRole( "link", { name: /Learn more about best practices for keyphrases/i } );
			expect( link ).toBeInTheDocument();
			expect( link ).toHaveAttribute( "href", "https://example.com/focus_keyword_info" );
			expect( link ).toHaveAttribute( "target", "_blank" );
			expect( link ).toHaveAttribute( "rel", "noopener noreferrer" );
		} );

		it( "renders the description text about content discoverability", () => {
			render( <KeywordInput { ...props } /> );

			expect( screen.getByText( /Use the main word or phrase you want your content found for/ ) ).toBeInTheDocument();
		} );
	} );

	describe( "input attributes", () => {
		it( "renders the input with the correct placeholder and autoComplete attributes", () => {
			renderWithLocation( <KeywordInput { ...props } />, "sidebar" );

			const input = document.getElementById( "focus-keyword-input-sidebar" );
			expect( input ).toHaveAttribute( "placeholder", "Type here" );
			expect( input ).toHaveAttribute( "autocomplete", "off" );
		} );

		it( "renders the input with the provided keyword value", () => {
			renderWithLocation( <KeywordInput { ...props } keyword="test keyword" />, "sidebar" );

			const input = document.getElementById( "focus-keyword-input-sidebar" );
			expect( input ).toHaveValue( "test keyword" );
		} );

		it( "renders the input with an empty value by default", () => {
			renderWithLocation( <KeywordInput { ...props } />, "sidebar" );

			const input = document.getElementById( "focus-keyword-input-sidebar" );
			expect( input ).toHaveValue( "" );
		} );
	} );
} );

describe( "KeywordInput default export", () => {
	beforeEach( () => {
		dataMock.__mockSetFocusKeyword.mockClear();
		dataMock.__mockSetMarkerPauseStatus.mockClear();
		dataMock.__mockGetFocusKeyphrase.mockClear();
	} );

	it( "wires the focus keyphrase value from the store into the input", () => {
		render( <KeywordInputDefault /> );

		expect( dataMock.__mockGetFocusKeyphrase ).toHaveBeenCalled();

		const input = document.getElementById( "focus-keyword-input-location" );
		expect( input ).toHaveValue( "store keyphrase" );
	} );

	it( "dispatches setFocusKeyword on input change via the wired onFocusKeywordChange", () => {
		render( <KeywordInputDefault /> );

		const input = document.getElementById( "focus-keyword-input-location" );
		fireEvent.change( input, { target: { value: "next keyphrase" } } );

		expect( dataMock.__mockSetFocusKeyword ).toHaveBeenCalledTimes( 1 );
		expect( dataMock.__mockSetFocusKeyword ).toHaveBeenCalledWith( "next keyphrase" );
	} );

	it( "pauses and resumes the marker via setMarkerPauseStatus on focus and blur", () => {
		render( <KeywordInputDefault /> );

		const input = document.getElementById( "focus-keyword-input-location" );
		fireEvent.focus( input );
		fireEvent.blur( input );

		expect( dataMock.__mockSetMarkerPauseStatus ).toHaveBeenCalledTimes( 2 );
		expect( dataMock.__mockSetMarkerPauseStatus ).toHaveBeenNthCalledWith( 1, true );
		expect( dataMock.__mockSetMarkerPauseStatus ).toHaveBeenNthCalledWith( 2, false );
	} );
} );
