import apiFetch from "@wordpress/api-fetch";
import { useDispatch } from "@wordpress/data";
import { useCallback, useReducer, useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { uniq } from "lodash";
import { STORE_NAME } from "../general/constants";
import { configurationReducer } from "./tailwind-components/helpers/index.js";
import SocialProfilesStep from "./tailwind-components/steps/social-profiles/social-profiles-step";
import Stepper, { Step } from "./tailwind-components/stepper";
import { ContinueButton, EditButton, ConfigurationStepButtons } from "./tailwind-components/configuration-stepper-buttons";
import { getInitialActiveStepIndex } from "./stepper-helper";
import IndexationStep from "./tailwind-components/steps/indexation/indexation-step";
import SiteRepresentationStep from "./tailwind-components/steps/site-representation/site-representation-step";
import PersonalPreferencesStep from "./tailwind-components/steps/personal-preferences/personal-preferences-step";
import FinishStep from "./tailwind-components/steps/finish/finish-step";
import { STEPS } from "./constants";

/* eslint-disable complexity */
/* eslint-disable react/jsx-no-bind */
/**
 * Updates the site representation in the database.
 *
 * @param {Object} state The state to save.
 *
 * @returns {Promise|boolean} A promise, or false if the call fails.
 */
async function updateSiteRepresentation( state ) {
	// Revert emptyChoice to the actual default: "company";
	const siteRepresentation = {
		/* eslint-disable camelcase */
		company_or_person: state.companyOrPerson === "emptyChoice" ? "company" : state.companyOrPerson,
		company_name: state.companyName,
		company_logo: state.companyLogo,
		company_logo_id: state.companyLogoId ? state.companyLogoId : 0,
		website_name: state.websiteName,
		person_logo: state.personLogo,
		person_logo_id: state.personLogoId ? state.personLogoId : 0,
		company_or_person_user_id: state.personId,
		/* eslint-enable camelcase */
	};

	const response = await apiFetch( {
		path: "yoast/v1/configuration/site_representation",
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
 * @returns {Promise|boolean} A promise, or false if the call fails.
 */
async function updateSocialProfiles( state ) {
	const socialProfiles = {
		/* eslint-disable camelcase */
		facebook_site: state.socialProfiles.facebookUrl,
		twitter_site: state.socialProfiles.twitterUsername,
		other_social_urls: state.socialProfiles.otherSocialUrls,
		/* eslint-enable camelcase */
	};

	const response = await apiFetch( {
		path: "yoast/v1/configuration/social_profiles",
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
 * @returns {Promise|boolean} A promise, or false if the call fails.
 */
async function updateTracking( state ) {
	if ( state.tracking !== 0 && state.tracking !== 1 ) {
		throw "Value not set!";
	}

	const tracking = {
		tracking: state.tracking,
	};

	const response = await apiFetch( {
		path: "yoast/v1/configuration/enable_tracking",
		method: "POST",
		data: tracking,
	} );
	return await response.json;
}

/**
 * Saves the first time configuration finished steps in the database.
 *
 * @param {Array} finishedSteps Array of finished steps.
 *
 * @returns {Promise|boolean} A promise, or false if the call fails.
 */
async function saveFinishedSteps( finishedSteps ) {
	const response = await apiFetch( {
		path: "yoast/v1/configuration/save_configuration_state",
		method: "POST",
		data: { finishedSteps },
	} );
	return await response.json;
}

/**
 * Calculates the initial state from the window object.
 *
 * @param {Object}   windowObject   The object to base the initial state on.
 * @param {function} isStepFinished A function to determine whether a step is finished.
 *
 * @returns {Object} The initial state.
 */
function calculateInitialState( windowObject, isStepFinished ) {
	const {
		companyName,
		companyLogo,
		companyOrPersonOptions,
		shouldForceCompany,
		fallbackCompanyName,
		websiteName,
		fallbackWebsiteName,
	} = windowObject;
	let { companyOrPerson } = windowObject;
	if ( ( companyOrPerson === "company" && ( ! companyName && ! companyLogo ) && ! isStepFinished( STEPS.siteRepresentation ) ) || shouldForceCompany ) {
		// Set the stage for a prefilled step 2 in case the customer does seem to have consciously finished step 2 without setting data.
		companyOrPerson = "company";
	}

	return {
		...windowObject,
		personId: Number( windowObject.personId ),
		personLogoId: Number( windowObject.personLogoId ),
		companyLogoId: Number( windowObject.companyLogoId ),
		tracking: Number( windowObject.tracking ),
		companyOrPerson,
		companyOrPersonOptions,
		errorFields: [],
		stepErrors: {},
		editedSteps: [],
		companyName: companyName || fallbackCompanyName,
		websiteName: websiteName || fallbackWebsiteName,
	};
}

/* eslint-disable max-statements */
/**
 * The first time configuration.
 *
 * @returns {WPElement} The FirstTimeConfigurationSteps component.
 */
export default function FirstTimeConfigurationSteps() {
	const { removeAlert, dismissNotice, restoreNotice } = useDispatch( STORE_NAME );
	const [ finishedSteps, setFinishedSteps ] = useState( window.wpseoFirstTimeConfigurationData.finishedSteps );

	const isStepFinished = useCallback( ( stepId ) => {
		return finishedSteps.includes( stepId );
	}, [ finishedSteps ] );

	const finishSteps = useCallback( ( stepId ) => {
		setFinishedSteps( prevState => uniq( [ ...prevState, stepId ] ) );
	}, [ setFinishedSteps ] );

	useEffect( () => {
		saveFinishedSteps( finishedSteps );
		window.wpseoFirstTimeConfigurationData.finishedSteps = finishedSteps;
	}, [ finishedSteps ] );

	const [ state, dispatch ] = useReducer( configurationReducer, {
		...calculateInitialState( window.wpseoFirstTimeConfigurationData, isStepFinished ),
	} );
	const [ indexingState, setIndexingState ] = useState( () => window.yoastIndexingData.amount === "0" ? "already_done" : "idle" );
	const [ siteRepresentationEmpty, setSiteRepresentationEmpty ] = useState( false );
	const [ showRunIndexationAlert, setShowRunIndexationAlert ] = useState( false );

	const setStepError = useCallback( ( step, message ) => {
		dispatch( { type: "SET_STEP_ERROR", payload: { step, message } } );
	}, [] );

	const removeStepError = useCallback( ( step ) => {
		dispatch( { type: "REMOVE_STEP_ERROR", payload: step } );
	}, [] );

	/* Briefly override window variable and remove indexing notices, because indexingstate is reinitialized when navigating back and forth
	without triggering a reload, whereas the window variable remains stale. */
	useEffect( () => {
		if ( indexingState === "completed" ) {
			removeAlert( "wpseo-reindex" );
			window.yoastIndexingData.amount = "0";
		}
	}, [ indexingState, removeAlert ] );

	const isStep1Finished = isStepFinished( STEPS.optimizeSeoData );
	const isStep2Finished = isStepFinished( STEPS.siteRepresentation );
	const isStep3Finished = isStepFinished( STEPS.socialProfiles );
	const isStep4Finished = isStepFinished( STEPS.personalPreferences );

	const setTracking = useCallback( ( value ) => {
		dispatch( { type: "SET_TRACKING", payload: parseInt( value, 10 ) } );
	} );

	const setErrorFields = useCallback( ( value ) => {
		dispatch( { type: "SET_ERROR_FIELDS", payload: value } );
	} );

	const resolveLocalNotice = useCallback( () => {
		if ( state.companyLogo !== "" && state.companyLogoId !== 0 && state.companyName !== "" ) {
			dismissNotice( "yoast-local-missing-organization-info-notice" );
		} else {
			restoreNotice( "yoast-local-missing-organization-info-notice" );
		}
	}, [ dismissNotice, restoreNotice, state.companyLogo, state.companyLogoId, state.companyName ] );

	const resolveFTCNotice = useCallback( () => {
		dismissNotice( "yoast-first-time-configuration-notice" );
	}, [ dismissNotice ] );

	const isCompanyAndEmpty = state.companyOrPerson === "company" && ( ! state.companyName || ( ! state.companyLogo && ! state.companyLogoFallback ) || ! state.websiteName );
	const isPersonAndEmpty = state.companyOrPerson === "person" && ( ! state.personId || ( ! state.personLogo && ! state.personLogoFallback ) || ! state.websiteName );

	/**
	 * Runs checks of finishing the site representation step.
	 *
	 * @returns {Boolean|Promise} Returns either a Boolean for success/failure or a Promise that will resolve into a Boolean.
	 */
	function updateOnFinishSiteRepresentation() {
		if ( ! siteRepresentationEmpty && isCompanyAndEmpty ) {
			setSiteRepresentationEmpty( true );
			return false;
		} else if ( ! siteRepresentationEmpty && isPersonAndEmpty ) {
			setSiteRepresentationEmpty( true );
			return false;
		} else if ( ! siteRepresentationEmpty && state.companyOrPerson === "emptyChoice" ) {
			setSiteRepresentationEmpty( true );
			return false;
		}
		setSiteRepresentationEmpty( state.companyOrPerson === "emptyChoice" || isCompanyAndEmpty || isPersonAndEmpty );
		return updateSiteRepresentation( state )
			.then( () => {
				setErrorFields( [] );
				removeStepError( STEPS.siteRepresentation );
				finishSteps( STEPS.siteRepresentation );
				window.wpseoFirstTimeConfigurationData = { ...window.wpseoFirstTimeConfigurationData,  ...state };

				resolveLocalNotice();

				return true;
			} )
			.catch( ( e ) => {
				if ( e.failures ) {
					setErrorFields( e.failures );
					return false;
				}
				if ( e.message ) {
					setStepError( STEPS.siteRepresentation, e.message );
				}
				return false;
			} );
	}

	/**
	 * Runs checks of finishing the social profiles step.
	 *
	 * @returns {Promise|boolean} Returns either a Boolean for success/failure or a Promise.
	 */
	function updateOnFinishSocialProfiles() {
		if ( state.companyOrPerson === "person" ) {
			finishSteps( STEPS.socialProfiles );
			return true;
		}

		return updateSocialProfiles( state )
			.then( ( response ) => {
				if ( response.success === false ) {
					setErrorFields( response.failures );
					return Promise.reject( "There were errors saving social profiles" );
				}
				return response;
			} )
			.then( () => {
				setErrorFields( [] );
				removeStepError( STEPS.socialProfiles );
				finishSteps( STEPS.socialProfiles );
			} )
			.then( () => {
				window.wpseoFirstTimeConfigurationData.socialProfiles = state.socialProfiles;
				return true;
			} )
			.catch(
				( e ) => {
					if ( e.failures ) {
						setErrorFields( e.failures );
					}
					if ( e.message ) {
						setStepError( STEPS.socialProfiles, e.message );
					}
					return false;
				}
			);
	}

	/**
	 * Runs checks of finishing the enable tracking step.
	 *
	 * @returns {Promise|boolean} Returns either a Boolean for success/failure or a Promise.
	 */
	function updateOnFinishPersonalPreferences() {
		return updateTracking( state )
			.then( () => finishSteps( STEPS.personalPreferences ) )
			.then( () => {
				removeStepError( STEPS.personalPreferences );
				window.wpseoFirstTimeConfigurationData.tracking = state.tracking;

				resolveFTCNotice();

				return true;
			} )
			.catch( e => {
				if ( e.message ) {
					setStepError( STEPS.personalPreferences, e.message );
				}
				return false;
			} );
	}

	const onOrganizationOrPersonChange = useCallback(
		( value ) => dispatch( { type: "SET_COMPANY_OR_PERSON", payload: value } ),
		[ dispatch ]
	);

	const isStepperFinished = [
		isStep1Finished,
		isStep2Finished,
		isStep3Finished,
		isStep4Finished,
	].every( Boolean );

	/* Duplicate site representation, because in reality, the first step cannot be saved.
	It's considered "finished" once at least the site representation has been done. */
	const savedSteps = [
		isStepFinished( STEPS.optimizeSeoData ),
		isStepFinished( STEPS.siteRepresentation ),
		isStepFinished( STEPS.socialProfiles ),
		isStepFinished( STEPS.personalPreferences ),
		isStepperFinished,
	];

	const [ activeStepIndex, setActiveStepIndex ] = useState( getInitialActiveStepIndex( savedSteps ) );

	const [ stepperFinishedOnce, setStepperFinishedOnce ] = useState( isStepperFinished );
	const [ isStepBeingEdited, setIsStepBeingEdited ] = useState( false );
	const [ showEditButton, setShowEditButton ] = useState( stepperFinishedOnce && ! isStepBeingEdited );

	/**
	 * Save and continue functionality for the Indexation step.
	 *
	 * @returns {boolean} Whether the stepper can continue to the next step.
	 */
	function beforeContinueIndexationStep() {
		// When: not already showing the alert AND indexation state is "idle" (not yet interacted with) AND indexation is not disabled.
		if ( ! showRunIndexationAlert && indexingState === "idle" && window.yoastIndexingData.disabled !== "1" ) {
			// Then: show an alert to notify users that indexation is helpful.
			setShowRunIndexationAlert( true );
			return false;
		}

		setIsStepBeingEdited( false );
		finishSteps( STEPS.optimizeSeoData );
		return true;
	}

	/**
	 * Steps to take before editing.
	 *
	 * @returns {boolean} Always returns true to satisfy button needs.
	 */
	function beforeEditing() {
		setShowEditButton( false );
		setIsStepBeingEdited( true );
		return true;
	}

	// The first time isStepperFinished is true, set stepperFinishedOnce to true.
	useEffect( () => {
		if ( isStepperFinished ) {
			setStepperFinishedOnce( true );
		}
	}, [ isStepperFinished ] );

	// If stepperFinishedOnce changes or isStepBeingEdited changes, evaluate edit button state.
	useEffect( () => {
		setShowEditButton( stepperFinishedOnce && ! isStepBeingEdited );
	}, [ stepperFinishedOnce, isStepBeingEdited ] );

	useEffect( () => {
		/**
		 * Prevents the submission of the form upon pressing enter.
		 *
		 * @param {KeyboardEvent} event The keydown event this function is listening to.
		 *
		 * @returns {void}
		 */
		function preventEnterSubmit( event ) {
			if ( event.key === "Enter" && document.querySelector( ".nav-tab.nav-tab-active" ).id === "first-time-configuration-tab" && event.target.tagName === "INPUT" ) {
				event.preventDefault();
			}
		}

		addEventListener( "keydown", preventEnterSubmit );
		return () => removeEventListener( "keydown", preventEnterSubmit );
	}, [] );

	// Used by admin.js to decide whether to show the confirmation dialog when user switches tabs in General.
	useEffect( () => {
		if ( state.editedSteps.includes( activeStepIndex + 1 ) || indexingState === "in_progress" ) {
			window.isStepBeingEdited = true;
		} else {
			window.isStepBeingEdited = false;
		}
	}, [ state.editedSteps, indexingState, activeStepIndex ] );

	/**
	 * Handles the "before page unloads" event.
	 *
	 * @param {Window} event The "before page unloads" event.
	 *
	 * @returns {void}
	 */
	const beforeUnloadEventHandler = useCallback( ( event ) => {
		/* Show the pop-up modal if the user wants to leave the first time configuration if:
		 - the current step is being edited but not saved, or
		 - the indexation process is still in progress
		 */
		if ( state.editedSteps.includes( activeStepIndex + 1 ) || indexingState === "in_progress" ) {
			// Show the pup-up modal only if the user is in the first time configuration tab
			if ( location.href.indexOf( "page=wpseo_dashboard#top#first-time-configuration" ) !== -1 || location.href.indexOf( "page=wpseo_dashboard#/first-time-configuration" ) !== -1 ) {
				event.preventDefault();
				event.returnValue = "";
			}
		}
	}, [ state.editedSteps, indexingState, activeStepIndex ] );

	useEffect( () => {
		window.addEventListener( "beforeunload", beforeUnloadEventHandler );

		return () => {
			window.removeEventListener( "beforeunload", beforeUnloadEventHandler );
		};
	}, [ beforeUnloadEventHandler ] );

	return (
		<Stepper
			setActiveStepIndex={ setActiveStepIndex }
			activeStepIndex={ activeStepIndex }
			isStepperFinished={ isStepperFinished }
		>
			<Step>
				<Step.Header
					name={ __( "SEO data optimization", "wordpress-seo" ) }
					isFinished={ isStep1Finished }
				>
					<EditButton
						stepId={ STEPS.optimizeSeoData }
						beforeGo={ beforeEditing }
						isVisible={ showEditButton }
						additionalClasses="yst-ms-auto"
					>
						{ __( "Edit", "wordpress-seo" ) }
					</EditButton>
				</Step.Header>
				<Step.Content>
					<IndexationStep
						setIndexingState={ setIndexingState } indexingState={ indexingState }
						showRunIndexationAlert={ showRunIndexationAlert } isStepperFinished={ isStepperFinished }
					/>
					<ContinueButton
						stepId={ STEPS.optimizeSeoData }
						additionalClasses="yst-mt-12"
						beforeGo={ beforeContinueIndexationStep }
						destination={ stepperFinishedOnce ? "last" : 1 }
					>
						{ __( "Continue", "wordpress-seo" ) }
					</ContinueButton>
				</Step.Content>
			</Step>
			<Step>
				<Step.Header
					name={ __( "Site representation", "wordpress-seo" ) }
					isFinished={ isStep2Finished }
				>
					<EditButton
						stepId={ STEPS.siteRepresentation }
						beforeGo={ beforeEditing }
						isVisible={ showEditButton }
						additionalClasses="yst-ms-auto"
					>
						{ __( "Edit", "wordpress-seo" ) }
					</EditButton>
				</Step.Header>
				<Step.Content>
					<SiteRepresentationStep
						onOrganizationOrPersonChange={ onOrganizationOrPersonChange }
						dispatch={ dispatch }
						state={ state }
						siteRepresentationEmpty={ siteRepresentationEmpty }
					/>
					<Step.Error id="yoast-site-representation-step-error" message={ state.stepErrors[ STEPS.siteRepresentation ] || "" } />
					<ConfigurationStepButtons
						stepId={ STEPS.siteRepresentation }
						stepperFinishedOnce={ stepperFinishedOnce }
						saveFunction={ updateOnFinishSiteRepresentation }
						setEditState={ setIsStepBeingEdited }
					/>
				</Step.Content>
			</Step>
			<Step>
				<Step.Header
					name={ __( "Social profiles", "wordpress-seo" ) }
					isFinished={ isStep3Finished }
				>
					<EditButton
						stepId={ STEPS.socialProfiles }
						beforeGo={ beforeEditing }
						isVisible={ showEditButton }
						additionalClasses="yst-ms-auto"
					>
						{ __( "Edit", "wordpress-seo" ) }
					</EditButton>
				</Step.Header>
				<Step.Content>
					<SocialProfilesStep state={ state } dispatch={ dispatch } setErrorFields={ setErrorFields } />
					<Step.Error id="yoast-social-profiles-step-error" message={ state.stepErrors[ STEPS.socialProfiles ] || "" } />
					<ConfigurationStepButtons
						stepId={ STEPS.socialProfiles }
						stepperFinishedOnce={ stepperFinishedOnce }
						saveFunction={ updateOnFinishSocialProfiles }
						setEditState={ setIsStepBeingEdited }
					/>
				</Step.Content>
			</Step>
			<Step>
				<Step.Header
					name={ __( "Personal preferences", "wordpress-seo" ) }
					isFinished={ isStep4Finished }
				>
					<EditButton
						stepId={ STEPS.personalPreferences }
						beforeGo={ beforeEditing }
						isVisible={ showEditButton }
						additionalClasses="yst-ms-auto"
					>
						{ __( "Edit", "wordpress-seo" ) }
					</EditButton>
				</Step.Header>
				<Step.Content>
					<PersonalPreferencesStep state={ state } setTracking={ setTracking } />
					<Step.Error id="yoast-personal-preferences-step-error" message={ state.stepErrors[ STEPS.personalPreferences ] || "" } />
					<ConfigurationStepButtons
						stepId={ STEPS.personalPreferences }
						stepperFinishedOnce={ stepperFinishedOnce }
						saveFunction={ updateOnFinishPersonalPreferences }
						setEditState={ setIsStepBeingEdited }
					/>
				</Step.Content>
			</Step>
			<Step>
				<Step.Header
					name={ __( "Finish configuration", "wordpress-seo" ) }
					isFinished={ isStepperFinished }
				/>
				<Step.Content>
					<FinishStep />
				</Step.Content>
			</Step>
		</Stepper>
	);
}

/* eslint-enable complexity */
/* eslint-enable react/jsx-no-bind */
/* eslint-enable max-statements */
