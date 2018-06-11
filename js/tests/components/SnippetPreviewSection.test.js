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

	let context, dataObject;

	beforeEach( () => {
		dataObject = {
			title: "",
			url: "local.wordpress.test/my URL is awesome",
			description: "",
		};
		context = {
			shortenedBaseUrl: "local.wordpress.test/",
		};
	} );

	it( "strips spaces from the description", () => {
		const exampleDescription = "        no more spaces        ";
		const expected = {
			description: "no more spaces",
			title: "",
			url: "local.wordpress.test/my-URL-is-awesome",
		};
		dataObject.description = exampleDescription;

		const actual = mapEditorDataToPreview( dataObject, context );

		expect( actual ).toEqual( expected );
	} );
	it( "replaces newlines in the description by spaces and removes resulting double spaces", () => {
		const exampleDescription = "Yay \n for \n spaces";
		const expected = {
			description: "Yay for spaces",
			title: "",
			url: "local.wordpress.test/my-URL-is-awesome",
		};
		dataObject.description = exampleDescription;

		const actual = mapEditorDataToPreview( dataObject, context );

		expect( actual ).toEqual( expected );
	} );
	it( "replaces a single spaces in the slug with one dash", () => {
		const exampleUrl = "local.wordpress.test/only one dash";
		const expected = {
			description: "",
			title: "",
			url: "local.wordpress.test/only-one-dash",
		};
		dataObject.url = exampleUrl;

		const actual = mapEditorDataToPreview( dataObject, context );

		expect( actual ).toEqual( expected );
	} );
	it( "replaces multiple spaces in the slug with one dash", () => {
		const exampleUrl = "local.wordpress.test/only      one      dash";
		const expected = {
			description: "",
			title: "",
			url: "local.wordpress.test/only-one-dash",
		};
		dataObject.url = exampleUrl;

		const actual = mapEditorDataToPreview( dataObject, context );

		expect( actual ).toEqual( expected );
	} );
	it( "Doesn't hyphenate leading  or trailing spaces.", () => {
		const exampleURL = "local.wordpress.test/  my URL is awesome  ";
		const expected = "local.wordpress.test/my-URL-is-awesome";

		dataObject.url = exampleURL;

		const actual = mapEditorDataToPreview( dataObject, context );

		expect( actual.url ).toEqual( expected );
	} );
} );
