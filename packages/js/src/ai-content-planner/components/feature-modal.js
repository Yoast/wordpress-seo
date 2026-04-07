import { Modal } from "@yoast/ui-library";
import { Fragment, useState, useEffect, useCallback } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { get } from "lodash";
import { ApproveModal } from "./approve-modal";
import { ContentSuggestionsModal } from "./content-suggestions-modal";
import { Transition } from "@headlessui/react";
import { STORE_NAME } from "../store";
import { removesLocaleVariantSuffixes } from "../../ai-generator/helpers/fetch-suggestions";

/**
 * The modal that is shown when the user clicks the "Get content suggestions" button.
 *
 * @param {boolean} isOpen Whether the modal is open or not.
 * @param {function} onClose The function to call when the modal is closed.
 * @param {boolean} isEmptyCanvas Whether the post has content or not.
 * @param {boolean} isPremium Whether the user has a premium subscription or not.
 * @param {boolean} isUpsell Whether the modal is shown as an upsell or not.
 * @param {string} upsellLink The link to the upsell page.
 * @returns {JSX.Element} The Content Planner Feature Modal.
 */
export const FeatureModal = ( { isOpen, onClose, isEmptyCanvas, isPremium, isUpsell, upsellLink } ) => {
	const [ uiStatus, setUiStatus ] = useState( null );

	const { fetchContentPlannerSuggestions } = useDispatch( STORE_NAME );

	const suggestionsStatus = useSelect( ( select ) => select( STORE_NAME ).selectSuggestionsStatus(), [] );

	const { postType, contentLocale, isBlockEditor, isElementorEditor } = useSelect( ( select ) => ( {
		postType: select( "yoast-seo/editor" ).getPostType(),
		contentLocale: select( "yoast-seo/editor" ).getContentLocale(),
		isBlockEditor: select( "yoast-seo/editor" ).getIsBlockEditor(),
		isElementorEditor: select( "yoast-seo/editor" ).getIsElementorEditor(),
	} ), [] );

	const handleGetSuggestionsClick = useCallback( () => {
		// Determine the current editor type.
		let editor;
		if ( isElementorEditor ) {
			editor = "elementor";
		} else if ( isBlockEditor ) {
			editor = "gutenberg";
		} else {
			editor = "classic";
		}

		const language = removesLocaleVariantSuffixes( contentLocale ).replace( "_", "-" );

		// Read the endpoint lazily from the window global. The ai-generator script localizes
		// wpseoAiGenerator independently, so it may not be available at store creation time.
		const endpoint = get( window, "wpseoAiGenerator.endpoints.contentPlanner", "" );

		fetchContentPlannerSuggestions( { endpoint, postType, language, editor } );
	}, [ postType, contentLocale, isBlockEditor, isElementorEditor, fetchContentPlannerSuggestions ] );

	// Map store status to UI status for transitions.
	useEffect( () => {
		if ( suggestionsStatus === "loading" ) {
			setUiStatus( "content-suggestions-loading" );
		} else if ( suggestionsStatus === "success" ) {
			setUiStatus( "content-suggestions-success" );
		}
	}, [ suggestionsStatus ] );

	// Delay setting the status to "idle" to allow assistive technology to announce the changes.
	useEffect( () => {
		if ( uiStatus === null ) {
			const timer = setTimeout( () => setUiStatus( "idle" ), 300 );
			return () => clearTimeout( timer );
		}
	}, [ uiStatus ] );

	useEffect( () => {
		if ( ! isOpen ) {
			setUiStatus( "idle" );
		}
	}, [ isOpen ] );

	return (
		<Modal isOpen={ isOpen } onClose={ onClose }>
			<div className="yst-relative yst-w-full yst-max-w-2xl">
				<Transition
					as={ Fragment }
					show={ uiStatus === "idle" }
					enter="yst-transition-opacity yst-duration-300"
					enterFrom="yst-opacity-0"
					enterTo="yst-opacity-100"
					leave="yst-transition-opacity yst-duration-300 yst-absolute yst-inset-0 yst-m-auto"
					leaveFrom="yst-opacity-100"
					leaveTo="yst-opacity-0"
				>
					<div className="yst-w-96 yst-flex yst-items-center yst-justify-center yst-mx-auto">
						<ApproveModal
							isEmptyCanvas={ isEmptyCanvas }
							isPremium={ isPremium }
							isUpsell={ isUpsell }
							onClick={ handleGetSuggestionsClick }
							upsellLink={ upsellLink }
						/>
					</div>
				</Transition>
				<Transition
					as={ Fragment }
					show={ uiStatus === "content-suggestions-success" || uiStatus === "content-suggestions-loading" }
					enter="yst-transition-opacity yst-duration-300 yst-delay-300"
					enterFrom="yst-opacity-0"
					enterTo="yst-opacity-100"
					leave="yst-transition-opacity yst-duration-300"
					leaveFrom="yst-opacity-100"
					leaveTo="yst-opacity-0"
				>
					<div>
						<ContentSuggestionsModal status={ uiStatus } isPremium={ isPremium } />
					</div>
				</Transition>
			</div>
		</Modal>
	);
};
