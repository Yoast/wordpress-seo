import { Disclosure } from "@headlessui/react";
import { MenuAlt2Icon, XIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";
import { useTopbarNavigationContext } from ".";

/**
 * @param {string} openButtonScreenReaderText The open button screen reader text.
 * @param {string} closeButtonScreenReaderText The close button screen reader text.
 * @returns {JSX.Element} The button that controls the mobile menu.
 */
const MobileMenuButton = ( { openButtonScreenReaderText, closeButtonScreenReaderText } ) => {
	const { isMobileMenuOpen } = useTopbarNavigationContext();

	return (
		<Disclosure.Button
			className="yst-inline-flex yst-items-center yst-justify-center yst-rounded-md yst-p-2 yst-text-slate-400 hover:yst-bg-slate-100 hover:yst-text-slate-500 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-inset focus:yst-ring-primary-500"
		>
			<span className="yst-sr-only">{ isMobileMenuOpen ? closeButtonScreenReaderText : openButtonScreenReaderText }</span>
			{ isMobileMenuOpen
				? <XIcon className="yst-block yst-h-6 yst-w-6" aria-hidden="true" />
				: <MenuAlt2Icon className="yst-block yst-h-6 yst-w-6" aria-hidden="true" />
			}
		</Disclosure.Button>
	);
};

MobileMenuButton.propTypes = {
	openButtonScreenReaderText: PropTypes.string.isRequired,
	closeButtonScreenReaderText: PropTypes.string.isRequired,
};

export default MobileMenuButton;
