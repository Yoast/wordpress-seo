/* External dependencies */
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import uniqueId from "lodash/uniqueId";
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import ReplacementVariableEditor from "./ReplacementVariableEditor";
import {
	InputContainer,
	DescriptionInputContainer,
	FormSection,
	SimulatedLabel,
	StyledEditor,
	TitleInputContainer,
	withCarretStyles,
} from "./Shared";
import ProgressBar from "../../SnippetPreview/components/ProgressBar";
import { lengthProgressShape, replacementVariablesShape } from "../constants";
import colors from "../../../../style-guide/colors";

const SlugInput = styled.input`
	border: none;
	width: 100%;
	height: inherit;
	line-height: inherit;
	font-family: inherit;
	font-size: inherit;
	color: inherit;

	&:focus {
		outline: 0;
	}
`;

const TitleInputContainerWithCarretStyles = withCarretStyles( TitleInputContainer );
const DescriptionInputContainerWithCarretStyles = withCarretStyles( DescriptionInputContainer );
const InputContainerWithCarretStyles = withCarretStyles( InputContainer );


class SnippetEditorFields extends React.Component {
	/**
	 * Constructs the snippet editor fields.
	 *
	 * @param {Object}   props                             The props for the editor
	 *                                                     fields.
	 * @param {Object}   props.replacementVariables        The replacement variables
	 *                                                     for this editor.
	 * @param {Object}   props.data                        The initial editor data.
	 * @param {string}   props.data.title                  The initial title.
	 * @param {string}   props.data.slug                   The initial slug.
	 * @param {string}   props.data.description            The initial description.
	 * @param {Function} props.onChange                    Called when the data
	 *                                                     changes.
	 * @param {Function} props.onFocus                     Called when a field is
	 *                                                     focused.
	 * @param {Object}   props.titleLengthProgress       The values for the title
	 *                                                     length assessment.
	 * @param {Object}   props.descriptionLengthProgress The values for the
	 *                                                     description length
	 *                                                     assessment.
	 * @param {string}   props.activeField                 The field that is
	 *                                                     currently active.
	 * @param {string}   props.hoveredField                The field that is
	 *                                                     currently hovered.
	 *
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.elements = {
			title: null,
			slug: null,
			description: null,
		};

		this.uniqueId = uniqueId( "snippet-editor-field-" );

		this.setRef = this.setRef.bind( this );
	}

	/**
	 * Sets ref for field editor.
	 *
	 * @param {string} field The field for this ref.
	 * @param {Object} ref The Draft.js react element.
	 *
	 * @returns {void}
	 */
	setRef( field, ref ) {
		this.elements[ field ] = ref;
	}

	/**
	 * Makes sure the focus is correct after updating the editor fields.
	 *
	 * For example, the component will update when clicking on the field labels.
	 * In this case, we need to focus again the field.
	 *
	 * @param {Object} prevProps The previous props.
	 * @returns {void}
	 */
	componentDidUpdate( prevProps ) {
		if ( prevProps.activeField !== this.props.activeField ) {
			this.focusOnActiveFieldChange();
		}
	}

	/**
	 * Focuses the currently active field if it wasn't previously active.
	 *
	 * @returns {void}
	 */
	focusOnActiveFieldChange() {
		const { activeField } = this.props;
		if ( activeField ) {
			const activeElement = this.elements[ activeField ];
			activeElement.focus();
		}
	}

