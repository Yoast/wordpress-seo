import { createBlock } from "@wordpress/blocks";
import { useSelect, useDispatch } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { useEffect, useRef } from "@wordpress/element";
import { registerPlugin } from "@wordpress/plugins";
import { get } from "lodash";
import { App } from "./components/app";
import "./blocks/content-suggestion-block";
import { CONTENT_PLANNER_STORE } from "./constants";
import { getIsBannerDismissedFromInput, getIsBannerRenderedFromInput } from "./helpers/fields";
import { registerStore } from "./store";
import { AVAILABILITY_NAME } from "./store/availability";
import { BANNER_NAME } from "./store/banner";
import { CONTENT_OUTLINE_NAME } from "./store/content-outline";
import { CONTENT_SUGGESTIONS_NAME } from "./store/content-suggestions";
import { withInlineBanner } from "./components/with-inline-banner";
import { addFilter } from "@wordpress/hooks";


/**
 * Ensures a fresh post has at least one block in the canvas, so the
 * `editor.BlockListBlock` filter has something to attach the banner to.
 *
 * Without this, a brand-new post shows only Gutenberg's empty-canvas appender
 * (which is not a real block), so the filter never fires and the banner only
 * appears once the user starts typing.
 *
 * @param {Array}    blocks      The current list of blocks in the editor.
 * @param {Function} insertBlock The block editor insertBlock dispatch function.
 * @param {boolean} isBannerRendered Whether the banner is rendered already in the post.
 * @returns {boolean} Whether the banner insertion is complete.
 */
export function insertFirstParagraph( blocks, insertBlock, isBannerRendered ) {
	if ( isBannerRendered ) {
		return true;
	}

	// If canvas is empty, insert a paragraph first; the effect will re-run.
	if ( blocks.length === 0 ) {
		// eslint-disable-next-line no-undefined
		insertBlock( createBlock( "core/paragraph" ), 0, undefined, false );
		return false;
	}

	const firstParagraphIndex = blocks.findIndex( b => b.name === "core/paragraph" );
	return firstParagraphIndex !== -1;
}


/**
 * Editor plugin that auto-inserts the Content Planner Banner component (via the `editor.BlockListBlock` filter) in new posts of the "post" type,
 * after the first paragraph on new posts and renders the shared
 * FeatureModal controlled by the content planner store.
 *
 * @returns {void}
 */
export const ContentPlannerEditorPlugin = () => {
	const hasInserted = useRef( false );

	const { isNewPost, postType, blocks, minPostsMet, isBannerRendered } = useSelect( select => {
		return {
			isNewPost: select( "core/editor" ).isEditedPostNew(),
			postType: select( "core/editor" ).getCurrentPostType(),
			blocks: select( "core/block-editor" ).getBlocks(),
			minPostsMet: select( CONTENT_PLANNER_STORE ).selectIsMinPostsMet(),
			isBannerRendered: select( CONTENT_PLANNER_STORE ).selectIsBannerRendered(),
		};
	}, [] );

	const { insertBlock } = useDispatch( "core/block-editor" );

	useEffect( () => {
		if ( hasInserted.current || ! isNewPost || postType !== "post" || ! minPostsMet ) {
			return;
		}

		hasInserted.current = insertFirstParagraph( blocks, insertBlock, isBannerRendered );
	}, [ blocks, isNewPost, postType, insertBlock, minPostsMet ] );

	return (
		<App />
	);
};

/**
 * Registers the editor.BlockListBlock filter that renders the inline banner.
 *
 * Deferred behind a function so the filter is only added when the Content
 * Planner feature initializes, not at module import time.
 *
 * @returns {void}
 */
export function registerInlineBanner() {
	addFilter( "editor.BlockListBlock", "yoast/content-planner-banner", withInlineBanner );
}

/**
 * Initializes the Content Planner feature.
 *
 * Registers the editor plugin (modals), the inline-banner filter, the legacy
 * banner block (kept for parsing posts saved during RC2 that contain the block
 * comment), and the content planner store.
 *
 * @returns {void}
 */
export default function initContentPlanner() {
	// The banner slice's initial state must come from the hidden inputs that the metabox renders into the DOM.
	// Those inputs only exist after the document is ready, so the store registration is deferred until then.
	domReady( () => {
		registerStore( {
			[ CONTENT_SUGGESTIONS_NAME ]: {
				endpoint: get( window, "wpseoContentPlanner.endpoints.getSuggestions", "" ),
			},
			[ CONTENT_OUTLINE_NAME ]: {
				endpoint: get( window, "wpseoContentPlanner.endpoints.getOutline", "" ),
			},
			[ AVAILABILITY_NAME ]: {
				minPostsMet: get( window, "wpseoContentPlanner.minPostsMet", false ),
			},
			[ BANNER_NAME ]: {
				isBannerDismissed: getIsBannerDismissedFromInput(),
				isBannerRendered: getIsBannerRenderedFromInput(),
				isBannerPermanentlyDismissed: get( window, "wpseoContentPlanner.isBannerPermanentlyDismissed", false ),
				bannerPermanentDismissalEndpoint: get( window, "wpseoContentPlanner.endpoints.bannerPermanentDismissal", "" ),
			},
		} );
		// Register the inline banner filter after the store is registered,
		// so the banner component can read from the store to determine whether it should render.
		registerInlineBanner();
	} );
	registerPlugin( "yoast-content-planner", { render: ContentPlannerEditorPlugin } );
}
