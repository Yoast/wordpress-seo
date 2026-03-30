import { Modal } from "@yoast/ui-library";
import { Fragment, useState, useEffect, useCallback } from "@wordpress/element";
import { ApproveModal } from "./approve-modal";
import { ContentSuggestionsModal } from "./content-suggestions-modal";
import { Transition } from "@headlessui/react";

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
	const [ status, setStatus ] = useState( null );

	const handleGetSuggestionsClick = useCallback( () => {
		setStatus( "content-suggestions-loading" );
	}, [] );

	useEffect( () => {
		if ( status === null ) {
			const timer = setTimeout( () => setStatus( "idle" ), 300 );
			return () => clearTimeout( timer );
		}
		if ( status === "content-suggestions-loading" ) {
			const timer = setTimeout( () => setStatus( "content-suggestions-success" ), 5000 );
			return () => clearTimeout( timer );
		}
	}, [ status ] );

	useEffect( () => {
		if ( ! isOpen ) {
			setStatus( "idle" );
		}
	}, [ isOpen ] );

	return (
		<Modal isOpen={ isOpen } onClose={ onClose }>
			<div className="yst-relative yst-w-full yst-max-w-2xl">
				<Transition
					as={ Fragment }
					show={ status === "idle" }
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
					show={ status === "content-suggestions-success" || status === "content-suggestions-loading" }
					enter="yst-transition-opacity yst-duration-300 yst-delay-300"
					enterFrom="yst-opacity-0"
					enterTo="yst-opacity-100"
					leave="yst-transition-opacity yst-duration-300"
					leaveFrom="yst-opacity-100"
					leaveTo="yst-opacity-0"
				>
					<div>
						<ContentSuggestionsModal status={ status } isPremium={ isPremium } />
					</div>
				</Transition>
			</div>
		</Modal>
	);
};
