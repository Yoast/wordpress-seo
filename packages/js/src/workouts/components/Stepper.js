import { CheckIcon } from "@heroicons/react/solid";
import { Transition } from "@headlessui/react";
import { Fragment, useCallback, useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import AnimateHeight from "react-animate-height";
/**
 * The StepButtons component.
 *
 * @param {Object}   props               The props object.
 * @param {number}   props.stepIndex       The index of the current step.
 * @param {number}   props.lastIndex     The index of the last step.
 * @param {function} props.setActiveStep A function to set a new active step.
 * @param {function} props.saveStep      A function to save the current step.
 * @param {function} props.finishStepper A function to finish the last step (entire stepper).
 *
 * @returns {WPElement} The StepButtons component.
 */
function StepButtons( { stepIndex, lastIndex, handlePrimaryClick, goBack } ) {
	return <div className="yst-mt-12">
		<button
			onClick={ handlePrimaryClick }
			className="yst-button--primary"
		>
			{ stepIndex < lastIndex
				? __( "Save and continue", "wordpress-seo" )
				: __( "Finish this workout", "wordpress-seo" ) }
		</button>
		{ stepIndex > 0 && <button
			onClick={ goBack }
			className="yst-button--secondary yst-ml-3"
		>
			{ __( "Go back", "wordpress-seo" ) }
		</button>
		}
	</div>;
}

StepButtons.propTypes = {
	stepIndex: PropTypes.number.isRequired,
	lastIndex: PropTypes.number.isRequired,
	handlePrimaryClick: PropTypes.func.isRequired,
	goBack: PropTypes.func.isRequired,
};

/**
 * Gets the classnames for the bullet.
 *
 * @param {boolean} isSaved Whether the step is saved.
 * @param {boolean} isActiveStep Whether the step is active.
 *
 * @returns {string} The classnames for the bullet.
 */
function getBulletClassnames( isSaved, isActiveStep ) {
	if ( isActiveStep ) {
		return "yst-bg-white yst-border-primary-500";
	}
	return isSaved ? "yst-delay-500 yst-bg-primary-500 yst-border-primary-500" : "yst-delay-500 yst-bg-white yst-border-gray-300";
}

/**
 * Gets the classnames for the step name.
 *
 * @param {boolean} isSaved Whether the step is saved.
 * @param {boolean} isActiveStep Whether the step is active.
 *
 * @returns {string} The classnames for the step name.
 */
function getNameClassnames( isSaved, isActiveStep ) {
	if ( isActiveStep ) {
		return "yst-text-primary-500";
	}
	return isSaved ? "" : "yst-text-gray-500";
}

/**
 * Gets the classnames for the bullet content.
 *
 * @param {boolean} isSaved Whether the step is saved.
 * @param {boolean} isActiveStep Whether the step is active.
 *
 * @returns {string} The classnames for the bullet content.
 */
function getBulletContentClassnames( isSaved, isActiveStep ) {
	if ( isActiveStep ) {
		return "yst-bg-primary-500";
	}
	return isSaved ? "yst-delay-500" : "yst-delay-500 yst-bg-transparent";
}

const stepShape = PropTypes.shape( {
	name: PropTypes.string.isRequired,
	description: PropTypes.string,
	component: PropTypes.element.isRequired,
	isSaved: PropTypes.bool.isRequired,
} );

/* eslint-disable complexity, max-len */
/**
 * The (Tailwind) Step component
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The Step component.
 */
function TailwindStep( { step, stepIndex, lastStepIndex, saveStep, finishStepper, activeStepIndex, setActiveStepIndex } ) {
	const isActiveStep = activeStepIndex === stepIndex;
	const isSaved = step.isSaved;
	const bulletClassNames = getBulletClassnames( isSaved, isActiveStep );
	const nameClassNames = getNameClassnames( isSaved, isActiveStep );
	const bulletContentClassNames = getBulletContentClassnames( isSaved, isActiveStep );

	const [ icon, setIcon ] = useState( isSaved ? "check" : "bullet" );
	const [ contentHeight, setContentHeight ] = useState( isActiveStep ? "auto" : 0 );

	useEffect( () => {
		const inActiveIcon = isSaved ? "check" : "bullet";
		setTimeout( () => setIcon( isActiveStep ? "bullet" : inActiveIcon ), 500 );
	}, [ isSaved, isActiveStep ] );


	const handlePrimaryClick = useCallback(
		() => {
			const currentStep = stepIndex;
			const nextStep = stepIndex + 1;
			if ( currentStep === lastStepIndex ) {
				finishStepper();
			} else {
				saveStep( currentStep );
				setActiveStepIndex( nextStep );
			}
		},
		[ setActiveStepIndex, saveStep, finishStepper, stepIndex, lastStepIndex ]
	);
	const goBack = useCallback( () => {
		setActiveStepIndex( stepIndex - 1 );
	}, [ stepIndex, setActiveStepIndex ] );

	const setHeightFull = useCallback( () => {
		setTimeout( () => setContentHeight( "auto" ), 500 );
	}, [] );

	const setHeightZero = useCallback( () => setContentHeight( 0 ), [] );

	return (
		<Fragment>
			{
				// Line
				( stepIndex !== lastStepIndex ) &&
				<Fragment>
					<div
						className={ "yst--ml-px yst-absolute yst-mt-0.5 yst-left-4 yst-w-0.5 yst-h-full yst-bg-gray-300 yst--bottom-6" }
						aria-hidden="true"
					/>
					<Transition
						show={ stepIndex < activeStepIndex }
						className={ "yst--ml-px yst-absolute yst-mt-0.5 yst-left-4 yst-w-0.5 yst-h-full yst-bg-primary-500" }
						enter="yst-transition-all yst-duration-700"
						enterFrom="yst-bottom-full"
						enterTo="yst--bottom-6"
						entered="yst--bottom-6"
						leave="yst-transition-all yst-duration-700"
						leaveFrom="yst--bottom-6"
						leaveTo="yst-bottom-full"
					/>
				</Fragment>
			}
			<div className="yst-relative yst-flex yst-items-start yst-group" aria-current={ isActiveStep ? "step" : null }>
				<span className="yst-flex yst-items-center" aria-hidden={ isActiveStep ? "true" : null }>
					<span
						className={ `yst-transition-colors yst-duration-500 yst-relative yst-border-2 yst-z-10 yst-w-8 yst-h-8 yst-flex yst-items-center yst-justify-center yst-rounded-full ${ bulletClassNames }` }
					>
						{ ( icon === "check" )
							? <CheckIcon className="yst-w-5 yst-h-5 yst-text-white" aria-hidden="true" />
							: <span className={ `yst-transition-colors yst-duration-500 yst-h-2.5 yst-w-2.5 yst-rounded-full ${ bulletContentClassNames }` } />
						}
					</span>
				</span>
				{ /* Name and description. */ }
				<span className="yst-ml-4 yst-min-w-0 yst-flex yst-flex-col yst-self-center">
					<span className={ "yst-text-xs yst-font-semibold yst-tracking-wide yst-uppercase " + nameClassNames }>
						{ step.name }
					</span>
					{ step.description && <span className="yst-text-sm yst-text-gray-500">{ step.description }</span> }
				</span>
			</div>
			{ /* Child component and buttons. */ }
			<Transition
				className=""
				show={ isActiveStep }
				unmount={ false }
				appear={ false }
				beforeEnter={ setHeightFull }
				enter={ "yst-transition-opacity yst-ease-linear yst-duration-500 yst-delay-500" }
				enterFrom="yst-opacity-0"
				enterTo="yst-opacity-100"
				beforeLeave={ setHeightZero }
				leave={ "yst-transition-opacity yst-ease-linear yst-duration-500" }
				leaveFrom="yst-opacity-100"
				leaveTo="yst-opacity-0"
			>
				<AnimateHeight
					id={ `content-${stepIndex}` }
					height={ contentHeight }
					easing="ease-in-out"
					duration={ 500 }
				>
					<div className="yst-ml-12 yst-mt-4">
						{ step.component }
						<StepButtons
							stepIndex={ stepIndex }
							lastIndex={ lastStepIndex }
							handlePrimaryClick={ handlePrimaryClick }
							goBack={ goBack }
						/>
					</div>
				</AnimateHeight>
			</Transition>
		</Fragment>
	);
}
TailwindStep.propTypes = {
	step: stepShape.isRequired,
	stepIndex: PropTypes.number.isRequired,
	lastStepIndex: PropTypes.number.isRequired,
	setActiveStepIndex: PropTypes.func.isRequired,
	saveStep: PropTypes.func,
	finishStepper: PropTypes.func,
	activeStepIndex: PropTypes.number.isRequired,
};
TailwindStep.defaultProps = {
	saveStep: () => { },
	finishStepper: () => { },
};
/**
 * The Tailwind Stepper component.
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The Stepper component.
 */
export default function Stepper( { steps, setActiveStepIndex, saveStep, finishStepper, activeStepIndex } ) {
	return (
		<ol className="yst-overflow-hidden">
			{ steps.map( ( step, stepIndex ) => (
				<li key={ step.name } className={ ( stepIndex === steps.length - 1 ? "" : "yst-pb-8" ) + " yst-relative" }>
					<TailwindStep
						step={ step }
						stepIndex={ stepIndex }
						lastStepIndex={ steps.length - 1 }
						setActiveStepIndex={ setActiveStepIndex }
						saveStep={ saveStep }
						finishStepper={ finishStepper }
						activeStepIndex={ activeStepIndex }
					/>
				</li>
			) ) }
		</ol>
	);
}
Stepper.propTypes = {
	steps: PropTypes.arrayOf( stepShape ).isRequired,
	setActiveStepIndex: PropTypes.func.isRequired,
	saveStep: PropTypes.func,
	finishStepper: PropTypes.func,
	activeStepIndex: PropTypes.number.isRequired,
};
Stepper.defaultProps = {
	saveStep: () => { },
	finishStepper: () => { },
};
/* eslint-enable complexity, max-len */
