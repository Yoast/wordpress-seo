/* External dependencies */
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import debounce from "lodash/debounce";
import uniqueId from "lodash/uniqueId";
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import ReplacementVariableEditor from "./ReplacementVariableEditor";
import ProgressBar from "../../SnippetPreview/components/ProgressBar";
import { lengthProgressShape, replacementVariablesShape } from "../constants";
import colors from "../../../../style-guide/colors";
import { Button } from "../../Shared/components/Button";
import SvgIcon from "../../Shared/components/SvgIcon";

const angleRight = ( color ) => "data:image/svg+xml;charset=utf8," + encodeURIComponent(
	'<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">' +
	'<path fill="' + color + '" d="M1152 896q0 26-19 45l-448 448q-19 19-45 19t-45-19-19-45v-896q0-26 19-45t45-19 45 19l448 448q19 19 19 45z" />' +
	"</svg>"
);

/**
 * Returns the color of the caret for an InputContainer based on the props.
 *
 * @param {Object} props The props for this InputContainer.
 * @returns {string} The color the caret should have.
 */
function getCaretColor( props ) {
	switch ( true ) {
		case props.isActive:
			return colors.$color_snippet_focus;

		case props.isHovered:
			return colors.$color_snippet_hover;

		default:
			return "transparent";
	}
}

/*
 * The caret is defined in this CSS because we cannot mount/unmount Draft.js.
 *
 * For some reason if you wrap the InputContainer with `.extend` or `styled()`
 * the ReplacementVariableEditor in the children will unmount and mount on every focus.
 * This means that Draft.js cannot keep track of the browser selection. Which
 * breaks the editor completely. We circumvent this by settings the caret styles
 * conditionally.
 */
const InputContainer = styled.div.attrs( {
} )`
	padding: 3px 5px;
	border: 1px solid ${ ( props ) => props.isActive ? "#5b9dd9" : "#ddd" };
	box-shadow: ${ ( props ) => props.isActive ? "0 0 2px rgba(30,140,190,.8);" : "inset 0 1px 2px rgba(0,0,0,.07)" };
	background-color: #fff;
	color: #32373c;
	outline: 0;
	transition: 50ms border-color ease-in-out;
	position: relative;
	font-family: Arial, Roboto-Regular, HelveticaNeue, sans-serif;
	font-size: 14px;
	cursor: text;
	margin-top: 5px;

	&::before {
		display: block;
		position: absolute;
		top: -1px;
		left: -25px;
		width: 24px;
		height: 24px;
		background-image: url( ${ ( props ) => angleRight( getCaretColor( props ) ) });
		background-size: 25px;
		content: "";
	}
`;

const TitleInputContainer = InputContainer.extend`
	.public-DraftStyleDefault-block {
		line-height: 24px;
		height: 24px;
		overflow: hidden;
		white-space: nowrap;
	}
`;

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

const DescriptionInputContainer = InputContainer.extend`
	min-height: 60px;
	padding: 2px 6px;
	line-height: 19.6px;
`;

const FormSection = styled.div`
	margin: 32px 0;
`;

const StyledEditor = styled.section`
	padding: 10px 20px 20px 20px;
`;

const SimulatedLabel = styled.div`
	cursor: pointer;
	font-size: 16px;
	font-family: Arial, Roboto-Regular, HelveticaNeue, sans-serif;
	margin-bottom: 5px;
`;

