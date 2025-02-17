import { __ } from "@wordpress/i18n";
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
	position: relative;

	${ props => ! props.isPremium && `
		.yoast-image-select__preview {
			width: 130px;
			min-height: 72px;
			max-height: 130px;
		}
	` };
`
;

CaretContainer.propTypes = {
	isPremium: PropTypes.bool,
};

CaretContainer.defaultProps = {
	isPremium: false,
};

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
			isPremium: PropTypes.bool,
		};

		// Destructure the props.
		const {
			isActive,
			isHovered,
			isPremium,
			...withoutCaretProps
		} = props;

		return (
			<CaretContainer isPremium={ isPremium }>
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
	 * Returns the titles for the fields based on the social medium name.
	 *
	 * @param {String} socialMediumName The name of the social medium.
	 *
	 * @returns {Object} The titles for the fields.
	 */
	getFieldsTitles( socialMediumName ) {
		if ( socialMediumName === "Twitter" ) {
			return {
				imageSelectTitle: __( "Twitter image", "wordpress-seo" ),
				titleEditorTitle: __( "Twitter title", "wordpress-seo" ),
				descEditorTitle: __( "Twitter description", "wordpress-seo" ),
			};
		}

		if ( socialMediumName === "X" ) {
			return {
				imageSelectTitle: __( "X image", "wordpress-seo" ),
				titleEditorTitle: __( "X title", "wordpress-seo" ),
				descEditorTitle: __( "X description", "wordpress-seo" ),
			};
		}

		return {
			imageSelectTitle: __( "Social image", "wordpress-seo" ),
			titleEditorTitle: __( "Social title", "wordpress-seo" ),
			descEditorTitle: __( "Social description", "wordpress-seo" ),
		};
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
			onReplacementVariableSearchChange,
			hoveredField,
			activeField,
			isPremium,
			replacementVariables,
			recommendedReplacementVariables,
			imageWarnings,
			imageUrl,
			imageFallbackUrl,
			imageAltText,
			idSuffix,
		} = this.props;

		const titles = this.getFieldsTitles( socialMediumName );
		const imageSelected = !! imageUrl;
		const imageSelectTitle = titles.imageSelectTitle;
		const titleEditorTitle = titles.titleEditorTitle;
		const descEditorTitle = titles.descEditorTitle;

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
					usingFallback={ ! imageUrl && imageFallbackUrl !== "" }
					imageAltText={ imageAltText }
					hasPreview={ ! isPremium }
					imageUrlInputId={ join( [ lowerCaseSocialMediumName, "url-input", idSuffix ] ) }
					selectImageButtonId={ join( [ lowerCaseSocialMediumName, "select-button", idSuffix ] ) }
					replaceImageButtonId={ join( [ lowerCaseSocialMediumName, "replace-button", idSuffix ] ) }
					removeImageButtonId={ join( [ lowerCaseSocialMediumName, "remove-button", idSuffix ] ) }
					isPremium={ isPremium }
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
					onSearchChange={ onReplacementVariableSearchChange }
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
					onSearchChange={ onReplacementVariableSearchChange }
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
	socialMediumName: PropTypes.oneOf( [ "Twitter", "X", "Social" ] ).isRequired,
	onSelectImageClick: PropTypes.func.isRequired,
	onRemoveImageClick: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	onTitleChange: PropTypes.func.isRequired,
	onDescriptionChange: PropTypes.func.isRequired,
	onReplacementVariableSearchChange: PropTypes.func,
	isPremium: PropTypes.bool,
	hoveredField: PropTypes.string,
	activeField: PropTypes.string,
	onSelect: PropTypes.func,
	replacementVariables: replacementVariablesShape,
	recommendedReplacementVariables: PropTypes.arrayOf( PropTypes.string ),
	imageWarnings: PropTypes.array,
	imageUrl: PropTypes.string,
	imageFallbackUrl: PropTypes.string,
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
	onReplacementVariableSearchChange: null,
	imageUrl: "",
	imageFallbackUrl: "",
	imageAltText: "",
	titleInputPlaceholder: "",
	descriptionInputPlaceholder: "",
	isPremium: false,
	setEditorRef: () => {},
	onMouseHover: () => {},
	idSuffix: "",
};

export default SocialMetadataPreviewForm;
