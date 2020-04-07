/* External dependencies */
import React, { Component } from "react";
import PropTypes from "prop-types";

/* Internal dependencies */
import { SocialMetadataPreviewForm } from "@yoast/social-metadata-forms";
import FacebookPreview from "../facebook/FacebookPreview";
import TwitterPreview from "../twitter/TwitterPreview";
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

		this.SocialPreview = props.socialMediumName === "Facebook" ? FacebookPreview : TwitterPreview;
		this.setHoveredField = this.setHoveredField.bind( this );
		this.setActiveField = this.setActiveField.bind( this );
		this.handleImageClick = this.handleImageClick.bind( this );
		this.setEditorRef = this.setEditorRef.bind( this );
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
		console.log( "hoveredfield", field );
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
		console.log( "activefield", field );
		this.setState( {
			activeField: field,
		}, () => {
			switch ( field ) {
				case "title":
					this.titleEditorRef.focus();
					return;
				case "description":
					console.log( "HERE!" );
					this.descriptionEditorRef.focus();
					return;
			}
		} );
	}

	/**
	 * Combines the setting of the activeField to "image" and the onSelectImageClick.
	 * This helps with setting the caret's activeField and calling the image select function.
	 *
	 * @returns {void}
	 */
	handleImageClick() {
		this.setActiveField( "image" );
		this.props.onSelectImageClick();
	}

	/**
	 * Hoi
	 * @param {*} field  hoi
	 * @param {*} ref hoi
	 *
	 * @returns {void}
	 */
	setEditorRef( field, ref ) {
		console.log( "setEditorRef: ", field, ref );
		switch ( field ) {
			case "title":
				this.titleEditorRef = ref;
				return;
			case "description":
				this.descriptionEditorRef = ref;
				return;
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
			siteName,
			description,
			image,
			alt,
			title,
			replacementVariables,
			recommendedReplacementVariables,
			isPremium,
			isLarge,
		} = this.props;

		return (
			<React.Fragment>
				<this.SocialPreview
					onMouseHover={ this.setHoveredField }
					hoveredField={ this.state.hoveredField }
					onSelect={ this.setActiveField }
					activeField={ this.state.activeField }
					onImageClick={ this.handleImageClick }
					siteName={ siteName }
					title={ title }
					description={ description }
					image={ image }
					alt={ alt }
					isLarge={ isLarge }
				/>
				<SocialMetadataPreviewForm
					onDescriptionChange={ onDescriptionChange }
					socialMediumName={ socialMediumName }
					title={ title }
					onRemoveImageClick={ onRemoveImageClick }
					imageSelected={ !! image }
					onTitleChange={ onTitleChange }
					onSelectImageClick={ onSelectImageClick }
					description={ description }
					imageWarnings={ imageWarnings }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
					onMouseHover={ this.setHoveredField }
					hoveredField={ this.state.hoveredField }
					onSelect={ this.setActiveField }
					activeField={ this.state.activeField }
					isPremium={ isPremium }
					setEditorRef={ this.setEditorRef }
				/>
			</React.Fragment>
		);
	}
}

SocialPreviewEditor.propTypes = {
	title: PropTypes.string.isRequired,
	onTitleChange: PropTypes.func.isRequired,
	description: PropTypes.string.isRequired,
	onDescriptionChange: PropTypes.func.isRequired,
	image: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired,
	onSelectImageClick: PropTypes.func.isRequired,
	onRemoveImageClick: PropTypes.func.isRequired,
	socialMediumName: PropTypes.string.isRequired,
	isPremium: PropTypes.bool,
	imageWarnings: PropTypes.array,
	isLarge: PropTypes.bool,
	siteName: PropTypes.string.isRequired,
	replacementVariables: PropTypes.arrayOf( replacementVariablesShape ),
	recommendedReplacementVariables: PropTypes.arrayOf( recommendedReplacementVariablesShape ),
};

SocialPreviewEditor.defaultProps = {
	imageWarnings: [],
	recommendedReplacementVariables: [],
	replacementVariables: [],
	isPremium: false,
	isLarge: true,
};

export default SocialPreviewEditor;
