import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef } from "react";

/**
 * @param {string} label Content of the Label. Note that this is a string ONLY for a11y reasons.
 * @param {string} children Alternative to the label. See label.
 * @param {string|JSX.node} [as] Base component.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} Label component.
 */
const Label = forwardRef( ( {
	as: Component,
	className,
	label,
	children,
	...props
}, ref ) => (
	<Component
		ref={ ref }
		className={ classNames( "yst-label", className ) }
		{ ...props }
	>
		{ label || children || null }
	</Component>
) );

const propTypes = {
	label: PropTypes.string,
	children: PropTypes.string,
	as: PropTypes.elementType,
	className: PropTypes.string,
};

Label.displayName = "Label";
Label.propTypes = propTypes;
Label.defaultProps = {
	label: "",
	children: "",
	as: "label",
	className: "",
};


// eslint-disable-next-line require-jsdoc
export const StoryComponent = props => <Label { ...props } />;
StoryComponent.propTypes = propTypes;
StoryComponent.defaultProps = Label.defaultProps;
StoryComponent.displayName = "Label";

export default Label;
