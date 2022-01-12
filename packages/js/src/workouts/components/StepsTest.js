import { CheckIcon } from "@heroicons/react/solid";
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

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
 */
export default function Stepper( { steps, setActiveStep } ) {
	return (
		<ol className="yst-overflow-hidden">
			{ /* eslint-disable-next-line complexity */ }
			{ steps.map( ( step, stepIdx ) => (
				<li key={ step.name } className={ stepIdx === steps.length - 1 ? "" : "yst-pb-10", "yst-relative" }>
					{ ( step.status === "complete" ) &&
						<Fragment>
							{ stepIdx !== steps.length - 1 &&
								<div
									className="yst--ml-px yst-absolute yst-mt-0.5 yst-top-4 yst-left-4 yst-w-0.5 yst-h-full yst-bg-primary-500"
									aria-hidden="true"
								/>
							}
							<div className="yst-relative yst-flex yst-items-start yst-group">
								<span className="yst-h-9 yst-flex yst-items-center">
									{ /* eslint-disable-next-line max-len */ }
									<span className="yst-relative yst-z-10 yst-w-8 yst-h-8 yst-flex yst-items-center yst-justify-center yst-bg-primary-500 yst-rounded-full yst-group-hover:bg-primary-700">
										<CheckIcon className="yst-w-5 yst-h-5 yst-text-white" aria-hidden="true" />
									</span>
								</span>
								<span className="yst-ml-4 yst-min-w-0 yst-flex yst-flex-col">
									<span className="yst-text-xs yst-font-semibold yst-tracking-wide yst-uppercase">{ step.name }</span>
									<span className="yst-text-sm yst-text-gray-500">{ step.description }</span>
								</span>
							</div>
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
							<div className="yst-relative yst-flex yst-items-start yst-group" aria-current="step">
								<span className="yst-h-9 yst-flex yst-items-center" aria-hidden="true">
									{ /* eslint-disable-next-line max-len */ }
									<span className="yst-relative yst-z-10 yst-w-8 yst-h-8 yst-flex yst-items-center yst-justify-center yst-bg-white yst-border-2 yst-border-primary-500 yst-rounded-full">
										<span className="yst-h-2.5 yst-w-2.5 yst-bg-primary-500 yst-rounded-full" />
									</span>
								</span>
								<span className="yst-ml-4 yst-min-w-0 yst-flex yst-flex-col">
									<span className="yst-text-xs yst-font-semibold yst-tracking-wide yst-uppercase yst-text-primary-500">
										{ step.name }
									</span>
									<span className="yst-text-sm yst-text-gray-500">{ step.description }</span>
								</span>
							</div>
							<step.component />
							<button
								onClick={ () => setActiveStep( stepIdx + 1 ) }
								className="yst-inline-flex yst-justify-center yst-py-2 yst-px-3 yst-border yst-shadow-sm yst-rounded-md yst-text-sm yst-font-medium yst-leading-4 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-indigo-500 yst-no-underline yst-text-white yst-bg-primary-500 yst-border-transparent hover:yst-bg-primary-700 disabled:yst-bg-primary-700"
							>
								{ __( "Save and continue", "wordpress-seo" ) }
							</button>
							<button onClick={ () => setActiveStep( stepIdx - 1 ) }>
								{ __( "Go back", "wordpress-seo" ) }
							</button>
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
							<div className="yst-relative yst-flex yst-items-start yst-group">
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
							</div>
						</Fragment>
					}
				</li>
			) ) }
		</ol>
	);
}
