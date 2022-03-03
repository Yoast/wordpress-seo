import { Combobox } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { __ } from "@wordpress/i18n";
import { Fragment, useState, useEffect, useCallback } from "@wordpress/element";
import classNames from "classnames";
import PropTypes from "prop-types";
import { noop } from "lodash";

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
 * Helper function to get active styles for select options.
 *
 * @param {boolean} options.active Whether the option is active.
 *
 * @returns {string} Styles for an active option.
 */
function getOptionActiveStyles( { active } ) {
	return classNames(
		"yst-relative yst-cursor-default yst-select-none yst-py-2 yst-pl-3 yst-pr-9",
		active ? "yst-bg-primary-500 yst-text-white" : "yst-text-gray-900"
	);
}

/**
 * The Yoast version of a Tailwind Combobox.
 *
 * @param {Object} props The props object.
 *
 * @returns {WPElement} The Yoast version of a Tailwind Combobox.
 */
export default function YoastComboBox( { value, onChange, options, onInputChange, placeholder } ) {
	const [ filteredOptions, setFilteredOptions ] = useState( options );

	const handleInputChange = useCallback( ( event ) => {
		if ( onInputChange ) {
			onInputChange( event );
		} else {
			setFilteredOptions( options.filter( option => option.label.includes( event.target.value ) ) );
		}
	}, [ options, onInputChange ] );

	useEffect( () => {
		setFilteredOptions( options );
	}, [ options ] );

	return <Combobox as="div" value={ value } onChange={ onChange }>
		{
			( { open } ) => {
				return <Fragment>
					<Combobox.Label className="yst-block yst-text-sm yst-font-medium yst-text-gray-700">{ __( "Name", "wordpress-seo" ) }</Combobox.Label>
					<div className="yst-h-[45px] yst-max-w-sm yst-relative yst-mt-1">
						<Combobox.Input
							className="yst-w-full yst-rounded-md yst-border yst-border-gray-300 yst-bg-white yst-py-2 yst-pl-3 yst-pr-10 yst-shadow-sm focus:yst-border-primary-500 focus:yst-outline-none focus:yst-ring-1 focus:yst-ring-primary-500 sm:yst-text-sm"
							onChange={ handleInputChange }
							displayValue={ getDisplayValue }
							placeholder={ placeholder }
						/>
						<Combobox.Button
							id="configuration-user-select-button"
							className="yst-absolute yst-inset-y-0 yst-right-0 yst-flex yst-items-center yst-rounded-r-md yst-px-2 focus:yst-outline-none"
						>
							<SelectorIcon className="yst-h-5 yst-w-5 yst-text-gray-400" aria-hidden="true" />
						</Combobox.Button>

						{ ( filteredOptions.length > 0 && open ) && (
							<Combobox.Options static={ true } className="yst-absolute yst-z-10 yst-mt-1 yst-max-h-60 yst-w-full yst-overflow-auto yst-rounded-md yst-bg-white yst-py-1 yst-text-base yst-shadow-lg yst-ring-1 yst-ring-black yst-ring-opacity-5 focus:yst-outline-none sm:yst-text-sm">
								{ filteredOptions.map( ( option ) => {
									return <Combobox.Option
										key={ `yst-option-${ option.value }` }
										value={ option }
										className={ getOptionActiveStyles }
									>
										{ ( { active, selected } ) => (
											<>
												<span className={ classNames( "yst-block yst-truncate", selected && "yst-font-semibold" ) }>{ option.label }</span>

												{ ( selected || value.value === option.value ) && (
													<span
														className={ classNames(
															"yst-absolute yst-inset-y-0 yst-right-0 yst-flex yst-items-center yst-pr-4",
															active ? "yst-text-white" : "yst-text-primary-500"
														) }
													>
														<CheckIcon className="yst-h-5 yst-w-5" aria-hidden="true" />
													</span>
												) }
											</>
										) }
									</Combobox.Option>;
								} ) }
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
	value: PropTypes.shape( {
		value: PropTypes.number,
		label: PropTypes.string,
	} ),
	onInputChange: PropTypes.func,
	placeholder: PropTypes.string,
};

YoastComboBox.defaultProps = {
	value: null,
	onInputChange: null,
	placeholder: __( "Select an option", "wordpress-seo" ),
};
