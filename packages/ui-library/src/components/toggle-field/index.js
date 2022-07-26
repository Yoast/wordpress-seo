import { Switch } from "@headlessui/react";
import classNames from "classnames";
import PropTypes from "prop-types";
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
const ToggleField = ( {
	children,
	label,
	labelSuffix,
	description,
	checked,
	disabled,
	onChange,
	className,
	...props
} ) => (
	<Switch.Group as="div" className={ classNames( "yst-toggle-field", disabled && "yst-toggle-field--disabled", className ) }>
		{ ( label || description || children ) && (
			<div className="yst-toggle-field__text">
				<div className="yst-flex yst-items-center yst-mb-1">
					<Label as={ Switch.Label } className="yst-toggle-field__label" label={ label } />
					{ labelSuffix }
				</div>
				{ ( description || children ) && (
					<Switch.Description className="yst-toggle-field__description">{ description || children }</Switch.Description>
				) }
			</div>
		) }
		<Toggle
			checked={ checked }
			onChange={ onChange }
			screenReaderLabel={ label }
			disabled={ disabled }
			{ ...props }
		/>
	</Switch.Group>
);

ToggleField.propTypes = {
	children: PropTypes.node,
	label: PropTypes.string.isRequired,
	labelSuffix: PropTypes.node,
	description: PropTypes.node,
	checked: PropTypes.bool.isRequired,
	disabled: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	className: PropTypes.string,
};

ToggleField.defaultProps = {
	children: null,
	className: "",
	labelSuffix: null,
	description: null,
	disabled: false,
};

export default ToggleField;
