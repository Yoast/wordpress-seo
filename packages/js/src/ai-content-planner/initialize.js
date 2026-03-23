import { createHigherOrderComponent } from "@wordpress/compose";
import { register, useSelect, useDispatch } from "@wordpress/data";
import { useEffect, useRef, Fragment } from "@wordpress/element";
import { addFilter } from "@wordpress/hooks";
import { registerPlugin } from "@wordpress/plugins";
import { store, STORE_NAME } from "./store";
import InlineBanner from "./containers/inline-banner";
import { PostPlannerEditorPlugin } from "./post-planner-editor-plugin";

register( store );

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
const PostPlannerBannerContainer = ( { BlockEdit, props } ) => {
	const ref = useRef( null );

	const { isBannerDismissed, shouldShowBanner } = useSelect( select => ( {
		isBannerDismissed: select( STORE_NAME )?.getIsBannerDismissed?.(),
		shouldShowBanner: select( STORE_NAME )?.getShouldShowBanner?.(),
	} ), [] );

	const isNewPost = useSelect( select => select( "core/editor" ).isEditedPostNew(), [] );

	const { showBanner } = useDispatch( STORE_NAME );

	const isFirstParagraph = useSelect( select => {
		const blocks = select( "core/block-editor" )?.getBlocks?.() ?? [];
		const firstParagraph = blocks.find( block => block.name === "core/paragraph" );
		return firstParagraph?.clientId === props.clientId;
	}, [ props.clientId ] );

	useEffect( () => {
		if ( isNewPost ) {
			showBanner();
		}
	}, [ isNewPost ] );

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
			{ ! isBannerDismissed && isFirstParagraph && shouldShowBanner && <InlineBanner /> }
		</Fragment>
	);
};

const withPostPlannerBanner = createHigherOrderComponent( ( BlockEdit ) => {
	// eslint-disable-next-line react/display-name
	return ( props ) => {
		if ( props.name !== "core/paragraph" ) {
			return <BlockEdit { ...props } />;
		}
		return <PostPlannerBannerContainer BlockEdit={ BlockEdit } props={ props } />;
	};
}, "withPostPlannerBanner" );

addFilter( "editor.BlockEdit", "yoast-seo/post-planner-banner", withPostPlannerBanner );

/**
 * Initializes the Content Planner feature.
 *
 * Registers an editor plugin (PostPlannerEditorPlugin) that ensures a paragraph
 * block exists when the canvas is empty so the inline banner can be shown.
 *
 * @returns {void}
 */
export default function initPostPlanner() {
	registerPlugin( "yoast-post-planner", { render: PostPlannerEditorPlugin } );
}
