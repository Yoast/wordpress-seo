import { Combobox } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { __ } from "@wordpress/i18n";
import { Fragment, useState, useEffect, useCallback } from "@wordpress/element";
import classNames from "classnames";
import PropTypes from "prop-types";

import { getOptionActiveStyles } from "../helpers";
import Spinner from "./spinner";

/**
 * A function needed to extract the label to display when a person is selected.
 *
 * @param {*} selectedOption The object to get a display value for.
 *
 * @returns {string|null} The value to display. Returns null if there is no label.
 */
function getDisplayValue( selectedOption ) {
	return selectedOption && selectedOption.label ? selectedOption.label : null;
}

/**
 * The Yoast version of a Tailwind Combobox.
 *
 * @param {Object}   props               The props object.
 * @param {string}   props.id            The id for this combo box.
 * @param {Object}   props.value         Selected option with shape {value, label}.
 * @param {*}        props.value.value   The id of the selected option
 * @param {string}   props.value.label   The display label of the selected option
 * @param {string}   props.label         Combobox label.
 * @param {function} props.onChange      Function to manage a selected option.
 * @param {function} props.onQueryChange Function to be called when the text inside the text input changes.
 * @param {array}    props.options       Combobox select options.
 * @param {string}   props.placeholder   Combobox text input placeholder.
 *
 * @returns {WPElement} The Yoast version of a Tailwind Combobox.
 */
export default function YoastComboBox( { id, value, label, onChange, onQueryChange, options, placeholder, isLoading } ) {
	const [ filteredOptions, setFilteredOptions ] = useState( options );
	const [ query, setQuery ] = useState( "" );

	const handleInputChange = useCallback( ( event ) => {
		setQuery( event.target.value );
	}, [ setQuery ] );

	const handleBlur = useCallback( () => {
		setQuery( "" );
	}, [ setQuery ] );

	useEffect( () => {
		setFilteredOptions( options );
	}, [ options ] );

	useEffect( () => {
		if ( onQueryChange ) {
			onQueryChange( query );
		} else {
			setFilteredOptions( options.filter( option => option.label.toLowerCase().includes( query.toLowerCase() ) ) );
		}
	}, [ query, onQueryChange ] );

	/**
	 * Returns a function that is used by the Combobox.Option className prop.
	 * Otherwise we have no option of overriding the selected prop that they pass (and avoid arrow functions in the render).
	 */
	const getOptionBasedStyles = useCallback( ( optionValue, selectedValue ) => {
		return ( { selected, active } ) => {
			return getOptionActiveStyles( { selected: selected || optionValue === selectedValue, active } );
		};
	}, [ getOptionActiveStyles ] );

	/**
	 * Clicking the input when the options are open would trigger the Combobox.Button's click event.
	 * Thus we need to stop the events propagation in the case an event is open.
	 */
	const stopEventPropagation = useCallback( ( isOpen ) => {
		return ( event ) => {
			if ( isOpen ) {
				event.stopPropagation();
			}
		};
	}, [] );

	return <Combobox id={ id } as="div" value={ value } onChange={ onChange } onBlur={ handleBlur }>
		{
			( { open } ) => {
				return <Fragment>
					{ label && <Combobox.Label className="yst-block yst-mb-1 yst-max-w-sm yst-text-sm yst-font-medium yst-text-gray-700">{ label }</Combobox.Label> }
					<div className="yst-h-[45px] yst-max-w-sm yst-relative">
						<Combobox.Button
							role="button"
							className="yst-w-full yst-h-full yst-rounded-md yst-border yst-border-gray-300 yst-flex yst-items-center yst-rounded-r-md yst-pl-3 yst-pr-2 focus-within:yst-border-primary-500 focus-within:yst-outline-none focus-within:yst-ring-1 focus-within:yst-ring-primary-500"
							as="div"
						>
							<Combobox.Input
								className="yst-w-full yst-text-gray-700 yst-rounded-md yst-border-0 yst-outline-none yst-bg-white yst-py-2 yst-pl-0 yst-pr-10 yst-shadow-none sm:yst-text-sm"
								onChange={ handleInputChange }
								displayValue={ getDisplayValue }
								placeholder={ placeholder }
								onClick={ stopEventPropagation( open ) }
							/>
							<SelectorIcon className="yst-h-5 yst-w-5 yst-text-gray-400 yst-inset-y-0 yst-right-0" aria-hidden="true" />
						</Combobox.Button>
						{ ( filteredOptions.length > 0 ) && (
							<Combobox.Options className="yst-absolute yst-z-10 yst-mt-1 yst-max-h-60 yst-w-full yst-overflow-auto yst-rounded-md yst-bg-white yst-text-base yst-shadow-lg yst-ring-1 yst-ring-black yst-ring-opacity-5 focus:yst-outline-none sm:yst-text-sm">
								{ isLoading && <div className="yst-flex yst-bg-white yst-sticky yst-z-20 yst-text-sm yst-italic yst-top-0 yst-py-2 yst-pl-3 yst-pr-9 yst-my-0"><Spinner className="yst-text-primary-500 yst-h-4 yst-w-4 yst-mr-2 yst-self-center" />{ __( "Loading...", "wordpress-seo" ) }</div> }
								{ filteredOptions.map( ( option ) => (
									<Combobox.Option
										key={ `yst-option-${ option.value }` }
										value={ option }
										className={ getOptionBasedStyles( option.value, value.value ) }
									>
										{ ( { selected } ) => {
											return <>
												<span className={ classNames( "yst-block yst-truncate", ( selected || value.value === option.value ) && "yst-font-semibold" ) }>{ option.label }</span>
												{ ( selected || value.value === option.value ) && (
													<span
														className={ "yst-absolute yst-inset-y-0 yst-right-0 yst-flex yst-items-center yst-pr-4 yst-text-white" }
													>
														<CheckIcon className="yst-h-5 yst-w-5" aria-hidden="true" />
													</span>
												) }
											</>;
										} }
									</Combobox.Option>
								 ) ) }
							</Combobox.Options>
						) }
					</div>
				</Fragment>;
			}
		}
	</Combobox>;
}

YoastComboBox.propTypes = {
	onChange: PropTypes.func.isRequired,
	options: PropTypes.array.isRequired,
	id: PropTypes.string.isRequired,
	value: PropTypes.shape( {
		value: PropTypes.number,
		label: PropTypes.string,
	} ),
	label: PropTypes.string,
	onQueryChange: PropTypes.func,
	placeholder: PropTypes.string,
	isLoading: PropTypes.bool,
};

YoastComboBox.defaultProps = {
	value: null,
	label: "",
	onQueryChange: null,
	placeholder: __( "Select an option", "wordpress-seo" ),
	isLoading: false,
};
