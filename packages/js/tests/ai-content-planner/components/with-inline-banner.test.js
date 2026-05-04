import { render } from "../../test-utils";
import { useSelect, useDispatch } from "@wordpress/data";
import { useRef } from "@wordpress/element";
import { withInlineBanner } from "../../../src/ai-content-planner/components/with-inline-banner";

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn(),
	useDispatch: jest.fn(),
} ) );

jest.mock( "@wordpress/compose", () => ( {
	createHigherOrderComponent: ( fn ) => fn,
} ) );

jest.mock( "@wordpress/element", () => ( {
	...jest.requireActual( "@wordpress/element" ),
	useRef: jest.fn(),
} ) );

jest.mock( "../../../src/ai-content-planner/components/inline-banner", () => ( {
	InlineBanner: ( { onDismiss, onClick, isPremium } ) => (
		<div data-testid="inline-banner" data-is-premium={ isPremium }>
			<button data-testid="dismiss-btn" onClick={ onDismiss } />
			<button data-testid="click-btn" onClick={ onClick } />
		</div>
	),
} ) );

const mockFetchContentSuggestions = jest.fn();
jest.mock( "../../../src/ai-content-planner/hooks/use-fetch-content-suggestions", () => ( {
	useFetchContentSuggestions: () => mockFetchContentSuggestions,
} ) );

jest.mock( "../../../src/ai-content-planner/constants", () => ( {
	CONTENT_PLANNER_STORE: "yoast-seo/content-planner",
	FEATURE_MODAL_STATUS: { consent: "consent" },
	INJECTED_STYLE_ID: "yoast-seo-tailwind-css",
} ) );

jest.mock( "../../../src/ai-generator/constants", () => ( {
	STORE_NAME_AI: "yoast-seo/ai-generator",
	STORE_NAME_EDITOR: "yoast-seo/editor",
} ) );

const MockBlockListBlock = ( props ) => <div data-testid="block-list-block" { ...props } />;

const mockSetFeatureModalStatus = jest.fn();
const mockSetBannerDismissed = jest.fn();
const mockSetBannerRendered = jest.fn();

const setupMocks = ( overrides = {} ) => {
	const defaults = {
		isFirstBlock: true,
		isNewPost: true,
		isBannerDismissed: false,
		isBannerRendered: false,
		hasConsent: false,
		isPremium: false,
		minPostsMet: true,
	};
	const values = { ...defaults, ...overrides };

	useSelect.mockImplementation( ( selector ) => selector( ( storeName ) => {
		if ( storeName === "core/block-editor" ) {
			return { getBlockOrder: () => values.isFirstBlock ? [ "client-1" ] : [ "other" ] };
		}
		if ( storeName === "core/editor" ) {
			return { isEditedPostNew: () => values.isNewPost };
		}
		if ( storeName === "yoast-seo/content-planner" ) {
			return {
				selectIsBannerDismissed: () => values.isBannerDismissed,
				selectIsBannerRendered: () => values.isBannerRendered,
				selectIsMinPostsMet: () => values.minPostsMet,
			};
		}
		if ( storeName === "yoast-seo/editor" ) {
			return { getIsPremium: () => values.isPremium };
		}
		if ( storeName === "yoast-seo/ai-generator" ) {
			return { selectHasAiGeneratorConsent: () => values.hasConsent };
		}
		return {};
	} ) );

	useDispatch.mockReturnValue( {
		setFeatureModalStatus: mockSetFeatureModalStatus,
		setBannerDismissed: mockSetBannerDismissed,
		setBannerRendered: mockSetBannerRendered,
	} );
};

// withInlineBanner is already unwrapped by our createHigherOrderComponent mock, so it's (BlockListBlock) => Component
const WithInlineBanner = withInlineBanner( MockBlockListBlock );

