import { render } from "../../test-utils";
import { useSelect, useDispatch } from "@wordpress/data";
import { useRef } from "@wordpress/element";
import { withInlineBanner } from "../../../src/ai-content-planner/components/with-inline-banner";

jest.mock( "@yoast/ui-library", () => {
	const { Component, createElement } = require( "react" );
	/**
	 * Mock ErrorBoundary component for testing.
	 */
	class ErrorBoundary extends Component {
		/**
		 * Initializes the ErrorBoundary component.
		 *
		 * @param {Object} props Component props.
		 */
		constructor( props ) {
			super( props );
			this.state = { hasError: false };
		}

		/**
		 * Updates state when an error is caught by the boundary.
		 *
		 * @returns {Object} New state with hasError flag set to true.
		 */
		static getDerivedStateFromError() {
			return { hasError: true };
		}

		/**
		 * Renders the component or fallback based on error state.
		 *
		 * @returns {Object} The fallback component, children, or null.
		 */
		render() {
			if ( this.state.hasError ) {
				const { FallbackComponent } = this.props;
				return FallbackComponent ? createElement( FallbackComponent ) : null;
			}
			return this.props.children;
		}
	}
	return { ErrorBoundary };
} );

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

/**
 * Spy-based stand-in for InlineBanner.
 *
 * Defined as a jest.fn() so individual tests can override its implementation
 * (e.g. to throw) and have it restored by beforeEach without re-requiring the module.
 *
 * @type {jest.Mock}
 */
const mockInlineBanner = jest.fn( ( { onDismiss, onDismissPermanently, onClick, isPremium, learnMoreLink } ) => (
	<div data-testid="inline-banner" data-is-premium={ isPremium } data-learn-more-link={ learnMoreLink }>
		<button data-testid="dismiss-btn" onClick={ onDismiss } />
		<button data-testid="dismiss-permanently-btn" onClick={ onDismissPermanently } />
		<button data-testid="click-btn" onClick={ onClick } />
	</div>
) );

