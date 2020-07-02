/* External dependencies */
import { Fragment, Component } from "@wordpress/element";
import { Modal } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { connect } from "react-redux";

/* Yoast dependencies */
import { BaseButton } from "@yoast/components";

/* Internal dependencies */
import { ModalContainer } from "./modals/Container";
import SemRushCountrySelector from "./modals/SemRushCountrySelector";
import KeyphrasesTable from "./modals/KeyphrasesTable";
import YoastIcon from "../../../images/Yoast_icon_kader.svg";
import SemRushLimitReached from "./modals/SemRushLimitReached";
import SemRushLoading from "./modals/SemRushLoading";
import SemRushUpsellAlert from "./modals/SemRushUpsellAlert";
import SemRushRequestFailed from "./modals/SemRushRequestFailed";
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
			isLoading: false,
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
		this.setState( { isModalOpen: true, isLoading: true } );
	}

	/**
	 * Closes the "Get related keyphrases" modal.
	 *
	 * @returns {void}
	 */
	closeModal() {
		this.setState( { isModalOpen: false, isLoading: false } );
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
						>
							{ this.state.isLoading && <SemRushLoading /> }
							{ maxRelatedKeyphrasesEntered && (
								<SemRushMaxRelatedKeyphrases />
							) }
							<SemRushUpsellAlert />
							<SemRushLimitReached />
							<SemRushRequestFailed />
							<SemRushCountrySelector />
							<KeyphrasesTable />
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

/**
 * Maps redux state to the RelatedKeyPhrasesModal props.
 *
 * @param {Object} state The redux state.
 *
 * @returns {Object} Props that should be passed to RelatedKeyPhrasesModal.
 */
function mapStateToProps( state ) {
	const keyphrase = state.focusKeyword;

	return {
		keyphrase,
	};
}

export default connect( mapStateToProps )( RelatedKeyPhrasesModal );
