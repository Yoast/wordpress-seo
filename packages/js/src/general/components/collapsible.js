import PropTypes from "prop-types";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import classNames from "classnames";

/**
 * @param {string} label The label of the collapsible.
 * @param {ReactNode} children The children of the collapsible.
 * @returns {JSX.Element} The hidden alerts collapsible component.
 */
export const Collapsible = ( { label, children } ) => {
	return (
		<Disclosure>
			{ ( { open } ) => (
				<div className="yst-shadow-sm yst-border-slate-300 yst-rounded-md yst-border">
					<Disclosure.Button className="yst-w-full yst-flex yst-justify-between yst-py-4 yst-pe-4 yst-ps-6 yst-items-center">
						<div className="yst-font-medium">{ label }</div>
						<ChevronDownIcon
							className={ classNames( "yst-h-5 yst-w-5 flex-shrink-0 yst-text-slate-400",
								open ? "yst-rotate-180" : ""
							) }
						/>
					</Disclosure.Button>
					<Disclosure.Panel className="yst-px-6">
						{ children }
					</Disclosure.Panel>
				</div>
			) }
		</Disclosure>
	);
};

Collapsible.propTypes = {
	label: PropTypes.string,
	children: PropTypes.node,
};
