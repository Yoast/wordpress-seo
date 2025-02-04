import classNames from "classnames";
import { noop } from "lodash";
import PropTypes from "prop-types";
import React, { useCallback } from "react";
import Label from "../../elements/label";

import Radio from "../../elements/radio";

const classNameMap = {
	variant: {
		"default": "",
		"inline-block": "yst-radio-group--inline-block",
	},
};

/**
 * @param {JSX.node} children Children are rendered below the radio group.
 * @param {string} [id] Identifier.
 * @param {string} [name] Name.
 * @param {string} [value] Value.
 * @param {string} [label] Label.
 * @param {string} [description] Description.
 * @param {{ value: string, label: string, screenReaderLabel: string }[]} options Options to choose from.
 * @param {Function} [onChange] Change handler.
 * @param {string} [variant] Variant.
 * @param {boolean} [disabled] Disabled state.
 * @param {string} [className] CSS class.
 * @param {Object} [props] Extra Radio props.
 * @returns {JSX.Element} RadioGroup component.
 */
const RadioGroup = ( {
	children = null,
	id = "",
	name = "",
	value = "",
	label,
	description,
	options,
	onChange = noop,
	variant = "default",
	disabled = false,
	className = "",
	...props
} ) => {
	const handleChange = useCallback( ( { target } ) => target.checked && onChange( target.value ), [ onChange ] );

	return (
		<fieldset
			id={ `radio-group-${ id }` }
			className={ classNames(
				"yst-radio-group",
				disabled && "yst-radio-group--disabled",
				classNameMap.variant[ variant ],
				className,
			) }
		>
			{ label && <Label as="legend" className="yst-radio-group__label" label={ label } /> }
			{ description && <div className="yst-radio-group__description">{ description }</div> }
			<div className="yst-radio-group__options">
				{ children || options.map( ( option, index ) => {
					const optionId = `radio-${ id }-${ index }`;
					return <Radio
						key={ optionId }
						id={ optionId }
						name={ name }
						value={ option.value }
						label={ option.label }
						screenReaderLabel={ option.screenReaderLabel }
						variant={ variant }
						checked={ value === option.value }
						onChange={ handleChange }
						disabled={ disabled }
						{ ...props }
					/>;
				} ) }
			</div>
		</fieldset>
	);
};

RadioGroup.propTypes = {
	children: PropTypes.node,
	id: PropTypes.string,
	name: PropTypes.string,
	value: PropTypes.string,
	label: PropTypes.string,
	description: PropTypes.string,
	options: PropTypes.arrayOf( PropTypes.shape( {
		value: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
		screenReaderLabel: PropTypes.string,
	} ) ),
	onChange: PropTypes.func,
	variant: PropTypes.oneOf( Object.keys( classNameMap.variant ) ),
	disabled: PropTypes.bool,
	className: PropTypes.string,
};

RadioGroup.Radio = Radio;
RadioGroup.Radio.displayName = "RadioGroup.Radio";

export default RadioGroup;
