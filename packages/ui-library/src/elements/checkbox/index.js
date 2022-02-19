/* eslint-disable no-undefined */
import classNames from "classnames";
import PropTypes from "prop-types";

import Label from "../label";

/**
 * @param {JSX.node} children Children props is used for the checkbox label.
 * @param {string} id Identifier.
 * @param {string} name Name.
 * @param {string} value Value.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} Checkbox component.
 */
const Checkbox = ( {
	children,
	id,
	name,
	value,
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
				children && "yst-mr-3",
				className,
			) }
			{ ...props }
		/>
		{ children && <Label htmlFor={ id } className="yst-radio__label">{ children }</Label> }
	</div>
);

Checkbox.propTypes = {
	children: PropTypes.node,
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	className: PropTypes.string,
};

Checkbox.defaultProps = {
	children: null,
	className: "",
};

export default Checkbox;
