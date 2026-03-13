/* eslint-disable complexity */
import { createBlock } from "@wordpress/blocks";
import { useEffect, useRef } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { NEXT_POST_BANNER_BLOCK, STORE_NAME } from "./store";

/**
 * The editor plugin component for the Next Post feature.
 *
 * When the editor canvas is empty, inserts a paragraph block followed by the
 * banner block. Removes the banner when the user starts writing or dismisses it.
 *
 * @returns {null} Renders nothing.
 */
export const NextPostEditorPlugin = () => {
	const hasInsertedBanner = useRef( false );

	const { isBannerDismissed, blocks } = useSelect( select => ( {
		isBannerDismissed: select( STORE_NAME )?.getIsBannerDismissed?.() ?? false,
		blocks: select( "core/block-editor" ).getBlocks(),
	} ), [] );

	const blockEditorDispatch = useDispatch( "core/block-editor" );

	const isFirstBlockEmptyParagraph = blocks.length === 1 &&
		blocks[ 0 ]?.name === "core/paragraph" &&
		! blocks[ 0 ]?.attributes?.content?.trim();

	// The canvas is empty when there are no blocks, or exactly one block that is
	// an empty core/paragraph (the default new-post state).
	const isEmptyCanvas = blocks.length === 0 || isFirstBlockEmptyParagraph;

	// Insert a paragraph + banner when the canvas is empty.
	useEffect( () => {
		if ( isBannerDismissed || ! isEmptyCanvas || hasInsertedBanner.current ) {
			return;
		}

		// Banner block already present (e.g. loaded from a previously saved post).
		if ( blocks.some( b => b.name === NEXT_POST_BANNER_BLOCK ) ) {
			hasInsertedBanner.current = true;
			return;
		}

		hasInsertedBanner.current = true;
		if ( blocks.length === 0 ) {
			// No blocks yet — insert both the paragraph and the banner.
			// eslint-disable-next-line no-undefined
			blockEditorDispatch.insertBlock( createBlock( "core/paragraph" ), 0, undefined, false );
			// eslint-disable-next-line no-undefined
			blockEditorDispatch.insertBlock( createBlock( NEXT_POST_BANNER_BLOCK ), 1, undefined, false );
		} else if ( isFirstBlockEmptyParagraph ) {
			// There is already an empty paragraph — insert the banner after it.
			// eslint-disable-next-line no-undefined
			blockEditorDispatch.insertBlock( createBlock( NEXT_POST_BANNER_BLOCK ), 1, undefined, false );
		}
	}, [ blocks, isBannerDismissed, isEmptyCanvas, blockEditorDispatch ] );

	// Remove the banner block when dismissed or when the user starts writing.
	useEffect( () => {
		if ( ! isBannerDismissed && blocks.length === 2 && blocks[ 0 ]?.name === "core/paragraph" && ! blocks[ 0 ]?.attributes?.content?.trim() ) {
			return;
		}

		const bannerBlock = blocks.find( b => b.name === NEXT_POST_BANNER_BLOCK );
		if ( bannerBlock ) {
			blockEditorDispatch.removeBlock( bannerBlock.clientId, false );
		}
	}, [ blocks, isBannerDismissed, blockEditorDispatch ] );

	return null;
};
