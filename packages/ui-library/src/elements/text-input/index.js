import { forwardRef } from "@wordpress/element";
import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * @param {string} [type="text"] The type of input.
 * @param {string} [className=""] CSS class.
 * @param {boolean} [disabled=false] Whether the input is disabled.
 * @param {boolean} [readOnly=false] Whether the input is read-only.
 * @param {object} [props] Optional extra properties.
 * @returns {JSX.Element} TextInput component.
 */
const TextInput = forwardRef( ( {
	type,
	className,
	disabled,
	readOnly,
	...props
}, ref ) => (
	<input
		ref={ ref }
		type={ type }
		className={ classNames(
			! props?.value && "yst-text-input--empty",
			"yst-text-input",
			disabled && "yst-text-input--disabled",
			readOnly && "yst-text-input--read-only",
			className,
		) }
		disabled={ disabled }
		readOnly={ readOnly }
		{ ...props }
	/>
) );

const propTypes = {
	type: PropTypes.string,
	className: PropTypes.string,
	disabled: PropTypes.bool,
	readOnly: PropTypes.bool,
};

TextInput.propTypes = propTypes;

TextInput.defaultProps = {
	type: "text",
	className: "",
	disabled: false,
	readOnly: false,
};

export default TextInput;

// eslint-disable-next-line require-jsdoc
export const StoryComponent = props => <TextInput { ...props } />;
StoryComponent.propTypes = propTypes;
StoryComponent.defaultProps = TextInput.defaultProps;
StoryComponent.displayName = "TextInput";
