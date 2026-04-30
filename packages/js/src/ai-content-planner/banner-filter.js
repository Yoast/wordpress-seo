import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import { useSelect, useDispatch } from "@wordpress/data";
import { useCallback, useEffect, useRef } from "@wordpress/element";
import { InlineBanner } from "./components/inline-banner";
import { CONTENT_PLANNER_STORE, FEATURE_MODAL_STATUS } from "./constants";
import { STORE_NAME_AI, STORE_NAME_EDITOR } from "../ai-generator/constants";
import { useFetchContentSuggestions } from "./hooks/use-fetch-content-suggestions";

const DRAFTABLE_STATUSES = [ "auto-draft", "draft" ];
const INJECTED_STYLE_ID = "yoast-seo-tailwind-css";

/**
 * Higher-order component for `editor.BlockListBlock` that injects the Content
 * Planner inline banner after the first top-level block in the canvas.
 *
 * The banner is purely UI here — it is NOT a block in the editor's data model,
 * so it does not affect Gutenberg's `isEditedPostEmpty` detection or the
 * Publish button's enabled state.
 *
 * Banner persistence rides on two hidden meta inputs registered via WPSEO_Meta;
 * the content planner store seeds its banner slice from those inputs at boot,
 * and the dispatched actions write back to them so the metabox save pipeline
 * persists "1" on the next save.
 */
const withInlineBanner = createHigherOrderComponent( ( BlockListBlock ) => function WithInlineBanner( props ) {
	const { isFirstBlock, isNewPost, isPostMatch, isBannerDismissed, isBannerRendered, hasConsent, isPremium } = useSelect( ( select ) => {
		const firstBlockClientId = select( "core/block-editor" ).getBlockOrder()[ 0 ];
		const status = select( "core/editor" ).getEditedPostAttribute( "status" );
		const postType = select( "core/editor" ).getCurrentPostType();
		const planner = select( CONTENT_PLANNER_STORE );

		return {
			isFirstBlock: firstBlockClientId === props.clientId,
			isNewPost: select( "core/editor" ).isEditedPostNew(),
			isPostMatch: postType === "post" && planner.selectIsMinPostsMet() && DRAFTABLE_STATUSES.includes( status ),
			isBannerDismissed: planner.selectIsBannerDismissed(),
			isBannerRendered: planner.selectIsBannerRendered(),
			isPremium: select( STORE_NAME_EDITOR ).getIsPremium(),
			hasConsent: select( STORE_NAME_AI ).selectHasAiGeneratorConsent(),
		};
	}, [ props.clientId ] );

	const { setFeatureModalStatus, setBannerDismissed, setBannerRendered } = useDispatch( CONTENT_PLANNER_STORE );
	const fetchContentSuggestions = useFetchContentSuggestions();
	const ref = useRef( null );

	const shouldShow = isFirstBlock && isPostMatch && ! isBannerDismissed && ( isNewPost || isBannerRendered );
	console.log( { isFirstBlock, isPostMatch, isBannerDismissed, isBannerRendered, isNewPost } );

	const handleDismiss = useCallback( () => {
		setBannerDismissed();
	}, [ setBannerDismissed ] );

	const handleClick = useCallback( () => {
		if ( hasConsent ) {
			fetchContentSuggestions();
		} else {
			setFeatureModalStatus( FEATURE_MODAL_STATUS.consent );
		}
	}, [ hasConsent, fetchContentSuggestions, setFeatureModalStatus ] );

	useEffect( () => {
		// Mark the post as having seen the banner, so subsequent reloads still show it (until dismissed).
		if ( shouldShow && ! isBannerRendered ) {
			setBannerRendered();
		}
	}, [ shouldShow, isBannerRendered, setBannerRendered ] );

	useEffect( () => {
		// Mirror the Tailwind stylesheet into the editor iframe's document so the banner is styled inside the iframed canvas.
		const ownerDoc = ref.current?.ownerDocument;
		if ( ! ownerDoc || ownerDoc === window.document || ownerDoc.getElementById( INJECTED_STYLE_ID ) ) {
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
	}, [ shouldShow ] );

	return (
		<>
			<BlockListBlock { ...props } />
			{ shouldShow && (
				<div ref={ ref }>
					<InlineBanner
						isPremium={ isPremium }
						onDismiss={ handleDismiss }
						onClick={ handleClick }
					/>
				</div>
			) }
		</>
	);
}, "withYoastContentPlannerBanner" );

/**
 * Registers the editor.BlockListBlock filter that renders the inline banner.
 *
 * Deferred behind a function so the filter is only added when the Content
 * Planner feature initializes, not at module import time.
 *
 * @returns {void}
 */
export function registerBannerFilter() {
	addFilter( "editor.BlockListBlock", "yoast/content-planner-banner", withInlineBanner );
}
