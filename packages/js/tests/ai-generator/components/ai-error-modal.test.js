import { useSelect } from "@wordpress/data";
import { expect } from "@jest/globals";
import { fireEvent, render, screen } from "../../test-utils";
import { AIErrorModal } from "../../../src/ai-generator/components/ai-error-modal";
import { SuggestionError } from "../../../src/ai-generator/components/suggestion-error";

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn(),
	useDispatch: jest.fn(),
	combineReducers: jest.fn(),
	registerStore: jest.fn(),
	createReduxStore: jest.fn(),
	register: jest.fn(),
} ) );

// Note: SuggestionError (used only by the drift-guardrail test) reads
// useModalContext, which defaults to { onClose: noop } outside a Modal, so no
// Modal provider is needed here.

/**
 * Builds the useSelect implementation backing the AI + editor stores.
 *
 * @param {Object} myyoastConnection The MyYoast connection slice for the AI store.
 * @returns {function} A useSelect implementation.
 */
const selectImplementation = ( myyoastConnection = {} ) => ( selectFn ) => selectFn( ( storeName ) => {
	if ( storeName === "yoast-seo/editor" ) {
		return {
			selectLink: ( url ) => url,
			selectAdminLink: ( path ) => path,
		};
	}
	if ( storeName === "yoast-seo/ai-generator" ) {
		return {
			selectBustSubscriptionCacheEndpoint: () => "/bust-cache",
			selectMyyoastConnection: () => ( {
				isAvailable: false,
				canConnect: false,
				connectUrl: null,
				learnMoreUrl: "https://yoa.st/ai-myyoast-connection",
				...myyoastConnection,
			} ),
		};
	}
	return {};
} );

/**
 * Renders the error modal in its open state.
 *
 * @param {Object} props The component props.
 * @returns {Object} The render result.
 */
const renderModal = ( props ) => render( <AIErrorModal isOpen={ true } { ...props } /> );

