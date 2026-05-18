import { useCallback } from "@wordpress/element";
import { useDispatch, select } from "@wordpress/data";
import { buildBlocksFromOutline } from "../helpers/build-blocks-from-outline";
import { CONTENT_PLANNER_STORE } from "../constants";

/**
 * Returns a callback that applies the content outline to the post.
 *
 * Fetches the outline from the API, merges it with the user's edits from the
 * modal, then writes the new blocks, title, and category in a single `editPost`
 * call so a single Gutenberg undo reverts everything together.
 *
 * @param {Object} params                  The parameters.
 * @param {Object} params.editedOutlineRef Ref holding the user's edits from the outline modal.
 *
 * @returns {Function} Callback to apply the outline.
 */
export const useApplyOutline = ( { editedOutlineRef } ) => {
	const { editPost } = useDispatch( "core/editor" );
	const { closeModal, setBannerDismissed } = useDispatch( CONTENT_PLANNER_STORE );

	return useCallback( () => {
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

		// Write blocks, title, and category in a single editPost call so they share one
		// Gutenberg undo entry. Each separate dispatch on `core/editor` / `core/block-editor`
		// would otherwise create its own undo level.
		const edits = {
			title: metaOutline.title,
			blocks: buildBlocksFromOutline( structure ),
			meta: {
				// eslint-disable-next-line camelcase
				_yoast_wpseo_title: metaOutline.title,
				// eslint-disable-next-line camelcase
				_yoast_wpseo_metadesc: metaOutline.metaDescription,
				// eslint-disable-next-line camelcase
				_yoast_wpseo_focuskw: metaOutline.focusKeyphrase,
			},
		};
		if ( metaOutline.category?.id && metaOutline.category.id !== -1 ) {
			edits.categories = [ metaOutline.category.id ];
		}
		editPost( edits );

		setBannerDismissed();

		closeModal();
	}, [ editPost, closeModal, setBannerDismissed ] );
};
