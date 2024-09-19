
import PropTypes from "prop-types";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";

/**
 * @param {string} label The label of the collapsible.
 * @param {ReactNode} children The children of the collapsible.
 * @returns {JSX.Element} The hidden alerts collapsible component.
 */
export const HiddenAlertsCollapsible = ( { label, children } ) => {
	return (
		<Disclosure>
			{ ( { open } ) => (
				<div className="yst-p-4 yst-shadow-sm yst-border-slate-200 yst-rounded-md yst-border">
					<Disclosure.Button className="yst-w-full yst-flex yst-justify-between">
						<div>{ label }</div>
						<ChevronDownIcon
							className={ `${
								open ? "yst-rotate-180 yst-transform" : ""
							} yst-h-5 yst-w-5` }
						/>
					</Disclosure.Button>
					<Disclosure.Panel>
						{ children }
					</Disclosure.Panel>
				</div>
			) }
		</Disclosure>
	);
};

HiddenAlertsCollapsible.propTypes = {
	label: PropTypes.string,
	children: PropTypes.node,
};

