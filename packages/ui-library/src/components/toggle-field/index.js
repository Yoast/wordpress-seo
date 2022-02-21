/* eslint-disable no-undefined */
import classNames from "classnames";
import PropTypes from "prop-types";

import Toggle from "../../elements/toggle";
import Label from "../../elements/label";

/**
 * @param {JSX.node} children Children are rendered below the checkbox group.
 * @param {string} id Identifier.
 * @param {JSX.node} label Label.
 * @param {boolean} [checked] Default state.
 * @param {Function} onChange Change callback.
 * @param {{ value, label }[]} options Options to choose from.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} ToggleField component.
 */
const ToggleField = ( {
	children,
	id,
	label,
	checked,
	onChange,
	className,
	...props
} ) => (
	<div className={ classNames( "yst-toggle-field", className ) }>
		{ ( label || children ) && (
			<div className="yst-toggle-field__text">
				{ label && <Label className="yst-toggle-field__label">{ label }</Label> }
				{ children && <div className="yst-toggle-field__description">{ children }</div> }
			</div>
		) }
		<Toggle
			id={ id }
			checked={ checked }
			onChange={ onChange }
			{ ...props }
		/>
	</div>
);

ToggleField.propTypes = {
	children: PropTypes.node,
	id: PropTypes.string.isRequired,
	label: PropTypes.node,
	checked: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
	className: PropTypes.string,
};

ToggleField.defaultProps = {
	children: null,
	label: null,
	className: "",
};

export default ToggleField;
