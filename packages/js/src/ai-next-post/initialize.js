import { useBlockProps } from "@wordpress/block-editor";
import { registerBlockType } from "@wordpress/blocks";
import { register, useDispatch } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { registerPlugin } from "@wordpress/plugins";
import { store, STORE_NAME, NEXT_POST_BANNER_BLOCK } from "./store";
import { NextPostInlineBanner } from "./components/next-post-inline-banner";
import { NextPostEditorPlugin } from "./next-post-editor-plugin";

register( store );

/**
 * The edit component for the Next Post banner block.
 *
 * @returns {JSX.Element} The block edit component.
 */
const NextPostBannerBlockEdit = () => {
	const blockProps = useBlockProps( { style: { border: "none", padding: 0, margin: 0 } } );
	const storeDispatch = useDispatch( STORE_NAME );
	const handleClose = useCallback( () => storeDispatch?.dismissBanner(), [ storeDispatch ] );
	const handleClick = useCallback( () => storeDispatch?.openModal(), [ storeDispatch ] );
	return (
		<div { ...blockProps }>
			<NextPostInlineBanner onClick={ handleClick } onClose={ handleClose } />
		</div>
	);
};

registerBlockType( NEXT_POST_BANNER_BLOCK, {
	title: "Yoast Next Post Banner",
	category: "text",
	icon: "yes",
	supports: {
		inserter: false,
		html: false,
		reusable: false,
		multiple: false,
	},
	edit: NextPostBannerBlockEdit,
	save: () => null,
} );

/**
 * Initializes the Next Post feature.
 *
 * Registers an editor plugin (NextPostEditorPlugin) that handles inserting
 * the paragraph + banner blocks when the canvas is empty, and removing the
 * banner when the user starts writing or dismisses it.
 *
 * @returns {void}
 */
export default function initNextPostBanner() {
	registerPlugin( "yoast-next-post", { render: NextPostEditorPlugin } );
}
