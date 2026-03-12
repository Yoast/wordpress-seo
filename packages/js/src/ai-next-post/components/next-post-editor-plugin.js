import { createBlock } from "@wordpress/blocks";
import { useEffect, useRef } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { NEXT_POST_BANNER_BLOCK, STORE_NAME } from "../store";

/**
 * The editor plugin component for the Next Post feature.
 *
 * Renders the Next Post Approve modal and inserts the inline banner as a second block
 * after the first paragraph on a new/empty post.
 *
 * @returns {JSX.Element} The Next Post editor plugin component.
 */
export const NextPostEditorPlugin = () => {
	const hasInsertedBanner = useRef( false );

	const { isBannerDismissed, blocks } = useSelect( select => ( {
		isBannerDismissed: select( STORE_NAME )?.getIsBannerDismissed?.() ?? false,
		blocks: select( "core/block-editor" ).getBlocks(),
	} ), [] );

	const blockEditorDispatch = useDispatch( "core/block-editor" );

	// The canvas is empty when no block (excluding the banner itself) has any content.
	const isEmptyCanvas = ! blocks.some( block => {
		if ( block.name === NEXT_POST_BANNER_BLOCK ) {
			return false;
		}
		return Boolean( block.attributes?.content?.trim() );
	} );

	// Auto-insert the banner block after the first paragraph on an empty canvas.
	useEffect( () => {
		if ( isBannerDismissed || ! isEmptyCanvas || hasInsertedBanner.current ) {
			return;
		}

		// Banner block already present (e.g. loaded from a previously saved post).
		if ( blocks.some( b => b.name === NEXT_POST_BANNER_BLOCK ) ) {
			hasInsertedBanner.current = true;
			return;
		}

		const firstParagraphIndex = blocks.findIndex( b => b.name === "core/paragraph" );
		if ( firstParagraphIndex === -1 ) {
			// No paragraph block yet — wait for the next blocks update.
			return;
		}

		// Pass null as rootClientId and false to not select the inserted block.
		blockEditorDispatch.insertBlock(
			createBlock( NEXT_POST_BANNER_BLOCK ),
			firstParagraphIndex + 1,
			null,
			false
		);
		hasInsertedBanner.current = true;
	}, [ blocks, isBannerDismissed, isEmptyCanvas, blockEditorDispatch ] );

	// Remove the banner block when dismissed or when the user starts writing.
	useEffect( () => {
		if ( ! isBannerDismissed && isEmptyCanvas ) {
			return;
		}
		const bannerBlock = blocks.find( b => b.name === NEXT_POST_BANNER_BLOCK );
		if ( bannerBlock ) {
			blockEditorDispatch.removeBlock( bannerBlock.clientId, false );
		}
	}, [ blocks, isBannerDismissed, isEmptyCanvas, blockEditorDispatch ] );

	return null;
};
