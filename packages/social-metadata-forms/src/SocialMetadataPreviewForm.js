import { __, sprintf } from "@wordpress/i18n";
import { getDirectionalStyle, join } from "@yoast/helpers";
import { ReplacementVariableEditor, replacementVariablesShape } from "@yoast/replacement-variable-editor";
import { angleLeft, angleRight, colors } from "@yoast/style-guide";
import PropTypes from "prop-types";
import React, { Component, Fragment } from "react";
import styled from "styled-components";
import { ImageSelect } from "@yoast/components";

/**
 * Sets the color based on whether the caret is active or not (usually hovered).
 * Display css prop sets the visibility, so this only needs to switch color.
 *
 * @param {*} active Whether to show the active color or the hover color.
 *
 * @returns {string} The color of the caret. Black if active, grey otherwise.
 */
const getCaretColor = ( active ) => {
	return active ? colors.$color_snippet_focus : colors.$color_snippet_hover;
};

const CaretContainer = styled.div`
	position: relative;`
;

const Caret = styled.div`
	display: ${ props => ( props.isActive || props.isHovered ) ? "block" : "none" };

	::before {
		position: absolute;
		top: -2px;
		${ getDirectionalStyle( "left", "right" ) }: -25px;
		width: 24px;
		height: 24px;
		background-image: url(
		${ props => getDirectionalStyle(
		angleRight( getCaretColor( props.isActive ) ),
		angleLeft( getCaretColor( props.isActive ) )
	) }
		);
		color: ${ props => getCaretColor( props.isActive ) };
		background-size: 24px;
		background-repeat: no-repeat;
		background-position: center;
		content: "";
	}
`;

Caret.propTypes = {
	isActive: PropTypes.bool,
	isHovered: PropTypes.bool,
};

Caret.defaultProps = {
	isActive: false,
	isHovered: false,
};

/**
 * Adds Caret to a component.
 * @param {React.Element} WithoutCaretComponent The component to add a Caret to.
 *
 * @returns {React.Element} A component with added Caret.
 */
export const withCaretStyle = ( WithoutCaretComponent ) => {
	return function ComponentWithCaret( props ) {
		// Define function props.
		ComponentWithCaret.propTypes = {
			isActive: PropTypes.bool.isRequired,
			isHovered: PropTypes.bool.isRequired,
		};

		// Destructure the props.
		const {
			isActive,
			isHovered,
			...withoutCaretProps
		} = props;

		return (
			<CaretContainer>
				<Caret isActive={ isActive } isHovered={ isHovered } />
				<WithoutCaretComponent { ...withoutCaretProps } />
			</CaretContainer>
		);
	};
};

const ImageSelectWithCaret = withCaretStyle( ImageSelect );

/**
 * A form with an image selection button, a title input field and a description field.
 *
 * @param {object} props The props for this component.
 *
 * @returns {React.Component} Returns a Fragment that contains all input fields.
 */
class SocialMetadataPreviewForm extends Component {
	/**
	 * Constructs the component.
	 *
	 * @param {Object} props The component's props.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		// Binding fields to onMouseHover to prevent arrow functions in JSX props.
		this.onImageEnter = props.onMouseHover.bind( this, "image" );
		this.onTitleEnter = props.onMouseHover.bind( this, "title" );
		this.onDescriptionEnter = props.onMouseHover.bind( this, "description" );
		this.onLeave = props.onMouseHover.bind( this, "" );
		this.onImageSelectBlur = props.onSelect.bind( this, "" );

		this.onSelectTitleEditor = this.onSelectEditor.bind( this, "title" );
		this.onSelectDescriptionEditor = this.onSelectEditor.bind( this, "description" );
		this.onDeselectEditor = this.onSelectEditor.bind( this, "" );

		this.onTitleEditorRef = this.onSetEditorRef.bind( this, "title" );
		this.onDescriptionEditorRef = this.onSetEditorRef.bind( this, "description" );
	}

	/**
	 * Handles the onSelect function for the editors.
	 *
	 * @param {String} field The field name of the editor to focus.
	 *
	 * @returns {void}
	 */
	onSelectEditor( field ) {
		this.props.onSelect( field );
	}

