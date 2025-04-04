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
const CustomStep = ( { children, index } ) => {
	const { addStepRef, currentStep } = useContext( Stepper.Context );
	const isActive = index === currentStep;
	const isComplete = index < currentStep;
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
					index={ index }
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
		const [ currentStep, setCurrentStep ] = useState( 0 );
		const steps = [ "INSTALL", "ACTIVATE", "SET UP", "CONNECT" ];
		const handleNext = useCallback( () => {
			if ( currentStep < steps.length ) {
				setCurrentStep( currentStep + 1 );
			} else if ( currentStep === steps.length ) {
				setCurrentStep( 0 );
			}
		}, [ currentStep, setCurrentStep ] );

		return <>
			<Stepper currentStep={ currentStep } steps={ steps } />

			<Button className="yst-mt-5" onClick={ handleNext }>
				{ currentStep < steps.length - 1 && "Next" }
				{ currentStep === steps.length - 1 && "Finish" }
				{ currentStep === steps.length && "Restart" }
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
					index={ index }
				>
					{ step }
				</Stepper.Step> ) }

				{ customSteps.map( ( step, index ) => <CustomStep
					key={ step }
					index={ defaultSteps.length + index }
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
