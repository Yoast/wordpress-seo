import { CheckIcon } from "@heroicons/react/solid";
import { Fragment } from "@wordpress/element";

const steps = [
	{ name: "Create account", description: "Vitae sed mi luctus laoreet.", href: "#", status: "complete" },
	{
		name: "Profile information",
		description: "Cursus semper viverra facilisis et et some more.",
		href: "#",
		status: "current",
	},
	{ name: "Business information", description: "Penatibus eu quis ante.", href: "#", status: "upcoming" },
	{ name: "Theme", description: "Faucibus nec enim leo et.", href: "#", status: "upcoming" },
	{ name: "Preview", description: "Iusto et officia maiores porro ad non quas.", href: "#", status: "upcoming" },
];

/**
 * Joins the classnames.
 *
 * @param {Object} classes The classes.
 * @returns {string} The joined classnames.
 */
function classNames( ...classes ) {
	return classes.filter( Boolean ).join( " " );
}

/**
 * Example stepper.
 *
 * @returns {JSX.Element} The example stepper.
 * @constructor
 */
export default function Example() {
	return (
		<nav aria-label="Progress">
			<ol className="overflow-hidden">
				{ /* eslint-disable-next-line complexity */ }
				{ steps.map( ( step, stepIdx ) => (
					<li key={ step.name } className={ classNames( stepIdx === steps.length - 1 ? "" : "yst-pb-10", "yst-relative" ) }>
						{ ( step.status === "complete" ) &&
							<Fragment>
								{ stepIdx !== steps.length - 1 &&
									<div
										className="yst--ml-px yst-absolute yst-mt-0.5 yst-top-4 yst-left-4 yst-w-0.5 yst-h-full yst-bg-indigo-600"
										aria-hidden="true"
									/>
								}
								<a href={ step.href } className="yst-relative yst-flex yst-items-start yst-group">
									<span className="yst-h-9 yst-flex yst-items-center">
										{ /* eslint-disable-next-line max-len */ }
										<span className="yst-relative yst-z-10 yst-w-8 yst-h-8 yst-flex yst-items-center yst-justify-center yst-bg-indigo-600 yst-rounded-full yst-group-hover:bg-indigo-800">
											<CheckIcon className="yst-w-5 yst-h-5 yst-text-white" aria-hidden="true" />
										</span>
									</span>
									<span className="yst-ml-4 yst-min-w-0 yst-flex yst-flex-col">
										<span className="yst-text-xs yst-font-semibold yst-tracking-wide yst-uppercase">{ step.name }</span>
										<span className="yst-text-sm yst-text-gray-500">{ step.description }</span>
									</span>
								</a>
							</Fragment>
						}
						{ ( step.status === "current" ) &&
							<Fragment>
								{ stepIdx === steps.length - 1 ? null : (
									<div
										className="yst--ml-px yst-absolute yst-mt-0.5 yst-top-4 yst-left-4 yst-w-0.5 yst-h-full yst-bg-gray-300"
										aria-hidden="true"
									/>
								) }
								<a href={ step.href } className="yst-relative yst-flex yst-items-start yst-group" aria-current="step">
									<span className="yst-h-9 yst-flex yst-items-center" aria-hidden="true">
										{ /* eslint-disable-next-line max-len */ }
										<span className="yst-relative yst-z-10 yst-w-8 yst-h-8 yst-flex yst-items-center yst-justify-center yst-bg-white yst-border-2 yst-border-indigo-600 yst-rounded-full">
											<span className="yst-h-2.5 yst-w-2.5 yst-bg-indigo-600 yst-rounded-full" />
										</span>
									</span>
									<span className="yst-ml-4 yst-min-w-0 yst-flex yst-flex-col">
										<span className="yst-text-xs yst-font-semibold yst-tracking-wide yst-uppercase yst-text-indigo-600">
											{ step.name }
										</span>
										<span className="yst-text-sm yst-text-gray-500">{ step.description }</span>
									</span>
								</a>
							</Fragment>
						}
						{ ( step.status !== "complete" && step.status !== "current" ) &&
							<Fragment>
								{ ( stepIdx !== steps.length - 1 ) &&
									<div
										className="yst--ml-px yst-absolute yst-mt-0.5 yst-top-4 yst-left-4 yst-w-0.5 yst-h-full yst-bg-gray-300"
										aria-hidden="true"
									/>
								}
								<a href={ step.href } className="yst-relative yst-flex yst-items-start yst-group">
									<span className="yst-h-9 yst-flex yst-items-center" aria-hidden="true">
										{ /* eslint-disable-next-line max-len */ }
										<span className="yst-relative yst-z-10 yst-w-8 yst-h-8 yst-flex yst-items-center yst-justify-center yst-bg-white yst-border-2 yst-border-gray-300 yst-rounded-full yst-group-hover:border-gray-400">
											<span className="yst-h-2.5 yst-w-2.5 yst-bg-transparent yst-rounded-full yst-group-hover:bg-gray-300" />
										</span>
									</span>
									<span className="yst-ml-4 yst-min-w-0 yst-flex yst-flex-col">
										<span className="yst-text-xs yst-font-semibold yst-tracking-wide yst-uppercase yst-text-gray-500">
											{ step.name }
										</span>
										<span className="yst-text-sm yst-text-gray-500">{ step.description }</span>
									</span>
								</a>
							</Fragment>
						}
					</li>
				) ) }
			</ol>
		</nav>
	);
}
