import { get } from "lodash";
import domReady from "@wordpress/dom-ready";
import { Modal, Root } from "@yoast/ui-library";
import { useCallback, useRef, useState } from "@wordpress/element";
import SlotWithDefault from "./components/slots/SlotWithDefault";
import { NewFeaturesModalContent } from "./components/new-features-modal-content";
import { registerReactComponent, renderReactRoot } from "./helpers/reactRoot";

window.YoastSEO = window.YoastSEO || {};
window.YoastSEO._registerReactComponent = registerReactComponent;

/**
 * Initializes the modals containing information about new features added in the current release.
 *
 * @returns {JSX.Element} The modal.
 */
const InitializeNewFeaturesModal = () => {
	const [ isModalOpen, setIsModalOpen ] = useState( true );

	const focusElementRef = useRef( null );
	const handleClose = useCallback( () => setIsModalOpen( false ), [] );

	return (
		<SlotWithDefault key="new-features-modal-slot" name="new-features-modal-slot">
			<Modal className="yst-introduction-modal" isOpen={ isModalOpen } onClose={ handleClose } initialFocus={ focusElementRef }>
				<Modal.Panel className="yst-max-w-lg yst-p-0 yst-bg-gradient-to-b yst-from-[#EDD2E1] yst-rounded-3xl">
					<NewFeaturesModalContent onClose={ handleClose } focusElementRef={ focusElementRef } />
				</Modal.Panel>
			</Modal>
		</SlotWithDefault>
	);
};

domReady( () => {
	const context = {
		isRtl: Boolean( get( window, "wpseoScriptData.metabox.isRtl", false ) ),
	};

	renderReactRoot(
		"wpseo-new-features-modal",
		<Root context={ context }>
			<InitializeNewFeaturesModal />
		</Root>
	);
} );
