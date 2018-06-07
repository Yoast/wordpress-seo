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

const context = {
	shortenedBaseUrl: "local.wordpress.test/",
};

const dataObject = {
	title: "",
	url: "local.wordpress.test/my URL is awesome",
	description: "",
};

describe( "mapEditorDataToPreview", () => {
	it( "Hyphenates spaces between words of the URL.", () => {
		const expected = "local.wordpress.test/my-URL-is-awesome";

		const actual = mapEditorDataToPreview( dataObject, context );

		expect( actual.url ).toEqual( expected );
	} );

	it( "Doesn't hyphenate leading or trailing spaces.", () => {
		const exampleURL = "local.wordpress.test/  my URL is awesome  ";
		const expected = "local.wordpress.test/my-URL-is-awesome";

		dataObject.url = exampleURL;

		const actual = mapEditorDataToPreview( dataObject, context );

		expect( actual.url ).toEqual( expected );
	} );
} );
