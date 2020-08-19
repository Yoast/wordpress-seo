/* External dependencies */
import { Fragment, Component } from "@wordpress/element";
import { Slot } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

/* Yoast dependencies */
import { BaseButton } from "@yoast/components";

/* Internal dependencies */
import { ModalContainer } from "./modals/Container";
import Modal from "./modals/Modal";
import YoastIcon from "../../../images/Yoast_icon_kader.svg";

/**
 * Redux container for the RelatedKeyPhrasesModal modal.
 */
class RelatedKeyphrasesModal extends Component {
	/**
	 * Constructs the RelatedKeyPhrasesModal component.
	 *
	 * @param {Object} props The properties.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.onModalOpen  = this.onModalOpen.bind( this );
		this.onModalClose = this.onModalClose.bind( this );
	}

	/**
	 * Handles the click event on the "Get related keyphrases" button.
	 *
	 * @returns {void}
	 */
	onModalOpen() {
		// Add not-logged in logic here.

		if ( ! this.props.keyphrase.trim() ) {
			this.props.onOpenWithNoKeyphrase();
			return;
		}

		this.props.onOpen( this.props.location );
	}

	/**
	 * Handles the close event for the modal.
	 *
	 * @returns {void}
	 */
	onModalClose() {
		this.props.onClose();
	}

	/**
	 * Renders the RelatedKeyPhrasesModal modal component.
	 *
	 * @returns {React.Element} The RelatedKeyPhrasesModal modal component.
	 */
	render() {
		const { keyphrase, location, whichModalOpen } = this.props;

		return (
			<Fragment>
				<BaseButton
					id="yoast-get-related-keyphrases"
					className="yoast-related-keyphrases-modal__button"
					onClick={ this.onModalOpen }
				>
					{ __( "Get related keyphrases", "wordpress-seo" ) }
				</BaseButton>
				{ keyphrase && whichModalOpen === location &&
					<Modal
						title={ __( "Related keyphrases", "wordpress-seo" ) }
						onRequestClose={ this.onModalClose }
						icon={ <YoastIcon /> }
						additionalClassName="yoast-related-keyphrases-modal"
					>
						<ModalContainer
							className="yoast-gutenberg-modal__content yoast-related-keyphrases-modal__content"
						>
							<Slot name="YoastRelatedKeyphrases" />

						</ModalContainer>
					</Modal>
				}
			</Fragment>
		);
	}
}

RelatedKeyphrasesModal.propTypes = {
	keyphrase: PropTypes.string,
	location: PropTypes.string,
	whichModalOpen: PropTypes.oneOf( [
		"none",
		"metabox",
		"sidebar",
	] ),
	onOpen: PropTypes.func.isRequired,
	onOpenWithNoKeyphrase: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
};

RelatedKeyphrasesModal.defaultProps = {
	keyphrase: "",
	location: "",
	whichModalOpen: "none",
};

export default RelatedKeyphrasesModal;
