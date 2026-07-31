import { EditorIntroText } from "../../src/components/EditorIntro";
import { render, screen } from "../test-utils";

describe( "EditorIntroText", () => {
	it( "renders the content suggestions copy when withPromptForContentSuggestions is true", () => {
		render( <EditorIntroText withPromptForContentSuggestions={ true } /> );
		expect( screen.getByText( "Optimize your content for discovery or get new content suggestions." ) ).toBeInTheDocument();
	} );

	it( "renders the discovery-only copy when withPromptForContentSuggestions is false", () => {
		render( <EditorIntroText withPromptForContentSuggestions={ false } /> );
		expect( screen.getByText( "Optimize your content for discovery." ) ).toBeInTheDocument();
	} );
} );