describe( "AIErrorModal", () => {
	beforeEach( () => {
		useSelect.mockImplementation( selectImplementation() );
	} );

	it( "renders the generic error for an unmapped code", () => {
		renderModal( { errorCode: 503 } );
		expect( screen.getByText( "Something went wrong" ) ).toBeInTheDocument();
	} );

	it( "renders the timeout error with a Try again action when actions are shown", () => {
		const onRetry = jest.fn();
		renderModal( { errorCode: 408, showActions: true, onRetry } );
		expect( screen.getByText( "Connection timeout" ) ).toBeInTheDocument();
		fireEvent.click( screen.getByRole( "button", { name: "Try again" } ) );
		expect( onRetry ).toHaveBeenCalled();
	} );

	it( "does not show a Try again action for message-only errors", () => {
		renderModal( { errorCode: 429, showActions: true } );
		expect( screen.getByText( "You've reached the Yoast AI rate limit" ) ).toBeInTheDocument();
		expect( screen.queryByRole( "button", { name: "Try again" } ) ).not.toBeInTheDocument();
	} );

	it( "renders the content-filter error without actions", () => {
		renderModal( { errorCode: 400, errorIdentifier: "AI_CONTENT_FILTER", showActions: true } );
		expect( screen.getByText( "Usage policy violation" ) ).toBeInTheDocument();
		expect( screen.queryByRole( "button", { name: "Try again" } ) ).not.toBeInTheDocument();
	} );

	it( "renders the subscription error with a Refresh page action", () => {
		renderModal( { errorCode: 402, invalidSubscriptions: [ "Yoast SEO Premium" ] } );
		expect( screen.getByText( "Subscription required" ) ).toBeInTheDocument();
		expect( screen.getByRole( "button", { name: "Refresh page" } ) ).toBeInTheDocument();
	} );

	it( "treats a usage-limit 429 as a subscription error", () => {
		renderModal( { errorCode: 429, errorIdentifier: "USAGE_LIMIT_REACHED", invalidSubscriptions: [ "Yoast SEO Premium" ] } );
		expect( screen.getByText( "Subscription required" ) ).toBeInTheDocument();
		expect( screen.getByRole( "button", { name: "Refresh page" } ) ).toBeInTheDocument();
	} );

	it( "renders the SEO-analysis-inactive error", () => {
		renderModal( { errorCode: 0, errorIdentifier: "SEO_ANALYSIS_INACTIVE" } );
		expect( screen.getByText( "SEO analysis required" ) ).toBeInTheDocument();
		expect( screen.getByRole( "button", { name: "Refresh page" } ) ).toBeInTheDocument();
	} );

	describe( "site-unreachable variants", () => {
		const props = { errorCode: 400, errorIdentifier: "SITE_UNREACHABLE" };

		it( "shows variant 1 (informational, with help actions) when the connection is unavailable", () => {
			useSelect.mockImplementation( selectImplementation( { isAvailable: false } ) );
			renderModal( props );
			expect( screen.getByText( "Yoast AI cannot reach your site" ) ).toBeInTheDocument();
			expect( screen.getByRole( "link", { name: /Still need help\?/ } ) ).toBeInTheDocument();
			expect( screen.getByRole( "link", { name: /Learn more/ } ) ).toBeInTheDocument();
			expect( screen.queryByRole( "link", { name: "Connect to MyYoast" } ) ).not.toBeInTheDocument();
		} );

		it( "shows variant 2 (Connect to MyYoast) when the user can connect", () => {
			useSelect.mockImplementation( selectImplementation( {
				isAvailable: true,
				canConnect: true,
				connectUrl: "https://example.test/connect",
			} ) );
			renderModal( props );
			const connect = screen.getByRole( "link", { name: "Connect to MyYoast" } );
			expect( connect ).toBeInTheDocument();
			// The CTA is a plain link to the nonce-protected URL, opening in a new tab.
			expect( connect ).toHaveAttribute( "href", "https://example.test/connect" );
			expect( connect ).toHaveAttribute( "target", "_blank" );
		} );

		it( "shows variant 3 (ask your administrator) when the user cannot connect", () => {
			useSelect.mockImplementation( selectImplementation( { isAvailable: true, canConnect: false } ) );
			renderModal( props );
			expect( screen.getByText( /Ask your site administrator to connect to MyYoast/ ) ).toBeInTheDocument();
			expect( screen.queryByRole( "link", { name: "Connect to MyYoast" } ) ).not.toBeInTheDocument();
		} );
	} );

	it( "always offers a bottom Close button that calls onClose, even for a message-only error", () => {
		const onClose = jest.fn();
		renderModal( { errorCode: 503, onClose } );
		fireEvent.click( screen.getByRole( "button", { name: "Close" } ) );
		expect( onClose ).toHaveBeenCalled();
	} );

	it( "calls onClose from the top-right dismiss control", () => {
		const onClose = jest.fn();
		renderModal( { errorCode: 503, onClose } );
		fireEvent.click( screen.getByRole( "button", { name: "Dismiss" } ) );
		expect( onClose ).toHaveBeenCalled();
	} );

	it( "shows a Close button but no Try again for a retryable error when actions are hidden", () => {
		renderModal( { errorCode: 408, showActions: false } );
		expect( screen.getByRole( "button", { name: "Close" } ) ).toBeInTheDocument();
		expect( screen.queryByRole( "button", { name: "Try again" } ) ).not.toBeInTheDocument();
	} );

	// Drift guardrail: the modal and the inline SuggestionError keep their own
	// switches, so this asserts both still produce a rendered error for every
	// (errorCode, errorIdentifier) pair. If a case is added to one but not the
	// other, one of these renders comes back empty and the test fails.
	describe( "stays in lockstep with SuggestionError", () => {
		const cases = [
			[ 400, "AI_CONTENT_FILTER" ],
			[ 400, "NOT_ENOUGH_CONTENT" ],
			[ 400, "SITE_UNREACHABLE" ],
			[ 400, "WP_HTTP_REQUEST_ERROR" ],
			[ 400, "" ],
			[ 402, "" ],
			[ 408, "" ],
			[ 429, "" ],
			[ 429, "USAGE_LIMIT_REACHED" ],
			[ 410, "" ],
			[ 403, "" ],
			[ 503, "" ],
		];

		it.each( cases )( "both render for code %s / identifier '%s'", ( errorCode, errorIdentifier ) => {
			const shared = { errorCode, errorIdentifier, invalidSubscriptions: [ "Yoast SEO Premium" ], errorMessage: "boom" };

			const modal = renderModal( shared );
			expect( modal.baseElement ).not.toBeEmptyDOMElement();
			modal.unmount();

			const inline = render( <SuggestionError { ...shared } /> );
			expect( inline.container ).not.toBeEmptyDOMElement();
			inline.unmount();
		} );
	} );
} );
