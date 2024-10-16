import { createSelector } from "@reduxjs/toolkit";
import { getBaseUrlFromSettings } from "../../../redux/selectors";
import { getSnippetEditorSlug } from "./snippet-editor";

// Override to use the Elementor `getSnippetEditorSlug` override (and not the full analysis data).
export const getWincherPermalink = createSelector(
	[
		getBaseUrlFromSettings,
		// Use the Elementor override with fallbacks.
		getSnippetEditorSlug,
	],
	( baseUrl, slug ) => baseUrl + slug
);
