import React, { useState, useCallback, useContext } from "react";
import { Stepper } from ".";
import { component, customStep } from "./docs";
import { Button } from "../../index";
import classNames from "classnames";
import { CheckIcon } from "@heroicons/react/solid";
import { useArgs } from "@storybook/preview-api";

/**
 * Custom step component for stepper story.
 *
 * @param {JSX.Node} children The step label or children.
 * @param {boolean} isComplete Is the step complete.
 * @param {boolean} isActive Is the step
 *
 * @returns {JSX.Element} The step element.
 */
const CustomStep = ( { children, isComplete, isActive } ) => {
	const { addStepRef } = useContext( Stepper.Context );
	return (
		<div
			ref={ addStepRef }
			className={ classNames(
				"yst-step",
				isComplete && "yst-step--complete",
				isActive && "yst-step--active yst-text-green-700",
			) }
		>
			<div
				className={ classNames( "yst-step__circle yst-ring-green-500",
					isComplete ? "yst-bg-green-500 yst-ring-green-500" : "yst-bg-white",
				) }
			>
				{ isComplete && <CheckIcon
					className="yst-step__icon yst-w-4 yst-z-50"
				/> }

				<div
					className={
						classNames( "yst-step__icon yst-bg-green-500 yst-w-2 yst-h-2 yst-rounded-full yst-delay-500",
							! isComplete && isActive ? "yst-opacity-100" : "yst-opacity-0" ) }
				/>
			</div>
			<div className="yst-font-semibold yst-text-xxs yst-mt-3">{ children }</div>
		</div>
	);
};

export default {
	title: "2) Components/Stepper",
	component: Stepper,
	parameters: {
		docs: {
			description: { component },
		},
	},
};

export const Factory = {
	args: {
		currentStep: 0,
	},
	render: ( args ) =>{
		const STEPS = [ "INSTALL", "ACTIVATE", "SET UP", "CONNECT" ];
		const [ { currentStep }, updateArgs ] = useArgs();

		const handleNext = useCallback( () => {
			if ( currentStep <= STEPS.length - 1 ) {
				updateArgs( { currentStep: currentStep + 1 } );
			} else if ( currentStep > STEPS.length - 1 ) {
				updateArgs( { currentStep: 0 } );
			}
		}, [ updateArgs, currentStep ] );

		return <>
			<Stepper { ...args }>
				{ STEPS.map( ( step, index ) => <Stepper.Step
					key={ step }
					isComplete={ currentStep > index || currentStep === STEPS.length }
					isActive={ currentStep === index }
				>
					{ step }
				</Stepper.Step> ) }

			</Stepper>

			<Button className="yst-mt-5" onClick={ handleNext }>
				{ currentStep < STEPS.length - 1 && "Next" }
				{ currentStep === STEPS.length - 1 && "Finish" }
				{ currentStep > STEPS.length - 1 && "Restart" }
			</Button>
		</>;
	},
};

export const StepsProp = {
	render: () => {
		const [ args, setArgs ] = useState( {
			currentStep: 0,
			steps: [
				{ children: "INSTALL", isComplete: false, isActive: true },
				{ children: "ACTIVATE", isComplete: false, isActive: false },
				{ children: "SET UP", isComplete: false, isActive: false },
				{ children: "CONNECT", isComplete: false, isActive: false },
			] } );
		const handleNext = useCallback( () => {
			const { currentStep, steps } = args;
			if ( currentStep < steps.length - 1 ) {
				const tempSteps = [ ...steps ];
				tempSteps[ currentStep ].isComplete = true;
				tempSteps[ currentStep ].isActive = false;
				tempSteps[ currentStep + 1 ].isActive = true;
				setArgs( {
					currentStep: currentStep + 1,
					steps: tempSteps,
				} );
			} else if ( currentStep === steps.length - 1 && ! steps[ currentStep ].isComplete ) {
				const tempSteps = [ ...steps ];
				tempSteps[ currentStep ].isComplete = true;
				tempSteps[ currentStep ].isActive = false;
				setArgs( {
					currentStep,
					steps: tempSteps,
				} );
			} else if ( steps[ steps.length - 1 ].isComplete ) {
				const tempSteps = steps.map( ( step ) => ( {
					...step,
					isComplete: false,
					isActive: false,
				} ) );
				tempSteps[ 0 ].isActive = true;
				setArgs( {
					currentStep: 0,
					steps: tempSteps,
				} );
			}
		}, [ args, setArgs ] );

		return <>
			<Stepper { ...args } />

			<Button className="yst-mt-5" onClick={ handleNext }>
				{ args.currentStep < args.steps.length - 1 && "Next" }
				{ args.currentStep === args.steps.length - 1 && ! args.steps[ args.steps.length - 1 ].isComplete && "Finish" }
				{ args.steps[ args.steps.length - 1 ].isComplete && "Restart" }
			</Button>
		</>;
	},
};

export const WithCustomStep = {
	parameters: {
		docs: {
			description: {
				story: customStep,
			},
		},
	},
	render: ( args ) =>{
		const defaultSteps = [ "INSTALL", "ACTIVATE", "SET UP" ];
		const customSteps = [ "CONNECT" ];
		const STEPS = [ ...defaultSteps, ...customSteps ];
		const [ currentStep, setCurrentStep ] = useState( 0 );

		const handleNext = useCallback( () => {
			if ( currentStep <= STEPS.length - 1 ) {
				setCurrentStep( currentStep + 1 );
			} else if ( currentStep > STEPS.length - 1 ) {
				setCurrentStep( 0 );
			}
		}, [ setCurrentStep, currentStep ] );

		return <>
			<Stepper currentStep={ currentStep }>
				{ defaultSteps.map( ( step, index ) => <Stepper.Step
					key={ step }
					isComplete={ currentStep > index || currentStep === STEPS.length }
					isActive={ currentStep === index }
				>
					{ step }
				</Stepper.Step> ) }

				{ customSteps.map( ( step, index ) => <CustomStep
					key={ step }
					isComplete={ currentStep > index + defaultSteps.length || currentStep === STEPS.length }
					isActive={ currentStep === index + defaultSteps.length }
				>
					{ step }
				</CustomStep> ) }

			</Stepper>

			<Button className="yst-mt-5" onClick={ handleNext }>
				{ currentStep < STEPS.length - 1 && "Next" }
				{ currentStep === STEPS.length - 1 && "Finish" }
				{ currentStep > STEPS.length - 1 && "Restart" }
			</Button>
		</>;
	},
};
