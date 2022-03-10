import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ExclamationCircleIcon, SelectorIcon } from "@heroicons/react/solid";
import { Fragment, useMemo } from "@wordpress/element";
import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * @param {string} id Identifier.
 * @param {string} value Selected value.
 * @param {{ value, label }[]} options Options to choose from.
 * @param {Function} onChange Change callback.
 * @param {boolean} isError Error message.
 * @param {string} [className] CSS class.
 * @param {Object} [buttonProps] Any extra props for the button.
 * @param {Object} [props] Any extra props.
 * @returns {JSX.Element} Select component.
 */
const Select = ( {
	id,
	value,
	options,
	onChange,
	isError,
	className,
	buttonProps,
	...props
} ) => {
	const selectedOption = useMemo( () => (
		// Default to first option if value is missing.
		options.find( ( option ) => value === option.value ) || options[ 0 ]
	), [ value, options ] );

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
			<Listbox.Button className="yst-select__button" { ...buttonProps }>
				<span className="yst-select__button-label">{ selectedOption.label }</span>
				{ isError ? (
					<ExclamationCircleIcon className="yst-select__button-icon yst-select__button-icon--error" role="img" aria-hidden="true" />
				) : (
					<SelectorIcon className="yst-select__button-icon" role="img" aria-hidden="true" />
				) }
			</Listbox.Button>
			<Transition
				as={ Fragment }
				leave="yst-transition yst-ease-in yst-duration-100"
				leaveFrom="yst-opacity-100"
				leaveTo="yst-opacity-0"
			>
				<Listbox.Options className="yst-select__options">
					{ options.map( ( option, index ) => (
						<Listbox.Option
							key={ `${ id }-${ index }` }
							value={ option.value }
							// eslint-disable-next-line react/jsx-no-bind
							className={ ( { active } ) => classNames(
								"yst-select__option",
								active && "yst-select__option--active",
							) }
						>
							{ ( { selected, active } ) => (
								<>
									<span
										className={ classNames(
											"yst-select__option-label",
											selected && "yst-select__option-label--selected",
										) }
									>
										{ option.label }
									</span>

									{ selected && (
										<CheckIcon
											className={ classNames(
												"yst-select__option-icon",
												active && "yst-select__option-icon--active",
											) }
											role="img"
											aria-hidden="true"
										/>
									) }
								</>

							) }
						</Listbox.Option>
					) ) }
				</Listbox.Options>
			</Transition>
		</Listbox>
	);
};

Select.propTypes = {
	id: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	options: PropTypes.arrayOf( PropTypes.shape( {
		value: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
	} ) ).isRequired,
	onChange: PropTypes.func.isRequired,
	isError: PropTypes.bool,
	className: PropTypes.string,
	buttonProps: PropTypes.object,
};

Select.defaultProps = {
	isError: false,
	className: "",
	buttonProps: {},
};

export default Select;
