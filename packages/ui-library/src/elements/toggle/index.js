import classNames from "classnames";
import PropTypes from "prop-types";
import { noop } from "lodash";
import { Switch, Transition } from "@headlessui/react";
import { CheckIcon, XIcon } from "@heroicons/react/solid";

/**
 * @param {string|JSX.Element} [as="button"] Base component.
 * @param {string} id Identifier.
 * @param {boolean} [checked] Default state.
 * @param {Function} onChange Change callback.
 * @param {boolean} [isDisabled] Disabled flag.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} Toggle component.
 */
const Toggle = ( {
	as: Component,
	id,
	checked,
	onChange,
	isDisabled,
	className,
	...props
} ) => (
	<Switch
		as={ Component }
		id={ id }
		checked={ checked }
		aria-disabled={ isDisabled }
		onChange={ isDisabled ? noop : onChange }
		className={ classNames(
			"yst-toggle",
			checked && "yst-toggle--checked",
			isDisabled && "yst-toggle--disabled",
			className,
		) }
		{ ...props }
	>
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
				<CheckIcon className="yst-toggle__icon yst-toggle__icon--check" />
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
				<XIcon className="yst-toggle__icon yst-toggle__icon--x" />
			</Transition>
		</span>
	</Switch>
);

Toggle.propTypes = {
	as: PropTypes.elementType,
	id: PropTypes.string.isRequired,
	checked: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	isDisabled: PropTypes.bool,
	className: PropTypes.string,
};

Toggle.defaultProps = {
	as: "button",
	checked: false,
	isDisabled: false,
	className: "",
};

export default Toggle;
