import { Switch, Transition } from "@headlessui/react";
import { CheckIcon, XIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { noop } from "lodash";
import PropTypes from "prop-types";
import { useSvgAria } from "../../hooks";

/**
 * @param {string|JSX.Element} [as="button"] Base component.
 * @param {boolean} [checked] Default state.
 * @param {string} screenReaderLabel The label for screen readers.
 * @param {Function} onChange Change callback.
 * @param {boolean} [disabled] Disabled flag.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} Toggle component.
 */
const Toggle = ( {
	as: Component,
	checked,
	screenReaderLabel,
	onChange,
	disabled,
	className,
	...props
} ) => {
	const svgAriaProps = useSvgAria();

	return (
		<Switch
			as={ Component }
			checked={ checked }
			disabled={ disabled }
			onChange={ disabled ? noop : onChange }
			className={ classNames(
				"yst-toggle",
				checked && "yst-toggle--checked",
				disabled && "yst-toggle--disabled",
				className,
			) }
			{ ...props }
		>
			<span className="yst-sr-only">{ screenReaderLabel }</span>
			<span className="yst-toggle__handle">
				<Transition
					show={ checked }
					unmount={ false }
					as="span"
					aria-hidden={ ! checked }
					enter=""
					enterFrom="yst-opacity-0 yst-hidden"
					enterTo="yst-opacity-100"
					leaveFrom="yst-opacity-100"
					leaveTo="yst-opacity-0 yst-hidden"
				>
					<CheckIcon className="yst-toggle__icon yst-toggle__icon--check" { ...svgAriaProps } />
				</Transition>
				<Transition
					show={ ! checked }
					unmount={ false }
					as="span"
					aria-hidden={ checked }
					enterFrom="yst-opacity-0 yst-hidden"
					enterTo="yst-opacity-100"
					leaveFrom="yst-opacity-100"
					leaveTo="yst-opacity-0 yst-hidden"
				>
					<XIcon className="yst-toggle__icon yst-toggle__icon--x" { ...svgAriaProps } />
				</Transition>
			</span>
		</Switch>
	);
};

Toggle.propTypes = {
	as: PropTypes.elementType,
	checked: PropTypes.bool,
	screenReaderLabel: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
	className: PropTypes.string,
};

Toggle.defaultProps = {
	as: "button",
	checked: false,
	disabled: false,
	className: "",
};

export default Toggle;
