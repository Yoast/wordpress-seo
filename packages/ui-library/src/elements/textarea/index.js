import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef } from "react";

/**
 * @param {boolean} [disabled=false] Whether the input is disabled.
 * @param {string} [rows] Textarea rows (height).
 * @param {string} [className=""] CSS class.
 * @returns {JSX.Element} Textarea component.
 */
const Textarea = forwardRef( ( {
	disabled,
	rows,
	className,
	...props
}, ref ) => (
	<textarea
		ref={ ref }
		disabled={ disabled }
		rows={ rows }
		className={ classNames(
			"yst-textarea",
			disabled && "yst-textarea--disabled",
			className,
		) }
		{ ...props }
	/>
) );

const propTypes = {
	className: PropTypes.string,
	disabled: PropTypes.bool,
	cols: PropTypes.number,
	rows: PropTypes.number,
};

Textarea.displayName = "Textarea";
Textarea.propTypes = propTypes;
Textarea.defaultProps = {
	className: "",
	disabled: false,
	cols: 20,
	rows: 2,
};

// eslint-disable-next-line require-jsdoc
export const StoryComponent = props => <Textarea { ...props } />;
StoryComponent.propTypes = propTypes;
StoryComponent.defaultProps = Textarea.defaultProps;
StoryComponent.displayName = "Textarea";

export default Textarea;
