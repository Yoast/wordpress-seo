import { Combobox, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { constant } from "lodash";
import PropTypes from "prop-types";
import React, { forwardRef, Fragment, useCallback } from "react";
import { useSvgAria } from "../../hooks";
import Button from "../button";
import { ValidationInput } from "../validation";

// Render Combobox.Button as a div always.
const AutocompleteButton = forwardRef( ( props, ref ) => <Combobox.Button as="div" ref={ ref } { ...props } /> );
AutocompleteButton.displayName = "AutocompleteButton";

/**
 * @param {JSX.node} children The children.
 * @param {string} value The value.
 * @returns {JSX.Element} The Option component.
 */
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
 * @param {Function} onClear Clear callback.
 * @param {Object} svgAriaProps SVG aria props.
 * @param {string} screenReaderText Screen reader text.
 * @returns {JSX.Element} Select component.
 */
const ClearSelection = ( { onClear, svgAriaProps, screenReaderText } ) => {
	const handleClear = useCallback( ( e ) => {
		e.preventDefault();
		onClear( null );
	}, [ onClear ] );

	return (
		<Button variant="tertiary" className="yst-autocomplete__clear-action" onClick={ handleClear }>
			<span className="yst-sr-only">{ screenReaderText }</span>
			<XIcon className="yst-autocomplete__action-icon" { ...svgAriaProps } />
		</Button>
	);
};

ClearSelection.propTypes = {
	onClear: PropTypes.func.isRequired,
	svgAriaProps: PropTypes.object.isRequired,
	screenReaderText: PropTypes.string.isRequired,
};

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
 * @param {Function} [onClear] Clear callback.
 * @param {Object} [validation] The validation state.
 * @param {string} [placeholder] Input placeholder.
 * @param {string} [className] CSS class.
 * @param {Object} [buttonProps] Any extra props for the button.
 * @param {string} [clearButtonScreenReaderText] Screen reader text for the clear button.
 * @param {boolean} [nullable=false] Allow nullable values.
 * @param {boolean} [disabled=false] Disable the autocomplete.
 * @param {Object} [props] Any extra props.
 * @returns {JSX.Element} Select component.
 */
const Autocomplete = forwardRef( ( {
	id,
	value,
	children,
	selectedLabel,
	label,
	labelProps,
	labelSuffix,
	onChange,
	onQueryChange,
	onClear,
	validation,
	placeholder,
	className,
	buttonProps,
	clearButtonScreenReaderText,
	nullable,
	disabled,
	...props
}, ref ) => {
	const getDisplayValue = useCallback( constant( selectedLabel ), [ selectedLabel ] );
	const svgAriaProps = useSvgAria();
	const showClearSelection = nullable && selectedLabel;
	const showSelectorIcon = ! validation?.message;
	const showActionContainer = showClearSelection || showSelectorIcon;

	return (
		<Combobox
			ref={ ref }
			as="div"
			value={ value }
			onChange={ onChange }
			className={ classNames(
				"yst-autocomplete",
				disabled && "yst-autocomplete--disabled",
				className,
			) }
			disabled={ disabled }
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
						autoComplete="off"
						placeholder={ placeholder }
						displayValue={ getDisplayValue }
						onChange={ onQueryChange }
					/>
					{ showActionContainer && (
						<div className="yst-autocomplete__action-container">
							{ showClearSelection && (
								<>
									<ClearSelection
										onClear={ onClear || onChange }
										svgAriaProps={ svgAriaProps }
										screenReaderText={ clearButtonScreenReaderText }
									/>
									<hr className="yst-autocomplete__action-separator" />
								</>
							) }
							{ showSelectorIcon && (
								<SelectorIcon className="yst-autocomplete__action-icon yst-pointer-events-none" { ...svgAriaProps } />
							) }
						</div>
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

const propTypes = {
	id: PropTypes.string.isRequired,
	value: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number, PropTypes.bool ] ),
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
	clearButtonScreenReaderText: PropTypes.string,
	nullable: PropTypes.bool,
	onClear: PropTypes.func,
	disabled: PropTypes.bool,
};

Autocomplete.displayName = "Autocomplete";
Autocomplete.propTypes = propTypes;
Autocomplete.defaultProps = {
	children: null,
	value: null,
	selectedLabel: "",
	label: "",
	labelProps: {},
	labelSuffix: null,
	validation: {},
	placeholder: "",
	className: "",
	buttonProps: {},
	clearButtonScreenReaderText: "Clear",
	nullable: false,
	onClear: null,
	disabled: false,
};

Autocomplete.Option = Option;
Autocomplete.Option.displayName = "Autocomplete.Option";

export default Autocomplete;
