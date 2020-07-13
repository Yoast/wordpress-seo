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

		this.handleOnClick = this.handleOnClick.bind( this );
		this.onModalClose = this.onModalClose.bind( this );
	}

	/**
	 * Handles the click event on the "Get related keyphrases" button.
	 *
	 * @returns {void}
	 */
	handleOnClick() {
		// Add not-logged in logic here.

		if ( ! this.props.keyphrase ) {
			// Add logic to display the empty keyphrase message here.
			return;
		}

		this.props.onOpen();
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
		const { keyphrase, location, maxRelatedKeyphrasesEntered, isModalOpen } = this.props;

		return (
			<Fragment>
				<BaseButton
					id="yoast-get-related-keyphrases"
					className="yoast-related-keyphrases-modal__button"
					onClick={ this.handleOnClick }

				>
					{ __( "Get related keyphrases", "wordpress-seo" ) }
				</BaseButton>
				{ keyphrase && isModalOpen &&
					<Modal
						title={ __( "Related keyphrases", "wordpress-seo" ) }
						//onRequestClose={() => this.onModalClose()}
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

							<h2>Debug info</h2>
							<p>
								The keyphrase is: { keyphrase }<br />
								The location is: { location }
							</p>

							<button
								onClick={() => this.onModalClose()}
							>
								close modal
							</button>
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
	isModalOpen: PropTypes.bool,
	currentDatabase: PropTypes.string,
};

RelatedKeyphrasesModal.defaultProps = {
	keyphrase: "",
	location: "",
	maxRelatedKeyphrasesEntered: false,
	isModalOpen: false,
	currentDatabase: "us",
};

export default RelatedKeyphrasesModal;
