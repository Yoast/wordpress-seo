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
	InlineBanner: ( { onDismiss, onDismissPermanently, onClick, isPremium, learnMoreLink } ) => (
		<div data-testid="inline-banner" data-is-premium={ isPremium } data-learn-more-link={ learnMoreLink }>
			<button data-testid="dismiss-btn" onClick={ onDismiss } />
			<button data-testid="dismiss-permanently-btn" onClick={ onDismissPermanently } />
			<button data-testid="click-btn" onClick={ onClick } />
		</div>
	),
} ) );

const mockFetchContentSuggestions = jest.fn();
jest.mock( "../../../src/ai-content-planner/hooks/use-fetch-content-suggestions", () => ( {
	useFetchContentSuggestions: () => mockFetchContentSuggestions,
} ) );

const mockHandleBannerTabNavigation = jest.fn();
jest.mock( "../../../src/ai-content-planner/helpers/handle-banner-tab-navigation", () => ( {
	handleBannerKeyNavigation: ( ...args ) => mockHandleBannerTabNavigation( ...args ),
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
const mockDismissBannerPermanently = jest.fn();

const setupMocks = ( overrides = {} ) => {
	const defaults = {
		isFirstBlock: true,
		isNewPost: true,
		isBannerDismissed: false,
		isBannerPermanentlyDismissed: false,
		isBannerRendered: false,
		bannerPermanentDismissalEndpoint: "yoast/v1/ai_content_planner/banner_permanent_dismissal",
		hasConsent: false,
		isPremium: false,
		minPostsMet: true,
		learnMoreLink: "https://yoa.st/content-planner-learn-more",
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
				selectIsBannerPermanentlyDismissed: () => values.isBannerPermanentlyDismissed,
				selectBannerPermanentDismissalEndpoint: () => values.bannerPermanentDismissalEndpoint,
				selectIsMinPostsMet: () => values.minPostsMet,
			};
		}
		if ( storeName === "yoast-seo/editor" ) {
			return { getIsPremium: () => values.isPremium, selectLink: () => values.learnMoreLink };
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
		dismissBannerPermanently: mockDismissBannerPermanently,
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

	test( "does not render the banner when it is permanently dismissed", () => {
		setupMocks( { isBannerPermanentlyDismissed: true } );
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

	test( "calls dismissBannerPermanently with the endpoint when the permanently-dismiss button is clicked", () => {
		setupMocks();
		const { getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		getByTestId( "dismiss-permanently-btn" ).click();
		expect( mockDismissBannerPermanently ).toHaveBeenCalledWith( "yoast/v1/ai_content_planner/banner_permanent_dismissal" );
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

	test( "wraps the banner in a div with the wp-block class so it inherits Gutenberg's per-block content-width rule", () => {
		// Regression guard: without this class, themes that constrain block width via the `.wp-block` selector
		// (rather than via direct children of `.is-layout-constrained`) render the banner full-canvas-width instead of matching adjacent blocks.
		setupMocks();
		const { getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		const wrapper = getByTestId( "inline-banner" ).parentElement;
		expect( wrapper ).toHaveClass( "wp-block" );
	} );

	test( "passes isPremium=true to the InlineBanner", () => {
		setupMocks( { isPremium: true } );
		const { getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		expect( getByTestId( "inline-banner" ).dataset.isPremium ).toBe( "true" );
	} );

	test( "passes learnMoreLink to the InlineBanner", () => {
		setupMocks();
		const { getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		expect( getByTestId( "inline-banner" ).dataset.learnMoreLink ).toBe( "https://yoa.st/content-planner-learn-more" );
	} );

	test( "forwards extra props to the wrapped BlockListBlock", () => {
		setupMocks();
		const { getByTestId } = render( <WithInlineBanner clientId="client-1" data-custom="yes" /> );

		expect( getByTestId( "block-list-block" ) ).toHaveAttribute( "data-custom", "yes" );
	} );

	describe( "tab navigation effect", () => {
		const makeTabRef = ( mockDoc ) => {
			const ref = {};
			Object.defineProperty( ref, "current", {
				get: () => ( { ownerDocument: mockDoc } ),
				set: () => {},
				configurable: true,
			} );
			return ref;
		};

		const makeMockDoc = () => ( {
			getElementById: jest.fn().mockReturnValue( null ),
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
		} );

		test( "registers a capture-phase keydown listener when the banner is visible", () => {
			const mockDoc = makeMockDoc();
			useRef.mockReturnValue( makeTabRef( mockDoc ) );
			setupMocks();
			render( <WithInlineBanner clientId="client-1" /> );

			expect( mockDoc.addEventListener ).toHaveBeenCalledWith( "keydown", expect.any( Function ), { capture: true } );
		} );

		test( "removes the keydown listener when the component unmounts", () => {
			const mockDoc = makeMockDoc();
			useRef.mockReturnValue( makeTabRef( mockDoc ) );
			setupMocks();
			const { unmount } = render( <WithInlineBanner clientId="client-1" /> );

			unmount();

			expect( mockDoc.removeEventListener ).toHaveBeenCalledWith( "keydown", expect.any( Function ), { capture: true } );
		} );

		test( "does not register a keydown listener when the banner is not shown", () => {
			const mockDoc = makeMockDoc();
			useRef.mockReturnValue( makeTabRef( mockDoc ) );
			setupMocks( { isBannerDismissed: true } );
			render( <WithInlineBanner clientId="client-1" /> );

			expect( mockDoc.addEventListener ).not.toHaveBeenCalled();
		} );

		test( "does nothing when ref.current has no ownerDocument", () => {
			// makeTabRef with a null ownerDoc hits the !ownerDoc guard on line 85.
			const nullDocRef = {};
			Object.defineProperty( nullDocRef, "current", {
				get: () => ( { ownerDocument: null } ),
				set: () => {},
				configurable: true,
			} );
			useRef.mockReturnValue( nullDocRef );
			setupMocks();

			expect( () => render( <WithInlineBanner clientId="client-1" /> ) ).not.toThrow();
		} );

		test( "invokes handleBannerTabNavigation when the registered keydown handler fires", () => {
			const mockDoc = makeMockDoc();
			useRef.mockReturnValue( makeTabRef( mockDoc ) );
			setupMocks();
			render( <WithInlineBanner clientId="client-1" /> );

			const [ , registeredHandler ] = mockDoc.addEventListener.mock.calls.find( ( [ type ] ) => type === "keydown" );
			const mockEvent = { key: "Tab", target: document.body, defaultPrevented: false };
			registeredHandler( mockEvent );

			expect( mockHandleBannerTabNavigation ).toHaveBeenCalledWith( expect.objectContaining( { ownerDocument: mockDoc } ), mockEvent );
		} );
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
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
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
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
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
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
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

