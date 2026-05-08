import { render, screen, fireEvent } from "@testing-library/react";
import { SuggestionButton, LoadingSuggestionButton } from "../../../src/ai-content-planner/components/suggestion-button";

const mockSuggestion = {
	intent: "informational",
	title: "How to train your dog",
	explanation: "Tips and tricks on how to train your dog effectively.",
};

describe( "SuggestionButton", () => {
	it( "renders the suggestion title", () => {
		render( <SuggestionButton suggestion={ mockSuggestion } onClick={ jest.fn() } /> );
		expect( screen.getByText( "How to train your dog" ) ).toBeInTheDocument();
	} );

	it( "renders the suggestion explanation", () => {
		render( <SuggestionButton suggestion={ mockSuggestion } onClick={ jest.fn() } /> );
		expect( screen.getByText( "Tips and tricks on how to train your dog effectively." ) ).toBeInTheDocument();
	} );

	it( "renders the intent badge", () => {
		render( <SuggestionButton suggestion={ mockSuggestion } onClick={ jest.fn() } /> );
		expect( screen.getByText( "Informational" ) ).toBeInTheDocument();
	} );

	it( "calls onClick with the full suggestion object when clicked", () => {
		const onClick = jest.fn();
		render( <SuggestionButton suggestion={ mockSuggestion } onClick={ onClick } /> );
		fireEvent.click( screen.getByRole( "button" ) );
		expect( onClick ).toHaveBeenCalledTimes( 1 );
		expect( onClick ).toHaveBeenCalledWith( mockSuggestion );
	} );
} );

describe( "LoadingSuggestionButton", () => {
	it( "renders without crashing", () => {
		const { container } = render( <LoadingSuggestionButton /> );
		expect( container.firstChild ).toBeInTheDocument();
	} );
} );