const TriggerReplacementVariableSuggestionsButton = Button.extend`
	height: 33px;
	border: 1px solid #dbdbdb;
	box-shadow: none;
	font-family: Arial, Roboto-Regular, HelveticaNeue, sans-serif;
	fill: ${ colors.$color_grey_dark };
	padding-left: 8px;
	float: right;
	margin-top: -35px; // +2 for spacing
	
	${ props => props.hasMobileWidth && `
		float: none;
		margin-top: 0;
		margin-bottom: 2px;
	` }

	& svg {
		margin-right: 7px;
	}
`;

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

		this.state = {
			hasMobileWidth: false,
		};

		this.setRef = this.setRef.bind( this );
		this.setEditorRef = this.setEditorRef.bind( this );
		this.triggerReplacementVariableSuggestions = this.triggerReplacementVariableSuggestions.bind( this );
		this.debouncedUpdateMobileWidth = debounce( this.updateMobileWidth.bind( this ), 500 );
	}

	/**
	 * Sets the ref for the editor fields.
	 *
	 * @param {Object} editor The editor fields React reference.
	 *
	 * @returns {void}
	 */
	setEditorRef( editor ) {
		this.editor = editor;
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
	 * Ensure hasMobileWidth is accurate.
	 *
	 * By running it once and binding it to the window resize event.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		this.updateMobileWidth();
		window.addEventListener( "resize", this.debouncedUpdateMobileWidth );
	}

	/**
	 * Removes the event listeners.
	 *
	 * @returns {void}
	 */
	componentWillUnmount() {
		window.removeEventListener( "resize", this.debouncedUpdateMobileWidth );
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
	 * Inserts a % into a ReplacementVariableEditor to trigger the autocomplete.
	 *
	 * @param {string} field The field name to get the ref of the ReplacementVariableEditor.
	 *
	 * @returns {void}
	 */
	triggerReplacementVariableSuggestions( field ) {
		const element = this.elements[ field ];

		element.triggerReplacementVariableSuggestions();
	}

	/**
	 * Updates hasMobileWidth when changed.
	 *
	 * hasMobileWidth is true if the editor's client width is smaller than the mobile width prop.
	 *
	 * @returns {void}
	 */
	updateMobileWidth() {
		const hasMobileWidth = this.editor.clientWidth < this.props.mobileWidth;
		if ( this.state.hasMobileWidth !== hasMobileWidth ) {
			this.setState( { hasMobileWidth } );
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
		const { hasMobileWidth } = this.state;


		const titleLabelId = `${ this.uniqueId }-title`;
		const slugLabelId = `${ this.uniqueId }-slug`;
		const descriptionLabelId = `${ this.uniqueId }-description`;

		return (
			<StyledEditor
				innerRef={ this.setEditorRef }
			>
				<FormSection>
					<SimulatedLabel
						id={ titleLabelId }
						onClick={ () => onFocus( "title" ) }
					>
						{ __( "SEO title", "yoast-components" ) }
					</SimulatedLabel>
					<TriggerReplacementVariableSuggestionsButton
						onClick={ () => this.triggerReplacementVariableSuggestions( "title" ) }
						hasMobileWidth={ hasMobileWidth }
					>
						<SvgIcon icon="plus-circle" />
						{ __( "Insert snippet variable", "yoast-components" ) }
					</TriggerReplacementVariableSuggestionsButton>
					<TitleInputContainer
						onClick={ () => this.elements.title.focus() }
						isActive={ activeField === "title" }
						isHovered={ hoveredField === "title" }
					>
						<ReplacementVariableEditor
							content={ title }
							onChange={ content => onChange( "title", content ) }
							onFocus={ () => onFocus( "title" ) }
							onBlur={ () => onBlur() }
							replacementVariables={ replacementVariables }
							ref={ ( ref ) => this.setRef( "title", ref ) }
							ariaLabelledBy={ titleLabelId }
						/>
					</TitleInputContainer>
					<ProgressBar
						max={ titleLengthProgress.max }
						value={ titleLengthProgress.actual }
						progressColor={ this.getProgressColor( titleLengthProgress.score ) }
					/>
				</FormSection>
				<FormSection>
					<SimulatedLabel
						id={ slugLabelId }
						onClick={ () => onFocus( "slug" ) }
					>
						{ __( "Slug", "yoast-components" ) }
					</SimulatedLabel>
					<InputContainer
						onClick={ () => this.elements.slug.focus() }
						isActive={ activeField === "slug" }
						isHovered={ hoveredField === "slug" }
					>
						<SlugInput
							value={ slug }
							onChange={ event => onChange( "slug", event.target.value ) }
							onFocus={ () => onFocus( "slug" ) }
							onBlur={ () => onBlur() }
							innerRef={ ref => this.setRef( "slug", ref ) }
							aria-labelledby={ this.uniqueId + "-slug" }
						/>
					</InputContainer>
				</FormSection>
				<FormSection>
					<SimulatedLabel
						id={ descriptionLabelId }
						onClick={ () => onFocus( "description" ) } >
						{ __( "Meta description", "yoast-components" ) }
					</SimulatedLabel>
					<TriggerReplacementVariableSuggestionsButton
						onClick={ () => this.triggerReplacementVariableSuggestions( "description" ) }
						hasMobileWidth={ hasMobileWidth }
					>
						<SvgIcon icon="plus-circle" />
						{ __( "Insert snippet variable", "yoast-components" ) }
					</TriggerReplacementVariableSuggestionsButton>
					<DescriptionInputContainer
						onClick={ () => this.elements.description.focus() }
						isActive={ activeField === "description" }
						isHovered={ hoveredField === "description" }
					>
						<ReplacementVariableEditor
							content={ description }
							onChange={ content => onChange( "description", content ) }
							onFocus={ () => onFocus( "description" ) }
							onBlur={ () => onBlur() }
							replacementVariables={ replacementVariables }
							ref={ ( ref ) => this.setRef( "description", ref ) }
							ariaLabelledBy={ descriptionLabelId }
							descriptionEditorFieldPlaceholder={ descriptionEditorFieldPlaceholder }
						/>
					</DescriptionInputContainer>
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
	mobileWidth: PropTypes.number,
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
	mobileWidth: 356,
};

export default SnippetEditorFields;
