import { createSelector } from "@reduxjs/toolkit";
import { cleanForSlug } from "@wordpress/url";
import { selectors } from "@yoast/externals/redux";
import { get } from "lodash";

const {
	getEditorDataSlug,
	getEditorDataTitle,
	getSnippetEditorDescription,
	getSnippetEditorSlug: getPureSnippetEditorSlug,
	getSnippetEditorTitle,
} = selectors;

// Override the default `getSnippetEditorSlug` to use fallbacks.
export const getSnippetEditorSlug = createSelector(
	[
		getEditorDataSlug,
		getPureSnippetEditorSlug,
		getEditorDataTitle,
		() => get( window, "elementor.documents.currentDocument.id", 0 ),
	],
	/**
	 * Gets the slug for the snippet editor.
	 *
	 * Using fallbacks like WordPress does in the editor.
	 * @see https://github.com/WordPress/gutenberg/blob/3aa19d28dd46433c6c5677fe76a9e0f500678905/packages/editor/src/store/selectors.js#L989-L1004
	 *
	 * @param {string} savedSlug The slug saved in the database.
	 * @param {string} editedSlug The slug edited by the user.
	 * @param {string} documentTitle The title of the document.
	 * @param {number} documentId The ID of the document.
	 *
	 * @returns {string} The slug.
	 */
	( savedSlug, editedSlug, documentTitle, documentId ) => {
		return editedSlug || savedSlug || cleanForSlug( documentTitle ) || String( documentId );
	}
);

// Override the default `getSnippetEditorData` to include the "slug with fallback" override.
export const getSnippetEditorData = createSelector(
	[
		getSnippetEditorTitle,
		getSnippetEditorDescription,
		getSnippetEditorSlug,
	],
	( title, description, slug ) => ( { title, description, slug } )
);
