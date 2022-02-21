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
	<div className="yst-flex yst-items-center">
		<input
			type="checkbox"
			id={ id }
			name={ name }
			value={ value }
			className={ classNames(
				"yst-checkbox",
				label && "yst-mr-3",
				className,
			) }
			{ ...props }
		/>
		{ label && <Label htmlFor={ id } className="yst-radio__label">{ label }</Label> }
	</div>
);

Checkbox.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	label: PropTypes.node,
	className: PropTypes.string,
};

Checkbox.defaultProps = {
	label: null,
	className: "",
};

export default Checkbox;
