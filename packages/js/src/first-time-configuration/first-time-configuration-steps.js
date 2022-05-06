/* global wpseoFirstTimeConfigurationData */
import apiFetch from "@wordpress/api-fetch";
import { useCallback, useReducer, useState, useEffect, useRef } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { cloneDeep, uniq } from "lodash";

import { addLinkToString } from "../helpers/stringHelpers.js";
import SocialProfilesStep from "./tailwind-components/steps/social-profiles/social-profiles-step";
import Stepper, { Step } from "./tailwind-components/stepper";
import { ContinueButton, EditButton, ConfigurationStepButtons } from "./tailwind-components/configuration-stepper-buttons";
import { getInitialActiveStepIndex } from "./stepper-helper";
import IndexationStep from "./tailwind-components/steps/indexation/indexation-step";
import SiteRepresentationStep from "./tailwind-components/steps/site-representation/site-representation-step";
import PersonalPreferencesStep from "./tailwind-components/steps/personal-preferences/personal-preferences-step";
import FinishStep from "./tailwind-components/steps/finish/finish-step";

window.wpseoScriptData = window.wpseoScriptData || {};
window.wpseoScriptData.searchAppearance = {
	...window.wpseoScriptData.searchAppearance,
	userEditUrl: "/wp-admin/user-edit.php?user_id={user_id}",
};

