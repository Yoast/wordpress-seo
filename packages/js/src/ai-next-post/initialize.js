import { useBlockProps } from "@wordpress/block-editor";
import { registerBlockType } from "@wordpress/blocks";
import { useDispatch, register } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { registerPlugin } from "@wordpress/plugins";
import { NEXT_POST_BANNER_BLOCK, STORE_NAME, store } from "./store";
import { NextPostInlineBanner } from "./components/next-post-inline-banner";
import { NextPostEditorPlugin } from "./components/next-post-editor-plugin";

/**
 * The edit component for the inline banner block.
 *
 * @returns {JSX.Element} The block edit component.
 */
const NextPostBannerBlockEdit = () => {
	const blockProps = useBlockProps( { style: { border: "none", padding: 0, margin: 0 } } );
	const dispatch = useDispatch( STORE_NAME );
	const handleClose = useCallback( () => dispatch?.dismissBanner(), [ dispatch ] );
	const handleClick = useCallback( () => dispatch?.openModal(), [ dispatch ] );
	return (
		<div { ...blockProps }>
			<NextPostInlineBanner onClick={ handleClick } onClose={ handleClose } />
		</div>
	);
};

register( store );

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
 * Registers a block type that renders the NextPostInlineBanner as a second
 * block after the first paragraph, and registers a plugin for the top bar
 * button and approve modal. The NextPostEditorPlugin handles inserting and
 * removing the banner block based on editor state.
 *
 * @returns {void}
 */
export default function initNextPostBanner() {
	registerPlugin( "yoast-next-post", {
		render: NextPostEditorPlugin,
	} );
}
