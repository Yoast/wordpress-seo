import classNames from "classnames";
import PropTypes from "prop-types";
import { Fragment } from "@wordpress/element";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";

/**
 * A notification dots element with menu.
 *
 * @returns {WPElement} The notification dots element with menu.
 */
export default function DotsMenu( { options } ) {
	return (
		<Menu as="div" className="yst-relative yst-inline-block yst-text-left">
			{
				( { open } ) => {
					return <Fragment>
						<div>
							<Menu.Button
								className={
									classNames(
										"yst-bg-white yst-rounded-full yst-flex yst-items-center yst-border-none yst-text-gray-400",
										"focus:yst-ring-primary-500 focus:yst-shadow-none focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-offset-white focus:yst-text-primary-500",
										"hover:yst-ring-primary-500 hover:yst-shadow-none hover:yst-outline-none hover:yst-ring-2 hover:yst-ring-offset-2 hover:yst-ring-offset-white hover:yst-text-primary-500",
										{ "yst-ring-primary-500 yst-shadow-none yst-outline-none yst-ring-2 yst-ring-offset-2 yst-ring-offset-white yst-text-primary-500": open }
									)
								}
							>
								<span className="yst-sr-only">Open options</span>
								<DotsVerticalIcon className="yst-h-5 yst-w-5" aria-hidden="true" />
							</Menu.Button>
						</div>

						<Transition
							as={ Fragment }
							enter="yst-transition yst-ease-out yst-duration-100"
							enterFrom="yst-transform yst-opacity-0 yst-scale-95"
							enterTo="yst-transform yst-opacity-100 yst-scale-100"
							leave="yst-transition yst-ease-in yst-duration-75"
							leaveFrom="yst-transform yst-opacity-100 yst-scale-100"
							leaveTo="yst-transform yst-opacity-0 yst-scale-95"
						>
							<Menu.Items className="yst-origin-top-right yst-absolute yst-right-0 yst-mt-2 yst-w-56 yst-rounded-md yst-shadow-lg yst-bg-white yst-ring-1 yst-ring-black yst-ring-opacity-5 focus:yst-outline-none">
								<div className="yst-py-1">
									{
										options.map( ( option, index ) => {
											return <Menu.Item key={ "card-option-" + index }>
												{ ( { active } ) => (
													<button
														type="button"
														onClick={ option.action }
														className={ classNames(
															active ? "yst-bg-gray-100 yst-text-gray-900" : "yst-text-gray-700",
															"yst-w-full yst-block yst-px-4 yst-py-2 yst-text-sm yst-text-left"
														) }
														{ ...option.menuItemData }
													>
														{ option.title }
													</button>
												) }
											</Menu.Item>;
										} )
									}
								</div>
							</Menu.Items>
						</Transition>
					</Fragment>;
				}
			}
		</Menu>
	);
}

DotsMenu.propTypes = {
	options: PropTypes.arrayOf( PropTypes.shape( {
		title: PropTypes.string.isRequired,
		action: PropTypes.function,
		menuItemData: PropTypes.object,
	} ) ),
};

DotsMenu.defaultProps = {
	options: [],
};
