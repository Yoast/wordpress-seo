import { describe, expect, it } from "@jest/globals";
import { getSnippetEditorSlug } from "../../../../src/elementor/redux/selectors/snippet-editor";
import {
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
