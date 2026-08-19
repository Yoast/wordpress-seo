import { render, screen } from "@testing-library/react";
import { ContentSuggestionBlock } from "../../../src/ai-content-planner/components/content-suggestion-block";

const renderBlock = ( { contentNotes = [], ...props } = {} ) => render(
	<ContentSuggestionBlock contentNotes={ contentNotes } { ...props } />
);

describe( "ContentSuggestionBlock", () => {
	it( "renders the 'Only visible to you' label", () => {
		renderBlock();
		expect( screen.getByText( "Only visible to you" ) ).toBeInTheDocument();
	} );

	it( "renders the 'Content notes' heading", () => {
		renderBlock();
		expect( screen.getByText( "Content notes" ) ).toBeInTheDocument();
	} );

	it( "renders each content note as a list item", () => {
		renderBlock( { contentNotes: [ "First note", "Second note", "Third note" ] } );
		expect( screen.getByText( "First note" ) ).toBeInTheDocument();
		expect( screen.getByText( "Second note" ) ).toBeInTheDocument();
		expect( screen.getByText( "Third note" ) ).toBeInTheDocument();
	} );

	it( "does not render the list when contentNotes is empty", () => {
		renderBlock( { contentNotes: [] } );
		expect( screen.queryByRole( "list" ) ).not.toBeInTheDocument();
	} );

	it( "renders a bullet for each note", () => {
		renderBlock( { contentNotes: [ "Note A", "Note B" ] } );
		const bullets = screen.getAllByText( "•" );
		expect( bullets ).toHaveLength( 2 );
	} );
} );
