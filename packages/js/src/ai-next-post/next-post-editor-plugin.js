import { createBlock } from "@wordpress/blocks";
import { useEffect, useRef } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { STORE_NAME } from "./store";

/**
 * The editor plugin component for the Next Post feature.
 *
 * Ensures a paragraph block exists when the canvas is empty so the inline
 * banner (rendered via a block filter) has a block to attach to.
 *
 * @returns {null} Renders nothing.
 */
export const NextPostEditorPlugin = () => {
	const hasInsertedParagraph = useRef( false );

	const { isBannerDismissed, blocks } = useSelect( select => ( {
		isBannerDismissed: select( STORE_NAME )?.getIsBannerDismissed?.() ?? false,
		blocks: select( "core/block-editor" ).getBlocks(),
	} ), [] );

	const blockEditorDispatch = useDispatch( "core/block-editor" );

	useEffect( () => {
		if ( isBannerDismissed || blocks.length !== 0 || hasInsertedParagraph.current ) {
			return;
		}

		hasInsertedParagraph.current = true;
		// eslint-disable-next-line no-undefined
		blockEditorDispatch.insertBlock( createBlock( "core/paragraph" ), 0, undefined, false );
	}, [ blocks, isBannerDismissed, blockEditorDispatch ] );

	return null;
};
