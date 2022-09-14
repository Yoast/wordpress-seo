import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ExclamationCircleIcon, SelectorIcon } from "@heroicons/react/solid";
import { Fragment, useCallback, useMemo } from "@wordpress/element";
import classNames from "classnames";
import PropTypes from "prop-types";
import { useSvgAria } from "../../hooks";

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
 * @param {boolean} [isError] Error message.
 * @param {string} [className] CSS class.
 * @param {Object} [buttonProps] Any extra props for the button.
 * @param {Object} [props] Any extra props.
 * @returns {JSX.Element} Select component.
 */
const Select = ( {
	id,
	value,
	options = [],
	children = null,
	selectedLabel = "",
	label = "",
	labelProps = {},
	labelSuffix = null,
	onChange,
	isError = false,
	className = "",
	buttonProps,
	...props
} ) => {
	const selectedOption = useMemo( () => (
		// Default to first option if value is missing.
		options.find( ( option ) => value === option?.value ) || options[ 0 ]
	), [ value, options ] );
	const svgAriaProps = useSvgAria();

	return (
		<Listbox
			id={ id }
			as="div"
			value={ value }
			onChange={ onChange }
			className={ classNames(
				"yst-select",
				isError && "yst-select--error",
				className,
			) }
			{ ...props }
		>
			{ label && <div className="yst-flex yst-items-center yst-mb-2">
				<Listbox.Label { ...labelProps }>{ label }</Listbox.Label>
				{ labelSuffix }
			</div> }
			<Listbox.Button className="yst-select__button" { ...buttonProps }>
				<span className="yst-select__button-label">{ selectedLabel || selectedOption?.label || "" }</span>
				{ isError ? (
					<ExclamationCircleIcon className="yst-select__button-icon yst-select__button-icon--error" { ...svgAriaProps } />
				) : (
					<SelectorIcon className="yst-select__button-icon" { ...svgAriaProps } />
				) }
			</Listbox.Button>
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
};

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
	isError: PropTypes.bool,
	className: PropTypes.string,
	buttonProps: PropTypes.object,
};

Select.Option = Option;

export default Select;
