import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "@yoast/ui-library";
import { ContentPlannerError } from "../../../src/ai-content-planner/components/content-planner-error";

jest.mock( "../../../src/ai-generator/components/errors", () => ( {
	BadWPRequestAlert: ( { errorMessage } ) => <div data-testid="bad-wp-request-alert">{ errorMessage }</div>,
	GenericAlert: () => <div data-testid="generic-alert" />,
	RateLimitAlert: () => <div data-testid="rate-limit-alert" />,
	TimeoutAlert: () => <div data-testid="timeout-alert" />,
} ) );

jest.mock( "../../../src/ai-generator/components/errors/site-unreachable-alert", () => ( {
	SiteUnreachableAlert: () => <div data-testid="site-unreachable-alert" />,
} ) );

const renderError = ( props = {} ) => render(
	<Modal isOpen={ true } onClose={ jest.fn() }>
		<div>
			<ContentPlannerError errorCode={ 500 } { ...props } />
		</div>
	</Modal>
);

describe( "ContentPlannerError", () => {
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

		it( "renders the RateLimitAlert for 429", () => {
			renderError( { errorCode: 429 } );
			expect( screen.getByTestId( "rate-limit-alert" ) ).toBeInTheDocument();
		} );

		it( "renders the GenericAlert for unmapped error codes", () => {
			renderError( { errorCode: 500 } );
			expect( screen.getByTestId( "generic-alert" ) ).toBeInTheDocument();
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
