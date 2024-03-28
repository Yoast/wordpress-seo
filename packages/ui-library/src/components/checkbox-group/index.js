import classNames from "classnames";
import { includes, noop, without } from "lodash";
import PropTypes from "prop-types";
import React, { useCallback } from "react";
import Checkbox from "../../elements/checkbox";
import Label from "../../elements/label";

/**
 * @param {JSX.node} children Children are rendered below the checkbox group.
 * @param {string} [id] Identifier.
 * @param {string} [name] Name.
 * @param {string[]} [values] Values.
 * @param {string} [label] Label.
 * @param {string} [description] Description.
 * @param {{ value: string, label: string }[]} options Options to choose from.
 * @param {Function} onChange Change handler.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} CheckboxGroup component.
 */
const CheckboxGroup = ( {
	children = null,
	id = "",
	name = "",
	values = [],
	label = "",
	description = "",
	disabled = false,
	options,
	onChange = noop,
	className = "",
	...props
} ) => {
	const handleChange = useCallback( ( { target } ) => {
		if ( target.checked && ! includes( values, target.value ) ) {
			return onChange( [ ...values, target.value ] );
		}
		onChange( without( values, target.value ) );
	}, [ values, onChange ] );

	return (
		<fieldset
			id={ `checkbox-group-${ id }` }
			className={ classNames(
				"yst-checkbox-group",
				disabled && "yst-checkbox-group--disabled",
				className,
			) }
		>
			<Label as="legend" className="yst-checkbox-group__label" label={ label } />
			{ description && <div className="yst-checkbox-group__description">{ description }</div> }
			<div className="yst-checkbox-group__options">
				{ children || options.map( ( option, index ) => {
					const optionId = `checkbox-${ id }-${ index }`;
					return <Checkbox
						key={ optionId }
						id={ optionId }
						name={ name }
						value={ option.value }
						label={ option.label }
						checked={ includes( values, option.value ) }
						disabled={ disabled }
						onChange={ handleChange }
						{ ...props }
					/>;
				} ) }
			</div>
		</fieldset>
	);
};

CheckboxGroup.propTypes = {
	children: PropTypes.node,
	id: PropTypes.string,
	name: PropTypes.string,
	values: PropTypes.arrayOf( PropTypes.string ),
	label: PropTypes.string,
	disabled: PropTypes.bool,
	description: PropTypes.string,
	options: PropTypes.arrayOf( PropTypes.shape( {
		value: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
	} ) ),
	onChange: PropTypes.func,
	className: PropTypes.string,
};

CheckboxGroup.Checkbox = Checkbox;
CheckboxGroup.Checkbox.displayName = "CheckboxGroup.Checkbox";

export default CheckboxGroup;
