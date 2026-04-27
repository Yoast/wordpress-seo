import { useCallback } from "@wordpress/element";
import { useDispatch, select } from "@wordpress/data";
import { buildBlocksFromOutline } from "../helpers/build-blocks-from-outline";
import { applyPostMetaFromOutline } from "../helpers/apply-post-meta-from-outline";
import { CONTENT_PLANNER_STORE } from "../constants";

/**
 * Returns a callback that applies the content outline to the post.
 *
 * Fetches the outline from the API, merges it with the user's edits from the
 * modal, then replaces the editor blocks, removes the banner block, and closes the modal.
 *
 * @param {Object} params                  The parameters.
 * @param {Object} params.editedOutlineRef Ref holding the user's edits from the outline modal.
 *
 * @returns {Function} Async callback to apply the outline.
 */
export const useApplyOutline = ( { editedOutlineRef } ) => {
	const { resetBlocks, removeBlock } = useDispatch( "core/block-editor" );
	const { closeModal } = useDispatch( CONTENT_PLANNER_STORE );

	return useCallback( async() => {
		const editedOutline = editedOutlineRef.current;
		const apiOutline = select( CONTENT_PLANNER_STORE ).selectContentOutline();
		const apiSuggestion = select( CONTENT_PLANNER_STORE ).selectSuggestion();

		// Build metadata from the user's edits in the modal.
		const metaOutline = editedOutline
			? {
				title: editedOutline.title,
				metaDescription: editedOutline.metaDescription,
				focusKeyphrase: editedOutline.focusKeyphrase,
				category: editedOutline.category,
			}
			: {
				title: apiSuggestion.title,
				metaDescription: apiSuggestion.meta_description,
				focusKeyphrase: apiSuggestion.keyphrase,
				category: apiSuggestion.category,
			};

		const structure = editedOutline ? editedOutline.structure : apiOutline;

		resetBlocks( buildBlocksFromOutline( structure ) );

		applyPostMetaFromOutline( metaOutline );

		const banner = select( "core/block-editor" ).getBlocks().find( ( b ) => b.name === "yoast/content-planner-banner" );
		if ( banner ) {
			removeBlock( banner.clientId );
		}

		closeModal();
	}, [ resetBlocks, removeBlock, closeModal ] );
};
