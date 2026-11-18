// External dependencies.
import { Component } from "@wordpress/element";
import styled from "styled-components";
import PropTypes from "prop-types";
import { noop, isEmpty } from "lodash";

/* Yoast dependencies */
import { addFocusStyle, SvgIcon, InputField } from "@yoast/components";
import { getDirectionalStyle } from "@yoast/helpers";
import { colors } from "@yoast/style-guide";

const errorColor = colors.$color_bad;
const backgroundErrorColor = colors.$palette_error_background;
const greyColor = colors.$color_grey_text_light;
const inputErrorColor = colors.$palette_error_text;

const KeywordInputContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

const KeywordFieldLabel = styled.label`
	font-size: var(--yoast-font-size-default);
	font-weight: var(--yoast-font-weight-bold);
	${ getDirectionalStyle( "margin-right: 4px", "margin-left: 4px" ) };
`;

const KeywordFieldLabelContainer = styled.span`
	margin-bottom: 0.5em;
`;

const KeywordField = styled( InputField )`
	flex: 1 !important;
	box-sizing: border-box;
	max-width: 100%;
	margin: 0; // Reset margins inherited from WordPress.

	// Hide native X in Edge and IE11.
	&::-ms-clear {
		display: none;
	}

	&.has-error {
		border-color: ${ errorColor } !important;
		background-color: ${ backgroundErrorColor } !important;

		&:focus {
			box-shadow: 0 0 2px ${ errorColor } !important;
		}
	}
`;

const ErrorList = styled.ul`
	color: ${ inputErrorColor };
	list-style-type: disc;
	list-style-position: outside;
	margin: 0;
	margin-left: 1.2em;
`;

const ErrorListItem = styled.li`
	color: ${ inputErrorColor };
	margin: 0 0 0.5em 0;
`;

const BorderlessButton = addFocusStyle(
	styled.button`
		border: 1px solid transparent;
		box-shadow: none;
		background: none;
		flex: 0 0 32px;
		height: 32px;
		max-width: 32px;
		padding: 0;
		cursor: pointer;
	`
);

BorderlessButton.propTypes = {
	type: PropTypes.string,
	focusColor: PropTypes.string,
	focusBackgroundColor: PropTypes.string,
	focusBorderColor: PropTypes.string,
};

BorderlessButton.defaultProps = {
	type: "button",
	focusColor: colors.$color_button_text_hover,
	focusBackgroundColor: "transparent",
	focusBorderColor: colors.$color_blue,
};

const RemoveIcon = styled( SvgIcon )`
	margin-top: 4px;
`;

export const YoastInputButtonContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;

	&.has-remove-keyword-button {
		${ KeywordField } {
			${ getDirectionalStyle( "padding-right: 40px", "padding-left: 40px" ) };
		}

		${ BorderlessButton } {
			${ getDirectionalStyle( "margin-left: -32px", "margin-right: -32px" ) };
		}
	}
`;

/**
 * An input component for the keyphrase.
 */
class KeywordInputComponent extends Component {
	/**
	 * Constructs a KeywordInput component.
	 *
	 * @param {Object}   props           The props for the KeywordInput.
	 * @param {string}   props.id        The id of the KeywordInput.
	 * @param {string}   props.label     The label of the KeywordInput.
	 * @param {boolean}  props.showLabel Toggle between an actual label or an aria-label on the input.
	 * @param {string}   props.keyword   The initial keyword passed to the state.
	 * @param {Function} props.onChange  The function that is triggered when the keyword input field is changed.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.handleChange = this.handleChange.bind( this );
	}

	/**
	 * Handles changes in the KeywordInput, sets the state if a change has been made.
	 *
	 * @param {SyntheticEvent} event The onChange event.
	 *
	 * @returns {void}
	 */
	handleChange( event ) {
		this.props.onChange( event.target.value );
	}

	/**
	 * Renders the input's label.
	 *
	 * @returns {ReactElement} The input label.
	 */
	renderLabel() {
		const {
			id,
			label,
			helpLink,
		} = this.props;
		return (
			<KeywordFieldLabelContainer>
				<KeywordFieldLabel htmlFor={ id }>
					{ label }
				</KeywordFieldLabel>
				{ helpLink }
			</KeywordFieldLabelContainer>
		);
	}

	/**
	 * Renders the input's error message list.
	 *
	 * @returns {ReactElement} The error list.
	 */
	renderErrorMessages() {
		const errorMessages = [ ...this.props.errorMessages ];
		return (
			! isEmpty( errorMessages ) &&
				<ErrorList>
					{ errorMessages.map( ( message, index ) =>
						<ErrorListItem
							key={ index }
						>
							<span role="alert">{ message }</span>
						</ErrorListItem>
					) }
				</ErrorList>
		);
	}

	/**
	 * Renders an input field, a label, and if the condition is met, an error message.
	 *
	 * @returns {ReactElement} The KeywordField react component including its label and eventual error message.
	 */
	render() { // eslint-disable-line complexity
		const { id, showLabel, keyword, onRemoveKeyword, onBlurKeyword, onFocusKeyword, hasError } = this.props;
		// The aria label should not be shown if there is a visible label.
		const showAriaLabel = ! showLabel;

		const showRemoveKeywordButton = onRemoveKeyword !== noop;

		return (
			<KeywordInputContainer>
				{ showLabel && this.renderLabel() }
				{ hasError && this.renderErrorMessages() }
				<YoastInputButtonContainer
					className={ showRemoveKeywordButton ? "has-remove-keyword-button" : null }
				>
					<KeywordField
						aria-label={ showAriaLabel ? this.props.label : null }
						type="text"
						id={ id }
						className={ hasError ? "has-error" : null }
						onChange={ this.handleChange }
						onFocus={ onFocusKeyword }
						onBlur={ onBlurKeyword }
						value={ keyword }
						autoComplete="off"
					/>
					{ showRemoveKeywordButton && (
						<BorderlessButton onClick={ onRemoveKeyword } focusBoxShadowColor={ "#084A67" }>
							<RemoveIcon
								size="18px"
								icon="times-circle"
								color={ greyColor }
							/>
						</BorderlessButton>
					) }
				</YoastInputButtonContainer>
			</KeywordInputContainer>
		);
	}
}

KeywordInputComponent.propTypes = {
	id: PropTypes.string.isRequired,
	showLabel: PropTypes.bool,
	keyword: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	onRemoveKeyword: PropTypes.func,
	onBlurKeyword: PropTypes.func,
	onFocusKeyword: PropTypes.func,
	label: PropTypes.string.isRequired,
	helpLink: PropTypes.node,
	hasError: PropTypes.bool,
	errorMessages: PropTypes.arrayOf(
		PropTypes.string
	),
};

KeywordInputComponent.defaultProps = {
	showLabel: true,
	keyword: "",
	onRemoveKeyword: noop,
	onBlurKeyword: noop,
	onFocusKeyword: noop,
	helpLink: null,
	hasError: false,
	errorMessages: [],
};

export default KeywordInputComponent;
