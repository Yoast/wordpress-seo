import { Switch } from "@headlessui/react";
import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef } from "react";
import Label from "../../elements/label";
import Toggle from "../../elements/toggle";

/**
 * @param {JSX.node} children Children are rendered below the checkbox group.
 * @param {string} label The Label.
 * @param {JSX.node} [labelSuffix] Optional label suffix.
 * @param {JSX.node} [description] Optional description to use over children prop.
 * @param {boolean} [checked] Default state.
 * @param {boolean} [disabled] Disabled state.
 * @param {Function} onChange Change callback.
 * @param {string} [className] CSS class.
 * @param {Object} props Other Toggle props.
 * @returns {JSX.Element} ToggleField component.
 */
const ToggleField = forwardRef( ( {
	id,
	children,
	label,
	labelSuffix,
	description,
	checked,
	disabled,
	onChange,
	className,
	"aria-label": ariaLabel,
	...props
}, ref ) => (
	<Switch.Group
		as="div"
		className={ classNames( "yst-toggle-field", disabled && "yst-toggle-field--disabled", className ) }
	>
		<div className="yst-toggle-field__header">
			{ label && <div className="yst-toggle-field__label-wrapper">
				<Label as={ Switch.Label } className="yst-toggle-field__label" label={ label } aria-label={ ariaLabel } />
				{ labelSuffix }
			</div> }
			<Toggle
				id={ id }
				ref={ ref }
				checked={ checked }
				onChange={ onChange }
				screenReaderLabel={ label }
				disabled={ disabled }
				{ ...props }
			/>
		</div>
		{ ( description || children ) && (
			<Switch.Description as="div" className="yst-toggle-field__description">
				{ description || children }
			</Switch.Description>
		) }
	</Switch.Group>
) );

ToggleField.displayName = "ToggleField";
ToggleField.propTypes = {
	id: PropTypes.string.isRequired,
	children: PropTypes.node,
	label: PropTypes.string.isRequired,
	labelSuffix: PropTypes.node,
	description: PropTypes.node,
	checked: PropTypes.bool.isRequired,
	disabled: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	className: PropTypes.string,
	"aria-label": PropTypes.string,
};
ToggleField.defaultProps = {
	children: null,
	labelSuffix: null,
	description: null,
	disabled: false,
	className: "",
	"aria-label": null,
};

export default ToggleField;
