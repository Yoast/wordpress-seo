import { createBlock } from "@wordpress/blocks";
import { useSelect, useDispatch, select as wpSelect } from "@wordpress/data";
import { useEffect, useRef, useCallback } from "@wordpress/element";
import { count } from "@wordpress/wordcount";
import { registerPlugin } from "@wordpress/plugins";
import { registerStore } from "./store";
import { FeatureModal } from "./components/feature-modal";
import { FEATURE_MODAL_STORE, FEATURE_MODAL_STATUS } from "./constants";
import "./block";

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
 * Removes the Content Planner Banner block from the editor if present.
 *
 * @param {Function} removeBlock The block editor removeBlock dispatch function.
 * @returns {void}
 */
function removeBannerBlock( removeBlock ) {
	const blocks = wpSelect( "core/block-editor" ).getBlocks();
	const banner = blocks.find( b => b.name === "yoast/content-planner-banner" );
	if ( banner ) {
		removeBlock( banner.clientId );
	}
}

/**
 * Editor plugin that auto-inserts the Content Planner Banner block
 * after the first paragraph on new posts and renders the shared
 * FeatureModal controlled by the content planner store.
 *
 * @returns {JSX.Element|null} The FeatureModal when open, otherwise null.
 */
export const ContentPlannerEditorPlugin = () => {
	const hasInserted = useRef( false );

	const { isNewPost, postType, blocks, isModalOpen, skipApprove, isPremium, isEmptyCanvas, upsellLink } = useSelect( select => {
		const content = select( "core/editor" ).getEditedPostContent();
		return {
			isNewPost: select( "core/editor" ).isEditedPostNew(),
			postType: select( "core/editor" ).getCurrentPostType(),
			blocks: select( "core/block-editor" ).getBlocks(),
			isModalOpen: select( FEATURE_MODAL_STORE ).selectIsModalOpen(),
			skipApprove: select( FEATURE_MODAL_STORE ).selectShouldSkipApprove(),
			isPremium: select( "yoast-seo/editor" ).getIsPremium(),
			isEmptyCanvas: count( content, "words", {} ) === 0,
			upsellLink: select( "yoast-seo/editor" ).selectLink( "https://yoa.st/content-planner-approve-modal" ),
		};
	}, [] );

	const { insertBlock, removeBlock } = useDispatch( "core/block-editor" );
	const { closeModal } = useDispatch( FEATURE_MODAL_STORE );

	useEffect( () => {
		if ( hasInserted.current || ! isNewPost || postType !== "post" ) {
			return;
		}

		hasInserted.current = insertBannerAfterFirstParagraph( blocks, insertBlock );
	}, [ blocks, isNewPost, postType, insertBlock ] );

	const handleClose = useCallback( () => {
		closeModal();
	}, [ closeModal ] );

	// Temporary: will be wired to handleApplyOutline (store-based outline application) once the blocks PR is merged.
	const handleAddOutline = useCallback( () => {
		removeBannerBlock( removeBlock );
	}, [ removeBlock ] );

	return (
		<FeatureModal
			isOpen={ isModalOpen }
			onClose={ handleClose }
			isEmptyCanvas={ isEmptyCanvas }
			isPremium={ isPremium }
			upsellLink={ upsellLink }
			onAddOutline={ handleAddOutline }
			initialStatus={ skipApprove ? FEATURE_MODAL_STATUS.contentSuggestionsLoading : null }
		/>
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
	registerStore();
	registerPlugin( "yoast-content-planner", { render: ContentPlannerEditorPlugin } );
}
