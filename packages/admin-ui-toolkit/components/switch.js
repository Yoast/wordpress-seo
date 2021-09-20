import { Switch as HeadlessUiSwitch } from "@headlessui/react";
import classNames from "classnames";
import { noop } from "lodash";
import { PropTypes } from "prop-types";

/**
 * The Switch component.
 *
 * @param {string} [className=""] The classname for the wrapper.
 * @param {string} label The text for the label.
 * @param {string} [description=""] The text for the description. For adding more information under the label.
 * @param {boolean} isChecked The value of the switch.
 * @param {boolean} isDisabled Whether the switch is disabled.
 * @param {function} onChange The change callback.
 *
 * @returns {JSX.Element} The Switch.
 */
export default function Switch( { className, label, description, isChecked, isDisabled, onChange } ) {
	return (
		<HeadlessUiSwitch.Group
			as="div"
			className={ classNames(
				"yst-toggle",
				className,
			) }
		>
			<HeadlessUiSwitch.Label
				className={ classNames(
					isDisabled ? "yst-opacity-50" : "yst-cursor-pointer",
					"yst-flex-grow yst-flex yst-flex-col yst-mr-6",
				) }
			>
				<span className="yst-text-sm yst-font-medium yst-text-gray-700">
					{ label }
				</span>
				{ description && (
					<HeadlessUiSwitch.Description
						className={ classNames(
							isDisabled ? "yst-text-gray-300" : "yst-text-gray-500",
							"yst-font-normal yst-mt-1",
						) }
					>
						{ description }
					</HeadlessUiSwitch.Description>
				) }
			</HeadlessUiSwitch.Label>
			<HeadlessUiSwitch
				as="button"
				checked={ isChecked }
				aria-disabled={ isDisabled }
				onChange={ isDisabled ? noop : onChange }
				className={ classNames(
					isChecked ? "yst-bg-primary-500" : "yst-bg-gray-200",
					isDisabled ? "yst-opacity-50 yst-cursor-default" : "yst-cursor-pointer",
					"yst-relative yst-inline-flex yst-flex-shrink-0 yst-h-6 yst-w-11 yst-border-2 yst-border-transparent yst-rounded-full yst-transition-colors yst-ease-in-out yst-duration-200 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-indigo-500",
				) }
			>
				<span
					className={ classNames(
						isChecked ? "yst-translate-x-5" : "yst-translate-x-0",
						"yst-pointer-events-none yst-inline-block yst-h-5 yst-w-5 yst-rounded-full yst-bg-white yst-shadow yst-transform yst-ring-0 yst-transition yst-ease-in-out yst-duration-200",
					) }
				/>
			</HeadlessUiSwitch>
		</HeadlessUiSwitch.Group>
	);
}

Switch.propTypes = {
	className: PropTypes.string,
	label: PropTypes.string.isRequired,
	description: PropTypes.string,
	isChecked: PropTypes.bool.isRequired,
	isDisabled: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
};

Switch.defaultProps = {
	className: "",
	description: "",
	isDisabled: false,
};
