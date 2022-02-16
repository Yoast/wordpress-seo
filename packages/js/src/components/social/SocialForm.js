import { Component, Fragment } from "@wordpress/element";
import PropTypes from "prop-types";
import SocialUpsell from "./SocialUpsell";
import { SocialMetadataPreviewForm } from "@yoast/social-metadata-forms";
import { recommendedReplacementVariablesShape, replacementVariablesShape } from "@yoast/replacement-variable-editor";

/**
 * A form with an image selection button, a title input field and a description field and the social preview.
 *
 * @returns {void} Void.
 */
class SocialPreviewEditor extends Component {
	/**
	 * The constructor.
	 * @param {Object} props The props object.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.state = {
			activeField: "",
			hoveredField: "",
		};

		this.setHoveredField = this.setHoveredField.bind( this );
		this.setActiveField = this.setActiveField.bind( this );
		this.setEditorRef = this.setEditorRef.bind( this );
		this.setEditorFocus = this.setEditorFocus.bind( this );
	}

	/**
	 * Sets the field that the mouse is hovering over in state.
	 *
	 * @param {string} field The field that is hovered over.
	 *
	 * @returns {void}
	 */
	setHoveredField( field ) {
		if ( field === this.state.hoveredField ) {
			return;
		}
		this.setState( {
			hoveredField: field,
		} );
	}

	/**
	 * Sets the active field that is selected in state.
	 *
	 * @param {string} field The field that is selected.
	 *
	 * @returns {void}
	 */
	setActiveField( field ) {
		if ( field === this.state.activeField ) {
			return;
		}
		this.setState(
			{ activeField: field },
			() => this.setEditorFocus( field )
		);
	}

	/**
	 * Sets focus on the editor that is the active field.
	 *
	 * @param {String} field The active field belonging to the editor to focus.
	 *
	 * @returns {void}
	 */
	setEditorFocus( field ) {
		switch ( field ) {
			case "title":
				this.titleEditorRef.focus();
				break;
			case "description":
				this.descriptionEditorRef.focus();
				break;
		}
	}

	/**
	 * Sets the reference of each editor.
	 * Used by child components to communicate with this focus managing component.
	 * This component can then call the .focus() function on the passed refs.
	 *
	 * @param {string} field The field belonging to the editor that belongs to the ref.
	 * @param {*} ref A ref to an editor.
	 *
	 * @returns {void}
	 */
	setEditorRef( field, ref ) {
		switch ( field ) {
			case "title":
				this.titleEditorRef = ref;
				break;
			case "description":
				this.descriptionEditorRef = ref;
				break;
		}
	}

	/**
	 * The render function.
	 *
	 * @returns {void} Void.
	 */
	render() {
		const {
			onDescriptionChange,
			onTitleChange,
			onSelectImageClick,
			onRemoveImageClick,
			socialMediumName,
			imageWarnings,
			description,
			descriptionInputPlaceholder,
			imageUrl,
			alt,
			title,
			titleInputPlaceholder,
			replacementVariables,
			recommendedReplacementVariables,
			isPremium,
			location,
		} = this.props;

		return (
			<Fragment>
				<SocialUpsell socialMediumName={ socialMediumName } />
				<SocialMetadataPreviewForm
					onDescriptionChange={ onDescriptionChange }
					socialMediumName={ socialMediumName }
					title={ title }
					titleInputPlaceholder={ titleInputPlaceholder }
					onRemoveImageClick={ onRemoveImageClick }
					imageSelected={ !! imageUrl }
					imageUrl={ imageUrl }
					imageAltText={ alt }
					onTitleChange={ onTitleChange }
					onSelectImageClick={ onSelectImageClick }
					description={ description }
					descriptionInputPlaceholder={ descriptionInputPlaceholder }
					imageWarnings={ imageWarnings }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
					onMouseHover={ this.setHoveredField }
					hoveredField={ this.state.hoveredField }
					onSelect={ this.setActiveField }
					activeField={ this.state.activeField }
					isPremium={ isPremium }
					setEditorRef={ this.setEditorRef }
					idSuffix={ location }
				/>
			</Fragment>
		);
	}
}

SocialPreviewEditor.propTypes = {
	title: PropTypes.string.isRequired,
	onTitleChange: PropTypes.func.isRequired,
	description: PropTypes.string.isRequired,
	onDescriptionChange: PropTypes.func.isRequired,
	imageUrl: PropTypes.string.isRequired,
	onSelectImageClick: PropTypes.func.isRequired,
	onRemoveImageClick: PropTypes.func.isRequired,
	socialMediumName: PropTypes.string.isRequired,
	isPremium: PropTypes.bool,
	imageWarnings: PropTypes.array,
	descriptionInputPlaceholder: PropTypes.string,
	titleInputPlaceholder: PropTypes.string,
	replacementVariables: replacementVariablesShape,
	recommendedReplacementVariables: recommendedReplacementVariablesShape,
	location: PropTypes.string,
	alt: PropTypes.string,
};

SocialPreviewEditor.defaultProps = {
	imageWarnings: [],
	recommendedReplacementVariables: [],
	replacementVariables: [],
	isPremium: false,
	descriptionInputPlaceholder: "",
	titleInputPlaceholder: "",
	location: "",
	alt: "",
};

export default SocialPreviewEditor;
