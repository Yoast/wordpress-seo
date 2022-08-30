/* eslint-disable require-jsdoc */
import PropTypes from "prop-types";
import { Fragment, useCallback } from "@wordpress/element";
import { Combobox, Transition } from "@headlessui/react";
import { SelectorIcon, CheckIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { constant } from "lodash";

const Option = ( {
	value,
	label,
} ) => {
	const getClassName = useCallback( ( { active } ) => (
		`yst-relative yst-cursor-default yst-select-none yst-py-2 yst-pl-10 yst-pr-4 ${
			active ? "yst-bg-teal-600 yst-text-white" : "yst-text-gray-900"
		}`
	), [] );

	return (
		<Combobox.Option
			className={ getClassName }
			value={ value }
		>
			{ ( { selected } ) => (
				<>
					<span className={ classNames( "yst-block yst-truncate", selected && "yst-font-semibold" ) }>
						{ label }
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
	value: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number, PropTypes.bool ] ).isRequired,
	label: PropTypes.string.isRequired,
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
				<div className="yst-relative yst-w-full yst-cursor-default yst-overflow-hidden yst-rounded-lg yst-bg-white yst-text-left yst-shadow-md focus:yst-outline-none focus-visible:yst-ring-2 focus-visible:yst-ring-white focus-visible:yst-ring-opacity-75 focus-visible:yst-ring-offset-2 focus-visible:yst-ring-offset-teal-300 sm:yst-text-sm">
					<Combobox.Input
						className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
						displayValue={ getDisplayValue }
						onChange={ onQueryChange }
					/>
					<Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2" { ...buttonProps }>
						<SelectorIcon
							className="h-5 w-5 text-gray-400"
							aria-hidden="true"
						/>
					</Combobox.Button>
				</div>
				<Transition
					as={ Fragment }
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
