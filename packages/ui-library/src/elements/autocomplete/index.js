/* eslint-disable require-jsdoc */
import PropTypes from "prop-types";
import { Fragment, useCallback } from "@wordpress/element";
import { Combobox, Transition } from "@headlessui/react";
import { SelectorIcon, CheckIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { constant } from "lodash";

const Option = ( {
	children,
	value,
} ) => {
	const getClassName = useCallback( ( { active, selected } ) => classNames(
		"yst-relative yst-cursor-default yst-select-none yst-py-2 yst-pl-3 yst-pr-9 yst-my-0",
		selected && "yst-bg-primary-500 yst-text-white",
		( active && ! selected ) && "yst-bg-primary-200 yst-text-gray-700",
		( ! active && ! selected ) && "yst-text-gray-700",
	), [] );

	return (
		<Combobox.Option className={ getClassName } value={ value }>
			{ ( { selected } ) => (
				<>
					<span className={ classNames( "yst-block yst-truncate", selected && "yst-font-semibold" ) }>
						{ children }
					</span>
					{ selected ? (
						<span className="yst-absolute yst-inset-y-0 yst-right-0 yst-flex yst-items-center yst-pr-4 yst-text-white">
							<CheckIcon className="yst-h-5 yst-w-5" aria-hidden="true" />
						</span>
					) : null }
				</>
			) }
		</Combobox.Option>
	);
};

const optionPropType = {
	children: PropTypes.node,
	value: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number, PropTypes.bool ] ).isRequired,
};

Option.propTypes = optionPropType;


/**
 * @param {string} id Identifier.
 * @param {string} value Selected value.
 * @param {JSX.node} [children] Defer from the default options rendering.
 * @param {string} [selectedLabel] When using children instead of options, pass the label of the selected option.
 * @param {string} [label] Label.
 * @param {Object} [labelProps] Extra label props.
 * @param {JSX.node} [labelSuffix] Optional label suffix.
 * @param {Function} onChange Change callback.
 * @param {Function} onQueryChange Query change callback.
 * @param {boolean} [isError] Error message.
 * @param {string} [className] CSS class.
 * @param {Object} [buttonProps] Any extra props for the button.
 * @param {Object} [props] Any extra props.
 * @returns {JSX.Element} Select component.
 */
const Autocomplete = ( {
	id,
	value,
	children = null,
	selectedLabel = "",
	label = "",
	labelProps = {},
	labelSuffix = null,
	onChange,
	onQueryChange,
	isError = false,
	className = "",
	buttonProps = {},
	...props
} ) => {
	const getDisplayValue = useCallback( constant( selectedLabel ), [ selectedLabel ] );

	return (
		<Combobox
			id={ id }
			as="div"
			value={ value }
			onChange={ onChange }
			className={ classNames(
				"yst-autocomplete",
				isError && "yst-autocomplete--error",
				className,
			) }
			{ ...props }
		>
			{ label && <div className="yst-flex yst-items-center yst-mb-2">
				<Combobox.Label { ...labelProps }>{ label }</Combobox.Label>
				{ labelSuffix }
			</div> }
			<div className="yst-relative">
				<div className="yst-relative">
					<Combobox.Button
						className="yst-w-full yst-h-full yst-rounded-md yst-border yst-border-gray-300 yst-flex yst-items-center yst-rounded-r-md yst-pl-3 yst-pr-2 focus-within:yst-border-primary-500 focus-within:yst-outline-none focus-within:yst-ring-1 focus-within:yst-ring-primary-500"
						{ ...buttonProps }
						as="div"
					>
						<Combobox.Input
							className="yst-w-full yst-text-gray-700 yst-rounded-md yst-border-0 yst-bg-white yst-py-2 yst-pl-0 yst-pr-10 yst-shadow-none sm:yst-text-sm focus:yst-ring-0"
							displayValue={ getDisplayValue }
							onChange={ onQueryChange }
						/>
						<SelectorIcon
							className="yst-h-5 yst-w-5 yst-text-gray-400 yst-inset-y-0 yst-right-0"
							aria-hidden="true"
						/>
					</Combobox.Button>
				</div>
				<Transition
					as={ Fragment }
					enter="yst-transition yst-duration-100 yst-ease-out"
					enterFrom="yst-transform yst-scale-95 yst-opacity-0"
					enterTo="yst-transform yst-scale-100 yst-opacity-100"
					leave="yst-transition yst-duration-75 yst-ease-out"
					leaveFrom="yst-transform yst-scale-100 yst-opacity-100"
					leaveTo="yst-transform yst-scale-95 yst-opacity-0"
				>
					<Combobox.Options className="yst-absolute yst-z-10 yst-mt-1 yst-max-h-60 yst-w-full yst-overflow-auto yst-rounded-md yst-bg-white yst-text-base yst-shadow-lg yst-ring-1 yst-ring-black yst-ring-opacity-5 focus:yst-outline-none sm:yst-text-sm">
						{ children }
					</Combobox.Options>
				</Transition>
			</div>
		</Combobox>
	);
};

Autocomplete.propTypes = {
	id: PropTypes.string.isRequired,
	value: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number, PropTypes.bool ] ).isRequired,
	options: PropTypes.arrayOf( PropTypes.shape( optionPropType ) ),
	children: PropTypes.node,
	selectedLabel: PropTypes.string,
	label: PropTypes.string,
	labelProps: PropTypes.object,
	labelSuffix: PropTypes.node,
	onChange: PropTypes.func.isRequired,
	onQueryChange: PropTypes.func.isRequired,
	isError: PropTypes.bool,
	className: PropTypes.string,
	buttonProps: PropTypes.object,
};

Autocomplete.Option = Option;

export default Autocomplete;
