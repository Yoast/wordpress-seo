/* eslint-disable complexity */
import { useCallback } from "@wordpress/element";
import classNames from "classnames";
import PropTypes from "prop-types";

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
 * @param {string|number} value Value.
 * @param {string} label Label.
 * @param {string} [variant="default"] Variant.
 * @param {string} [className=""] CSS class.
 * @param {...Object} [props] Additional properties.
 * @returns {JSX.Element} Radio element.
 */
const Radio = ( {
	id,
	name,
	value,
	label,
	variant = "default",
	className = "",
	...props
} ) => {
	return (
		<div
			className={ classNames(
				"yst-radio",
				radioClassNameMap.variant[ variant ],
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

/**
 * @param {React.ReactNode} children Content of the Label.
 * @param {string|function} [as="label"] Base component.
 * @param {string} [className=""] CSS class.
 * @returns {JSX.Element} Label component.
 */
const Label = ( {
	children,
	as: Component = "label",
	className = "",
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

/**
 * @param {React.ReactNode} [children=null] Children are rendered below the radio group.
 * @param {string} id Identifier.
 * @param {string} name Name.
 * @param {string|number} value Value.
 * @param {React.ReactNode} [label=null] Label.
 * @param {{value: string|number, label: string}[]} options Options to choose from.
 * @param {function}  onChange Change handler.
 * @param {string} [variant="default"] Variant.
 * @param {string} [className=""] CSS class.
 * @param {...Object} [props] Additional properties.
 * @returns {JSX.Element} RadioGroup component.
 */
const RadioGroup = ( {
	children = null,
	id,
	name,
	value,
	label = null,
	options,
	onChange,
	variant = "default",
	className = "",
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
	options: PropTypes.arrayOf( PropTypes.shape( {
		value: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ).isRequired,
		label: PropTypes.string.isRequired,
	} ) ).isRequired,
	onChange: PropTypes.func.isRequired,
	label: PropTypes.node,
	variant: PropTypes.oneOf( Object.keys( classNameMap.variant ) ),
	className: PropTypes.string,
};

export default RadioGroup;
