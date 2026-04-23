import { createBlock } from "@wordpress/blocks";
import { useSelect, useDispatch } from "@wordpress/data";
import { useEffect, useRef } from "@wordpress/element";
import { registerPlugin } from "@wordpress/plugins";
import { get } from "lodash";
import FeatureModal from "./containers/feature-modal";
import { registerBannerBlock } from "./blocks/banner-block";
import { registerContentSuggestionBlock } from "./blocks/content-suggestion-block";
import { registerStore } from "./store";
import { CONTENT_SUGGESTIONS_NAME } from "./store/content-suggestions";
import { CONTENT_OUTLINE_NAME } from "./store/content-outline";

/**
 * Inserts a Content Planner Banner block after the first paragraph in the editor.
 *
 * If the canvas is empty, inserts a paragraph block first. Returns true when
 * the banner has been inserted or was already present.
 *
 * @param {Array}    blocks      The current list of blocks in the editor.
 * @param {Function} insertBlock The block editor insertBlock dispatch function.
 * @returns {boolean} Whether the banner insertion is complete.
 */
export function insertBannerAfterFirstParagraph( blocks, insertBlock ) {
	const hasBanner = blocks.some( b => b.name === "yoast/content-planner-banner" );
	if ( hasBanner ) {
		return true;
	}

	// If canvas is empty, insert a paragraph first; the effect will re-run.
	if ( blocks.length === 0 ) {
		// eslint-disable-next-line no-undefined
		insertBlock( createBlock( "core/paragraph" ), 0, undefined, false );
		return false;
	}

	const firstParagraphIndex = blocks.findIndex( b => b.name === "core/paragraph" );
	if ( firstParagraphIndex === -1 ) {
		return false;
	}

	// eslint-disable-next-line no-undefined
	insertBlock( createBlock( "yoast/content-planner-banner" ), firstParagraphIndex + 1, undefined, false );
	return true;
}


/**
 * Editor plugin that auto-inserts the Content Planner Banner block
 * after the first paragraph on new posts and renders the shared
 * FeatureModal controlled by the content planner store.
 *
 * @returns {JSX.Element} The FeatureModal element, with visibility controlled by the isOpen prop.
 */
export const ContentPlannerEditorPlugin = () => {
	const hasInserted = useRef( false );

	const { isNewPost, postType, blocks } = useSelect( select => {
		return {
			isNewPost: select( "core/editor" ).isEditedPostNew(),
			postType: select( "core/editor" ).getCurrentPostType(),
			blocks: select( "core/block-editor" ).getBlocks(),
		};
	}, [] );

	const { insertBlock } = useDispatch( "core/block-editor" );

	useEffect( () => {
		if ( hasInserted.current || ! isNewPost || postType !== "post" ) {
			return;
		}

		hasInserted.current = insertBannerAfterFirstParagraph( blocks, insertBlock );
	}, [ blocks, isNewPost, postType, insertBlock ] );

	return (
		<FeatureModal />
	);
};


/**
 * Initializes the Content Planner feature.
 *
 * Registers the editor plugin that handles auto-insertion of the
 * Content Planner Banner block on new posts.
 *
 * @returns {void}
 */
export default function initContentPlanner() {
	registerBannerBlock();
	registerContentSuggestionBlock();
	registerStore( {
		[ CONTENT_SUGGESTIONS_NAME ]: {
			endpoint: get( window, "wpseoContentPlanner.endpoints.getSuggestions", "" ),
		},
		[ CONTENT_OUTLINE_NAME ]: {
			endpoint: get( window, "wpseoContentPlanner.endpoints.getOutline", "" ),
		},
	} );
	registerPlugin( "yoast-content-planner", { render: ContentPlannerEditorPlugin } );
}
