import { mapEditorDataToPreview } from "../../src/containers/SnippetEditor";

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
