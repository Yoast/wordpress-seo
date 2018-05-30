import { mount } from "enzyme";
import SnippetPreviewSection, { mapEditorDataToPreview } from "../../src/components/SnippetPreviewSection";
import React from "react";

jest.mock( "../../src/containers/SnippetEditor", () => {
	return () => {
		return <div>HI!</div>;
	};
} );

jest.mock( "yoast-components", () => {
	return { StyledSection: () => <span>yoast-components StyledSection</span> };
} );

describe( "SnippetPreviewSection", () => {
	it( "renders the snippet editor inside of it", () => {
		const tree = mount( <SnippetPreviewSection baseUrl="http://example.org" /> );

		expect( tree ).toMatchSnapshot();
	} );
} );

describe( "mapEditorDataToPreview", () => {
	it( "Hyphenates spaces between words of the URL.", () => {
		const exampleURL = "my URL is awesome";
		const expected = "my-URL-is-awesome";

		const dataObject = {
			title: "",
			url: exampleURL,
			description: "",
		};

		const actual = mapEditorDataToPreview( dataObject );

		expect( actual.url ).toEqual( expected );
	} );

	it( "Doesn't hyphenate trailing spaces.", () => {
		const exampleURL = "my URL is awesome    ";
		const expected = "my-URL-is-awesome";

		const dataObject = {
			title: "",
			url: exampleURL,
			description: "",
		};

		const actual = mapEditorDataToPreview( dataObject );

		expect( actual.url ).toEqual( expected );
	} );
} );
