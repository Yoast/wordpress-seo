import { registerBlockType } from "@wordpress/blocks";
import { useBlockProps } from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import { useCallback, useEffect, useRef } from "@wordpress/element";
import block from "./block.json";
import { InlineBanner } from "./components/inline-banner";
import { FEATURE_MODAL_STORE } from "./constants";

const INJECTED_STYLE_ID = "yoast-seo-tailwind-css";

/**
 * The edit component for the Content Planner Banner block.
 *
 * Renders the inline banner in the editor. When the user dismisses it,
 * the block is removed from the editor entirely.
 *
 * @param {Object} props           The block props.
 * @param {string} props.clientId  The block's client ID.
 * @returns {JSX.Element} The block edit component.
 */
const Edit = ( { clientId } ) => {
	const blockProps = useBlockProps();
	const ref = useRef( null );
	const isPremium = useSelect( select => select( "yoast-seo/editor" ).getIsPremium(), [] );
	const { removeBlock } = useDispatch( "core/block-editor" );
	const { openModal } = useDispatch( FEATURE_MODAL_STORE );

	const handleDismiss = useCallback( () => {
		removeBlock( clientId );
	}, [ removeBlock, clientId ] );

	const handleClick = useCallback( () => {
		openModal( true );
	}, [ openModal ] );

	useEffect( () => {
		// Inject the Tailwind stylesheet into the editor iframe if needed.
		const ownerDoc = ref.current?.ownerDocument ?? document;
		if ( ownerDoc === window.document || ownerDoc.getElementById( INJECTED_STYLE_ID ) ) {
			return;
		}
		const mainLink = window.document.getElementById( INJECTED_STYLE_ID );
		if ( ! mainLink ) {
			return;
		}
		const link = ownerDoc.createElement( "link" );
		link.id = INJECTED_STYLE_ID;
		link.rel = "stylesheet";
		link.href = mainLink.href;
		ownerDoc.head.appendChild( link );
	}, [] );

	return (
		<div { ...blockProps } ref={ ref }>
			<InlineBanner
				isPremium={ isPremium }
				onDismiss={ handleDismiss }
				onClick={ handleClick }
			/>
		</div>
	);
};

registerBlockType( block, {
	edit: Edit,
	save: () => null,
} );
