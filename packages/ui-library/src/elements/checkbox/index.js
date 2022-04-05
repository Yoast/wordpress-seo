/* eslint-disable no-undefined */
import classNames from "classnames";
import PropTypes from "prop-types";

import Label from "../label";

/**
 * @param {string} id Identifier.
 * @param {string} name Name.
 * @param {string} value Value.
 * @param {JSX.node} label Label.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} Checkbox component.
 */
const Checkbox = ( {
	id,
	name,
	value,
	label,
	className,
	...props
} ) => (
	<div
		className={ classNames(
			"yst-checkbox",
			className,
		) }
	>
		<input
			type="checkbox"
			id={ id }
			name={ name }
			value={ value }
			className="yst-checkbox__input"
			{ ...props }
		/>
		{ label && <Label htmlFor={ id } className="yst-checkbox__label">{ label }</Label> }
	</div>
);

Checkbox.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	label: PropTypes.node.isRequired,
	className: PropTypes.string,
};

Checkbox.defaultProps = {
	className: "",
};

export default Checkbox;