describe( "withInlineBanner", () => {
	beforeEach( () => {
		jest.clearAllMocks();
		// Restore useRef to its default behaviour so it does not affect unrelated tests.
		useRef.mockImplementation( ( init ) => ( { current: init } ) );
	} );

	test( "renders the banner when conditions are met on a new post", () => {
		setupMocks();
		const { getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		expect( getByTestId( "inline-banner" ) ).toBeInTheDocument();
		expect( getByTestId( "block-list-block" ) ).toBeInTheDocument();
	} );

	test( "does not render the banner when it is dismissed", () => {
		setupMocks( { isBannerDismissed: true } );
		const { queryByTestId, getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		expect( queryByTestId( "inline-banner" ) ).not.toBeInTheDocument();
		expect( getByTestId( "block-list-block" ) ).toBeInTheDocument();
	} );

	test( "does not render the banner when not the first block", () => {
		setupMocks( { isFirstBlock: false } );
		const { queryByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		expect( queryByTestId( "inline-banner" ) ).not.toBeInTheDocument();
	} );

	test( "does not render the banner when minPostsMet is false", () => {
		setupMocks( { minPostsMet: false } );
		const { queryByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		expect( queryByTestId( "inline-banner" ) ).not.toBeInTheDocument();
	} );

	test( "renders the banner on an existing post when isBannerRendered is true", () => {
		setupMocks( { isNewPost: false, isBannerRendered: true } );
		const { getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		expect( getByTestId( "inline-banner" ) ).toBeInTheDocument();
	} );

	test( "does not render the banner on an existing post when isBannerRendered is false", () => {
		setupMocks( { isNewPost: false, isBannerRendered: false } );
		const { queryByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		expect( queryByTestId( "inline-banner" ) ).not.toBeInTheDocument();
	} );

	test( "calls setBannerDismissed when dismiss button is clicked", () => {
		setupMocks();
		const { getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		getByTestId( "dismiss-btn" ).click();
		expect( mockSetBannerDismissed ).toHaveBeenCalledTimes( 1 );
	} );

	test( "calls fetchContentSuggestions when click button is clicked and has consent", () => {
		setupMocks( { hasConsent: true } );
		const { getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		getByTestId( "click-btn" ).click();
		expect( mockFetchContentSuggestions ).toHaveBeenCalledTimes( 1 );
	} );

	test( "opens consent modal when click button is clicked without consent", () => {
		setupMocks( { hasConsent: false } );
		const { getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		getByTestId( "click-btn" ).click();
		expect( mockSetFeatureModalStatus ).toHaveBeenCalledWith( "consent" );
	} );

	test( "calls setBannerRendered when banner is shown for the first time", () => {
		setupMocks( { isBannerRendered: false } );
		render( <WithInlineBanner clientId="client-1" /> );

		expect( mockSetBannerRendered ).toHaveBeenCalledTimes( 1 );
	} );

	test( "does not call setBannerRendered when banner was already rendered", () => {
		setupMocks( { isBannerRendered: true } );
		render( <WithInlineBanner clientId="client-1" /> );

		expect( mockSetBannerRendered ).not.toHaveBeenCalled();
	} );

	test( "always renders the BlockListBlock", () => {
		setupMocks( { isBannerDismissed: true } );
		const { getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		expect( getByTestId( "block-list-block" ) ).toBeInTheDocument();
	} );

	test( "passes isPremium=true to the InlineBanner", () => {
		setupMocks( { isPremium: true } );
		const { getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		expect( getByTestId( "inline-banner" ).dataset.isPremium ).toBe( "true" );
	} );

	describe( "stylesheet injection effect", () => {
		const STYLE_ID = "yoast-seo-tailwind-css";

		const makeIframeRef = ( mockDoc ) => {
			const ref = {};
			Object.defineProperty( ref, "current", {
				get: () => ( { ownerDocument: mockDoc } ),
				/* no-op: prevents React from overwriting with the real DOM node */
				set: () => {},
				configurable: true,
			} );
			return ref;
		};

		test( "does nothing when the style is already present in the iframe document", () => {
			const mockDoc = {
				getElementById: jest.fn().mockReturnValue( { id: STYLE_ID } ),
				createElement: jest.fn(),
				head: { appendChild: jest.fn() },
			};
			useRef.mockReturnValue( makeIframeRef( mockDoc ) );
			setupMocks();
			render( <WithInlineBanner clientId="client-1" /> );

			expect( mockDoc.createElement ).not.toHaveBeenCalled();
		} );

		test( "does nothing when the main link element is absent from window.document", () => {
			const mockDoc = {
				getElementById: jest.fn().mockReturnValue( null ),
				createElement: jest.fn(),
				head: { appendChild: jest.fn() },
			};
			useRef.mockReturnValue( makeIframeRef( mockDoc ) );
			setupMocks();
			render( <WithInlineBanner clientId="client-1" /> );

			expect( mockDoc.createElement ).not.toHaveBeenCalled();
		} );

		test( "injects a cloned stylesheet link when ownerDoc is a separate iframe document", () => {
			const mockLink = { id: "", rel: "", href: "" };
			const mockDoc = {
				getElementById: jest.fn().mockReturnValue( null ),
				createElement: jest.fn().mockReturnValue( mockLink ),
				head: { appendChild: jest.fn() },
			};

			useRef.mockReturnValue( makeIframeRef( mockDoc ) );

			const mainLink = document.createElement( "link" );
			mainLink.id = STYLE_ID;
			mainLink.href = "https://example.com/tailwind.css";
			document.head.appendChild( mainLink );

			setupMocks();
			render( <WithInlineBanner clientId="client-1" /> );

			expect( mockDoc.createElement ).toHaveBeenCalledWith( "link" );
			expect( mockLink.id ).toBe( STYLE_ID );
			expect( mockLink.rel ).toBe( "stylesheet" );
			expect( mockLink.href ).toBe( "https://example.com/tailwind.css" );
			expect( mockDoc.head.appendChild ).toHaveBeenCalledWith( mockLink );

			document.head.removeChild( mainLink );
		} );
	} );
} );

