import { CheckIcon } from "@heroicons/react/solid";

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
					<li key={ step.name } className={ classNames( stepIdx === steps.length - 1 ? "" : "pb-10", "relative" ) }>
						{ ( step.status === "complete" ) &&
							<>
								{ stepIdx !== steps.length - 1 &&
									<div className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-indigo-600" aria-hidden="true" />
								}
								<a href={ step.href } className="relative flex items-start group">
									<span className="h-9 flex items-center">
										{ /* eslint-disable-next-line max-len */ }
										<span className="relative z-10 w-8 h-8 flex items-center justify-center bg-indigo-600 rounded-full group-hover:bg-indigo-800">
											<CheckIcon className="w-5 h-5 text-white" aria-hidden="true" />
										</span>
									</span>
									<span className="ml-4 min-w-0 flex flex-col">
										<span className="text-xs font-semibold tracking-wide uppercase">{ step.name }</span>
										<span className="text-sm text-gray-500">{ step.description }</span>
									</span>
								</a>
							</>
						}
						{ ( step.status === "current" ) &&
							<>
								{ stepIdx === steps.length - 1 ? null : (
									<div className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300" aria-hidden="true" />
								) }
								<a href={ step.href } className="relative flex items-start group" aria-current="step">
									<span className="h-9 flex items-center" aria-hidden="true">
										{ /* eslint-disable-next-line max-len */ }
										<span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-indigo-600 rounded-full">
											<span className="h-2.5 w-2.5 bg-indigo-600 rounded-full" />
										</span>
									</span>
									<span className="ml-4 min-w-0 flex flex-col">
										<span className="text-xs font-semibold tracking-wide uppercase text-indigo-600">{ step.name }</span>
										<span className="text-sm text-gray-500">{ step.description }</span>
									</span>
								</a>
							</>
						}
						{ ( step.status !== "complete" && step.status !== "current" ) &&
							<>
								{ ( stepIdx !== steps.length - 1 ) &&
									<div className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300" aria-hidden="true" />
								}
								<a href={ step.href } className="relative flex items-start group">
									<span className="h-9 flex items-center" aria-hidden="true">
										{ /* eslint-disable-next-line max-len */ }
										<span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400">
											<span className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300" />
										</span>
									</span>
									<span className="ml-4 min-w-0 flex flex-col">
										<span className="text-xs font-semibold tracking-wide uppercase text-gray-500">{ step.name }</span>
										<span className="text-sm text-gray-500">{ step.description }</span>
									</span>
								</a>
							</>
						}
					</li>
				) ) }
			</ol>
		</nav>
	);
}
