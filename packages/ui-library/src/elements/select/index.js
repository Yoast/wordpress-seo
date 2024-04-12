import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef, Fragment, useCallback, useMemo } from "react";
import { useSvgAria } from "../../hooks";
import Label from "../label";
import { ValidationInput } from "../validation";

const optionPropType = {
	value: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number, PropTypes.bool ] ).isRequired,
	label: PropTypes.string.isRequired,
};

/**
 * @param {string|number|boolean} value Value.
 * @param {string} label Label.
 * @returns {JSX.Element} The option.
 */
const Option = ( { value, label } ) => {
	const svgAriaProps = useSvgAria();
	const getClassName = useCallback( ( { active, selected } ) => classNames(
		"yst-select__option",
		active && "yst-select__option--active",
		selected && "yst-select__option--selected",
	), [] );

	return (
		<Listbox.Option value={ value } className={ getClassName }>
			{ ( { selected } ) => <>
				<span className={ classNames( "yst-select__option-label", selected && "yst-font-semibold" ) }>
					{ label }
				</span>
				{ selected && (
					<CheckIcon className="yst-select__option-check" { ...svgAriaProps } />
				) }
			</> }
		</Listbox.Option>
	);
};

Option.propTypes = optionPropType;

/**
 * @param {string} id Identifier.
 * @param {string} value Selected value.
 * @param {{ value, label }[]} [options] Options to choose from.
 * @param {JSX.node} [children] Defer from the default options rendering.
 * @param {string} [selectedLabel] When using children instead of options, pass the label of the selected option.
 * @param {string} [label] Label.
 * @param {Object} [labelProps] Extra label props.
 * @param {JSX.node} [labelSuffix] Optional label suffix.
 * @param {Function} onChange Change callback.
 * @param {boolean} [disabled] Disabled state.
 * @param {Object} [validation] The validation state.
 * @param {string} [className] CSS class.
 * @param {Object} [buttonProps] Any extra props for the button.
 * @param {Object} [props] Any extra props.
 * @returns {JSX.Element} Select component.
 */
const Select = forwardRef( ( {
	id,
	value,
	options,
	children,
	selectedLabel,
	label,
	labelProps,
	labelSuffix,
	onChange,
	disabled,
	validation,
	className,
	buttonProps,
	...props
}, ref ) => {
	const selectedOption = useMemo( () => (
		// Default to first option if value is missing.
		options.find( ( option ) => value === option?.value ) || options[ 0 ]
	), [ value, options ] );
	const svgAriaProps = useSvgAria();

	return (
		<Listbox
			ref={ ref }
			as="div"
			value={ value }
			onChange={ onChange }
			disabled={ disabled }
			className={ classNames(
				"yst-select",
				disabled && "yst-select--disabled",
				className,
			) }
			{ ...props }
		>
			{ label && <div className="yst-flex yst-items-center yst-mb-2">
				<Listbox.Label as={ Label } { ...labelProps }>{ label }</Listbox.Label>
				{ labelSuffix }
			</div> }
			<ValidationInput
				as={ Listbox.Button }
				data-id={ id }
				className="yst-select__button"
				validation={ validation }
				{ ...buttonProps }
			>
				<span className="yst-select__button-label">{ selectedLabel || selectedOption?.label || "" }</span>
				{ ! validation?.message && (
					<SelectorIcon className="yst-select__button-icon" { ...svgAriaProps } />
				) }
			</ValidationInput>
			<Transition
				as={ Fragment }
				enter="yst-transition yst-duration-100 yst-ease-out"
				enterFrom="yst-transform yst-scale-95 yst-opacity-0"
				enterTo="yst-transform yst-scale-100 yst-opacity-100"
				leave="yst-transition yst-duration-75 yst-ease-out"
				leaveFrom="yst-transform yst-scale-100 yst-opacity-100"
				leaveTo="yst-transform yst-scale-95 yst-opacity-0"
			>
				<Listbox.Options className="yst-select__options">
					{ children || options.map( option => <Option key={ option.value } { ...option } /> ) }
				</Listbox.Options>
			</Transition>
		</Listbox>
	);
} );

Select.displayName = "Select";
Select.propTypes = {
	id: PropTypes.string.isRequired,
	value: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number, PropTypes.bool ] ).isRequired,
	options: PropTypes.arrayOf( PropTypes.shape( optionPropType ) ),
	children: PropTypes.node,
	selectedLabel: PropTypes.string,
	label: PropTypes.string,
	labelProps: PropTypes.object,
	labelSuffix: PropTypes.node,
	onChange: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
	validation: PropTypes.shape( {
		variant: PropTypes.string,
		message: PropTypes.node,
	} ),
	className: PropTypes.string,
	buttonProps: PropTypes.object,
};
Select.defaultProps = {
	options: [],
	children: null,
	selectedLabel: "",
	label: "",
	labelProps: {},
	labelSuffix: null,
	disabled: false,
	validation: {},
	className: "",
	buttonProps: {},
};

Select.Option = Option;
Select.Option.displayName = "Select.Option";

export default Select;
