import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ExclamationCircleIcon, SelectorIcon } from "@heroicons/react/solid";
import { Fragment, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import classNames from "classnames";
import { PropTypes } from "prop-types";
import { getErrorAriaProps, getErrorId, getOptionActiveStyles } from "../helpers";
import MultiLineText from "./multi-line-text";

/**
 * The Select component.
 *
 * @param {string} id ID attribute.
 * @param {string|number} value Current value.
 * @param {Object[]} choices Array of option objects.
 * @param {string} [label=""] Label. If left empty, no label will be rendered.
 * @param {function} onChange Change handler.
 * @param {ValidationError} [error] Validation error object.
 *
 * @returns {WPElement} The Select element.
 */
export default function Select( { id, value, choices, label, onChange, error, disabled } ) {
	// Find label to display for value of selected choice.
	const valueLabel = useMemo( () => {
		const selectedChoice = choices.find( ( choice ) => value === choice.value );
		return selectedChoice ? selectedChoice.label : __( "Select an option", "wordpress-seo" );
	}, [ choices, value ] );

	return (
		<Listbox id={ id } as="div" value={ value } onChange={ onChange } disabled={ disabled }>
			{ ( { open } ) => (
				<>
					{ label && <Listbox.Label className="yst-block yst-max-w-sm yst-mb-1 yst-text-sm yst-font-medium yst-text-gray-700">{ label }</Listbox.Label> }
					<div className="yst-max-w-sm">
						<div className="yst-relative">
							<Listbox.Button
								className={ classNames(
									"yst-relative yst-h-[45px] yst-w-full yst-leading-6 yst-py-2 yst-pl-3 yst-pr-10 yst-text-left yst-bg-white yst-border yst-border-gray-300 yst-rounded-md yst-shadow-sm yst-cursor-default focus:yst-outline-none focus:yst-ring-1 focus:yst-ring-primary-500 focus:yst-border-primary-500 sm:yst-text-sm",
									{
										"yst-border-red-300": error.isVisible,
										"yst-opacity-50": disabled,
									},
									value === "emptyChoice" ? "yst-text-gray-400" : "yst-text-gray-700"
								) }
								{ ...getErrorAriaProps( id, error ) }
							>
								<span className="yst-block yst-truncate">{ valueLabel }</span>
								<span className="yst-absolute yst-inset-y-0 yst-right-0 yst-flex yst-items-center yst-pr-2 yst-pointer-events-none">
									<SelectorIcon className="yst-w-5 yst-h-5 yst-text-gray-400" aria-hidden="true" />
								</span>
								{ error.isVisible &&
								<div className="yst-flex yst-items-center yst-absolute yst-inset-y-0 yst-right-0 yst-mr-8">
									<ExclamationCircleIcon className="yst-pointer-events-none yst-h-5 yst-w-5 yst-text-red-500" />
								</div> }
							</Listbox.Button>

							<Transition
								show={ open }
								as={ Fragment }
								leave="yst-transition yst-ease-in yst-duration-100"
								leaveFrom="yst-opacity-100"
								leaveTo="yst-opacity-0"
							>
								<Listbox.Options
									static={ true }
									className="yst-absolute yst-z-10 yst-w-full yst-mt-1 yst-overflow-auto yst-bg-white yst-rounded-md yst-shadow-lg yst-max-h-60 yst-ring-1 yst-ring-black yst-ring-opacity-5 focus:yst-outline-none sm:yst-text-sm"
								>
									{ choices.map( ( choice ) => (
										<Listbox.Option
											key={ choice.id }
											as={ Fragment }
											value={ choice.value }
										>
											{ ( { selected, active } ) => (
												<li
													className={ getOptionActiveStyles( { selected, active } ) }
												>
													<span
														className={ classNames(
															selected ? "yst-font-semibold" : "yst-font-normal",
															"yst-block yst-truncate"
														) }
													>
														{ choice.label }
													</span>

													{ selected ? (
														<span
															className={ classNames(
																"yst-text-white yst-absolute yst-inset-y-0 yst-right-0 yst-flex yst-items-center yst-pr-4"
															) }
														>
															<CheckIcon className="yst-w-5 yst-h-5" aria-hidden="true" />
														</span>
													) : null }
												</li>
											) }
										</Listbox.Option>
									) ) }
								</Listbox.Options>
							</Transition>
						</div>
						{ error.isVisible && <MultiLineText id={ getErrorId( id ) } className="yst-mt-2 yst-text-sm yst-text-red-600" texts={ error.message } /> }
					</div>
				</>
			) }
		</Listbox>
	);
}

Select.propTypes = {
	value: PropTypes.string.isRequired,
	choices: PropTypes.arrayOf( PropTypes.shape( {
		id: PropTypes.oneOfType( [ PropTypes.number, PropTypes.string ] ).isRequired,
		value: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
	} ) ).isRequired,
	label: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	id: PropTypes.string.isRequired,
	error: PropTypes.shape( {
		message: PropTypes.string,
		isVisible: PropTypes.bool,
	} ),
	disabled: PropTypes.bool,
};

Select.defaultProps = {
	error: {
		message: "",
		isVisible: false,
	},
	disabled: false,
};
