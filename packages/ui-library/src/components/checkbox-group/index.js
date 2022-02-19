/* eslint-disable no-undefined */
import classNames from "classnames";
import PropTypes from "prop-types";

import Checkbox from "../../elements/checkbox";
import Label from "../../elements/label";

/**
 * @param {JSX.node} children Children prop is used for the checkbox label.
 * @param {string} id Identifier.
 * @param {string} name Name.
 * @param {string} label Label.
 * @param {{ value, label }[]} options Options to choose from.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} CheckboxGroup component.
 */
const CheckboxGroup = ( {
	children,
	id,
	name,
	options,
	className,
	...props
} ) => {
	return (
		<div className={ classNames( "yst-checkbox-group", className ) }>
			{ children && <Label className="yst-mb-3">{ children }</Label> }
			<div className="yst-checkbox-group__options">
				{ options.map( ( item, index ) => {
					const itemId = `${ id }-${ index }`;
					return <Checkbox
						key={ itemId }
						id={ itemId }
						name={ name }
						value={ item.value }
						{ ...props }
					>
						{ item.label }
					</Checkbox>;
				} ) }
			</div>
		</div>
	);
};

CheckboxGroup.propTypes = {
	children: PropTypes.node,
	name: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	options: PropTypes.arrayOf( PropTypes.shape( {
		value: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
	} ) ).isRequired,
	className: PropTypes.string,
};

CheckboxGroup.defaultProps = {
	children: null,
	className: "",
};

export default CheckboxGroup;
