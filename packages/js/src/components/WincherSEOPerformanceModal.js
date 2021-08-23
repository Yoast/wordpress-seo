/* External dependencies */
import { Fragment, Component } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import without from "lodash/without";

/* Yoast dependencies */
import { colors } from "@yoast/style-guide";

/* Internal dependencies */
import { ModalContainer } from "./modals/Container";
import Modal from "./modals/Modal";
import { ReactComponent as YoastIcon } from "../../images/Yoast_icon_kader.svg";
import { isCloseEvent } from "./modals/editorModals/EditorModal.js";
import SidebarButton from "./SidebarButton";
import WincherSEOPerformance from "../containers/WincherSEOPerformance";

/**
 * Redux container for the WincherSEOPerformanceModal modal.
 */
class WincherSEOPerformanceModal extends Component {
	/**
	 * Constructs the WincherSEOPerformanceModal component.
	 *
	 * @param {Object} props The properties.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.onModalOpen      = this.onModalOpen.bind( this );
		this.onModalClose     = this.onModalClose.bind( this );
	}

	/**
	 * Handles the click event on the "Get related keyphrase" button.
	 *
	 * @returns {void}
	 */
	onModalOpen() {
		if ( without( this.props.keyphrases, "", null ).length === 0 ) {
			this.props.onNoKeyphraseSet();
		}

		this.props.onOpen( this.props.location );
	}

	/**
	 * Handles the close event for the modal.
	 *
	 * @param {Event} event The event passed to the onRequestClose.
	 *
	 * @returns {void}
	 */
	onModalClose( event ) {
		if ( ! isCloseEvent( event ) ) {
			return;
		}

		this.props.onClose();
	}

	/**
	 * Renders the WincherSEOPerformanceModal modal component.
	 *
	 * @returns {wp.Element} The WincherSEOPerformanceModal modal component.
	 */
	render() {
		const { location, whichModalOpen } = this.props;
		const title = __( "Track SEO performance", "wordpress-seo" );

		return (
			<Fragment>
				{ whichModalOpen === location &&
				<Modal
					title={ title }
					onRequestClose={ this.onModalClose }
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
						onClick={ this.onModalOpen }
					/>
				}
			</Fragment>
		);
	}
}

WincherSEOPerformanceModal.propTypes = {
	location: PropTypes.string,
	whichModalOpen: PropTypes.oneOf( [
		"none",
		"metabox",
		"sidebar",
	] ),
	onOpen: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
	onNoKeyphraseSet: PropTypes.func.isRequired,
	keyphrases: PropTypes.array,
};

WincherSEOPerformanceModal.defaultProps = {
	location: "",
	whichModalOpen: "none",
	keyphrases: [],
};

export default WincherSEOPerformanceModal;
