import { Disclosure } from "@headlessui/react";
import PropTypes from "prop-types";

/**
 * @param {JSX.node} children The mobile links.
 * @returns {JSX.Element} The mobile container.
 */
const MobileContainer = ( { children } ) => {
	return (
		<Disclosure.Panel className="sm:yst-hidden">
			<div className="yst-space-y-1 yst-pb-4 yst-pt-2">
				{ children }
			</div>
		</Disclosure.Panel>
	);
};

MobileContainer.propTypes = {
	children: PropTypes.node,
};

export default MobileContainer;
