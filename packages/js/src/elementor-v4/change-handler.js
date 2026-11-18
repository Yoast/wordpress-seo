/* global elementor */
import { dispatch, select } from "@wordpress/data";
import { debounce } from "lodash";
import { refreshDelay } from "../analysis/constants";
import { isFormIdEqualToDocumentId } from "../elementor/helpers/is-form-id";
import { getEditorData } from "./editor-data";

const editorData = {
	content: "",
	title: "",
	excerpt: "",
	imageUrl: "",
	featuredImage: "",
	contentImage: "",
	excerptOnly: "",
};

/* eslint-disable complexity */
/**
 * Dispatches updated editor data when the document changes.
 *
 * @returns {void}
 */
function handleEditorChange() {
	const currentDocument = elementor.documents.getCurrent();

	if ( ! isFormIdEqualToDocumentId() ) {
		return;
	}

	if ( ! [ "wp-post", "wp-page" ].includes( currentDocument.config.type ) ) {
		return;
	}

	if ( select( "yoast-seo/editor" ).getActiveMarker() ) {
		return;
	}

	const data = getEditorData( currentDocument );

	if ( data.content !== editorData.content ) {
		editorData.content = data.content;
		dispatch( "yoast-seo/editor" ).setEditorDataContent( editorData.content );
	}

	if ( data.title !== editorData.title ) {
		editorData.title = data.title;
		dispatch( "yoast-seo/editor" ).setEditorDataTitle( editorData.title );
	}

	if ( data.excerpt !== editorData.excerpt ) {
		editorData.excerpt = data.excerpt;
		editorData.excerptOnly = data.excerptOnly;
		dispatch( "yoast-seo/editor" ).setEditorDataExcerpt( editorData.excerpt );
		dispatch( "yoast-seo/editor" ).updateReplacementVariable( "excerpt", editorData.excerpt );
		dispatch( "yoast-seo/editor" ).updateReplacementVariable( "excerpt_only", editorData.excerptOnly );
	}

	if ( data.imageUrl !== editorData.imageUrl ) {
		editorData.imageUrl = data.imageUrl;
		dispatch( "yoast-seo/editor" ).setEditorDataImageUrl( editorData.imageUrl );
	}

	if ( data.contentImage !== editorData.contentImage ) {
		editorData.contentImage = data.contentImage;
		dispatch( "yoast-seo/editor" ).setContentImage( editorData.contentImage );
	}

	if ( data.featuredImage !== editorData.featuredImage ) {
		editorData.featuredImage = data.featuredImage;
		dispatch( "yoast-seo/editor" ).updateData( { snippetPreviewImageURL: editorData.featuredImage } );
	}
}
/* eslint-enable complexity */

const debouncedHandleEditorChange = debounce( handleEditorChange, refreshDelay );

export { handleEditorChange, debouncedHandleEditorChange };
