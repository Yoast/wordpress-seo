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
	it( "strips spaces from the description", () => {
		const data = {
			description: "        no more spaces        ",
			url: "",
			title: "",
		};

		const actual = mapEditorDataToPreview( data );
		const expected = {
			description: "no more spaces",
			url: "",
			title: "",
		};

		expect( actual ).toEqual( expected );
	} );
	it( "replaces a single spaces in the slug with one dash", () => {
		const data = {
			description: "",
			title: "",
			url: "only one dash",
		};

		const actual = mapEditorDataToPreview( data );
		const expected = {
			description: "",
			title: "",
			url: "only-one-dash",
		};

		expect( actual ).toEqual( expected );
	} );
	it( "replaces multiple spaces in the slug with one dash", () => {
		const data = {
			description: "",
			title: "",
			url: "only      one      dash",
		};

		const actual = mapEditorDataToPreview( data );
		const expected = {
			description: "",
			title: "",
			url: "only-one-dash",
		};

		expect( actual ).toEqual( expected );
	} );
	it( "replaces newlines in the description by spaces and removes resulting double spaces", () => {
		const data = {
			description: "Yay \n for \n spaces",
			title: "",
			url: "",
		};

		const actual = mapEditorDataToPreview( data );
		const expected = {
			description: "Yay for spaces",
			title: "",
			url: "",
		};

		expect( actual ).toEqual( expected );
	} );
	it( "Hyphenates spaces between words of the URL.", () => {
		const expected = "local.wordpress.test/my-URL-is-awesome";

		const actual = mapEditorDataToPreview( dataObject, context );

		expect( actual.url ).toEqual( expected );
	} );

	it( "Doesn't hyphenate leading  or trailing spaces.", () => {
		const exampleURL = "local.wordpress.test/  my URL is awesome  ";
		const expected = "local.wordpress.test/my-URL-is-awesome";

		dataObject.url = exampleURL;

		const actual = mapEditorDataToPreview( dataObject, context );

		expect( actual.url ).toEqual( expected );
	} );
} );
