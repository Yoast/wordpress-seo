import { Disclosure } from "@headlessui/react";
import { MenuAlt2Icon, XIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

/**
 * @param {string} activePath The path of the active menu item.
 * @param {Object[]} links The menu links.
 * @param {JSX.Element} [logo] The menu logo.
 * @param {JSX.Element} [notifications] The menu notifications.
 * @param {string} openButtonScreenReaderText The open button screen reader text.
 * @param {string} closeButtonScreenReaderText The close button screen reader text.
 * @returns {JSX.Element} The topbar.
 */
const Topbar = ( { activePath, links, logo, notifications, openButtonScreenReaderText, closeButtonScreenReaderText } ) => {
	return (
		<Disclosure as="nav" className="yst-bg-white yst-shadow">
			{ ( { open } ) => (
				<>
					<div className="yst-px-2 sm:yst-px-6 lg:yst-px-8">
						<div className="yst-relative yst-flex yst-h-16 yst-justify-between">
							<div className="yst-absolute yst-inset-y-0 yst-left-0 yst-flex yst-items-center sm:yst-hidden">
								<Disclosure.Button
									className="yst-inline-flex yst-items-center yst-justify-center yst-rounded-md yst-p-2 yst-text-slate-400 hover:yst-bg-slate-100 hover:yst-text-slate-500 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-inset focus:yst-ring-primary-500"
								>
									<span className="yst-sr-only">{ open ? closeButtonScreenReaderText : openButtonScreenReaderText }</span>
									{ open
										? <XIcon className="yst-block yst-h-6 yst-w-6" aria-hidden="true" />
										: <MenuAlt2Icon className="yst-block yst-h-6 yst-w-6" aria-hidden="true" />
									}
								</Disclosure.Button>
							</div>

							<div className="yst-flex yst-flex-1 yst-items-center yst-justify-center sm:yst-items-stretch sm:yst-justify-start">
								{ logo && (
									<div className="yst-flex yst-flex-shrink-0 yst-items-center">
										{ logo }
									</div>
								) }

								<div className="yst-hidden sm:yst-ml-6 sm:yst-flex sm:yst-space-x-8">
									{ links.map( ( link, index ) => (
										<Link
											key={ `link-topbar-${ index }` }
											className={ classNames(
												"yst-inline-flex yst-items-center yst-border-b-2 yst-px-1 yst-pt-1 yst-text-sm yst-font-medium yst-no-underline focus:yst-outline-none focus:yst-ring-1 focus:yst-ring-primary-500",
												activePath === link.to
													? "yst-border-primary-500 yst-text-slate-900"
													: "yst-border-transparent yst-text-slate-500 hover:yst-border-slate-300 hover:yst-text-slate-700"
											) }
											{ ...link }
										/>
									) ) }
								</div>
							</div>

							{ notifications && (
								<div
									className="yst-absolute yst-inset-y-0 yst-right-0 yst-flex yst-items-center yst-pr-2 sm:yst-static sm:yst-inset-auto sm:yst-ml-6 sm:yst-pr-0"
								>
									{ notifications }
								</div>
							) }
						</div>
					</div>

					<Disclosure.Panel className="sm:yst-hidden" id="FOOBAR">
						<div className="yst-space-y-1 yst-pb-4 yst-pt-2">
							{ links.map( ( link, index ) => (
								<Disclosure.Button
									as={ Link }
									key={ `link-topbar-mobile-${ index }` }
									className={ classNames(
										"yst-block yst-border-l-4 yst-py-2 yst-pl-3 yst-pr-4 yst-text-base yst-font-medium yst-no-underline focus:yst-outline-none focus:yst-ring-1 focus:yst-ring-primary-500",
										activePath === link.to
											? "yst-border-primary-500 yst-text-primary-700 yst-bg-primary-50"
											: "yst-border-transparent yst-text-slate-500 hover:yst-bg-slate-50 hover:yst-border-slate-300 hover:yst-text-slate-700"
									) }
									{ ...link }
									// Unfortunately, passing an ID is not supported by Disclosure.Button.
									id={ `${ link.id }-mobile` }
								/>
							) ) }
						</div>
					</Disclosure.Panel>
				</>
			) }
		</Disclosure>
	);
};

Topbar.propTypes = {
	activePath: PropTypes.string.isRequired,
	links: PropTypes.array.isRequired,
	logo: PropTypes.node,
	notifications: PropTypes.node,
	openButtonScreenReaderText: PropTypes.string.isRequired,
	closeButtonScreenReaderText: PropTypes.string.isRequired,
};

export default Topbar;
