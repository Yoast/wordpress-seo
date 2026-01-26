/* eslint-disable no-undefined */
import { Switch, Transition } from "@headlessui/react";
import { CheckIcon, XIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { noop } from "lodash";
import PropTypes from "prop-types";
import React, { forwardRef } from "react";
import { useSvgAria } from "../../hooks";

/**
 * @param {string} id ID.
 * @param {string|JSX.Element} [as="button"] Base component.
 * @param {boolean} checked Default state.
 * @param {string} screenReaderLabel The label for screen readers.
 * @param {Function} onChange Change callback.
 * @param {boolean} [disabled] Disabled flag.
 * @param {string} [type] Type.
 * @param {string} [className] CSS class.
 * @param {JSX.Element} [checkedIcon] Icon to show when checked.
 * @param {JSX.Element} [unCheckedIcon] Icon to show when unchecked.
 * @returns {JSX.Element} Toggle component.
 */
const Toggle = forwardRef( ( {
	id,
	as: Component,
	checked,
	screenReaderLabel,
	onChange,
	disabled,
	className,
	type,
	checkedIcon,
	unCheckedIcon,
	...props
}, ref ) => {
	const svgAriaProps = useSvgAria();
	return (
		<Switch
			ref={ ref }
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
			data-id={ id }
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
					{ checkedIcon || <CheckIcon className="yst-toggle__icon yst-toggle__icon--check" { ...svgAriaProps } /> }
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
					{ unCheckedIcon || <XIcon className="yst-toggle__icon yst-toggle__icon--x" { ...svgAriaProps } /> }
				</Transition>
			</span>
		</Switch>
	);
} );

Toggle.displayName = "Toggle";
Toggle.propTypes = {
	as: PropTypes.elementType,
	id: PropTypes.string.isRequired,
	checked: PropTypes.bool,
	screenReaderLabel: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
	type: PropTypes.string,
	className: PropTypes.string,
	checkedIcon: PropTypes.node,
	unCheckedIcon: PropTypes.node,
};
Toggle.defaultProps = {
	as: "button",
	checked: false,
	disabled: false,
	type: "",
	className: "",
	checkedIcon: undefined,
	unCheckedIcon: undefined,
};

export default Toggle;
