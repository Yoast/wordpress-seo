import apiFetch from "@wordpress/api-fetch";
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { createInterpolateElement, useCallback, useReducer, useState, useEffect, Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { cloneDeep } from "lodash";
import PropTypes from "prop-types";
import UnsavedChangesModal from "../tailwind-components/UnsavedChangesModal";
import Alert from "../tailwind-components/alert";

import { NewButton as Button, RadioButtonGroup, SingleSelect, TextInput } from "@yoast/components";
import { ReactComponent as WorkoutDoneImage } from "../../../../../images/mirrored_fit_bubble_woman_1_optim.svg";
import { ReactComponent as WorkoutStartImage } from "../../../images/motivated_bubble_woman_1_optim.svg";
import { addLinkToString } from "../../helpers/stringHelpers.js";
import { Step, Steps, FinishButtonSection } from "./Steps";
import { OrganizationSection } from "./OrganizationSection";
import { PersonSection } from "./PersonSection";
import { NewsletterSignup } from "./NewsletterSignup";
import { WorkoutIndexation } from "../tailwind-components/WorkoutIndexation";
import SocialInputSection from "./SocialInputSection";
import SocialInputPersonSection from "./SocialInputPersonSection";
import Stepper from "../tailwind-components/Stepper";
import { STEPS, WORKOUTS } from "../config";
import { getInitialActiveStepIndex } from "../stepper-helper";
import { scrollToStep } from "../helpers";
import AnimateHeight from "react-animate-height";

window.wpseoScriptData = window.wpseoScriptData || {};
window.wpseoScriptData.searchAppearance = {
	...window.wpseoScriptData.searchAppearance,
	userEditUrl: "/wp-admin/user-edit.php?user_id={user_id}",
};

/**
 * Adds a step to editedSteps if not there already.
 *
 * @param {Array} editedSteps Steps that have been edited.
 * @param {number} stepNumber  The number of the field that was edited.
 *
 * @returns {Array} The new array of editedSteps.
 */
function addStepToEditedSteps( editedSteps, stepNumber ) {
	if ( editedSteps.includes( stepNumber ) ) {
		return [ ...editedSteps ];
	}
	return [ ...editedSteps, stepNumber ];
}

/**
 * Removes a step from savedSteps.
 *
 * @param {Array} savedSteps Steps that have been saved.
 * @param {number} stepNumber  The number of the step that was edited.
 *
 * @returns {Array} The new array of savedSteps
 */
function removeStepFromSavedSteps( savedSteps, stepNumber ) {
	return savedSteps.filter( step => step !== stepNumber );
}

/**
 * Adjusts the editedSteps and savedSteps and returns the full state;
 *
 * @param {Object} state      The state.
 * @param {number} stepNumber The number of the step that was edited.
 *
 * @returns {Object} The new state;
 */
function handleStepEdit( state, stepNumber ) {
	const newEditedSteps = addStepToEditedSteps( state.editedSteps, stepNumber );
	const newSavedSteps = removeStepFromSavedSteps( state.savedSteps, stepNumber );
	return {
		...state,
		editedSteps: newEditedSteps,
		savedSteps: newSavedSteps,
	};
}

/* eslint-disable complexity */
/**
 * A reducer for the configuration workout's internal state.
 *
 * @param {Object} state  The "current" state.
 * @param {Object} action The action with which to mutate the state.
 *
 * @returns {Object} The state as altered by the action.
 */
function configurationWorkoutReducer( state, action ) {
	let newState = cloneDeep( state );
	switch ( action.type ) {
		case "SET_COMPANY_OR_PERSON":
			newState = handleStepEdit( newState, 2 );
			newState.companyOrPerson = action.payload;
			newState.companyOrPersonLabel = window.wpseoWorkoutsData.configuration.companyOrPersonOptions.filter( ( item ) => {
				return item.value === action.payload;
			} ).pop().name;
			return newState;
		case "CHANGE_COMPANY_NAME":
			newState = handleStepEdit( newState, 2 );
			newState.companyName = action.payload;
			return newState;
		case "SET_COMPANY_LOGO":
			newState = handleStepEdit( newState, 2 );
			newState.companyLogo = action.payload.url;
			newState.companyLogoId = action.payload.id;
			return newState;
		case "REMOVE_COMPANY_LOGO":
			newState = handleStepEdit( newState, 2 );
			newState.companyLogo = "";
			newState.companyLogoId = "";
			return newState;
		case "SET_PERSON_LOGO":
			newState = handleStepEdit( newState, 2 );
			newState.personLogo = action.payload.url;
			newState.personLogoId = action.payload.id;
			return newState;
		case "REMOVE_PERSON_LOGO":
			newState = handleStepEdit( newState, 2 );
			newState.personLogo = "";
			newState.personLogoId = "";
			return newState;
		case "SET_PERSON_ID":
			newState = handleStepEdit( newState, 2 );
			newState.personId = action.payload;
			return newState;
		case "CHANGE_SOCIAL_PROFILE":
			newState = handleStepEdit( newState, 3 );
			newState.socialProfiles[ action.payload.socialMedium ] = action.payload.value;
			return newState;
		case "SET_ERROR_FIELDS":
			newState.errorFields = action.payload;
			return newState;
		case "CHANGE_SITE_TAGLINE":
			newState = handleStepEdit( newState, 2 );
			newState.siteTagline = action.payload;
			return newState;
		case "SET_TRACKING":
			newState = handleStepEdit( newState, 4 );
			newState.tracking = action.payload;
			return newState;
		case "SET_STEP_SAVED":
			if ( ! newState.savedSteps.includes( action.payload ) ) {
				newState.savedSteps = [ ...newState.savedSteps, action.payload ];
			}
			newState.editedSteps = newState.editedSteps.filter( step => step !== action.payload );
			return newState;
		case "SET_STEP_NOT_SAVED":
			newState.savedSteps = newState.savedSteps.filter( step => step !== action.payload );
			return newState;
		case "SET_ALL_STEPS_NOT_SAVED":
			newState.savedSteps = [];
			return newState;
		default:
			return newState;
	}
}

/**
 * Updates the site representation in the database.
 *
 * @param {Object} state The state to save.
 *
 * @returns {Promise|bool} A promise, or false if the call fails.
 */
async function updateSiteRepresentation( state ) {
	const siteRepresentation = {
		/* eslint-disable camelcase */
		company_or_person: state.companyOrPerson,
		company_name: state.companyName,
		company_logo: state.companyLogo,
		company_logo_id: state.companyLogoId ? state.companyLogoId : 0,
		person_logo: state.personLogo,
		person_logo_id: state.personLogoId ? state.personLogoId : 0,
		company_or_person_user_id: state.personId,
		/* eslint-enable camelcase */
	};

	if ( window.wpseoWorkoutsData.canEditWordPressOptions ) {
		siteRepresentation.description = state.siteTagline;
	}
	const response = await apiFetch( {
		path: "yoast/v1/workouts/site_representation",
		method: "POST",
		data: siteRepresentation,
	} );
	return await response.json;
}

/**
 * Updates the social profiles in the database.
 *
 * @param {Object} state The state to save.
 *
 * @returns {Promise|bool} A promise, or false if the call fails.
 */
async function updateSocialProfiles( state ) {
	const socialProfiles = {
		/* eslint-disable camelcase */
		facebook_site: state.socialProfiles.facebookUrl,
		twitter_site: state.socialProfiles.twitterUsername,
		instagram_url: state.socialProfiles.instagramUrl,
		linkedin_url: state.socialProfiles.linkedinUrl,
		myspace_url: state.socialProfiles.myspaceUrl,
		pinterest_url: state.socialProfiles.pinterestUrl,
		youtube_url: state.socialProfiles.youtubeUrl,
		wikipedia_url: state.socialProfiles.wikipediaUrl,
		/* eslint-enable camelcase */
	};

	const response = await apiFetch( {
		path: "yoast/v1/workouts/social_profiles",
		method: "POST",
		data: socialProfiles,
	} );
	return await response.json;
}

/**
 * Updates the tracking option in the database.
 *
 * @param {Object} state The state to save.
 *
 * @returns {Promise|bool} A promise, or false if the call fails.
 */
async function updateTracking( state ) {
	if ( state.tracking !== 0 && state.tracking !== 1 ) {
		throw "Value not set!";
	}

	const tracking = {
		tracking: state.tracking,
	};

	const response = await apiFetch( {
		path: "yoast/v1/workouts/enable_tracking",
		method: "POST",
		data: tracking,
	} );
	return await response.json;
}

const stepNumberNameMap = {
	1: STEPS.configuration.optimizeSeoData,
	2: STEPS.configuration.siteRepresentation,
	3: STEPS.configuration.socialProfiles,
	4: STEPS.configuration.newsletterSignup,
};

/**
 * The indexation step.
 *
 * @param {string}   indexingState          The indexing state.
 * @param {Function} setIndexingState       A callback to set the indexing state.
 * @param {boolean}  showRunIndexationAlert Whether the alert to run indexation needs to be shown.
 *
 * @returns {WPElement} The indexation step.
 */
function IndexationStep( { indexingState, setIndexingState, showRunIndexationAlert } ) {
	const [ alertOpacity, setAlertOpacity ] = useState( "yst-opacity-0" );
	const startOpacityTransition = useCallback( () => {
		setAlertOpacity( "yst-opacity-100" );
	} );

	return <Fragment>
		<div className="yst-flex yst-flex-row yst-mb-8">
			<p className="yst-text-sm yst-text-[#333333] yst-whitespace-pre-line yst-basis-9/12">
				{ addLinkToString(
					sprintf(
						__( "Let’s analyze your site just like Google does and get those indexables into action by running the SEO data " +
							"optimization! Our indexables will immediately improve technical issues without you needing to do anything!\n" +
							"\nIf you have a lot of content, that optimization could take a while. But trust us, it’s worth it! " +
							"Want to read more, %1$scheck out the benefits of the indexables squad.%2$s", "wordpress-seo" ),
						"<a>",
						"</a>"
					),
					window.wpseoWorkoutsData.configuration.shortlinks.indexData,
					"yoast-configuration-workout-index-data-link"
				)
				}
			</p>
			<WorkoutStartImage className="yst-h-[95px] yst-basis-3/12" />
		</div>
		<div id="yoast-configuration-workout-indexing-container" className="indexation-container">
			<WorkoutIndexation
				indexingStateCallback={ setIndexingState }
				isEnabled={ ! window.wpseoWorkoutsData.shouldUpdatePremium }
				indexingState={ indexingState }
			/>
		</div>
		{ ( window.wpseoWorkoutsData.shouldUpdatePremium && indexingState !== "completed" ) && <Alert type="warning">
			<p>{
				// translators: %1$s is replaced by a version number.
				sprintf( __( "This workout step is currently disabled, because you're not running the latest version of Yoast SEO Premium. " +
				"Please update to the latest version (at least %1$s). ",
				"wordpress-seo"
				), "17.7"
				)
			}</p>
			<p>{
				addLinkToString(
					sprintf(
						// translators: %1$s and %2$s are replaced by anchor tags to make a link to the tool section.
						__( "You can still run the SEO data optimization in the %1$sTools section%2$s. " +
						"Once that is finished, please refresh this workout.", "wordpress-seo" ),
						"<a>",
						"</a>"
					),
					window.wpseoWorkoutsData.toolsPageUrl
				) }
			</p>
		</Alert> }
		<AnimateHeight
			id="indexation-alert"
			height={ indexingState === "idle" && showRunIndexationAlert ? "auto" : 0 }
			easing="linear"
			duration={ 400 }
			onAnimationEnd={ startOpacityTransition }
		>
			<Alert
				type="info"
				className={ `yst-transition-opacity yst-duration-300 yst-mt-4 ${ alertOpacity }` }
			>
				{
					__( "Be aware that you should run the SEO data optimization for this configuration to take maximum effect.",
						"wordpress-seo" )
				}
			</Alert>
		</AnimateHeight>
	</Fragment>;
}

IndexationStep.propTypes = {
	indexingState: PropTypes.string.isRequired,
	setIndexingState: PropTypes.func.isRequired,
	showRunIndexationAlert: PropTypes.bool,
};
IndexationStep.defaultProps = {
	showRunIndexationAlert: false,
};

/* eslint-disable max-len, react/prop-types */
/**
 * Doc comment to make linter happy.
 *
 * @returns {JSX.Element} Example step.
 */
function SiteRepresentationStep( { onOrganizationOrPersonChange, dispatch, state, siteRepresentsPerson, onSiteTaglineChange, siteRepresentationEmpty } ) {
	return <Fragment>
		{  window.wpseoWorkoutsData.configuration.knowledgeGraphMessage &&  <Alert type="warning">
			{  window.wpseoWorkoutsData.configuration.knowledgeGraphMessage }
		</Alert> }
		{
			window.wpseoWorkoutsData.configuration.shouldForceCompany === 0 && <SingleSelect
				id="organization-person-select"
				htmlFor="organization-person-select"
				name="organization"
				label={ __( "Does your site represent an Organization or Person?", "wordpress-seo" ) }
				selected={ state.companyOrPerson }
				onChange={ onOrganizationOrPersonChange }
				options={  window.wpseoWorkoutsData.configuration.companyOrPersonOptions }
			/>
		}
		{
			window.wpseoWorkoutsData.configuration.shouldForceCompany === 1 && <TextInput
				id="organization-forced-readonly-text"
				name="organization"
				label={ __( "Does your site represent an Organization or Person?", "wordpress-seo" ) }
				value={ state.companyOrPersonLabel }
				readOnly={ true }
			/>
		}
		{ state.companyOrPerson === "company" && <Fragment>
			{ ( ! state.companyName || ! state.companyLogo ) && <Alert type="warning">
				{ __(
					// eslint-disable-next-line max-len
					"You need to set an organization name and logo for structured data to work properly.",
					"wordpress-seo"
				) }
			</Alert> }
			<OrganizationSection
				dispatch={ dispatch }
				imageUrl={ state.companyLogo }
				organizationName={ state.companyName }
			/>
		</Fragment> }
		{ siteRepresentsPerson && <Fragment>
			{ ( ! state.personLogo || state.personId === 0 ) && <Alert type="warning">
				{ __(
					// eslint-disable-next-line max-len
					"You need to set a person name and logo for structured data to work properly.",
					"wordpress-seo"
				) }
			</Alert> }
			<PersonSection
				dispatch={ dispatch }
				imageUrl={ state.personLogo }
				personId={ state.personId }
			/>
		</Fragment> }
		{ window.wpseoWorkoutsData.canEditWordPressOptions && <TextInput
			id="site-tagline-input"
			name="site-tagline"
			label={ __( "Site tagline", "wordpress-seo" ) }
			description={ sprintf( __( "Add a catchy tagline that describes your site in the best light. Use the keywords you want people to find your site with. Example: %1$s’s tagline is ‘SEO for everyone.’", "wordpress-seo" ), "Yoast" ) }
			value={ state.siteTagline }
			onChange={ onSiteTaglineChange }
		/> }
		{ siteRepresentationEmpty && <Alert type="warning">
			{ __(
				// eslint-disable-next-line max-len
				"Please be aware that you need to set a name and logo in step 2 for structured data to work properly.",
				"wordpress-seo"
			) }
		</Alert> }
	</Fragment>;
}

/**
 * Doc comment to make linter happy.
 *
 * @returns {JSX.Element} Example step.
 */
function SocialProfilesStep( { state, dispatch, setErrorFields, siteRepresentsPerson } ) {
	return <Fragment>
		{ state.companyOrPerson === "company" && <SocialInputSection
			socialProfiles={ state.socialProfiles }
			dispatch={ dispatch }
			errorFields={ state.errorFields }
			setErrorFields={ setErrorFields }
		/> }
		{ siteRepresentsPerson && <SocialInputPersonSection personId={ state.personId } /> }
	</Fragment>;
}

/**
 * Doc comment to make linter happy.
 *
 * @returns {JSX.Element} Example step.
 */
function PersonalPreferencesStep( { state, setTracking, isTrackingOptionSelected } ) {
	return <Fragment>
		<p>
			{
				__( "To provide the best experience for you, we need your permission to do the following things:", "wordpress-seo" )
			}
		</p>
		<ul className="yoast-tracking">
			<li> { __( "collect info about the plugins and themes you have installed;", "wordpress-seo" ) } </li>
			<li> {
				sprintf(
					// translators: translates to Yoast SEO.
					__( "see which %s features you use or don't use;", "wordpress-seo" ),
					"Yoast SEO"
				)
			} </li>
			<li> { __( "always load our customer support window so we can immediately assist you when you need help.", "wordpress-seo" ) } </li>
		</ul>
		<RadioButtonGroup
			id="yoast-configuration-workout-tracking-radio-button"
			label={ __( "Can we collect anonymous information about your website and how you use it?", "wordpress-seo" ) }
			groupName="yoast-configuration-workout-tracking"
			selected={ state.tracking }
			onChange={ setTracking }
			vertical={ true }
			wrapperClassName={ "tracking-radiobuttons" }
			options={ [
				{
					value: 0,
					label: __( "No, don’t track my site data", "wordpress-seo" ),
				},
				{
					value: 1,
					label: __( "Yes, you can track my site data", "wordpress-seo" ),
				},
			] }
		/>
		<p>
			<i>{
				__( "Important: We will never sell this data. And of course, as always, we won't collect any personal data about you or your visitors!", "wordpress-seo" )
			}</i>
		</p>
		{ ! isTrackingOptionSelected && <Alert type="warning">
			{ __(
				// eslint-disable-next-line max-len
				"In order to complete this step please select if we are allowed to improve Yoast SEO with your data.",
				"wordpress-seo"
			) }
		</Alert> }
		<br />
		<NewsletterSignup gdprLink={ window.wpseoWorkoutsData.configuration.shortlinks.gdpr } />
	</Fragment>;
}

/**
 * Example Finish step.
 *
 * @returns {WPElement} Finish step.
 */
const FinishStep = () => <Fragment>
	<p className="yst-mb-6">You have finished all the things, yay!</p>
	<button className="yst-button--primary">{ __( "Check out your Indexables page", "wordpress-seo" ) }</button>
</Fragment>;

/* eslint-enable max-len, react/prop-types */

/* eslint-disable max-statements */
/**
 * The configuration workout.
 *
 * @param {function}  toggleStep                The function to toggle the step state.
 * @param {function}  finishSteps               The function to finish steps.
 * @param {function}  reviseStep                The function to revise steps.
 * @param {function}  toggleWorkout             The function to toggle the workout state.
 * @param {function}  isStepFinished            The function to check whether a step is finished.
 * @returns {WPElement} The ConfigurationWorkout component.
 */
export function ConfigurationWorkout( { finishSteps, reviseStep, toggleWorkout, clearActiveWorkout, isStepFinished } ) {
	const [ state, dispatch ] = useReducer( configurationWorkoutReducer, {
		...window.wpseoWorkoutsData.configuration,
		errorFields: [],
		editedSteps: [],
		savedSteps: [],
	} );
	const [ indexingState, setIndexingState ] = useState( () => window.yoastIndexingData.amount === "0" ? "completed" : "idle" );
	const [ siteRepresentationEmpty, setSiteRepresentationEmpty ] = useState( false );
	const [ showRunIndexationAlert, setShowRunIndexationAlert ] = useState( false );
	const steps = STEPS.configuration;

	const isTrackingOptionSelected = state.tracking === 0 || state.tracking === 1;

	/**
	 * If indexing has been completed, finish step 1, else, unfinish it.
	 */
	useEffect( () => {
		if ( indexingState === "completed" ) {
			// Briefly override window variable to preserve indexingstate when navigating back and forth on the workouts page.
			window.yoastIndexingData.amount = "0";
			finishSteps( "configuration", [ steps.optimizeSeoData ] );
		} else {
			reviseStep( "configuration", steps.optimizeSeoData );
		}
	}, [ indexingState ] );

	// Whenever a step is edited, toggle the saved state for that step.
	useEffect( () => {
		state.editedSteps.forEach( stepNumber => {
			reviseStep( "configuration", stepNumberNameMap[ stepNumber ] );
		} );
	}, [ state.editedSteps ] );

	/**
	 * Sets the step to isSaved.
	 *
	 * @param {number} stepNumber The number of the step to save.
	 *
	 * @returns {void}
	 */
	const setStepIsSaved = ( stepNumber ) => {
		dispatch( { type: "SET_STEP_SAVED", payload: stepNumber } );
	};

	const isStep1Finished = isStepFinished( "configuration", steps.optimizeSeoData );
	const isStep2Finished = isStepFinished( "configuration", steps.siteRepresentation );
	const isStep3Finished = isStepFinished( "configuration", steps.socialProfiles );
	const isStep4Finished = isStepFinished( "configuration", steps.enableTracking );
	const isStep5Finished = isStepFinished( "configuration", steps.newsletterSignup );
	const isWorkoutFinished = [
		isStep1Finished,
		isStep2Finished,
		isStep3Finished,
		isStep4Finished,
		isStep5Finished,
	].every( Boolean );

	/**
	 * A function that tests whether criteria are met.
	 *
	 * @param {number} stepNumber The number of the step to verify readiness for.
	 *
	 * @returns {Boolean} Whether the step is ready to be saved.
	 */
	function isStepReady( stepNumber ) {
		switch ( stepNumber ) {
			case 1:
				return [ "in_progress", "completed" ].includes( indexingState );
			case 2:
				if ( state.companyOrPerson === "company" ) {
					return Boolean( state.companyLogo && state.companyName );
				}
				return Boolean( state.personLogo && state.personId );
			case 3:
			case 4:
				return true;
			case 5:
				return [ isStep1Finished, isStep2Finished, isStep3Finished, isStep4Finished ].every( Boolean ) && indexingState === "completed";
			default:
				return false;
		}
	}

	const setTracking = useCallback( ( value ) => {
		dispatch( { type: "SET_TRACKING", payload: parseInt( value, 10 ) } );
	} );

	const setErrorFields = useCallback( ( value ) => {
		dispatch( { type: "SET_ERROR_FIELDS", payload: value } );
	} );

	const onFinishOptimizeSeoData = useCallback(
		() => {
			scrollToStep( 2 );
		},
		[ isStep1Finished ]
	);

	/**
	 * Runs checks of finishing the site representation step.
	 *
	 * @returns {void}
	 */
	function updateOnFinishSiteRepresentation() {
		if ( ! siteRepresentationEmpty &&
			state.companyOrPerson === "company" &&
			( ! state.companyName || ! state.companyLogo ) ) {
			setSiteRepresentationEmpty( true );
		} else if ( ! siteRepresentationEmpty &&
			state.companyOrPerson === "person" &&
			( ! state.personId || ! state.personLogo ) ) {
			setSiteRepresentationEmpty( true );
		} else {
			setSiteRepresentationEmpty( false );
			updateSiteRepresentation( state )
				.then( () => setStepIsSaved( 2 ) )
				.then( () => finishSteps( "configuration", [ steps.siteRepresentation ] ) );
			scrollToStep( 3 );
		}
	}

	/**
	 * Runs checks of finishing the social profiles step.
	 *
	 * @returns {void}
	 */
	function updateOnFinishSocialProfiles() {
		updateSocialProfiles( state )
			.then( () => setStepIsSaved( 3 ) )
			.then( () => {
				setErrorFields( [] );
				finishSteps( "configuration", [ steps.socialProfiles ] );
				scrollToStep( 4 );
			} )
			.catch(
				( e ) => {
					if ( e.failures ) {
						setErrorFields( e.failures );
					}
					return false;
				}
			);
	}

	/**
	 * Runs checks of finishing the enable tracking step.
	 *
	 * @returns {void}
	 */
	function updateOnFinishEnableTracking() {
		updateTracking( state )
			.then( () => setStepIsSaved( 4 ) )
			.then( () => finishSteps( "configuration", [ steps.enableTracking ] ) );
		scrollToStep( 5 );
	}

	const toggleConfigurationWorkout = useCallback(
		async() => {
			const stepsToFinish = [];

			if ( isWorkoutFinished ) {
				reviseStep( "configuration", steps.siteRepresentation );
				reviseStep( "configuration", steps.socialProfiles );
				reviseStep( "configuration", steps.enableTracking );
				reviseStep( "configuration", steps.newsletterSignup );
				dispatch( { type: "SET_ALL_STEPS_NOT_SAVED" } );
				return;
			}
			if ( ! isStep2Finished ) {
				try {
					await updateSiteRepresentation( state );
					setStepIsSaved( 2 );
					stepsToFinish.push( steps.siteRepresentation );
				} catch ( e ) {
					console.error( e.message );
				}
			}
			if ( ! isStep3Finished ) {
				try {
					await updateSocialProfiles( state );
					setStepIsSaved( 3 );
					setErrorFields( [] );
					stepsToFinish.push( steps.socialProfiles );
				} catch ( e ) {
					if ( e.failures ) {
						setErrorFields( e.failures );
					}
					scrollToStep( 3 );
				}
			}
			if ( ! isStep4Finished ) {
				try {
					await updateTracking( state );
					setStepIsSaved( 4 );
					stepsToFinish.push( steps.enableTracking );
				} catch ( e ) {
					console.error( e.message );
				}
			}
			if ( ! isStep5Finished ) {
				stepsToFinish.push( steps.newsletterSignup );
			}
			finishSteps( "configuration", stepsToFinish );
		},
		[ toggleWorkout, isWorkoutFinished, isStep1Finished, isStep2Finished, isStep3Finished, isStep4Finished, isStep5Finished, state ]
	);

	const onOrganizationOrPersonChange = useCallback(
		( value ) => dispatch( { type: "SET_COMPANY_OR_PERSON", payload: value } ),
		[ dispatch ]
	);

	const onSiteTaglineChange = useCallback(
		( value ) => dispatch( { type: "CHANGE_SITE_TAGLINE", payload: value } ),
		[ dispatch ]
	);

	const siteRepresentsPerson = state.companyOrPerson === "person";

	// PROBABLY DELETE BETWEEN HERE....
	const isStepperFinished = [
		isStep1Finished,
		isStep2Finished,
		isStep3Finished,
		isStep5Finished,
	].every( Boolean );

	const savedSteps = [
		isStepFinished( "configuration", steps.optimizeSeoData ),
		isStepFinished( "configuration", steps.siteRepresentation ),
		isStepFinished( "configuration", steps.socialProfiles ),
		isStepFinished( "configuration", steps.newsletterSignup ),
		isStepperFinished,
	];

	const [ hideOriginal, setHideOriginal ] = useState( true );
	const [ activeStepIndex, setActiveStepIndex ] = useState( getInitialActiveStepIndex( savedSteps ) );

	/**
	 * Sets the step to finished.
	 *
	 * @param {int} stepIdx The step to-be-finished.
	 *
	 * @returns {boolean} Whether the stepper can continue to the next step.
	 */
	function finishStep( stepIdx ) {
		finishSteps( "configuration", [ stepNumberNameMap[ stepIdx + 1 ] ] );
		return true;
	}

	/**
	 * Save and continue functionality for the Indexation step.
	 *
	 * @param {int} stepIdx The step index of the indexation step.
	 *
	 * @returns {boolean} Whether the stepper can continue to the next step.
	 */
	function beforeContinueIndexationStep( stepIdx ) {
		if ( ! showRunIndexationAlert && indexingState === "idle" ) {
			setShowRunIndexationAlert( true );
			return false;
		}

		finishStep( stepIdx );
		return true;
	}

	// AND HERE....
	/* eslint-disable max-len */
	return (
		<div id="yoast-configuration-workout" className="card">
			<h2 id="yoast-configuration-workout-title">{ __( "Configuration", "wordpress-seo" ) }</h2>
			<h3 id="yoast-configuration-workout-tagline">{
				// translators: %1$s is replaced by "Yoast SEO"
				sprintf( __( "Configure %1$s with optimal SEO settings for your site", "wordpress-seo" ), "Yoast SEO" )
			}</h3>
			<p>
				{
					sprintf(
						// translators: %1$s is replaced by "Yoast SEO"
						__(
							"Do the five steps in this workout to configure the essential %1$s settings!",
							"wordpress-seo"
						),
						"Yoast SEO"
					)
				}
			</p>
			<p>
				<i>
					{
						addLinkToString(
							sprintf(
								__(
									// translators: %1$s and %3$s are replaced by opening and closing anchor tags. %2$s is replaced by "Yoast SEO"
									"Need more guidance? We've covered every step in more detail in the %1$s%2$s configuration workout guide.%3$s",
									"wordpress-seo"
								),
								"<a>",
								"Yoast SEO",
								"</a>"
							),
							window.wpseoWorkoutsData.configuration.shortlinks.workoutGuide,
							"yoast-configuration-workout-guide-link"
						)
					}
				</i>
			</p>
			<hr id="configuration-workout-hr-top" />
			<p id="configuration-workout-important-message">
				{
					createInterpolateElement(
						sprintf(
							__(
								// translators: %1$s and %2$s are replaced by opening and closing <b> tags.
								"%1$sImportant:%2$s If the SEO data optimization in step 1 is running, you can already continue to the next steps.",
								"wordpress-seo"
							),
							"<b>",
							"</b>"
						),
						{
							b: <b />,
						}
					)
				}
			</p>
			{ /* eslint-disable react/jsx-no-bind */ }
			<div className="yst-mt-8">
				<Stepper
					steps={ [
						{ name: "Let’s analyse your site and get those indexables into action!",
							component: <IndexationStep setIndexingState={ setIndexingState } indexingState={ indexingState } showRunIndexationAlert={ showRunIndexationAlert } />,
							isSaved: isStepFinished( "configuration", steps.optimizeSeoData ),
							beforeContinue: beforeContinueIndexationStep,
						},
						{ name: "Knowledge panel",
							component: <SiteRepresentationStep onOrganizationOrPersonChange={ onOrganizationOrPersonChange } dispatch={ dispatch } state={ state } siteRepresentsPerson={ siteRepresentsPerson } onSiteTaglineChange={ onSiteTaglineChange } siteRepresentationEmpty={ siteRepresentationEmpty } />,
							isSaved: isStepFinished( "configuration", steps.siteRepresentation ),
							beforeContinue: finishStep,
						},
						{ name: "Social profiles",
							component: <SocialProfilesStep state={ state } dispatch={ dispatch } setErrorFields={ setErrorFields } siteRepresentsPerson={ siteRepresentsPerson } />,
							isSaved: isStepFinished( "configuration", steps.socialProfiles ),
							beforeContinue: finishStep,
						},
						{ name: "Personal preferences",
							component: <PersonalPreferencesStep state={ state } setTracking={ setTracking } isTrackingOptionSelected={ isTrackingOptionSelected } />,
							isSaved: isStepFinished( "configuration", steps.newsletterSignup ),
							beforeContinue: finishStep,
						},
						{ name: "Finish configuration",
							component: <FinishStep />,
							isSaved: isStepperFinished,
							beforeContinue: finishStep,
						},
					] }
					setActiveStepIndex={ setActiveStepIndex }
					activeStepIndex={ activeStepIndex }
					isStepperFinished={ isStepperFinished }
				/>
			</div>

			<UnsavedChangesModal hasUnsavedChanges={ state.editedSteps.includes( activeStepIndex + 1 ) } />

			<button
				className="yst-button--danger yst-mt-4"
				onClick={ () => {
					setHideOriginal( prevState => ! prevState  );
				} }
			>
				Toggle original
			</button>
			{ /* eslint-enable react/jsx-no-bind */ }

			<div className={ `workflow ${ hideOriginal ? "yst-hidden" : "" }` }>
				<Steps id="yoast-configuration-workout-steps">
					<Step
						id="yoast-configuration-workout-step-optimize-seo-data"
						title={ __( "Optimize SEO data", "wordpress-seo" ) }
						subtitle={ addLinkToString(
							sprintf(
								__(
									"Click the button below to optimize your SEO data. It will let us see your site as Google does, so we can give " +
									"you the best SEO tips and improve technical SEO issues in the background! If you have a lot of content the " +
									"optimization might take a while. But trust us, it's worth it! %1$sLearn more about the benefits of optimized SEO data.%2$s",
									"wordpress-seo"
								),
								"<a>",
								"</a>"
							),
							window.wpseoWorkoutsData.configuration.shortlinks.indexData,
							"yoast-configuration-workout-index-data-link"
						) }
						subtitleClass={ window.wpseoWorkoutsData.shouldUpdatePremium ? "disabled" : "" }
						ImageComponent={ WorkoutStartImage }
						isFinished={ isStep1Finished }
					>
						<div id="yoast-configuration-workout-indexing-container" className="indexation-container">
							<WorkoutIndexation
								indexingStateCallback={ setIndexingState }
								isEnabled={ ! window.wpseoWorkoutsData.shouldUpdatePremium }
								indexingState={ indexingState }
							/>
						</div>
						{ ( window.wpseoWorkoutsData.shouldUpdatePremium && indexingState !== "completed" ) && <Alert type="warning">
							<p>{
								// translators: %1$s is replaced by a version number.
								sprintf( __( "This workout step is currently disabled, because you're not running the latest version of Yoast SEO Premium. " +
								"Please update to the latest version (at least %1$s). ",
								"wordpress-seo"
								), "17.7"
								)
							}</p>
							<p>{
								addLinkToString(
									sprintf(
										// translators: %1$s and %2$s are replaced by anchor tags to make a link to the tool section.
										__( "You can still run the SEO data optimization in the %1$sTools section%2$s. " +
										"Once that is finished, please refresh this workout.", "wordpress-seo" ),
										"<a>",
										"</a>"
									),
									window.wpseoWorkoutsData.toolsPageUrl
								) }
							</p>
						</Alert> }
						<FinishButtonSection
							buttonId="yoast-configuration-workout-step-optimize-seo-data-button"
							stepNumber={ 1 }
							hasDownArrow={ true }
							finishText={ __( "Continue", "wordpress-seo" ) }
							onFinishClick={	onFinishOptimizeSeoData }
							isFinished={ isStep1Finished }
							isReady={ isStepReady( 1 ) }
						/>
					</Step>
					<p className="extra-list-content">
						{
							createInterpolateElement(
								sprintf(
									__(
										// translators: %1$s and %2$s are replaced by opening and closing <b> tags.
										"%1$sImportant:%2$s After you’ve completed (or made any changes to) a step below, please make sure to save your changes by clicking the ‘Save and continue’ button below that step.",
										"wordpress-seo"
									),
									"<b>",
									"</b>"
								),
								{
									b: <b />,
								}
							)
						}
					</p>
					<Step
						id="yoast-configuration-workout-step-site-representation"
						title={ __( "Site representation", "wordpress-seo" ) }
						subtitle={ __( "Tell Google what kind of site you have and increase the chance it gets features in a Google Knowledge Panel. Select ‘Organization’ if you are working on a site for a business or an organization. Select ‘Person’ if you have, say, a personal blog.", "wordpress-seo" ) }
						isFinished={ isStep2Finished }
					>
						{  window.wpseoWorkoutsData.configuration.knowledgeGraphMessage &&  <Alert type="warning">
							{  window.wpseoWorkoutsData.configuration.knowledgeGraphMessage }
						</Alert> }
						{
							window.wpseoWorkoutsData.configuration.shouldForceCompany === 0 && <SingleSelect
								id="organization-person-select"
								htmlFor="organization-person-select"
								name="organization"
								label={ __( "Does your site represent an Organization or Person?", "wordpress-seo" ) }
								selected={ state.companyOrPerson }
								onChange={ onOrganizationOrPersonChange }
								options={  window.wpseoWorkoutsData.configuration.companyOrPersonOptions }
							/>
						}
						{
							window.wpseoWorkoutsData.configuration.shouldForceCompany === 1 && <TextInput
								id="organization-forced-readonly-text"
								name="organization"
								label={ __( "Does your site represent an Organization or Person?", "wordpress-seo" ) }
								value={ state.companyOrPersonLabel }
								readOnly={ true }
							/>
						}
						{ state.companyOrPerson === "company" && <Fragment>
							{ ( ! state.companyName || ! state.companyLogo ) && <Alert type="warning">
								{ __(
									// eslint-disable-next-line max-len
									"You need to set an organization name and logo for structured data to work properly.",
									"wordpress-seo"
								) }
							</Alert> }
							<OrganizationSection
								dispatch={ dispatch }
								imageUrl={ state.companyLogo }
								organizationName={ state.companyName }
							/>
						</Fragment> }
						{ siteRepresentsPerson && <Fragment>
							{ ( ! state.personLogo || state.personId === 0 ) && <Alert type="warning">
								{ __(
									// eslint-disable-next-line max-len
									"You need to set a person name and logo for structured data to work properly.",
									"wordpress-seo"
								) }
							</Alert> }
							<PersonSection
								dispatch={ dispatch }
								imageUrl={ state.personLogo }
								personId={ state.personId }
							/>
						</Fragment> }
						{ window.wpseoWorkoutsData.canEditWordPressOptions && <TextInput
							id="site-tagline-input"
							name="site-tagline"
							label={ __( "Site tagline", "wordpress-seo" ) }
							description={ sprintf( __( "Add a catchy tagline that describes your site in the best light. Use the keywords you want people to find your site with. Example: %1$s’s tagline is ‘SEO for everyone.’", "wordpress-seo" ), "Yoast" ) }
							value={ state.siteTagline }
							onChange={ onSiteTaglineChange }
						/> }
						{ siteRepresentationEmpty && <Alert type="warning">
							{ __(
								// eslint-disable-next-line max-len
								"Please be aware that you need to set a name and logo in step 2 for structured data to work properly.",
								"wordpress-seo"
							) }
						</Alert> }
						<FinishButtonSection
							buttonId="yoast-configuration-workout-step-site-representation-button"
							stepNumber={ 2 }
							isSaved={ state.savedSteps.includes( 2 ) }
							hasDownArrow={ true }
							finishText={ __( "Save and continue", "wordpress-seo" ) }
							onFinishClick={ updateOnFinishSiteRepresentation }
							isFinished={ isStep2Finished }
							isReady={ isStepReady( 2 ) }
						/>
					</Step>
					<Step
						id="yoast-configuration-workout-step-social-profiles"
						title={ __( "Social profiles", "wordpress-seo" ) }
						subtitle={ state.companyOrPerson === "company" ?  __( "Do you have profiles for your site on social media? Then, add all of their URLs here, so your social profiles may also appear in a Google Knowledge Panel.", "wordpress-seo" ) : "" }
						isFinished={ isStep3Finished }
					>
						{ state.companyOrPerson === "company" && <SocialInputSection
							socialProfiles={ state.socialProfiles }
							dispatch={ dispatch }
							errorFields={ state.errorFields }
							setErrorFields={ setErrorFields }
						/> }
						{ siteRepresentsPerson && <SocialInputPersonSection personId={ state.personId } /> }
						<FinishButtonSection
							buttonId="yoast-configuration-workout-step-social-profiles-button"
							stepNumber={ 3 }
							isSaved={ ! siteRepresentsPerson && state.savedSteps.includes( 3 ) }
							hasDownArrow={ true }
							finishText={ siteRepresentsPerson ? __( "Continue", "wordpress-seo" ) :  __( "Save and continue", "wordpress-seo" ) }
							onFinishClick={ updateOnFinishSocialProfiles }
							isFinished={ isStep3Finished }
							isReady={ isStepReady( 3 ) }
						/>
					</Step>
					<Step
						id="yoast-configuration-workout-step-tracking"
						title={ __( "Help us improve Yoast SEO", "wordpress-seo" ) }
						isFinished={ isStep4Finished }
					>
						<p>
							{
								__( "To provide the best experience for you, we need your permission to do the following things:", "wordpress-seo" )
							}
						</p>
						<ul className="yoast-tracking">
							<li> { __( "collect info about the plugins and themes you have installed;", "wordpress-seo" ) } </li>
							<li> {
								sprintf(
									// translators: translates to Yoast SEO.
									__( "see which %s features you use or don't use;", "wordpress-seo" ),
									"Yoast SEO"
								)
							} </li>
							<li> { __( "always load our customer support window so we can immediately assist you when you need help.", "wordpress-seo" ) } </li>
						</ul>
						<RadioButtonGroup
							id="yoast-configuration-workout-tracking-radio-button"
							label={ __( "Can we collect anonymous information about your website and how you use it?", "wordpress-seo" ) }
							groupName="yoast-configuration-workout-tracking"
							selected={ state.tracking }
							onChange={ setTracking }
							vertical={ true }
							wrapperClassName={ "tracking-radiobuttons" }
							options={ [
								{
									value: 0,
									label: __( "No, don’t track my site data", "wordpress-seo" ),
								},
								{
									value: 1,
									label: __( "Yes, you can track my site data", "wordpress-seo" ),
								},
							] }
						/>
						<p>
							<i>{
								__( "Important: We will never sell this data. And of course, as always, we won't collect any personal data about you or your visitors!", "wordpress-seo" )
							}</i>
						</p>
						{ ! isTrackingOptionSelected && <Alert type="warning">
							{ __(
								// eslint-disable-next-line max-len
								"In order to complete this step please select if we are allowed to improve Yoast SEO with your data.",
								"wordpress-seo"
							) }
						</Alert> }
						<FinishButtonSection
							buttonId="yoast-configuration-workout-step-tracking-button"
							stepNumber={ 4 }
							isSaved={ state.savedSteps.includes( 4 ) }
							hasDownArrow={ true }
							finishText={ __( "Save and continue", "wordpress-seo" ) }
							onFinishClick={ updateOnFinishEnableTracking }
							isFinished={ isStep4Finished }
							additionalButtonProps={ { disabled: ! isTrackingOptionSelected } }
							isReady={ isStepReady( 4 ) }
						/>
					</Step>
					<Step
						id="yoast-configuration-workout-step-newsletter"
						title={ __( "Sign up for the Yoast newsletter!", "wordpress-seo" ) }
						isFinished={ isStep5Finished }
					>
						<br />
						<NewsletterSignup gdprLink={ window.wpseoWorkoutsData.configuration.shortlinks.gdpr } />
					</Step>
					<FinishButtonSection
						buttonId="yoast-configuration-workout-finish-workout-button"
						finishText={ isWorkoutFinished ? __( "Do workout again", "wordpress-seo" ) : __( "Finish this workout", "wordpress-seo" ) }
						onFinishClick={ toggleConfigurationWorkout }
						isFinished={ false }
						isReady={ isWorkoutFinished ? false : isStepReady( 5 ) }
						additionalButtonProps={ { disabled: indexingState !== "completed" || ! isTrackingOptionSelected } }
					>
						{ indexingState !== "completed" && <Alert type="warning">
							{ indexingState === "idle" && __( "Before you finish this workout, please start the SEO data optimization in step 1 and wait until it is completed...", "wordpress-seo" ) }
							{ indexingState === "in_progress" && __( "Before you finish this workout, please wait on this page until the SEO data optimization in step 1 is completed...", "wordpress-seo" ) }
						</Alert> }
					</FinishButtonSection>
				</Steps>
			</div>
			{ isWorkoutFinished && <div className={ hideOriginal ? "yst-hidden" : "" } id="yoast-configuration-workout-congratulations">
				<hr />
				<h3 id="yoast-configuration-workout-congratulations-title" style={ { marginBottom: 0 } }>{ __( "Congratulations!", "wordpress-seo" ) }</h3>
				<div id="yoast-configuration-workout-congratulations-content" style={ { display: "flex" } }>
					<div>
						<p>
							{
								// translators: %1$s is replaced by "Yoast SEO"
								sprintf( __( "Amazing! You’ve successfully finished the Configuration workout! %1$s now outputs the essential structured data for your site.", "wordpress-seo" ), "Yoast SEO" )
							}
						</p>
						<p>{ __( "Make sure to also check out our other SEO workouts to really get your site into shape!", "wordpress-seo" ) }</p>
					</div>
					<WorkoutDoneImage style={ { height: "119px", width: "100px", flexShrink: 0 } } />
				</div>
				<Button id="yoast-configuration-workout-congratulations-button" onClick={ clearActiveWorkout } variant="primary">
					{
						// translators: %1$s translates to a rightward pointing arrow ( → )
						sprintf( __( "View other SEO workouts%1$s", "wordpress-seo" ), " →" )
					}
				</Button>
			</div> }
		</div>
		/* eslint-enable max-len */
	);
}

ConfigurationWorkout.propTypes = {
	finishSteps: PropTypes.func.isRequired,
	reviseStep: PropTypes.func.isRequired,
	toggleWorkout: PropTypes.func.isRequired,
	isStepFinished: PropTypes.func.isRequired,
	clearActiveWorkout: PropTypes.func.isRequired,
};
/* eslint-enable complexity */

export default compose(
	[
		withSelect( ( select ) => {
			const workouts = select( "yoast-seo/workouts" ).getWorkouts();
			const finishedWorkouts = select( "yoast-seo/workouts" ).getFinishedWorkouts();
			/**
			 * Determines if a step for a particular workout is finished.
			 * @param {string} workout The name of the workout.
			 * @param {string} step The name of the step.
			 * @returns {boolean} Whether or not the step is finished.
			 */
			const isStepFinished = ( workout, step ) => {
				return workouts[ workout ].finishedSteps.includes( step );
			};
			const isWorkoutFinished = finishedWorkouts.includes( WORKOUTS.cornerstone );
			const getIndexablesByStep = select( "yoast-seo/workouts" ).getIndexablesByStep;
			return { finishedWorkouts, isStepFinished, isWorkoutFinished, getIndexablesByStep };
		} ),
		withDispatch(
			( dispatch ) => {
				const {
					toggleStep,
					finishSteps,
					reviseStep,
					toggleWorkout,
					moveIndexables,
					clearActiveWorkout,
				} = dispatch( "yoast-seo/workouts" );

				return {
					toggleStep,
					finishSteps,
					reviseStep,
					toggleWorkout,
					moveIndexables,
					clearActiveWorkout,
				};
			}
		),
	]
)( ConfigurationWorkout );
/* eslint-enable max-statements */
