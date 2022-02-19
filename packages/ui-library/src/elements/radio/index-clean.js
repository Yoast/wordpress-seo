/* eslint-disable no-undefined */
import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * @param {string} id Identifier.
 * @param {string} name Name.
 * @param {string} value Value.
 * @param {string} [variant] Variant.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} Radio component.
 */
const Radio = ( {
	id,
	name,
	value,
	className,
	...props
} ) => (
	<input
		type="radio"
		id={ id }
		name={ name }
		value={ value }
		className={ classNames(
			"yst-radio",
			className,
		) }
		{ ...props }
	/>
);

Radio.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	className: PropTypes.string,
};

Radio.defaultProps = {
	className: "",
};

export default Radio;
