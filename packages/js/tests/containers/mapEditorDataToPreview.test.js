import { mapEditorDataToPreview } from "../../src/containers/SnippetEditor";

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
