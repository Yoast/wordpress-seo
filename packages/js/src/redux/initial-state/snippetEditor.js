import { select } from "@wordpress/data";
import { get } from "lodash";
import { STORES } from "../../shared-admin/constants";
import getDefaultReplacementVariables from "../../values/defaultReplaceVariables";

const titleTemplate = get( window, "wpseoScriptData.metabox.title_template", "" );
const descriptionTemplate = get( window, "wpseoScriptData.metabox.metadesc_template", "" );
const title = get( window, "wpseoScriptData.metabox.metadata.title", "" );

const termDescription = get( window, "wpseoScriptData.metabox.metadata.desc", "" );
const description = get( window, "wpseoScriptData.metabox.metadata.metadesc", termDescription );

/**
 * Gets the slug.
 *
 * @returns {string} The slug.
 */
const getSlug = () => {
	// Get the slug from the editor store.
	const editorSelectors = select( STORES.wp.editor );
	if ( editorSelectors && editorSelectors.getCurrentPostAttribute( "slug" ) ) {
		return editorSelectors.getCurrentPostAttribute( "slug" );
	}

	const newPostSlug = document.getElementById( "new-post-slug" );
	const postSlug = document.getElementById( "editable-post-name-full" );
	const elementorSlugInput = document.getElementById( "yoast_wpseo_slug" );

	if ( newPostSlug ) {
		return newPostSlug.val();
	} else if ( postSlug !== null ) {
		return postSlug.textContent;
	} else if ( elementorSlugInput ) {
		return elementorSlugInput.value;
	}
};

export const snippetEditorInitialState = {
	mode: "mobile",
	data: {
		title: title || titleTemplate,
		description: description || descriptionTemplate,
		slug: getSlug(),
	},
	wordsToHighlight: [],
	replacementVariables: getDefaultReplacementVariables(),
	uniqueRefreshValue: "",
	templates: {
		title: titleTemplate,
		description: descriptionTemplate,
	},
};
