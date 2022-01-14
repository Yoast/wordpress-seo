import { CheckIcon } from "@heroicons/react/solid";
import { Fragment, useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

/**
 * The StepButtons component.
 *
 * @param {Object}   props               The props object.
 * @param {number}   props.stepIdx       The index of the current step.
 * @param {number}   props.lastIndex     The index of the last step.
 * @param {function} props.setActiveStep A function to set a new active step.
 * @param {function} props.saveStep      A function to save the current step.
 * @param {function} props.finishStepper A function to finish the last step (entire stepper).
 *
 * @returns {WPElement} The StepButtons component.
 */
function StepButtons( { stepIdx, lastIndex, saveStep, setActiveStep, finishStepper } ) {
	const handlePrimaryClick = useCallback(
		() => {
			const currentStep = stepIdx;
			const nextStep = stepIdx + 1;
			if ( currentStep === lastIndex ) {
				finishStepper();
			} else {
				saveStep( currentStep );
				setActiveStep( nextStep );
			}
		},
		[ setActiveStep, saveStep, finishStepper, stepIdx, lastIndex ]
	);

	const goBack = useCallback( () => {
		setActiveStep( stepIdx - 1 );
	}, [ stepIdx, setActiveStep ] );

	return <Fragment>
		<button
			onClick={ handlePrimaryClick }
			className="yst-button--primary"
		>
			{ stepIdx < lastIndex
				? __( "Save and continue", "wordpress-seo" )
				: __( "Finish this workout", "wordpress-seo" ) }
		</button>
		{ stepIdx > 0 && <button
			onClick={ goBack }
			className="yst-button--secondary yst-ml-3"
		>
			{ __( "Go back", "wordpress-seo" ) }
		</button>
		}
	</Fragment>;
}

StepButtons.propTypes = {
	stepIdx: PropTypes.number.isRequired,
	lastIndex: PropTypes.number.isRequired,
	setActiveStep: PropTypes.func.isRequired,
	saveStep: PropTypes.func,
	finishStepper: PropTypes.func,
};

StepButtons.defaultProps = {
	saveStep: () => {},
	finishStepper: () => {},
};

/**
 * Example stepper.
 *
 * @returns {WPElement} The example stepper.
 */
export default function Stepper( { steps, setActiveStep, saveStep, finishStepper } ) {
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
								<span className="yst-ml-4 yst-min-w-0 yst-flex yst-flex-col yst-self-center">
									<span className="yst-text-xs yst-font-semibold yst-tracking-wide yst-uppercase">{ step.name }</span>
									{ step.description && <span className="yst-text-sm yst-text-gray-500">{ step.description }</span> }
								</span>
							</div>
						</Fragment>
					}
					{ ( step.status === "current" ) &&
						<Fragment>
							{ stepIdx === steps.length - 1 ? null : (
								<div
									className="yst--ml-px yst-absolute yst-mt-0.5 yst-top-8 yst-left-4 yst-w-0.5 yst-h-full yst-bg-gray-300"
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
								<span className="yst-ml-4 yst-min-w-0 yst-flex yst-flex-col yst-self-center">
									<span className="yst-text-xs yst-font-semibold yst-tracking-wide yst-uppercase yst-text-primary-500">
										{ step.name }
									</span>
									{ step.description && <span className="yst-text-sm yst-text-gray-500">{ step.description }</span> }
								</span>
							</div>
							<div className="yst-ml-12 yst-mb-8 yst-mt-4">
								{ step.component }
								<StepButtons
									stepIdx={ stepIdx }
									lastIndex={ steps.length - 1 }
									setActiveStep={ setActiveStep }
									finishStepper={ finishStepper }
									saveStep={ saveStep }
								/>
							</div>
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
								<span className="yst-ml-4 yst-min-w-0 yst-flex yst-flex-col yst-self-center">
									<span className="yst-text-xs yst-font-semibold yst-tracking-wide yst-uppercase yst-text-gray-500">
										{ step.name }
									</span>
									{ step.description && <span className="yst-text-sm yst-text-gray-500">{ step.description }</span> }
								</span>
							</div>
						</Fragment>
					}
				</li>
			) ) }
		</ol>
	);
}

Stepper.propTypes = {
	steps: PropTypes.arrayOf( PropTypes.shape( {
		name: PropTypes.string.isRequired,
		description: PropTypes.string,
		component: PropTypes.element.isRequired,
		status: PropTypes.oneOf( [ "complete", "current", "upcoming" ] ).isRequired,
	} ) ).isRequired,
	setActiveStep: PropTypes.func.isRequired,
	saveStep: PropTypes.func,
	finishStepper: PropTypes.func,
};

Stepper.defaultProps = {
	saveStep: () => {},
	finishStepper: () => {},
};
