/* global elementor */
import { get } from "lodash";
import firstImageUrlInContent from "../helpers/firstImageUrlInContent";
import { excerptFromContent } from "../helpers/replacementVariableHelpers";
import getContentLocale from "../analysis/getContentLocale";
import { buildContentAndMap } from "./content-walker";
import { getDocumentTree } from "./document-tree";

/**
 * Computes the SEO excerpt with a content fallback.
 *
 * @param {string}  content     The full extracted content HTML.
 * @param {boolean} onlyExcerpt When true, returns only the post excerpt (no fallback).
 * @returns {string} The excerpt string.
 */
function getExcerpt( content, onlyExcerpt = false ) {
	let excerpt = elementor.settings.page.model.get( "post_excerpt" );

	if ( onlyExcerpt ) {
		return excerpt || "";
	}

	if ( ! excerpt ) {
		const limit = ( getContentLocale() === "ja" ) ? 80 : 156;
		excerpt = excerptFromContent( content, limit );
	}

	return excerpt;
}

/**
 * Builds the editor data snapshot from the current Elementor document. The content is read
 * from the rendered preview DOM (see content-walker), so unwanted widgets (table of contents,
 * forms, …) are left in and filtered out downstream by yoastseo's `alwaysFilterElements`.
 *
 * @param {Object} editorDocument The current document.
 * @returns {Object} The editor data.
 */
export const getEditorData = ( editorDocument ) => {
	const { content } = buildContentAndMap( getDocumentTree( editorDocument ), editorDocument.$element );
	const featuredImageUrl = get( elementor.settings.page.model.get( "post_featured_image" ), "url", "" );
	const contentImageUrl = firstImageUrlInContent( content );

	return {
		content,
		title: elementor.settings.page.model.get( "post_title" ),
		excerpt: getExcerpt( content ),
		excerptOnly: getExcerpt( content, true ),
		imageUrl: featuredImageUrl || contentImageUrl,
		featuredImage: featuredImageUrl,
		contentImage: contentImageUrl,
		status: elementor.settings.page.model.get( "post_status" ),
	};
};
