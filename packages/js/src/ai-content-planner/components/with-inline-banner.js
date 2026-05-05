/* eslint-disable jsdoc/require-jsdoc */
import { createHigherOrderComponent } from "@wordpress/compose";
import { useSelect, useDispatch } from "@wordpress/data";
import { useCallback, useEffect, useRef } from "@wordpress/element";
import { InlineBanner } from "./inline-banner";
import { CONTENT_PLANNER_STORE, FEATURE_MODAL_STATUS, INJECTED_STYLE_ID } from "../constants";
import { STORE_NAME_AI, STORE_NAME_EDITOR } from "../../ai-generator/constants";
import { useFetchContentSuggestions } from "../hooks/use-fetch-content-suggestions";
import { handleBannerTabNavigation } from "../helpers/handle-banner-tab-navigation";

/**
 * The component that conditionally renders the Content Planner inline banner and injects the Tailwind stylesheet into the editor iframe.
 * @param {Function}   BlockListBlock The Gutenberg block component to wrap.
 * @param {Object}   props The block props passed by Gutenberg.
 * @returns {JSX.Element} The wrapped block component with the inline banner conditionally rendered before it.
 */
const FirstBlockWithBanner = ( { BlockListBlock, props } ) => {
	const { isNewPost, isBannerDismissed, isBannerRendered, hasConsent, isPremium, minPostsMet } = useSelect( ( select ) => {
		const planner = select( CONTENT_PLANNER_STORE );
		return {
			isNewPost: select( "core/editor" ).isEditedPostNew(),
			isBannerDismissed: planner.selectIsBannerDismissed(),
			isBannerRendered: planner.selectIsBannerRendered(),
			isPremium: select( STORE_NAME_EDITOR ).getIsPremium(),
			hasConsent: select( STORE_NAME_AI ).selectHasAiGeneratorConsent(),
			minPostsMet: select( CONTENT_PLANNER_STORE ).selectIsMinPostsMet(),
		};
	}, [] );

	const { setFeatureModalStatus, setBannerDismissed, setBannerRendered } = useDispatch( CONTENT_PLANNER_STORE );
	const fetchContentSuggestions = useFetchContentSuggestions();
	const ref = useRef( null );

	const shouldShow = ! isBannerDismissed && ( isNewPost || isBannerRendered ) && minPostsMet;

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

	useEffect( () => {
		if ( ! shouldShow ) {
			return;
		}

		// Gutenberg's writing-flow Tab handler runs in the bubble phase and redirects
		// focus to sentinel divs when the next tabbable is not inside the same block.
		// The banner sits outside any [data-block] block wrapper, so it is always
		// skipped. Attaching a capture-phase listener lets us act before Gutenberg does;
		// once we call preventDefault(), Gutenberg's early-return guard fires and leaves
		// focus alone.
		const ownerDoc = ref.current?.ownerDocument;
		if ( ! ownerDoc ) {
			return;
		}

		function handleTabNavigation( event ) {
			handleBannerTabNavigation( ref.current, event );
		}

		ownerDoc.addEventListener( "keydown", handleTabNavigation, { capture: true } );
		return () => ownerDoc.removeEventListener( "keydown", handleTabNavigation, { capture: true } );
	}, [ shouldShow ] );

	return (
		<>
			{ shouldShow && (
				<div ref={ ref } className="wp-block" data-block="yoast-content-planner-banner">
					<InlineBanner
						isPremium={ isPremium }
						onDismiss={ handleDismiss }
						onClick={ handleClick }
					/>
				</div>
			) }
			<BlockListBlock { ...props } />
		</>
	);
};

/**
 * Higher-order component for `editor.BlockListBlock` that injects the Content
 * Planner inline banner before the first top-level block in the canvas.
 *
 * The banner sits before (not after) the wrapped block on purpose: rendering
 * it after places it at the bottom edge of Gutenberg's block wrapper, where
 * the between-block inserter (the blue "+" line) draws and visually cuts
 * through the banner. Putting the banner first keeps the wrapper's bottom
 * edge at the actual block, so the inserter renders below the block where
 * Gutenberg expects it.
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
export const withInlineBanner = createHigherOrderComponent( ( BlockListBlock ) => function WithInlineBanner( props ) {
	const isFirstBlock = useSelect( ( select ) => {
		return select( "core/block-editor" ).getBlockOrder()[ 0 ] === props.clientId;
	}, [ props.clientId ] );

	// Non-first blocks: zero additional overhead.
	if ( ! isFirstBlock ) {
		return <BlockListBlock { ...props } />;
	}

	// Only the first block renders the full component with all subscriptions.
	return <FirstBlockWithBanner BlockListBlock={ BlockListBlock } props={ props } />;
}, "withYoastContentPlannerBanner" );
