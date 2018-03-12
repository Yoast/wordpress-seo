import SnippetPreview from "../components/SnippetPreview";
import React from "react";
import renderer from "react-test-renderer";

describe( "SnippetPreview", () => {
	it( "renders a SnippetPreview that looks like Google", () => {
		const tree = renderer
			.create( <SnippetPreview  description="Description" title="Title" onClick={ () => {} } url="https://example.org" /> )
			.toJSON();

		expect( tree ).toMatchSnapshot();
	} );
} );
