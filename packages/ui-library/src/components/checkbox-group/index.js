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
		<fieldset className={ classNames( "yst-checkbox-group", className ) }>
			{ label && <Label as="legend" className="yst-checkbox-group__label">{ label }</Label> }
			<div className="yst-checkbox-group__options">
				{ options.map( ( option, index ) => {
					const optionId = `${ id }-${ index }`;
					return <Checkbox
						key={ optionId }
						id={ optionId }
						name={ name }
						value={ option.value }
						checked={ includes( values, option.value ) }
						onChange={ handleChange }
						{ ...props }
					>
						{ option.label }
					</Checkbox>;
				} ) }
			</div>
			{ children && <div className="yst-checkbox-group__description">{ children }</div> }
		</fieldset>
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
