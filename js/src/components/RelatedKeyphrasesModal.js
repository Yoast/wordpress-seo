/* External dependencies */
import { Fragment, Component } from "@wordpress/element";
import { Modal, Slot } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

/* Yoast dependencies */
import { BaseButton } from "@yoast/components";

/* Internal dependencies */
import { ModalContainer } from "./modals/Container";
import KeyphrasesTable from "./modals/KeyphrasesTable";
import YoastIcon from "../../../images/Yoast_icon_kader.svg";
import SemRushMaxRelatedKeyphrases from "./modals/SemRushMaxRelatedKeyphrases";

/**
 * Redux container for the RelatedKeyPhrasesModal modal.
 */
class RelatedKeyPhrasesModal extends Component {
	/**
	 * Constructs the RelatedKeyPhrasesModal component.
	 *
	 * @param {Object} props The properties.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.state = {
			isModalOpen: false,
		};

		this.handleOnClick = this.handleOnClick.bind( this );
		this.openModal     = this.openModal.bind( this );
		this.closeModal    = this.closeModal.bind( this );
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

		this.openModal();
	}

	/**
	 * Opens the "Get related keyphrases" modal.
	 *
	 * @returns {void}
	 */
	openModal() {
		this.setState( { isModalOpen: true } );
	}

	/**
	 * Closes the "Get related keyphrases" modal.
	 *
	 * @returns {void}
	 */
	closeModal() {
		this.setState( { isModalOpen: false } );
	}

	/**
	 * Renders the RelatedKeyPhrasesModal modal component.
	 *
	 * @returns {React.Element} The RelatedKeyPhrasesModal modal component.
	 */
	render() {
		const { keyphrase, location, maxRelatedKeyphrasesEntered } = this.props;

		return (
			<Fragment>
				<BaseButton
					id="yoast-get-related-keyphrases"
					onClick={ this.handleOnClick }
					className="yoast-related-keyphrases-modal__button"
					{ ...this.props }
				>
					{ __( "Get related keyphrases", "wordpress-seo" ) }
				</BaseButton>
				{ keyphrase && this.state.isModalOpen &&
					<Modal
						title={ __( "Related keyphrases", "wordpress-seo" ) }
						onRequestClose={ this.closeModal }
						className="yoast-gutenberg-modal yoast-related-keyphrases-modal"
						icon={ <YoastIcon /> }
					>
						<ModalContainer
							className="yoast-gutenberg-modal__content yoast-related-keyphrases-modal__content"
							id="semrush-rel-keyph"
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
						</ModalContainer>
					</Modal>
				}
			</Fragment>
		);
	}
}

RelatedKeyPhrasesModal.propTypes = {
	keyphrase: PropTypes.string,
	location: PropTypes.string,
	maxRelatedKeyphrasesEntered: PropTypes.bool,
};

RelatedKeyPhrasesModal.defaultProps = {
	keyphrase: "",
	location: "",
	maxRelatedKeyphrasesEntered: false,
};

export default RelatedKeyPhrasesModal;
