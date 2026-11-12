/* eslint-disable complexity */
import { useCallback } from "@wordpress/element";
import classNames from "classnames";

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
 * @param {Object} props Component props. Additional props are passed to the input element.
 * @param {string} props.name Name.
 * @param {string} props.id Identifier.
 * @param {(string|number)} props.value Value.
 * @param {string} props.label Label.
 * @param {("default"|"inline-block")} [props.variant="default"] Variant.
 * @param {string} [props.className=""] CSS class.
 *
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

/**
 * @param {Object} props Component props.
 * @param {React.ReactNode} props.children Content of the Label.
 * @param {import("react").ElementType} [props.as="label"] Base component.
 * @param {string} [props.className=""] CSS class.
 *
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

/**
 * @param {Object} props Component props. Additional props are passed to each Radio.
 * @param {React.ReactNode} [props.children=null] Children are rendered below the radio group.
 * @param {string} props.id Identifier.
 * @param {string} props.name Name.
 * @param {(string|number)} props.value Value.
 * @param {Object[]} props.options Options to choose from.
 * @param {(string|number)} props.options[].value The option value.
 * @param {string} props.options[].label The option label.
 * @param {Function} props.onChange Change handler.
 * @param {React.ReactNode} [props.label=null] Label.
 * @param {("default"|"inline-block")} [props.variant="default"] Variant.
 * @param {string} [props.className=""] CSS class.
 *
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

export default RadioGroup;