const STEPS = {
	optimizeSeoData: "optimizeSeoData",
	siteRepresentation: "siteRepresentation",
	socialProfiles: "socialProfiles",
	personalPreferences: "personalPreferences",
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
 * A reducer for the configuration's internal state.
 *
 * @param {Object} state  The "current" state.
 * @param {Object} action The action with which to mutate the state.
 *
 * @returns {Object} The state as altered by the action.
 */
function configurationReducer( state, action ) {
	let newState = cloneDeep( state );
	switch ( action.type ) {
		case "SET_COMPANY_OR_PERSON":
			newState = handleStepEdit( newState, 2 );
			newState.companyOrPerson = action.payload;
			newState.companyOrPersonLabel = newState.companyOrPersonOptions.filter( ( item ) => {
				return item.value === action.payload;
			} ).pop().label;
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
		case "SET_PERSON":
			newState = handleStepEdit( newState, 2 );
			newState.personId = action.payload.value;
			newState.personName = action.payload.label;
			return newState;
		case "CHANGE_PERSON_SOCIAL_PROFILE":
			newState = handleStepEdit( newState, 3 );
			newState.personSocialProfiles[ action.payload.socialMedium ] = action.payload.value;
			return newState;
		case "INIT_PERSON_SOCIAL_PROFILES":
			newState.personSocialProfiles = action.payload.socialProfiles;
			return newState;
		case "SET_CAN_EDIT_USER":
			newState = handleStepEdit( newState, 2 );
			newState.canEditUser = ( action.payload === true ) ? 1 : 0;
			return newState;
		case "CHANGE_SOCIAL_PROFILE":
			newState = handleStepEdit( newState, 3 );
			newState.socialProfiles[ action.payload.socialMedium ] = action.payload.value;
			return newState;
		case "CHANGE_OTHERS_SOCIAL_PROFILE":
			newState = handleStepEdit( newState, 3 );
			newState.socialProfiles.otherSocialUrls[ action.payload.index ] = action.payload.value;
			return newState;
		case "ADD_OTHERS_SOCIAL_PROFILE":
			newState = handleStepEdit( newState, 3 );
			newState.socialProfiles.otherSocialUrls = [ ...newState.socialProfiles.otherSocialUrls, action.payload.value ];
			return newState;
		case "REMOVE_OTHERS_SOCIAL_PROFILE":
			newState = handleStepEdit( newState, 3 );
			newState.socialProfiles.otherSocialUrls.splice( action.payload.index, 1 );
			return newState;
		case "SET_ERROR_FIELDS":
			newState.errorFields = action.payload;
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
	// Revert emptyChoice to the actual default: "company";
	const siteRepresentation = {
		/* eslint-disable camelcase */
		company_or_person: state.companyOrPerson === "emptyChoice" ? "company" : state.companyOrPerson,
		company_name: state.companyName,
		company_logo: state.companyLogo,
		company_logo_id: state.companyLogoId ? state.companyLogoId : 0,
		person_logo: state.personLogo,
		person_logo_id: state.personLogoId ? state.personLogoId : 0,
		company_or_person_user_id: state.personId,
		/* eslint-enable camelcase */
	};

	if ( window.wpseoFirstTimeConfigurationData.canEditWordPressOptions ) {
		siteRepresentation.description = state.siteTagline;
	}
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
 * @returns {Promise|bool} A promise, or false if the call fails.
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
 * Updates the person social profiles in the database.
 *
 * @param {Object} state The state to save.
 *
 * @returns {Promise|bool} A promise, or false if the call fails.
 */
async function updatePersonSocialProfiles( state ) {
	const socialProfiles = {
		/* eslint-disable camelcase */
		user_id: state.personId,
		facebook: state.personSocialProfiles.facebook,
		instagram: state.personSocialProfiles.instagram,
		linkedin: state.personSocialProfiles.linkedin,
		myspace: state.personSocialProfiles.myspace,
		pinterest: state.personSocialProfiles.pinterest,
		soundcloud: state.personSocialProfiles.soundcloud,
		tumblr: state.personSocialProfiles.tumblr,
		twitter: state.personSocialProfiles.twitter,
		youtube: state.personSocialProfiles.youtube,
		wikipedia: state.personSocialProfiles.wikipedia,
		/* eslint-enable camelcase */
	};
	const response = await apiFetch( {
		path: "yoast/v1/configuration/person_social_profiles",
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
		path: "yoast/v1/configuration/enable_tracking",
		method: "POST",
		data: tracking,
	} );
	return await response.json;
}

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
	let { companyOrPerson, companyName,	companyLogo, companyOrPersonOptions, shouldForceCompany } = windowObject; // eslint-disable-line prefer-const

	if ( shouldForceCompany ) {
		companyOrPerson = "company";
	} else if ( companyOrPerson === "company" && ( ! companyName && ! companyLogo ) && ! isStepFinished( STEPS.siteRepresentation ) ) {
		// Set the stage for an empty step 2 in case the customer does seem to have consciously finished step 2 without setting data.
		companyOrPerson = "emptyChoice";
	}

	return {
		...windowObject,
		companyOrPerson,
		companyOrPersonOptions,
		personSocialProfiles: {},
		errorFields: [],
		editedSteps: [],
		savedSteps: [],
	};
}

/* eslint-enable max-len, react/prop-types */

/* eslint-disable max-statements */
/**
 * The first time configuration.
 *
 * @returns {WPElement} The FirstTimeConfigurationSteps component.
 */
export default function FirstTimeConfigurationSteps() {
	const [ finishedSteps, setFinishedSteps ] = useState( wpseoFirstTimeConfigurationData.finishedSteps );

	const isStepFinished = useCallback( ( stepId ) => {
		return finishedSteps.includes( stepId );
	}, [ finishedSteps ] );

	const finishSteps = useCallback( ( stepId ) => {
		setFinishedSteps( prevState => uniq( [ ...prevState, stepId ] ) );
	}, [ setFinishedSteps ] );

	useEffect( () => {
		saveFinishedSteps( finishedSteps );
	}, [ finishedSteps ] );

	const [ state, dispatch ] = useReducer( configurationReducer, {
		...calculateInitialState( window.wpseoFirstTimeConfigurationData, isStepFinished ),
	} );
	const [ indexingState, setIndexingState ] = useState( () => window.yoastIndexingData.amount === "0" ? "already_done" : "idle" );
	const [ siteRepresentationEmpty, setSiteRepresentationEmpty ] = useState( false );
	const [ showRunIndexationAlert, setShowRunIndexationAlert ] = useState( false );

	const isTrackingOptionSelected = state.tracking === 0 || state.tracking === 1;

	/* Briefly override window variable because indexingstate is reinitialized when navigating back and forth without triggering a reload,
	whereas the window variable remains stale. */
	useEffect( () => {
		if ( indexingState === "completed" ) {
			window.yoastIndexingData.amount = "0";
		}
	}, [ indexingState ] );

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

	const isStep2Finished = isStepFinished( STEPS.siteRepresentation );
	const isStep3Finished = isStepFinished( STEPS.socialProfiles );
	const isStep4Finished = isStepFinished( STEPS.personalPreferences );

	const setTracking = useCallback( ( value ) => {
		dispatch( { type: "SET_TRACKING", payload: parseInt( value, 10 ) } );
	} );

	const setErrorFields = useCallback( ( value ) => {
		dispatch( { type: "SET_ERROR_FIELDS", payload: value } );
	} );

	const isCompanyAndEmpty = state.companyOrPerson === "company" && ( ! state.companyName || ! state.companyLogo );
	const isPersonAndEmpty = state.companyOrPerson === "person" && ( ! state.personId || ! state.personLogo );

	/**
	 * Runs checks of finishing the site representation step.
	 *
	 * @returns {void}
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
		updateSiteRepresentation( state )
			.then( () => setStepIsSaved( 2 ) )
			.then( () => finishSteps( STEPS.siteRepresentation ) );
		return true;
	}

	/**
	 * Runs checks of finishing the social profiles step.
	 *
	 * @returns {void}
	 */
	function updateOnFinishSocialProfiles() {
		if ( state.companyOrPerson === "person" ) {
			if ( ! state.canEditUser ) {
				return true;
			}
			return updatePersonSocialProfiles( state )
				.then( ( response ) => {
					if ( response.success === false ) {
						setErrorFields( response.failures );
						return Promise.reject( "There were errors saving social profiles" );
					}
					return response;
				} )
				.then( () => setStepIsSaved( 3 ) )
				.then( () => {
					setErrorFields( [] );
					finishSteps( STEPS.socialProfiles );
				} )
				.then( () => {
					return true;
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

		return updateSocialProfiles( state )
			.then( ( response ) => {
				if ( response.success === false ) {
					setErrorFields( response.failures );
					return Promise.reject( "There were errors saving social profiles" );
				}
				return response;
			} )
			.then( () => setStepIsSaved( 3 ) )
			.then( () => {
				setErrorFields( [] );
				finishSteps( STEPS.socialProfiles );
			} )
			.then( () => {
				return true;
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
	function updateOnFinishPersonalPreferences() {
		return updateTracking( state )
			.then( () => setStepIsSaved( 4 ) )
			.then( () => finishSteps( STEPS.personalPreferences ) )
			.then( () => {
				return true;
			} );
	}

	const onOrganizationOrPersonChange = useCallback(
		( value ) => dispatch( { type: "SET_COMPANY_OR_PERSON", payload: value } ),
		[ dispatch ]
	);

	const isStepperFinished = [
		isStep2Finished,
		isStep3Finished,
		isStep4Finished,
	].every( Boolean );

	const [ isIndexationStepFinished, setIndexationStepFinished ] = useState( isStepFinished( STEPS.siteRepresentation ) );

	/* Duplicate site representation, because in reality, the first step cannot be saved.
	It's considered "finished" once at least the site representation has been done. */
	const savedSteps = [
		isIndexationStepFinished,
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
		if ( ! showRunIndexationAlert && indexingState === "idle" ) {
			setShowRunIndexationAlert( true );
			return false;
		}

		setIndexationStepFinished( true );
		setIsStepBeingEdited( false );
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

	useEffect( () => {
		if ( isStep2Finished ) {
			const configurationNotice = document.getElementById( "yoast-first-time-configuration-notice" );
			if ( configurationNotice ) {
				document.getElementById( "yoast-first-time-configuration-notice" ).remove();
			}
		}
	}, [ isStep2Finished ] );

	/* In order to refresh data in the php form, once the stepper is done, we need to reload upon haschanges triggered by the tabswitching */
	const isStepperFinishedAtBeginning = useRef( isStep2Finished && isStep3Finished && isStep4Finished );
	useEffect( () => {
		/**
		 * Reloads the window.
		 *
		 * @returns {void}
		 */
		const reloadFunction = () => {
			window.location.reload( true );
		};

		if ( isStepperFinished && ! isStepperFinishedAtBeginning.current ) {
			window.addEventListener( "hashchange", reloadFunction );
		}
		return () => window.removeEventListener( "hashchange", reloadFunction );
	}, [ isStepperFinished, isStepperFinishedAtBeginning ] );

	// If stepperFinishedOnce changes or isStepBeingEdited changes, evaluate edit button state.
	useEffect( () => {
		setShowEditButton( stepperFinishedOnce && ! isStepBeingEdited );
	}, [ stepperFinishedOnce, isStepBeingEdited ] );

	/* eslint-disable max-len */
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

	/**
	 * Handles the "before page unloads" event.
	 *
	 * @param {Window} event The "before page unloads" event.
	 *
	 * @returns {void}
	 */
	const beforeUnloadEventHandler = useCallback( ( event ) => {
		if ( state.editedSteps.includes( activeStepIndex + 1 ) || indexingState === "in_progress"  ) {
			event.preventDefault();
			event.returnValue = "";
		}
	}, [ state.editedSteps, indexingState ] );

	useEffect( () => {
		window.addEventListener( "beforeunload", beforeUnloadEventHandler );

		return () => {
			window.removeEventListener( "beforeunload", beforeUnloadEventHandler );
		};
	}, [ beforeUnloadEventHandler ] );

	return (
		<div id="yoast-configuration" className="yst-card yst-text-gray-500">
			<h2 id="yoast-configuration-title" className="yst-text-lg yst-text-primary-500 yst-font-medium">{ __( "Tell us about your site, so we can get your site ranked!", "wordpress-seo" ) }</h2>
			<p className="yst-py-2">
				{
					addLinkToString(
						sprintf(
							__(
								// translators: %1$s and %3$s are replaced by opening and closing anchor tags. %2$s is replaced by "Yoast SEO"
								"Put the %1$s%2$s indexables squad%3$s to work! Make Google understand your site.",
								"wordpress-seo"
							),
							"<a>",
							"Yoast SEO",
							"</a>"
						),
						window.wpseoFirstTimeConfigurationData.shortlinks.workoutGuide,
						"yoast-configuration-guide-link"
					)
				}
			</p>
			<p className="yst-mb-6">
				{ __( "The Yoast indexables squad can't wait to get your site in tip-top shape for the search engines. Help us and take these 5 steps in order to put our Yoast indexables to work!", "wordpress-seo" ) }
			</p>
			<hr id="configuration-hr-top" />
			{ /* eslint-disable react/jsx-no-bind */ }
			<div className="yst-mt-8">
				<Stepper
					setActiveStepIndex={ setActiveStepIndex }
					activeStepIndex={ activeStepIndex }
					isStepperFinished={ isStepperFinished }
				>
					<Step>
						<Step.Header
							name="SEO data optimization"
							isFinished={ isIndexationStepFinished }
						>
							<EditButton
								beforeGo={ beforeEditing }
								isVisible={ showEditButton }
								additionalClasses={ "yst-ml-auto" }
							>
								{ __( "Edit", "wordpress-seo" ) }
							</EditButton>
						</Step.Header>
						<Step.Content>
							<IndexationStep setIndexingState={ setIndexingState } indexingState={ indexingState } showRunIndexationAlert={ showRunIndexationAlert }  isStepperFinished={ isStepperFinished } />
							<ContinueButton
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
							name="Site representation"
							isFinished={ isStep2Finished }
						>
							<EditButton
								beforeGo={ beforeEditing }
								isVisible={ showEditButton }
								additionalClasses={ "yst-ml-auto" }
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
							<ConfigurationStepButtons
								stepperFinishedOnce={ stepperFinishedOnce }
								saveFunction={ updateOnFinishSiteRepresentation }
								setEditState={ setIsStepBeingEdited }
							/>
						</Step.Content>
					</Step>
					<Step>
						<Step.Header
							name="Social profiles"
							isFinished={ isStep3Finished }
						>
							<EditButton
								beforeGo={ beforeEditing }
								isVisible={ showEditButton }
								additionalClasses={ "yst-ml-auto" }
							>
								{ __( "Edit", "wordpress-seo" ) }
							</EditButton>
						</Step.Header>
						<Step.Content>
							<SocialProfilesStep state={ state } dispatch={ dispatch } setErrorFields={ setErrorFields } />
							<ConfigurationStepButtons stepperFinishedOnce={ stepperFinishedOnce } saveFunction={ updateOnFinishSocialProfiles } setEditState={ setIsStepBeingEdited } />
						</Step.Content>
					</Step>
					<Step>
						<Step.Header
							name="Personal preferences"
							isFinished={ isStep4Finished }
						>
							<EditButton
								beforeGo={ beforeEditing }
								isVisible={ showEditButton }
								additionalClasses={ "yst-ml-auto" }
							>
								{ __( "Edit", "wordpress-seo" ) }
							</EditButton>
						</Step.Header>
						<Step.Content>
							<PersonalPreferencesStep state={ state } setTracking={ setTracking } isTrackingOptionSelected={ isTrackingOptionSelected } />
							<ConfigurationStepButtons stepperFinishedOnce={ stepperFinishedOnce } saveFunction={ updateOnFinishPersonalPreferences } setEditState={ setIsStepBeingEdited } />
						</Step.Content>
					</Step>
					<Step>
						<Step.Header
							name="Finish configuration"
							isFinished={ isStepperFinished }
						/>
						<Step.Content>
							<FinishStep />
						</Step.Content>
					</Step>
				</Stepper>
			</div>
		</div>
	);
}

/* eslint-enable max-len */
/* eslint-enable complexity */
/* eslint-enable max-statements */
