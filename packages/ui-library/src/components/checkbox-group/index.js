/* eslint-disable no-undefined */
import classNames from "classnames";
import PropTypes from "prop-types";
import { useCallback } from "@wordpress/element";
import { includes, without } from "lodash";

import Checkbox from "../../elements/checkbox";
import Label from "../../elements/label";

/**
 * @param {JSX.node} children Children are rendered below the checkbox group.
 * @param {string} id Identifier.
 * @param {string} name Name.
 * @param {string[]} values Values.
 * @param {JSX.node} label Label.
 * @param {{ value, label, defaultChecked }[]} options Options to choose from.
 * @param {Function} onChange Change handler.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} CheckboxGroup component.
 */
const CheckboxGroup = ( {
	children,
	id,
	name,
	values,
	label,
	options,
	onChange,
	className,
	...props
} ) => {
	const handleChange = useCallback( ( { target } ) => {
		if ( target.checked && ! includes( values, target.value ) ) {
			return onChange( [ ...values, target.value ] );
		}
		onChange( without( values, target.value ) );
	}, [ values, onChange ] );

	return (
		<div className={ classNames( "yst-checkbox-group", className ) }>
			{ label && <Label className="yst-checkbox-group__label">{ label }</Label> }
			<div className="yst-checkbox-group__options">
				{ options.map( ( item, index ) => {
					const itemId = `${ id }-${ index }`;
					return <Checkbox
						key={ itemId }
						id={ itemId }
						name={ name }
						value={ item.value }
						checked={ includes( values, item.value ) }
						onChange={ handleChange }
						{ ...props }
					>
						{ item.label }
					</Checkbox>;
				} ) }
			</div>
			{ children && <div className="yst-checkbox-group__description">{ children }</div> }
		</div>
	);
};

CheckboxGroup.propTypes = {
	children: PropTypes.node,
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	values: PropTypes.arrayOf( PropTypes.string ),
	label: PropTypes.node,
	options: PropTypes.arrayOf( PropTypes.shape( {
		value: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
		defaultChecked: PropTypes.bool,
	} ) ).isRequired,
	onChange: PropTypes.func.isRequired,
	className: PropTypes.string,
};

CheckboxGroup.defaultProps = {
	children: null,
	values: [],
	label: null,
	className: "",
};

export default CheckboxGroup;
