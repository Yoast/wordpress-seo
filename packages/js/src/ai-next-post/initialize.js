import { createHigherOrderComponent } from "@wordpress/compose";
import { register, useSelect, useDispatch } from "@wordpress/data";
import { useCallback, useEffect, useRef, Fragment } from "@wordpress/element";
import { addFilter } from "@wordpress/hooks";
import { registerPlugin } from "@wordpress/plugins";
import { store, STORE_NAME } from "./store";
import { NextPostInlineBanner } from "./components/next-post-inline-banner";
import { NextPostEditorPlugin } from "./next-post-editor-plugin";

register( store );

const INJECTED_STYLE_ID = "yoast-seo-tailwind-css";

const withNextPostBanner = createHigherOrderComponent( ( BlockEdit ) => {
	// eslint-disable-next-line react/display-name
	return ( props ) => {
		if ( props.name !== "core/paragraph" ) {
			return <BlockEdit { ...props } />;
		}

		const storeDispatch = useDispatch( STORE_NAME );
		const handleClose = useCallback( () => storeDispatch?.dismissBanner(), [ storeDispatch ] );
		const handleClick = useCallback( () => storeDispatch?.openModal(), [ storeDispatch ] );
		const ref = useRef( null );

		const showBanner = useSelect( ( select ) => {
			const isBannerDismissed = select( STORE_NAME )?.getIsBannerDismissed?.() ?? false;
			if ( isBannerDismissed ) {
				return false;
			}
			const blocks = select( "core/block-editor" ).getBlocks();
			const isFirstBlock = blocks[ 0 ]?.clientId === props.clientId;
			const isEmpty = ! props.attributes?.content?.trim();
			return isFirstBlock && isEmpty;
		}, [ props.clientId, props.attributes?.content ] );

		useEffect( () => {
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
			<Fragment>
				<span ref={ ref } style={ { display: "none" } } />
				<BlockEdit { ...props } />
				{ showBanner && <NextPostInlineBanner onClick={ handleClick } onClose={ handleClose } /> }
			</Fragment>
		);
	};
}, "withNextPostBanner" );

addFilter( "editor.BlockEdit", "yoast-seo/next-post-banner", withNextPostBanner );

/**
 * Initializes the Next Post feature.
 *
 * Registers an editor plugin (NextPostEditorPlugin) that ensures a paragraph
 * block exists when the canvas is empty so the inline banner can be shown.
 *
 * @returns {void}
 */
export default function initNextPostBanner() {
	registerPlugin( "yoast-next-post", { render: NextPostEditorPlugin } );
}
