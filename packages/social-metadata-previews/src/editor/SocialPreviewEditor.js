/* External dependencies */
import React, { Component } from "react";
import PropTypes from "prop-types";

/* Internal dependencies */
import { SocialMetadataPreviewForm } from "@yoast/social-metadata-forms";
import FacebookPreview from "../facebook/FacebookPreview";
import { recommendedReplacementVariablesShape, replacementVariablesShape } from "@yoast/replacement-variable-editor";

/**
 * A form with an image selection button, a title input field and a description field and the social preview.
 *
 * @returns {void} Void.
 */
class SocialPreviewEditor extends Component {
	/**
	 * The constructor.
	 */
	constructor() {
		super();

		this.state = {
			activeField: "",
			hoveredField: "",
		};

		this.setHoveredField = this.setHoveredField.bind( this );
		this.setActiveField = this.setActiveField.bind( this );
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
		} );
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
			imageWarnings,
			siteName,
			description,
			image,
			alt,
			title,
			replacementVariables,
			recommendedReplacementVariables,
		} = this.props;

		return (
			<React.Fragment>
				<FacebookPreview
					onMouseHover={ this.setHoveredField }
					onSelect={ this.setActiveField }
					siteName={ siteName }
					title={ title }
					description={ description }
					image={ image }
					alt={ alt }
				/>
				<SocialMetadataPreviewForm
					onDescriptionChange={ onDescriptionChange }
					socialMediumName="Facebook"
					title={ title }
					onRemoveImageClick={ onRemoveImageClick }
					imageSelected={ !! image }
					onTitleChange={ onTitleChange }
					onSelectImageClick={ onSelectImageClick }
					description={ description }
					imageWarnings={ imageWarnings }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
					onFocus={ this.setHoveredField }
					onSelect={ this.setActiveField }
					activeField={ this.state.activeField }
					hoveredField={ this.state.hoveredField }
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
	imageWarnings: PropTypes.array,
	siteName: PropTypes.string.isRequired,
	replacementVariables: PropTypes.arrayOf( replacementVariablesShape ),
	recommendedReplacementVariables: PropTypes.arrayOf( recommendedReplacementVariablesShape ),
};

SocialPreviewEditor.defaultProps = {
	imageWarnings: [],
	recommendedReplacementVariables: [],
	replacementVariables: [],
};

export default SocialPreviewEditor;
