/* External dependencies */
import { Fragment, useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

/* Yoast dependencies */
import { colors } from "@yoast/style-guide";

/* Internal dependencies */
import { ModalContainer } from "./modals/Container";
import Modal from "./modals/Modal";
import { ReactComponent as YoastIcon } from "../../images/Yoast_icon_kader.svg";
import { isCloseEvent } from "./modals/editorModals/EditorModal.js";
import SidebarButton from "./SidebarButton";
import WincherSEOPerformance from "../containers/WincherSEOPerformance";
import { isFeatureEnabled } from "@yoast/feature-flag";

/**
 * Handles the click event on the "Track SEO performance" button.
 *
 * @param {Object} props The props to use.
 *
 * @returns {void}
 */
export function openModal( props ) {
	const { keyphrases, onNoKeyphraseSet, onOpen, location } = props;

	if ( ! keyphrases.length ) {
		onNoKeyphraseSet();

		return;
	}

	onOpen( location );
}

/**
 * Handles the close event for the modal.
 *
 * @param {Object} props The props to use.
 * @param {Event} event The event passed to the closeModal.
 *
 * @returns {void}
 */
export function closeModal( props, event ) {
	if ( ! isCloseEvent( event ) ) {
		return;
	}

	props.onClose();
}

/**
 * The WincherSEOPerformanceModal modal.
 *
 * @param {Object} props The props to use.
 *
 * @returns {wp.Element} The WincherSEOPerformanceModal.
 */
export default function WincherSEOPerformanceModal( props ) {
	if ( ! isFeatureEnabled( "WINCHER_INTEGRATION" ) ) {
		return null;
	}

	const { location, whichModalOpen } = props;

	const onModalOpen = useCallback( () => {
		openModal( props );
	}, [ openModal, props ] );

	const onModalClose = useCallback( ( event ) => {
		closeModal( props, event );
	}, [ closeModal, props ] );

	const title = __( "Track SEO performance", "wordpress-seo" );

	return (
		<Fragment>
			{ whichModalOpen === location &&
			<Modal
				title={ title }
				onRequestClose={ onModalClose }
				icon={ <YoastIcon /> }
				additionalClassName="yoast-wincher-seo-performance-modal"
			>
				<ModalContainer
					className="yoast-gutenberg-modal__content yoast-wincher-seo-performance-modal__content"
				>
					<WincherSEOPerformance />
				</ModalContainer>
			</Modal>
			}

			{ location === "sidebar" &&
			<SidebarButton
				id={ `wincher-open-button-${location}` }
				title={ title }
				suffixIcon={ { size: "20px", icon: "pencil-square" } }
				prefixIcon={ { icon: "chart-square-bar", color: colors.$color_grey_medium_dark } }
				onClick={ onModalOpen }
			/>
			}
		</Fragment>
	);
}

WincherSEOPerformanceModal.propTypes = {
	location: PropTypes.string,
	whichModalOpen: PropTypes.oneOf( [
		"none",
		"metabox",
		"sidebar",
	] ),
};

WincherSEOPerformanceModal.defaultProps = {
	location: "",
	whichModalOpen: "none",
};
