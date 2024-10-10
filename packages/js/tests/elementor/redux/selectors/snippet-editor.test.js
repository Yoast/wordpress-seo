import { describe, expect, it } from "@jest/globals";
import { getSnippetEditorData, getSnippetEditorSlug } from "../../../../src/elementor/redux/selectors/snippet-editor";
import {
	getSnippetEditorData as getPureSnippetEditorData,
	getSnippetEditorSlug as getPureSnippetEditorSlug,
} from "../../../../src/redux/selectors/snippetEditor";
import { withWindowMock } from "../../../test-utils";

describe( "getSnippetEditorSlug", () => {
	it( "exists", () => {
		expect( getSnippetEditorSlug ).toBeTruthy();
	} );

	it( "should return the saved slug if one exists and has not been edited", () => {
		const state = {
			editorData: {
				slug: "saved-slug",
			},
		};

		expect( getSnippetEditorSlug( state ) ).toBe( "saved-slug" );
	} );

	it( "should return the edited slug if it has been edited", () => {
		const state = {
			snippetEditor: {
				data: {
					slug: "edited-slug",
				},
			},
		};

		expect( getSnippetEditorSlug( state ) ).toBe( "edited-slug" );
	} );

	it( "should return the cleaned title as slug if no saved or edited slug exists", () => {
		const state = {
			editorData: {
				title: "Sample Post",
			},
		};

		expect( getSnippetEditorSlug( state ) ).toBe( "sample-post" );
	} );

	it( "should return the post ID if no slug or post title exists", () => {
		const state = {};

		withWindowMock( { elementor: { documents: { currentDocument: { id: 123 } } } }, () => {
			expect( getSnippetEditorSlug( state ) ).toBe( String( 123 ) );
		} );
	} );

	it( "should return the same as the non-Elementor override", () => {
		const state = {
			snippetEditor: {
				data: {
					slug: "edited-slug",
				},
			},
		};

		expect( getSnippetEditorSlug( state ) ).toBe( getPureSnippetEditorSlug( state ) );
	} );
} );

describe( "getSnippetEditorData", () => {
	it( "exists", () => {
		expect( getSnippetEditorData ).toBeTruthy();
	} );

	it( "should return the title, description, and slug", () => {
		const state = {
			snippetEditor: {
				data: {
					title: "Title",
					description: "Description",
					slug: "slug",
				},
			},
		};

		expect( getSnippetEditorData( state ) ).toEqual( { title: "Title", description: "Description", slug: "slug" } );
	} );

	it( "should return the saved slug if one exists and has not been edited", () => {
		const state = {
			editorData: {
				slug: "saved-slug",
			},
			snippetEditor: {
				data: {
					title: "Title",
					description: "Description",
				},
			},
		};

		expect( getSnippetEditorData( state ) ).toEqual( { title: "Title", description: "Description", slug: "saved-slug" } );
	} );

	it( "should return the edited slug if it has been edited", () => {
		const state = {
			snippetEditor: {
				data: {
					title: "Title",
					description: "Description",
					slug: "edited-slug",
				},
			},
		};

		expect( getSnippetEditorData( state ) ).toEqual( { title: "Title", description: "Description", slug: "edited-slug" } );
	} );

	it( "should return the cleaned title as slug if no saved or edited slug exists", () => {
		const state = {
			editorData: {
				title: "Sample Post",
			},
			snippetEditor: {
				data: {
					title: "Title",
					description: "Description",
				},
			},
		};

		expect( getSnippetEditorData( state ) ).toEqual( { title: "Title", description: "Description", slug: "sample-post" } );
	} );

	it( "should return the post ID if no slug or post title exists", () => {
		const state = {
			snippetEditor: {
				data: {
					title: "Title",
					description: "Description",
				},
			},
		};

		withWindowMock( { elementor: { documents: { currentDocument: { id: 123 } } } }, () => {
			expect( getSnippetEditorData( state ) ).toEqual( { title: "Title", description: "Description", slug: String( 123 ) } );
		} );
	} );

	it( "should return the same as the non-Elementor override", () => {
		const state = {
			snippetEditor: {
				data: {
					title: "Title",
					description: "Description",
					slug: "slug",
				},
			},
		};

		expect( getSnippetEditorData( state ) ).toEqual( getPureSnippetEditorData( state ) );
	} );
} );
