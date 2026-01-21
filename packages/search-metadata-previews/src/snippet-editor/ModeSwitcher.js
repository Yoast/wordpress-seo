// External dependencies.
import React, { useCallback } from "react";
import { __ } from "@wordpress/i18n";
import { DeviceMobileIcon } from "@heroicons/react/outline";
import { DesktopComputerIcon } from "@heroicons/react/solid";

// Yoast dependencies.
import { Label, Toggle, Root, useSvgAria } from "@yoast/ui-library";

// Internal dependencies.
import { MODE_DESKTOP, MODE_MOBILE } from "../snippet-preview/constants";

/**
 * The ModeSwitcher component allows switching between mobile and desktop preview modes.
 * Includes a toggle and labels for each mode.
 *
 * @param {Function} onChange Callback when mode is changed.
 * @param {string} active Current active mode.
 * @param {string} id ID for the toggle.
 * @param {string} desktopModeInputId ID for the desktop mode input.
 * @param {string} mobileModeInputId ID for the mobile mode input.
 * @param {boolean} [disabled] Whether the switcher is disabled.
 *
 * @returns {JSX.Element} ModeSwitcher component.
 */
const ModeSwitcher = ( { onChange, active, id, desktopModeInputId, mobileModeInputId, disabled = false } ) => {
	const svgAriaProps = useSvgAria();
	const handleChange = useCallback( () => {
		const newMode = active === MODE_DESKTOP ? MODE_MOBILE : MODE_DESKTOP;
		onChange( newMode );
	}, [ onChange, active ] );

	const label = __( "Google preview", "wordpress-seo" );
	const screenReaderLabel = active === MODE_DESKTOP
		? __( "Switch to mobile preview. Currently showing desktop preview.", "wordpress-seo" )
		: __( "Switch to desktop preview. Currently showing mobile preview.", "wordpress-seo" );
	return (
		<Root>
			<div className="yst-flex yst-justify-between yst-mb-4">
				<Label>
					{ label }
				</Label>
				<div className="yst-flex yst-gap-3 yst-items-center" role="group">
					<span
						className={ active === MODE_MOBILE ? "yst-text-slate-800" : "yst-text-slate-500" }
						aria-hidden="true"
					>
						{ __( "Mobile", "wordpress-seo" ) }
					</span>
					<Toggle
						id={ id }
						className="yst-bg-primary-500"
						checked={ active === MODE_DESKTOP }
						onChange={ handleChange }
						checkedIcon={ <DesktopComputerIcon
							id={ desktopModeInputId }
							className="yst-shrink-0 yst-grow-0 yst-transition-opacity yst-ease-out yst-duration-100 yst-text-slate-800 yst-stroke-0 yst-h-4 yst-w-4"
							{ ...svgAriaProps }
						/> }
						unCheckedIcon={ <DeviceMobileIcon
							id={ mobileModeInputId }
							className="yst-toggle__icon yst-text-slate-800 yst-h-4 yst-w-4"
							{ ...svgAriaProps }
						/> }
						screenReaderLabel={ `${label}: ${ screenReaderLabel }` }
						disabled={ disabled }
					/>
					<span
						className={ active === MODE_DESKTOP ? "yst-text-slate-800" : "yst-text-slate-500" }
						aria-hidden="true"
					>
						{ __( "Desktop", "wordpress-seo" ) }
					</span>
				</div>
			</div>
		</Root>
	);
};

export default ModeSwitcher;
