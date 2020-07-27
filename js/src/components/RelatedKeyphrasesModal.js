/* External dependencies */
import { Fragment, Component } from "@wordpress/element";
import { Modal, Slot } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

/* Yoast dependencies */
import { BaseButton } from "@yoast/components";

/* Internal dependencies */
import { ModalContainer } from "./modals/Container";
import YoastIcon from "../../../images/Yoast_icon_kader.svg";
import SemRushMaxRelatedKeyphrases from "./modals/SemRushMaxRelatedKeyphrases";
import SEMrushRelatedKeyphrases from "../containers/RelatedKeyphrases";

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

		if ( ! this.props.keyphrase ) {
			// Add logic to display the empty keyphrase message here.
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
		const { keyphrase, location, maxRelatedKeyphrasesEntered, whichModalOpen, currentDatabase } = this.props;

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
						className="yoast-gutenberg-modal yoast-related-keyphrases-modal"
						icon={ <YoastIcon /> }
					>
						<ModalContainer
							className="yoast-gutenberg-modal__content yoast-related-keyphrases-modal__content"
						>
							{ maxRelatedKeyphrasesEntered && (
								<SemRushMaxRelatedKeyphrases />
							) }

							<Slot name="YoastRelatedKeyphrases" />

							<SEMrushRelatedKeyphrases {...this.props} />

							<h2>Debug info</h2>
							<p>
								The keyphrase is: { keyphrase }<br />
								The location is: { location }<br />
								The current database is: { currentDatabase }
							</p>

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
	maxRelatedKeyphrasesEntered: PropTypes.bool,
	whichModalOpen: PropTypes.oneOf( [
		"none",
		"metabox",
		"sidebar",
	] ),
	currentDatabase: PropTypes.string,
	onOpen: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
	setDatabase: PropTypes.func.isRequired,
};

RelatedKeyphrasesModal.defaultProps = {
	keyphrase: "",
	location: "",
	maxRelatedKeyphrasesEntered: false,
	whichModalOpen: "none",
	currentDatabase: "us",
};

export default RelatedKeyphrasesModal;
