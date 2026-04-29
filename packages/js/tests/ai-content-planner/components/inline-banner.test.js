import { render, screen, fireEvent } from "@testing-library/react";
import { InlineBanner } from "../../../src/ai-content-planner/components/inline-banner";

const renderBanner = ( { onDismiss = jest.fn(), onClick = jest.fn(), isPremium = false, ...props } = {} ) => render(
	<InlineBanner
		onDismiss={ onDismiss }
		onClick={ onClick }
		isPremium={ isPremium }
		{ ...props }
	/>
);

describe( "InlineBanner", () => {
	it( "renders the 'Stuck on what to write next?' heading", () => {
		renderBanner();
		expect( screen.getByText( "Stuck on what to write next?" ) ).toBeInTheDocument();
	} );

	it( "renders the description text", () => {
		renderBanner();
		expect( screen.getByText( /Let Yoast analyze your site/ ) ).toBeInTheDocument();
	} );

	it( "renders the 'Get content suggestions' button", () => {
		renderBanner();
		expect( screen.getByRole( "button", { name: "Get content suggestions" } ) ).toBeInTheDocument();
	} );

	it( "calls onClick when the 'Get content suggestions' button is clicked", () => {
		const onClick = jest.fn();
		renderBanner( { onClick } );
		fireEvent.click( screen.getByRole( "button", { name: "Get content suggestions" } ) );
		expect( onClick ).toHaveBeenCalledTimes( 1 );
	} );

	it( "renders the close button", () => {
		renderBanner();
		expect( screen.getByRole( "button", { name: "Close" } ) ).toBeInTheDocument();
	} );

	it( "calls onDismiss when the close button is clicked", () => {
		const onDismiss = jest.fn();
		renderBanner( { onDismiss } );
		fireEvent.click( screen.getByRole( "button", { name: "Close" } ) );
		expect( onDismiss ).toHaveBeenCalledTimes( 1 );
	} );

	describe( "OneSparkNote visibility", () => {
		it( "shows the spark note when isPremium is false", () => {
			renderBanner( { isPremium: false } );
			expect( screen.getByText( "Using 1 spark" ) ).toBeInTheDocument();
		} );

		it( "does not show the spark note when isPremium is true", () => {
			renderBanner( { isPremium: true } );
			expect( screen.queryByText( "Using 1 spark" ) ).not.toBeInTheDocument();
		} );
	} );
} );