jest.mock( "../../../src/ai-content-planner/components/inline-banner", () => ( {
	// Use a getter so tests can swap mockInlineBanner's implementation without re-requiring the module.
	get InlineBanner() {
		return mockInlineBanner;
	},
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

/**
 * Minimal stand-in for the Gutenberg BlockListBlock component passed to the HOC.
 *
 * @param {Object} props Component props.
 * @returns {Object} A div element with test ID and forwarded props.
 */
const MockBlockListBlock = ( props ) => <div data-testid="block-list-block" { ...props } />;

const mockSetFeatureModalStatus = jest.fn();
const mockSetBannerDismissed = jest.fn();
const mockSetBannerRendered = jest.fn();
const mockDismissBannerPermanently = jest.fn();

/**
 * Configures the useSelect and useDispatch mocks for a typical render scenario.
 *
 * All store values default to a state where the banner is visible on a new post.
 * Pass an `overrides` object to deviate from those defaults for a specific test.
 *
 * @param {Object}  [overrides]                           Per-test store value overrides.
 * @param {boolean} [overrides.isFirstBlock=true]         Whether the rendered block is the first in the canvas.
 * @param {boolean} [overrides.isNewPost=true]            Whether the post is new (not yet saved).
 * @param {string}  [overrides.postType="post"]           The current post type (e.g. "post", "wp_template").
 * @param {string}  [overrides.renderingMode="post-only"] The editor rendering mode (e.g. "post-only", "template-locked").
 * @param {boolean} [overrides.isBannerDismissed=false]   Whether the banner has been dismissed for this session.
 * @param {boolean} [overrides.isBannerPermanentlyDismissed=false] Whether the banner has been permanently dismissed.
 * @param {boolean} [overrides.isBannerRendered=false]    Whether the banner has been persisted to the post meta.
 * @param {string}  [overrides.bannerPermanentDismissalEndpoint] REST endpoint for permanent dismissal.
 * @param {boolean} [overrides.hasConsent=false]          Whether the user has granted AI consent.
 * @param {boolean} [overrides.isPremium=false]           Whether the site has a Premium subscription.
 * @param {boolean} [overrides.minPostsMet=true]          Whether the minimum-posts threshold for the feature is met.
 * @param {string}  [overrides.learnMoreLink]             URL for the "learn more" link in the banner.
 */
const setupMocks = ( overrides = {} ) => {
	const defaults = {
		isFirstBlock: true,
		isNewPost: true,
		postType: "post",
		renderingMode: "post-only",
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
			return {
				isEditedPostNew: () => values.isNewPost,
				getCurrentPostType: () => values.postType,
				getRenderingMode: () => values.renderingMode,
			};
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

// createHigherOrderComponent is mocked to be an identity function, so withInlineBanner
// is unwrapped to (BlockListBlock) => Component and can be called directly in tests.
const WithInlineBanner = withInlineBanner( MockBlockListBlock );

describe( "withInlineBanner", () => {
	beforeEach( () => {
		jest.clearAllMocks();
		// Restore useRef to its default behaviour so it does not affect unrelated tests.
		useRef.mockImplementation( ( init ) => ( { current: init } ) );
		// Restore InlineBanner to its default implementation after tests that override it.
		mockInlineBanner.mockImplementation( ( { onDismiss, onDismissPermanently, onClick, isPremium, learnMoreLink } ) => (
			<div data-testid="inline-banner" data-is-premium={ isPremium } data-learn-more-link={ learnMoreLink }>
				<button data-testid="dismiss-btn" onClick={ onDismiss } />
				<button data-testid="dismiss-permanently-btn" onClick={ onDismissPermanently } />
				<button data-testid="click-btn" onClick={ onClick } />
			</div>
		) );
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

	test( "does not render the banner when editing a wp_template", () => {
		setupMocks( { postType: "wp_template" } );
		const { queryByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		expect( queryByTestId( "inline-banner" ) ).not.toBeInTheDocument();
	} );

	test( "does not render the banner when editing a wp_template_part", () => {
		setupMocks( { postType: "wp_template_part" } );
		const { queryByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		expect( queryByTestId( "inline-banner" ) ).not.toBeInTheDocument();
	} );

	test( "does not render the banner when the rendering mode is template-locked (Settings > Template > Show template)", () => {
		setupMocks( { renderingMode: "template-locked" } );
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

	test( "sets the data-block attribute on the banner wrapper div", () => {
		setupMocks();
		const { getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

		const wrapper = getByTestId( "inline-banner" ).parentElement;
		expect( wrapper ).toHaveAttribute( "data-block", "yoast-content-planner-banner" );
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

	/**
	 * Creates a minimal fake ownerDocument with jest.fn() stubs for the
	 * methods used by the mousedown and keydown effects.
	 *
	 * @returns {{ getElementById: jest.Mock, addEventListener: jest.Mock, removeEventListener: jest.Mock }} Fake document.
	 */
	const makeMockDoc = () => ( {
		getElementById: jest.fn().mockReturnValue( null ),
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
	} );

	describe( "mousedown effect", () => {
		/**
		 * Builds a ref whose `current` has `ownerDocument` and a `querySelector` that returns
		 * different elements based on the selector, so we can exercise `isClickOutsideDropdown`.
		 *
		 * @param {object} mockDoc             The fake ownerDocument.
		 * @param {object} [opts]              Per-selector overrides.
		 * @param {object} [opts.triggerExpandedEl] Returned for `[aria-expanded='true']` selector.
		 * @param {object} [opts.menuEl]        Returned for `[role='menu']` selector.
		 * @param {object} [opts.triggerEl]     Returned for the plain trigger selector (used to call .click()).
		 * @returns {object} A mocked ref.
		 */
		const makeBannerRef = ( mockDoc, { triggerExpandedEl = null, menuEl = null, triggerEl = null } = {} ) => {
			const el = {
				ownerDocument: mockDoc,
				querySelector: jest.fn( ( selector ) => {
					if ( selector === ".yst-dropdown-menu__icon-trigger[aria-expanded='true']" ) {
						return triggerExpandedEl;
					}
					if ( selector === "[role='menu']" ) {
						return menuEl;
					}
					if ( selector === ".yst-dropdown-menu__icon-trigger" ) {
						return triggerEl;
					}
					return null;
				} ),
			};
			const ref = {};
			Object.defineProperty( ref, "current", { get: () => el, set: () => {}, configurable: true } );
			return ref;
		};

		test( "registers a capture-phase mousedown listener when the banner is visible", () => {
			const mockDoc = makeMockDoc();
			useRef.mockReturnValue( makeBannerRef( mockDoc ) );
			setupMocks();
			render( <WithInlineBanner clientId="client-1" /> );

			expect( mockDoc.addEventListener ).toHaveBeenCalledWith( "mousedown", expect.any( Function ), { capture: true } );
		} );

		test( "removes the mousedown listener when the component unmounts", () => {
			const mockDoc = makeMockDoc();
			useRef.mockReturnValue( makeBannerRef( mockDoc ) );
			setupMocks();
			const { unmount } = render( <WithInlineBanner clientId="client-1" /> );

			unmount();

			expect( mockDoc.removeEventListener ).toHaveBeenCalledWith( "mousedown", expect.any( Function ), { capture: true } );
		} );

		test( "does not register a mousedown listener when the banner is not shown", () => {
			const mockDoc = makeMockDoc();
			useRef.mockReturnValue( makeBannerRef( mockDoc ) );
			setupMocks( { isBannerDismissed: true } );
			render( <WithInlineBanner clientId="client-1" /> );

			expect( mockDoc.addEventListener ).not.toHaveBeenCalled();
		} );

		test( "clicks the trigger to close the dropdown when mousedown fires outside both trigger and menu", () => {
			const mockClick = jest.fn();
			const triggerExpandedEl = { contains: jest.fn().mockReturnValue( false ), click: mockClick };
			const triggerEl = { click: mockClick };
			const menuEl = { contains: jest.fn().mockReturnValue( false ) };
			const mockDoc = makeMockDoc();
			useRef.mockReturnValue( makeBannerRef( mockDoc, { triggerExpandedEl, menuEl, triggerEl } ) );
			setupMocks();
			render( <WithInlineBanner clientId="client-1" /> );

			const [ , handler ] = mockDoc.addEventListener.mock.calls.find( ( [ type ] ) => type === "mousedown" );
			handler( { target: document.body } );

			expect( mockClick ).toHaveBeenCalledTimes( 1 );
		} );

		test( "does not close the dropdown when mousedown is inside the trigger", () => {
			const mockClick = jest.fn();
			const triggerExpandedEl = { contains: jest.fn().mockReturnValue( true ), click: mockClick };
			const triggerEl = { click: mockClick };
			const menuEl = { contains: jest.fn().mockReturnValue( false ) };
			const mockDoc = makeMockDoc();
			useRef.mockReturnValue( makeBannerRef( mockDoc, { triggerExpandedEl, menuEl, triggerEl } ) );
			setupMocks();
			render( <WithInlineBanner clientId="client-1" /> );

			const [ , handler ] = mockDoc.addEventListener.mock.calls.find( ( [ type ] ) => type === "mousedown" );
			handler( { target: document.body } );

			expect( mockClick ).not.toHaveBeenCalled();
		} );

		test( "does not close the dropdown when mousedown is inside the menu", () => {
			const mockClick = jest.fn();
			const triggerExpandedEl = { contains: jest.fn().mockReturnValue( false ), click: mockClick };
			const triggerEl = { click: mockClick };
			const menuEl = { contains: jest.fn().mockReturnValue( true ) };
			const mockDoc = makeMockDoc();
			useRef.mockReturnValue( makeBannerRef( mockDoc, { triggerExpandedEl, menuEl, triggerEl } ) );
			setupMocks();
			render( <WithInlineBanner clientId="client-1" /> );

			const [ , handler ] = mockDoc.addEventListener.mock.calls.find( ( [ type ] ) => type === "mousedown" );
			handler( { target: document.body } );

			expect( mockClick ).not.toHaveBeenCalled();
		} );

		test( "does not close the dropdown when no trigger with aria-expanded is found", () => {
			const mockClick = jest.fn();
			const triggerEl = { click: mockClick };
			const mockDoc = makeMockDoc();
			// triggerExpandedEl is null: no open dropdown trigger.
			useRef.mockReturnValue( makeBannerRef( mockDoc, { triggerExpandedEl: null, triggerEl } ) );
			setupMocks();
			render( <WithInlineBanner clientId="client-1" /> );

			const [ , handler ] = mockDoc.addEventListener.mock.calls.find( ( [ type ] ) => type === "mousedown" );
			handler( { target: document.body } );

			expect( mockClick ).not.toHaveBeenCalled();
		} );

		test( "does not close the dropdown when the trigger is open but the menu element is absent", () => {
			const mockClick = jest.fn();
			const triggerExpandedEl = { contains: jest.fn().mockReturnValue( false ), click: mockClick };
			const triggerEl = { click: mockClick };
			const mockDoc = makeMockDoc();
			// menuEl is null: trigger is open but [role='menu'] not found.
			useRef.mockReturnValue( makeBannerRef( mockDoc, { triggerExpandedEl, menuEl: null, triggerEl } ) );
			setupMocks();
			render( <WithInlineBanner clientId="client-1" /> );

			const [ , handler ] = mockDoc.addEventListener.mock.calls.find( ( [ type ] ) => type === "mousedown" );
			handler( { target: document.body } );

			expect( mockClick ).not.toHaveBeenCalled();
		} );
	} );

	describe( "tab navigation effect", () => {
		/**
		 * Creates a ref whose `current.ownerDocument` is the supplied fake document.
		 * Used to exercise the keydown listener effect without a real DOM node.
		 *
		 * @param {object} mockDoc The fake ownerDocument returned by makeMockDoc().
		 * @returns {object} A ref-shaped object with a getter for `current`.
		 */
		const makeTabRef = ( mockDoc ) => {
			const ref = {};
			Object.defineProperty( ref, "current", {
				get: () => ( { ownerDocument: mockDoc } ),
				set: () => {},
				configurable: true,
			} );
			return ref;
		};

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

		/**
		 * Creates a ref whose `current.ownerDocument` is the supplied fake document,
		 * simulating a block element rendered inside a Gutenberg iframe canvas.
		 * The setter is a no-op so React cannot overwrite `current` with the real DOM node.
		 *
		 * @param {object} mockDoc The fake ownerDocument returned by makeMockDoc().
		 * @returns {object} A ref-shaped object with a getter for `current`.
		 */
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

		test( "does not inject a stylesheet when ownerDoc is the main window document", () => {
			// ownerDoc === window.document: we are not inside an iframe, so no injection needed.
			const realEl = document.createElement( "div" );
			const ref = {};
			Object.defineProperty( ref, "current", { get: () => realEl, set: () => {}, configurable: true } );
			useRef.mockReturnValue( ref );

			const mainLink = document.createElement( "link" );
			mainLink.id = STYLE_ID;
			mainLink.href = "https://example.com/tailwind.css";
			document.head.appendChild( mainLink );

			const appendChildSpy = jest.spyOn( document.head, "appendChild" ).mockImplementation( () => {} );
			setupMocks();
			render( <WithInlineBanner clientId="client-1" /> );

			expect( appendChildSpy ).not.toHaveBeenCalled();

			appendChildSpy.mockRestore();
			document.head.removeChild( mainLink );
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

	describe( "AI generator store guard", () => {
		/**
		 * Configures useSelect and useDispatch for the scenario where the AI Generator
		 * store has not been registered yet (select returns undefined for that store name).
		 * All other stores return values that would normally show the banner, so any
		 * banner that does appear is a guard failure rather than an unmet condition.
		 */
		const setupWithoutAiStore = () => {
			useSelect.mockImplementation( ( selector ) => selector( ( storeName ) => {
				if ( storeName === "yoast-seo/ai-generator" ) {
					// Store not yet registered — returns undefined.
					return undefined;
				}
				if ( storeName === "core/block-editor" ) {
					return { getBlockOrder: () => [ "client-1" ] };
				}
				if ( storeName === "core/editor" ) {
					return { isEditedPostNew: () => true, getCurrentPostType: () => "post", getRenderingMode: () => "post-only" };
				}
				if ( storeName === "yoast-seo/content-planner" ) {
					return {
						selectIsBannerDismissed: () => false,
						selectIsBannerRendered: () => false,
						selectIsBannerPermanentlyDismissed: () => false,
						selectBannerPermanentDismissalEndpoint: () => "",
						selectIsMinPostsMet: () => true,
					};
				}
				if ( storeName === "yoast-seo/editor" ) {
					return { getIsPremium: () => false, selectLink: () => "" };
				}
				return {};
			} ) );
			useDispatch.mockReturnValue( {
				setFeatureModalStatus: jest.fn(),
				setBannerDismissed: jest.fn(),
				setBannerRendered: jest.fn(),
				dismissBannerPermanently: jest.fn(),
			} );
		};

		test( "renders only the BlockListBlock when the AI generator store is not registered", () => {
			setupWithoutAiStore();

			const { queryByTestId, getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

			expect( queryByTestId( "inline-banner" ) ).not.toBeInTheDocument();
			expect( getByTestId( "block-list-block" ) ).toBeInTheDocument();
		} );

		test( "skips the banner even when it is the first block and all other conditions would show it", () => {
			// Regression guard: the isObject check must fire before FirstBlockWithBanner is mounted,
			// so the missing AI store never causes a missing-selector error inside that component.
			setupWithoutAiStore();

			const { queryByTestId, getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

			expect( queryByTestId( "inline-banner" ) ).not.toBeInTheDocument();
			expect( getByTestId( "block-list-block" ) ).toBeInTheDocument();
		} );
	} );

	describe( "ErrorBoundary", () => {
		test( "renders only the BlockListBlock (fallback) when FirstBlockWithBanner throws during render", () => {
			// Suppress React's built-in error boundary console.error output so the test output stays clean.
			const consoleError = jest.spyOn( console, "error" ).mockImplementation( () => {} );

			// Set up useSelect so WithInlineBanner's isObject guard passes and FirstBlockWithBanner mounts.
			setupMocks();

			// useDispatch is called inside FirstBlockWithBanner (within the ErrorBoundary's subtree)
			// but never in WithInlineBanner itself, so throwing here is caught by the boundary.
			useDispatch.mockImplementation( () => {
				throw new Error( "simulated render error" );
			} );

			const { queryByTestId, getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

			expect( queryByTestId( "inline-banner" ) ).not.toBeInTheDocument();
			expect( getByTestId( "block-list-block" ) ).toBeInTheDocument();

			consoleError.mockRestore();
		} );
	} );

	describe( "hasConsent prop", () => {
		test( "derives hasConsent from the AI generator store and passes it to FirstBlockWithBanner", () => {
			setupMocks( { hasConsent: true } );

			const { getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

			// hasConsent=true → clicking CTA fetches suggestions, not opens consent modal.
			getByTestId( "click-btn" ).click();
			expect( mockFetchContentSuggestions ).toHaveBeenCalledTimes( 1 );
			expect( mockSetFeatureModalStatus ).not.toHaveBeenCalled();
		} );

		test( "defaults hasConsent to false when selectHasAiGeneratorConsent returns undefined", () => {
			useSelect.mockImplementation( ( selector ) => selector( ( storeName ) => {
				if ( storeName === "yoast-seo/ai-generator" ) {
					return { selectHasAiGeneratorConsent: () => undefined };
				}
				if ( storeName === "core/block-editor" ) {
					return { getBlockOrder: () => [ "client-1" ] };
				}
				if ( storeName === "core/editor" ) {
					return { isEditedPostNew: () => true, getCurrentPostType: () => "post", getRenderingMode: () => "post-only" };
				}
				if ( storeName === "yoast-seo/content-planner" ) {
					return {
						selectIsBannerDismissed: () => false,
						selectIsBannerRendered: () => false,
						selectIsBannerPermanentlyDismissed: () => false,
						selectBannerPermanentDismissalEndpoint: () => "",
						selectIsMinPostsMet: () => true,
					};
				}
				if ( storeName === "yoast-seo/editor" ) {
					return { getIsPremium: () => false, selectLink: () => "" };
				}
				return {};
			} ) );
			useDispatch.mockReturnValue( {
				setFeatureModalStatus: mockSetFeatureModalStatus,
				setBannerDismissed: mockSetBannerDismissed,
				setBannerRendered: mockSetBannerRendered,
				dismissBannerPermanently: mockDismissBannerPermanently,
			} );

			const { getByTestId } = render( <WithInlineBanner clientId="client-1" /> );

			// undefined ?? false → false: clicking opens consent modal rather than fetching.
			getByTestId( "click-btn" ).click();
			expect( mockSetFeatureModalStatus ).toHaveBeenCalledWith( "consent" );
			expect( mockFetchContentSuggestions ).not.toHaveBeenCalled();
		} );
	} );
} );
