/* eslint-disable no-undefined */
import { useCallback } from "@wordpress/element";
import classNames from "classnames";
import { noop } from "lodash";
import PropTypes from "prop-types";
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
 * @param {string} [className] CSS class.
 * @param {Object} [props] Extra Radio props.
 * @returns {JSX.Element} RadioGroup component.
 */
const RadioGroup = ( {
	children,
	id,
	name,
	value,
	label,
	description,
	options,
	onChange,
	variant,
	className,
	...props
} ) => {
	const handleChange = useCallback( ( { target } ) => target.checked && onChange( target.value ), [ onChange ] );

	return (
		<fieldset
			className={ classNames(
				"yst-radio-group",
				classNameMap.variant[ variant ],
				className,
			) }
		>
			{ label && <Label as="legend" className="yst-radio-group__label" label={ label } /> }
			{ description && <div className="yst-radio-group__description">{ description }</div> }
			<div className="yst-radio-group__options">
				{ children || options.map( ( option, index ) => {
					const optionId = `${ id }-${ index }`;
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
	className: PropTypes.string,
};

RadioGroup.defaultProps = {
	children: null,
	id: "",
	name: "",
	value: "",
	label: "",
	variant: "default",
	description: "",
	onChange: noop,
	className: "",
};

export default RadioGroup;