	/**
	 * Renders the snippet editor.
	 *
	 * @returns {ReactElement} The snippet editor element.
	 */
	render() {
		const {
			activeField,
			hoveredField,
			replacementVariables,
			titleLengthProgress,
			descriptionLengthProgress,
			onFocus,
			onBlur,
			onChange,
			descriptionEditorFieldPlaceholder,
			data: {
				title,
				slug,
				description,
			},
		} = this.props;

		const titleLabelId = `${ this.uniqueId }-title`;
		const slugLabelId = `${ this.uniqueId }-slug`;
		const descriptionLabelId = `${ this.uniqueId }-description`;

		return (
			<StyledEditor>
				<FormSection>
					<SimulatedLabel
						id={ titleLabelId }
						onClick={ () => onFocus( "title" ) } >
						{ __( "SEO title", "yoast-components" ) }
					</SimulatedLabel>
					<TitleInputContainerWithCarretStyles
						onClick={ () => this.elements.title.focus() }
						isActive={ activeField === "title" }
						isHovered={ hoveredField === "title" }>
						<ReplacementVariableEditor
							content={ title }
							onChange={ content => onChange( "title", content ) }
							onFocus={ () => onFocus( "title" ) }
							onBlur={ () => onBlur() }
							replacementVariables={ replacementVariables }
							ref={ ( ref ) => this.setRef( "title", ref ) }
							ariaLabelledBy={ titleLabelId }
						/>
					</TitleInputContainerWithCarretStyles>
					<ProgressBar
						max={ titleLengthProgress.max }
						value={ titleLengthProgress.actual }
						progressColor={ this.getProgressColor( titleLengthProgress.score ) }
					/>
				</FormSection>
				<FormSection>
					<SimulatedLabel
						id={ slugLabelId }
						onClick={ () => onFocus( "slug" ) } >
						{ __( "Slug", "yoast-components" ) }
					</SimulatedLabel>
					<InputContainerWithCarretStyles
						onClick={ () => this.elements.slug.focus() }
						isActive={ activeField === "slug" }
						isHovered={ hoveredField === "slug" }>
						<SlugInput
							value={ slug }
							onChange={ event => onChange( "slug", event.target.value ) }
							onFocus={ () => onFocus( "slug" ) }
							onBlur={ () => onBlur() }
							innerRef={ ref => this.setRef( "slug", ref ) }
							aria-labelledby={ this.uniqueId + "-slug" }
						/>
					</InputContainerWithCarretStyles>
				</FormSection>
				<FormSection>
					<SimulatedLabel
						id={ descriptionLabelId }
						onClick={ () => onFocus( "description" ) } >
						{ __( "Meta description", "yoast-components" ) }
					</SimulatedLabel>
					<DescriptionInputContainerWithCarretStyles
						onClick={ () => this.elements.description.focus() }
						isActive={ activeField === "description" }
						isHovered={ hoveredField === "description" }>
						<ReplacementVariableEditor
							content={ description }
							onChange={ content => onChange( "description", content ) }
							onFocus={ () => onFocus( "description" ) }
							onBlur={ () => onBlur() }
							replacementVariables={ replacementVariables }
							ref={ ( ref ) => this.setRef( "description", ref ) }
							ariaLabelledBy={ descriptionLabelId }
							placeholder={ descriptionEditorFieldPlaceholder }
						/>
					</DescriptionInputContainerWithCarretStyles>
					<ProgressBar
						max={ descriptionLengthProgress.max }
						value={ descriptionLengthProgress.actual }
						progressColor={ this.getProgressColor( descriptionLengthProgress.score ) }
					/>
				</FormSection>
			</StyledEditor>
		);
	}

	/**
	 * Returns the progress color for a given score.
	 *
	 * @param {number} score The score to determine a color for.
	 *
	 * @returns {string} A hex color.
	 */
	getProgressColor( score ) {
		if ( score >= 7 ) {
			return colors.$color_good;
		}

		if ( score >= 5 ) {
			return colors.$color_ok;
		}

		return colors.$color_bad;
	}
}

SnippetEditorFields.propTypes = {
	replacementVariables: replacementVariablesShape,
	onChange: PropTypes.func.isRequired,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	data: PropTypes.shape( {
		title: PropTypes.string.isRequired,
		slug: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
	} ).isRequired,
	activeField: PropTypes.oneOf( [ "title", "slug", "description" ] ),
	hoveredField: PropTypes.oneOf( [ "title", "slug", "description" ] ),
	titleLengthProgress: lengthProgressShape,
	descriptionLengthProgress: lengthProgressShape,
	descriptionEditorFieldPlaceholder: PropTypes.string,
};

SnippetEditorFields.defaultProps = {
	replacementVariables: [],
	onFocus: () => {},
	onBlur: () => {},
	titleLengthProgress: {
		max: 600,
		actual: 0,
		score: 0,
	},
	descriptionLengthProgress: {
		max: 156,
		actual: 0,
		score: 0,
	},
};

export default SnippetEditorFields;
