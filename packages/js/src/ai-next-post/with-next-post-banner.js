import { createHigherOrderComponent } from "@wordpress/compose";
import { useDispatch, useSelect } from "@wordpress/data";
import { Fragment, createPortal, useCallback, useEffect, useRef, useState } from "@wordpress/element";
import { NextPostInlineBanner } from "./components/next-post-inline-banner";
import { STORE_NAME } from "./store";

const BANNER_CONTAINER_ID = "yoast-next-post-banner-container";

/**
 * A higher-order component that wraps BlockListBlock to render the
 * NextPostInlineBanner directly after the first core/paragraph block's
 * outer wrapper (outside Gutenberg's block CSS scope).
 */
const withNextPostBanner = createHigherOrderComponent( BlockListBlock => {
	const BlockListBlockWithNextPostBanner = ( props ) => {
		const { name, clientId } = props;
		const dispatch = useDispatch( STORE_NAME );
		const sentinelRef = useRef( null );
		const [ portalContainer, setPortalContainer ] = useState( null );

		const handleClose = useCallback( () => dispatch?.dismissBanner(), [ dispatch ] );
		const handleClick = useCallback( () => dispatch?.openModal(), [ dispatch ] );

		const shouldShowBanner = useSelect( select => {
			if ( name !== "core/paragraph" ) {
				return false;
			}
			if ( select( STORE_NAME )?.getIsBannerDismissed?.() ) {
				return false;
			}
			const blocks = select( "core/block-editor" ).getBlocks();
			const firstParagraph = blocks.find( block => block.name === "core/paragraph" );
			return Boolean( firstParagraph && firstParagraph.clientId === clientId );
		}, [ name, clientId ] );

		useEffect( () => {
			// Use the sentinel's ownerDocument to support iframed editors (WP 6.5+).
			const ownerDoc = sentinelRef.current?.ownerDocument ?? document;

			if ( ! shouldShowBanner ) {
				const existing = ownerDoc.getElementById( BANNER_CONTAINER_ID );
				if ( existing ) {
					existing.remove();
				}
				setPortalContainer( null );
				return;
			}

			const existing = ownerDoc.getElementById( BANNER_CONTAINER_ID );
			if ( existing ) {
				setPortalContainer( existing );
				return;
			}

			// When the block editor canvas is inside an <iframe>, CSS from the main
			// document's <head> does not apply to elements inside the iframe.
			// Inject the tailwind stylesheet into the iframe so yst-* classes render correctly.
			const INJECTED_STYLE_ID = "yoast-next-post-tailwind";
			if ( ownerDoc !== window.document && ! ownerDoc.getElementById( INJECTED_STYLE_ID ) ) {
				const mainLink = window.document.querySelector( "link[href*='tailwind']" );
				if ( mainLink ) {
					const link = ownerDoc.createElement( "link" );
					link.id = INJECTED_STYLE_ID;
					link.rel = "stylesheet";
					link.href = mainLink.href;
					ownerDoc.head.appendChild( link );
				}
			}

			let container = null;

			const insertAfterBlock = () => {
				const blockElement = ownerDoc.getElementById( `block-${ clientId }` );
				if ( ! blockElement ) {
					return false;
				}
				// Avoid duplicates in case the observer fires while a container already exists.
				if ( ownerDoc.getElementById( BANNER_CONTAINER_ID ) ) {
					return true;
				}
				container = ownerDoc.createElement( "div" );
				container.id = BANNER_CONTAINER_ID;
				// Add yst-root so the CSS selector .yst-root .yst-ai-gradient-border always matches.
				container.classList.add( "yst-root" );
				// Establish a stacking context so ::after z-index:-1 on yst-ai-gradient-border
				// stays within the element and doesn't bleed behind the block editor background.
				container.style.isolation = "isolate";
				blockElement.after( container );
				setPortalContainer( container );
				return true;
			};

			if ( insertAfterBlock() ) {
				return () => {
					container?.remove();
				};
			}

			// Block element not yet in the DOM (e.g. iframed editor initial load, or the
			// default paragraph block added asynchronously on a new post). Watch for it.
			const observer = new window.MutationObserver( () => {
				if ( insertAfterBlock() ) {
					observer.disconnect();
				}
			} );
			observer.observe( ownerDoc.body, { childList: true, subtree: true } );

			return () => {
				observer.disconnect();
				container?.remove();
			};
		}, [ shouldShowBanner, clientId ] );

		return (
			<Fragment>
				<BlockListBlock { ...props } />
				{ /* Sentinel rendered for paragraph blocks to get the correct ownerDocument. */ }
				{ name === "core/paragraph" && <span ref={ sentinelRef } style={ { display: "none" } } /> }
				{ portalContainer && createPortal(
					<NextPostInlineBanner onClick={ handleClick } onClose={ handleClose } />,
					portalContainer
				) }
			</Fragment>
		);
	};

	BlockListBlockWithNextPostBanner.displayName = "BlockListBlockWithNextPostBanner";
	return BlockListBlockWithNextPostBanner;
}, "withNextPostBanner" );

export default withNextPostBanner;
