import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "@yoast/ui-library";
import { ContentPlannerError } from "../../../src/ai-content-planner/components/content-planner-error";

jest.mock( "../../../src/ai-generator/components/errors", () => ( {
	BadWPRequestAlert: ( { errorMessage } ) => <div data-testid="bad-wp-request-alert">{ errorMessage }</div>,
	GenericAlert: () => <div data-testid="generic-alert" />,
	RateLimitAlert: () => <div data-testid="rate-limit-alert" />,
	SubscriptionError: ( { invalidSubscriptions } ) => (
		<div data-testid="subscription-error">{ invalidSubscriptions.join( "," ) }</div>
	),
	TimeoutAlert: () => <div data-testid="timeout-alert" />,
} ) );

jest.mock( "../../../src/ai-generator/components/errors/site-unreachable-alert", () => ( {
	SiteUnreachableAlert: () => <div data-testid="site-unreachable-alert" />,
} ) );

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn(),
} ) );

import { useSelect } from "@wordpress/data";

const mockIsPremium = ( isPremium ) => {
	useSelect.mockImplementation( ( mapSelect ) => mapSelect( () => ( {
		getIsPremium: () => isPremium,
	} ) ) );
};

const renderError = ( props = {} ) => render(
	<Modal isOpen={ true } onClose={ jest.fn() }>
		<div>
			<ContentPlannerError errorCode={ 500 } { ...props } />
		</div>
	</Modal>
);

describe( "ContentPlannerError", () => {
	beforeEach( () => {
		mockIsPremium( false );
	} );

	describe( "alert selection", () => {
		it( "renders the SiteUnreachableAlert for 400 + SITE_UNREACHABLE", () => {
			renderError( { errorCode: 400, errorIdentifier: "SITE_UNREACHABLE" } );
			expect( screen.getByTestId( "site-unreachable-alert" ) ).toBeInTheDocument();
		} );

		it( "renders the BadWPRequestAlert for 400 + WP_HTTP_REQUEST_ERROR with the error message", () => {
			renderError( {
				errorCode: 400,
				errorIdentifier: "WP_HTTP_REQUEST_ERROR",
				errorMessage: "Simulated error",
			} );
			const alert = screen.getByTestId( "bad-wp-request-alert" );
			expect( alert ).toBeInTheDocument();
			expect( alert ).toHaveTextContent( "Simulated error" );
		} );

		it( "renders the GenericAlert for 400 without a known identifier", () => {
			renderError( { errorCode: 400, errorIdentifier: "UNKNOWN_IDENTIFIER" } );
			expect( screen.getByTestId( "generic-alert" ) ).toBeInTheDocument();
		} );

		it( "renders the TimeoutAlert for 408", () => {
			renderError( { errorCode: 408 } );
			expect( screen.getByTestId( "timeout-alert" ) ).toBeInTheDocument();
		} );

		it( "renders the RateLimitAlert for 429 without a USAGE_LIMIT_REACHED identifier", () => {
			renderError( { errorCode: 429 } );
			expect( screen.getByTestId( "rate-limit-alert" ) ).toBeInTheDocument();
		} );

		it( "renders the RateLimitAlert for 429 + USAGE_LIMIT_REACHED when Premium is not installed", () => {
			mockIsPremium( false );
			renderError( { errorCode: 429, errorIdentifier: "USAGE_LIMIT_REACHED" } );
			expect( screen.getByTestId( "rate-limit-alert" ) ).toBeInTheDocument();
			expect( screen.queryByTestId( "subscription-error" ) ).not.toBeInTheDocument();
		} );

		it( "renders the SubscriptionError for 429 + USAGE_LIMIT_REACHED when Premium is installed", () => {
			mockIsPremium( true );
			renderError( {
				errorCode: 429,
				errorIdentifier: "USAGE_LIMIT_REACHED",
				missingLicenses: [ "Yoast SEO Premium" ],
			} );
			const alert = screen.getByTestId( "subscription-error" );
			expect( alert ).toBeInTheDocument();
			expect( alert ).toHaveTextContent( "Yoast SEO Premium" );
			expect( screen.queryByTestId( "rate-limit-alert" ) ).not.toBeInTheDocument();
			expect( screen.queryByRole( "button", { name: "Try again" } ) ).not.toBeInTheDocument();
		} );

		it( "renders the RateLimitAlert for 429 + non-USAGE_LIMIT_REACHED identifier when Premium is installed", () => {
			mockIsPremium( true );
			renderError( { errorCode: 429, errorIdentifier: "REQUEST_RATE_LIMITED" } );
			expect( screen.getByTestId( "rate-limit-alert" ) ).toBeInTheDocument();
			expect( screen.queryByTestId( "subscription-error" ) ).not.toBeInTheDocument();
		} );

		it( "renders the GenericAlert for unmapped error codes", () => {
			renderError( { errorCode: 500 } );
			expect( screen.getByTestId( "generic-alert" ) ).toBeInTheDocument();
		} );

		it( "renders the SubscriptionError for 402 when Premium is installed", () => {
			mockIsPremium( true );
			renderError( { errorCode: 402, missingLicenses: [ "Yoast SEO Premium" ] } );
			const alert = screen.getByTestId( "subscription-error" );
			expect( alert ).toBeInTheDocument();
			expect( alert ).toHaveTextContent( "Yoast SEO Premium" );
			// SubscriptionError renders its own actions, so the wrapping Close / Try again footer must not appear.
			expect( screen.queryByRole( "button", { name: "Try again" } ) ).not.toBeInTheDocument();
		} );

		it( "renders the GenericAlert for 402 when Premium is not installed", () => {
			mockIsPremium( false );
			renderError( { errorCode: 402, missingLicenses: [] } );
			expect( screen.getByTestId( "generic-alert" ) ).toBeInTheDocument();
			expect( screen.queryByTestId( "subscription-error" ) ).not.toBeInTheDocument();
			expect( screen.getByRole( "button", { name: "Try again" } ) ).toBeInTheDocument();
		} );
	} );

	describe( "actions", () => {
		it( "shows the Close and Try again buttons", () => {
			renderError();
			expect( screen.getByRole( "button", { name: "Close" } ) ).toBeInTheDocument();
			expect( screen.getByRole( "button", { name: "Try again" } ) ).toBeInTheDocument();
		} );

		it( "calls onRetry when the Try again button is clicked", () => {
			const onRetry = jest.fn();
			renderError( { onRetry } );
			fireEvent.click( screen.getByRole( "button", { name: "Try again" } ) );
			expect( onRetry ).toHaveBeenCalledTimes( 1 );
		} );

		it( "calls the modal's onClose when the Close button is clicked", () => {
			const onClose = jest.fn();
			render(
				<Modal isOpen={ true } onClose={ onClose }>
					<div>
						<ContentPlannerError errorCode={ 500 } />
					</div>
				</Modal>
			);
			fireEvent.click( screen.getByRole( "button", { name: "Close" } ) );
			expect( onClose ).toHaveBeenCalledTimes( 1 );
		} );
	} );
} );
