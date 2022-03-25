/* eslint-disable no-undefined */
import classNames from "classnames";
import PropTypes from "prop-types";
import { useCallback } from "@wordpress/element";

const radioClassNameMap = {
	variant: {
		"default": "",
		"inline-block": "yst-radio--inline-block",
	},
};


const classNameMap = {
	variant: {
		"default": "",
		"inline-block": "yst-radio-group--inline-block",
	},
};

/**
 * @param {string} id Identifier.
 * @param {string} name Name.
 * @param {string} value Value.
 * @param {JSX.string} label Label.
 * @param {JSX.string} srLabel Screen reader label.
 * @param {string} [variant] Variant.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} Radio component.
 */
const Radio = ( {
	id,
	name,
	value,
	label,
	className,
	...props
} ) => {
	return (
		<div
			className={ classNames(
				"yst-radio",
				className
			) }
		>
			<input
				type="radio"
				id={ id }
				name={ name }
				value={ value }
				className="yst-radio__input"
				{ ...props }
			/>
			{ label && <Label htmlFor={ id } className="yst-radio__label">{ label }</Label> }
		</div>
	);
};

Radio.propTypes = {
	name: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	value: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ).isRequired,
	label: PropTypes.string.isRequired,
	variant: PropTypes.oneOf( Object.keys( radioClassNameMap.variant ) ),
	className: PropTypes.string,
};

Radio.defaultProps = {
	variant: "default",
	className: "",
};

/**
 * @param {JSX.node} children Content of the Label.
 * @param {string|function} [as="label"] Base component.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} Label component.
 */
const Label = ( {
	children,
	as: Component,
	className,
	...props
} ) => (
	<Component
		className={ classNames( "yst-label", className ) }
		{ ...props }
	>
		{ children }
	</Component>
);

Label.propTypes = {
	children: PropTypes.node.isRequired,
	as: PropTypes.elementType,
	className: PropTypes.string,
};

Label.defaultProps = {
	as: "label",
	className: "",
};

/**
 * @param {JSX.node} children Children are rendered below the radio group.
 * @param {string} id Identifier.
 * @param {string} name Name.
 * @param {string} value Value.
 * @param {JSX.node} [label] Label.
 * @param {{ value: string, label: string, srLabel: string }[]} options Options to choose from.
 * @param {Function} onChange Change handler.
 * @param {string} [variant] Variant.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} RadioGroup component.
 */
const RadioGroup = ( {
	children,
	id,
	name,
	value,
	label,
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
				className
			) }
		>
			{ label && <Label as="legend" className="yst-radio-group__label">{ label }</Label> }
			{ children && <div className="yst-radio-group__description">{ children }</div> }
			<div className="yst-radio-group__options">
				{ options.map( ( option, index ) => {
					const optionId = `${ id }-${ index }`;
					return <Radio
						key={ optionId }
						id={ optionId }
						name={ name }
						value={ option.value }
						label={ option.label }
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
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	value: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ).isRequired,
	label: PropTypes.node.isRequired,
	options: PropTypes.arrayOf( PropTypes.shape( {
		value: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ).isRequired,
		label: PropTypes.string.isRequired,
		srLabel: PropTypes.string,
	} ) ).isRequired,
	onChange: PropTypes.func.isRequired,
	variant: PropTypes.oneOf( Object.keys( classNameMap.variant ) ),
	className: PropTypes.string,
};

RadioGroup.defaultProps = {
	children: null,
	variant: "default",
	className: "",
};

export default RadioGroup;
