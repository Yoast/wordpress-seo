

import domReady from "@wordpress/dom-ready";
import { createHigherOrderComponent } from "@wordpress/compose";
import { useSelect, useDispatch } from "@wordpress/data";
import { useEffect, useRef, Fragment } from "@wordpress/element";
import { addFilter } from "@wordpress/hooks";
import { registerPlugin } from "@wordpress/plugins";
import { STORE_NAME, registerStore } from "./store";
import InlineBanner from "./containers/inline-banner";
import { ContentPlannerEditorPlugin } from "./content-planner-editor-plugin";
import { getIsBannerDismissedFromInput, getIsBannerRenderedFromInput } from "./helpers/fields";

domReady( () => {
	registerStore( {
		banner: {
			isBannerDismissed: getIsBannerDismissedFromInput(),
			isBannerRendered: getIsBannerRenderedFromInput(),
		},
	} );
} );

const INJECTED_STYLE_ID = "yoast-seo-tailwind-css";

/**
 * Renders the inline banner alongside the first paragraph block's edit component.
 *
 * Extracted into its own component so all hooks are called unconditionally,
 * satisfying the Rules of Hooks. The outer HOC can safely return early for
 * non-paragraph blocks without ever reaching this component.
 *
 * @param {Function} BlockEdit The original block edit component.
 * @param {Object}   props     The block props passed by Gutenberg.
 * @returns {JSX.Element} The block edit with the inline banner conditionally appended.
 */
const ContentPlannerBannerContainer = ( { BlockEdit, props } ) => {
	const ref = useRef( null );

	const { isBannerDismissed, isBannerRendered } = useSelect( select => ( {
		isBannerDismissed: select( STORE_NAME ).getIsBannerDismissed(),
		isBannerRendered: select( STORE_NAME ).getIsBannerRendered(),
	} ), [] );

	const isNewPost = useSelect( select => select( "core/editor" ).isEditedPostNew(), [] );
	const { setBannerRendered } = useDispatch( STORE_NAME );

	const isFirstParagraph = useSelect( select => {
		const blocks = select( "core/block-editor" ).getBlocks();
		const firstParagraph = blocks.find( block => block.name === "core/paragraph" );
		return firstParagraph?.clientId === props.clientId;
	}, [ props.clientId ] );

	useEffect( () => {
		if ( isNewPost ) {
			setBannerRendered();
		}
	}, [ isNewPost, setBannerRendered ] );

	useEffect( () => {
		// Inject the stylesheet for the banner into the editor's iframe if it exists, otherwise into the main document.
		// This ensures the banner is styled correctly in both the main editor and any iframes (like the mobile preview).
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
			{ ! isBannerDismissed && isFirstParagraph && ( isNewPost || isBannerRendered ) && <InlineBanner /> }
		</Fragment>
	);
};

const withContentPlannerBanner = createHigherOrderComponent( ( BlockEdit ) => {
	// eslint-disable-next-line react/display-name
	return ( props ) => {
		if ( props.name !== "core/paragraph" ) {
			return <BlockEdit { ...props } />;
		}
		return <ContentPlannerBannerContainer BlockEdit={ BlockEdit } props={ props } />;
	};
}, "withContentPlannerBanner" );

addFilter( "editor.BlockEdit", "yoast-seo/content-planner-banner", withContentPlannerBanner );

/**
 * Initializes the Content Planner feature.
 *
 * Registers an editor plugin (ContentPlannerEditorPlugin) that ensures a paragraph
 * block exists when the canvas is empty so the inline banner can be shown.
 *
 * @returns {void}
 */
export default function initContentPlanner() {
	registerPlugin( "yoast-content-planner", { render: ContentPlannerEditorPlugin } );
}