	/**
	 * Handles the onSelect function for the editors.
	 *
	 * @param {String} field The field name of the editor to focus.
	 * @param {String} ref The field name of the editor to focus.
	 *
	 * @returns {void}
	 */
	onSetEditorRef( field, ref ) {
		this.props.setEditorRef( field, ref );
	}

	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rend
	 */
	render() {
		const {
			socialMediumName,
			onSelectImageClick,
			onRemoveImageClick,
			title,
			titleInputPlaceholder,
			description,
			descriptionInputPlaceholder,
			onTitleChange,
			onDescriptionChange,
			hoveredField,
			activeField,
			isPremium,
			replacementVariables,
			recommendedReplacementVariables,
			imageWarnings,
			imageUrl,
			imageAltText,
			idSuffix,
		} = this.props;

		const imageSelected = !! imageUrl;

		/* Translators: %s expands to the social medium name, i.e. Facebook. */
		const imageSelectTitle = sprintf( __( "%s image", "wordpress-seo" ), socialMediumName );
		/* Translators: %s expands to the social medium name, i.e. Facebook. */
		const titleEditorTitle = sprintf( __( "%s title", "wordpress-seo" ), socialMediumName );
		/* Translators: %s expands to the social medium name, i.e. Facebook. */
		const descEditorTitle = sprintf( __( "%s description", "wordpress-seo" ), socialMediumName );

		const lowerCaseSocialMediumName = socialMediumName.toLowerCase();

		return (
			<Fragment>
				<ImageSelectWithCaret
					label={ imageSelectTitle }
					onClick={ onSelectImageClick }
					onRemoveImageClick={ onRemoveImageClick }
					warnings={ imageWarnings }
					imageSelected={ imageSelected }
					onMouseEnter={ this.onImageEnter }
					onMouseLeave={ this.onLeave }
					isActive={ activeField === "image" }
					isHovered={ hoveredField === "image" }
					imageUrl={ imageUrl }
					imageAltText={ imageAltText }
					hasPreview={ ! isPremium }
					imageUrlInputId={ join( [ lowerCaseSocialMediumName, "url-input", idSuffix ] ) }
					selectImageButtonId={ join( [ lowerCaseSocialMediumName, "select-button", idSuffix ] ) }
					replaceImageButtonId={ join( [ lowerCaseSocialMediumName, "replace-button", idSuffix ] ) }
					removeImageButtonId={ join( [ lowerCaseSocialMediumName, "remove-button", idSuffix ] ) }
				/>
				<ReplacementVariableEditor
					onChange={ onTitleChange }
					content={ title }
					placeholder={ titleInputPlaceholder }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
					type="title"
					fieldId={ join( [ lowerCaseSocialMediumName, "title-input", idSuffix ] ) }
					label={ titleEditorTitle }
					onMouseEnter={ this.onTitleEnter }
					onMouseLeave={ this.onLeave }
					isActive={ activeField === "title" }
					isHovered={ hoveredField === "title" }
					withCaret={ true }
					onFocus={ this.onSelectTitleEditor }
					onBlur={ this.onDeselectEditor }
					editorRef={ this.onTitleEditorRef }
				/>
				<ReplacementVariableEditor
					onChange={ onDescriptionChange }
					content={ description }
					placeholder={ descriptionInputPlaceholder }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
					type="description"
					fieldId={ join( [ lowerCaseSocialMediumName, "description-input", idSuffix ] ) }
					label={ descEditorTitle }
					onMouseEnter={ this.onDescriptionEnter }
					onMouseLeave={ this.onLeave }
					isActive={ activeField === "description" }
					isHovered={ hoveredField === "description" }
					withCaret={ true }
					onFocus={ this.onSelectDescriptionEditor }
					onBlur={ this.onDeselectEditor }
					editorRef={ this.onDescriptionEditorRef }
				/>
			</Fragment>
		);
	}
}

SocialMetadataPreviewForm.propTypes = {
	socialMediumName: PropTypes.oneOf( [ "Twitter", "Facebook" ] ).isRequired,
	onSelectImageClick: PropTypes.func.isRequired,
	onRemoveImageClick: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	onTitleChange: PropTypes.func.isRequired,
	onDescriptionChange: PropTypes.func.isRequired,
	isPremium: PropTypes.bool,
	hoveredField: PropTypes.string,
	activeField: PropTypes.string,
	onSelect: PropTypes.func,
	replacementVariables: replacementVariablesShape,
	recommendedReplacementVariables: PropTypes.arrayOf( PropTypes.string ),
	imageWarnings: PropTypes.array,
	imageUrl: PropTypes.string,
	imageAltText: PropTypes.string,
	titleInputPlaceholder: PropTypes.string,
	descriptionInputPlaceholder: PropTypes.string,
	setEditorRef: PropTypes.func,
	onMouseHover: PropTypes.func,
	idSuffix: PropTypes.string,
};

SocialMetadataPreviewForm.defaultProps = {
	replacementVariables: [],
	recommendedReplacementVariables: [],
	imageWarnings: [],
	hoveredField: "",
	activeField: "",
	onSelect: () => {},
	imageUrl: "",
	imageAltText: "",
	titleInputPlaceholder: "",
	descriptionInputPlaceholder: "",
	isPremium: false,
	setEditorRef: () => {},
	onMouseHover: () => {},
	idSuffix: "",
};

export default SocialMetadataPreviewForm;
