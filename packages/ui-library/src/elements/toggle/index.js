import { Switch, Transition } from "@headlessui/react";
import { CheckIcon, XIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { noop } from "lodash";
import PropTypes from "prop-types";
import { useSvgAria } from "../../hooks";

/**
 * @param {string|JSX.Element} [as="button"] Base component.
 * @param {boolean} checked Default state.
 * @param {string} screenReaderLabel The label for screen readers.
 * @param {Function} onChange Change callback.
 * @param {boolean} [disabled] Disabled flag.
 * @param {string} [type] Type.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} Toggle component.
 */
const Toggle = ( {
	as: Component = "button",
	checked,
	screenReaderLabel,
	onChange,
	disabled = false,
	className = "",
	type = "",
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
			// Force type button when component is button for proper behavior in HTML forms.
			type={ Component === "button" ? "button" : type }
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
	type: PropTypes.string,
	className: PropTypes.string,
};

export default Toggle;
