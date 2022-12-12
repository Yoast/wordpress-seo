/* eslint-disable require-jsdoc */
import PropTypes from "prop-types";
import { forwardRef, Fragment, useCallback } from "@wordpress/element";
import { Combobox, Transition } from "@headlessui/react";
import { SelectorIcon, CheckIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { constant } from "lodash";
import { useSvgAria } from "../../hooks";
import { ValidationInput } from "../validation";

// Render Combobox.Button as a div always.
const AutocompleteButton = forwardRef( ( props, ref ) => <Combobox.Button as="div" ref={ ref } { ...props } /> );

const Option = ( {
	children,
	value,
} ) => {
	const svgAriaProps = useSvgAria();
	const getClassName = useCallback( ( { active, selected } ) => classNames(
		"yst-autocomplete__option",
		selected && "yst-autocomplete__option--selected",
		( active && ! selected ) && "yst-autocomplete__option--active",
	), [] );

	return (
		<Combobox.Option className={ getClassName } value={ value }>
			{ ( { selected } ) => (
				<>
					<span className={ classNames( "yst-autocomplete__option-label", selected && "yst-font-semibold" ) }>
						{ children }
					</span>
					{ selected && (
						<CheckIcon className="yst-autocomplete__option-check" { ...svgAriaProps } />
					) }
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
 * @param {Object} [validation] The validation state.
 * @param {string} [placeholder] Input placeholder.
 * @param {string} [className] CSS class.
 * @param {Object} [buttonProps] Any extra props for the button.
 * @param {Object} [props] Any extra props.
 * @returns {JSX.Element} Select component.
 */
const Autocomplete = forwardRef( ( {
	id,
	value,
	children = null,
	selectedLabel = "",
	label = "",
	labelProps = {},
	labelSuffix = null,
	onChange,
	onQueryChange,
	validation = {},
	placeholder = "",
	className = "",
	buttonProps = {},
	...props
}, ref ) => {
	const getDisplayValue = useCallback( constant( selectedLabel ), [ selectedLabel ] );
	const svgAriaProps = useSvgAria();

	return (
		<Combobox
			ref={ ref }
			as="div"
			value={ value }
			onChange={ onChange }
			className={ classNames( "yst-autocomplete", className ) }
			{ ...props }
		>
			{ label && <div className="yst-flex yst-items-center yst-mb-2">
				<Combobox.Label { ...labelProps }>{ label }</Combobox.Label>
				{ labelSuffix }
			</div> }
			<div className="yst-relative">
				<ValidationInput
					as={ AutocompleteButton }
					data-id={ id }
					validation={ validation }
					className="yst-autocomplete__button"
					{ ...buttonProps }
				>
					<Combobox.Input
						className="yst-autocomplete__input"
						placeholder={ placeholder }
						displayValue={ getDisplayValue }
						onChange={ onQueryChange }
					/>
					{ ! validation?.message && (
						<SelectorIcon className="yst-autocomplete__button-icon" { ...svgAriaProps } />
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
					<Combobox.Options className="yst-autocomplete__options">
						{ children }
					</Combobox.Options>
				</Transition>
			</div>
		</Combobox>
	);
} );

Autocomplete.propTypes = {
	id: PropTypes.string.isRequired,
	value: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number, PropTypes.bool ] ).isRequired,
	children: PropTypes.node,
	selectedLabel: PropTypes.string,
	label: PropTypes.string,
	labelProps: PropTypes.object,
	labelSuffix: PropTypes.node,
	onChange: PropTypes.func.isRequired,
	onQueryChange: PropTypes.func.isRequired,
	validation: PropTypes.shape( {
		variant: PropTypes.string,
		message: PropTypes.node,
	} ),
	placeholder: PropTypes.string,
	className: PropTypes.string,
	buttonProps: PropTypes.object,
};

Autocomplete.Option = Option;

export default Autocomplete;
