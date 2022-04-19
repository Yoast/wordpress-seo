import apiFetch from "@wordpress/api-fetch";
import { compose } from "@wordpress/compose";
import { useCallback, useReducer, useState, useEffect, Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { cloneDeep, uniq } from "lodash";
import PropTypes from "prop-types";

import UnsavedChangesModal from "./tailwind-components/unsaved-changes-modal";
import { addLinkToString } from "../helpers/stringHelpers.js";
import SocialProfilesStep from "./tailwind-components/steps/social-profiles/social-profiles-step";
import Stepper, { Step } from "./tailwind-components/Stepper";
import { ContinueButton, EditButton, ConfigurationStepButtons } from "./tailwind-components/ConfigurationStepperButtons";
import { STEPS } from "./config";
import { getInitialActiveStepIndex } from "./stepper-helper";
import IndexationStep from "./tailwind-components/steps/indexation/indexation-step";
import SiteRepresentationStep from "./tailwind-components/steps/site-representation/site-representation-step";
import PersonalPreferencesStep from "./tailwind-components/steps/personal-preferences/personal-preferences-step";

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
			newState.canEditUser = ( action.payload.value === true ) ? 1 : 0;
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
		other_social_urls: state.socialProfiles.otherSocialUrls,
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
		path: "yoast/v1/workouts/person_social_profiles",
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

/**
 * Example Finish step.
 *
 * @returns {WPElement} Finish step.
 */
const FinishStep = () => <Fragment>
	<p className="yst-mb-6">You have finished all the things, yay!</p>
</Fragment>;

/**
 * Calculates the initial state from the window object.
 *
 * @param {Object}   windowObject   The object to base the initial state on.
 * @param {function} isStepFinished A function to determine whether a step is finished.
 *
 * @returns {Object} The initial state.
 */
function calculateInitialState( windowObject, isStepFinished ) {
	// Overrule default state to empty and add empty choice.
	let { companyOrPerson, companyName,	companyLogo, companyOrPersonOptions, shouldForceCompany } = windowObject; // eslint-disable-line prefer-const
	if ( shouldForceCompany ) {
		companyOrPerson = "company";
	} else if ( companyOrPerson === "company" && ( ! companyName && ! companyLogo ) && ! isStepFinished( 2 ) ) {
		companyOrPerson = "emptyChoice";
	}

	return {
		...windowObject,
		companyOrPerson,
		companyOrPersonOptions,
		errorFields: [],
		editedSteps: [],
		savedSteps: [],
	};
}

/* eslint-enable max-len, react/prop-types */

/* eslint-disable max-statements */
/**
 * The configuration workout.
 *
 * @returns {WPElement} The FirstTimeConfigurationSteps component.
 */
export default function FirstTimeConfigurationSteps() {
	const [ finishedSteps, setFinishedSteps ] = useState( [] );

	const isStepFinished = useCallback( ( stepIndex ) => {
		return finishedSteps.includes( stepIndex );
	}, [ finishedSteps ] );

	const finishSteps = useCallback( ( stepNumber ) => {
		setFinishedSteps( prevState => uniq( [ ...prevState, stepNumber ] ) );
	}, [ setFinishedSteps ] );

	const [ state, dispatch ] = useReducer( configurationWorkoutReducer, {
		...calculateInitialState( window.wpseoFirstTimeConfigurationData, isStepFinished ),
	} );
	const [ indexingState, setIndexingState ] = useState( () => window.yoastIndexingData.amount === "0" ? "already_done" : "idle" );
	const [ siteRepresentationEmpty, setSiteRepresentationEmpty ] = useState( false );
	const [ showRunIndexationAlert, setShowRunIndexationAlert ] = useState( false );

	const isTrackingOptionSelected = state.tracking === 0 || state.tracking === 1;

	/* Briefly override window variable because indexingstate is reinitialized when navigating back and forth on the workouts page,
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

	const isStep2Finished = isStepFinished( 2 );
	const isStep3Finished = isStepFinished( 3 );
	const isStep4Finished = isStepFinished( 4 );

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
			.then( () => finishSteps( 2 ) );
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
				.then( () => setStepIsSaved( 3 ) )
				.then( () => {
					setErrorFields( [] );
					finishSteps( 3 );
				} )
				.then( () => {
					return true;
				} )
				.catch(
					( e ) => {
						if ( e.failures ) {
							setErrorFields( e.failures );
						}
						console.error( e );
						return false;
					}
				);
		}

		return updateSocialProfiles( state )
			.then( () => setStepIsSaved( 3 ) )
			.then( () => {
				setErrorFields( [] );
				finishSteps( 3 );
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
	function updateOnFinishEnableTracking() {
		return updateTracking( state )
			.then( () => setStepIsSaved( 4 ) )
			.then( () => finishSteps( 4 ) )
			.then( () => {
				return true;
			} );
	}

	const onOrganizationOrPersonChange = useCallback(
		( value ) => dispatch( { type: "SET_COMPANY_OR_PERSON", payload: value } ),
		[ dispatch ]
	);

	// PROBABLY DELETE BETWEEN HERE....
	const isStepperFinished = [
		isStep2Finished,
		isStep3Finished,
		isStep4Finished,
	].every( Boolean );

	const [ isIndexationStepFinished, setIndexationStepFinished ] = useState( isStepFinished( 2 ) );

	/* Duplicate site representation, because in reality, the first step cannot be saved.
	It's considered "finished" once at least the site representation has been done. */
	const savedSteps = [
		isIndexationStepFinished,
		isStepFinished( 2 ),
		isStepFinished( 3 ),
		isStepFinished( 4 ),
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

	// If stepperFinishedOnce changes or isStepBeingEdited changes, evaluate edit button state.
	useEffect( () => {
		setShowEditButton( stepperFinishedOnce && ! isStepBeingEdited );
	}, [ stepperFinishedOnce, isStepBeingEdited ] );

	// AND HERE....
	/* eslint-disable max-len */
	return (
		<div id="yoast-configuration-workout" className="yst-card">
			<h2 id="yoast-configuration-workout-title" className="yst-text-lg yst-text-primary-500 yst-font-medium">{ __( "Tell us about your site, so we can get your site ranked!", "wordpress-seo" ) }</h2>
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
						"yoast-configuration-workout-guide-link"
					)
				}
			</p>
			<p className="yst-mb-6">
				{ __( "The Yoast indexables squad can't wait to get your site in tip-top shape for the search engines. Help us and take these 5 steps in order to put our Yoast indexables to work!", "wordpress-seo" ) }
			</p>
			<hr id="configuration-workout-hr-top" />
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
							<ConfigurationStepButtons stepperFinishedOnce={ stepperFinishedOnce } saveFunction={ updateOnFinishEnableTracking } setEditState={ setIsStepBeingEdited } />
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

			<UnsavedChangesModal
				hasUnsavedChanges={ state.editedSteps.includes( activeStepIndex + 1 ) }
				title={ __( "Unsaved changes", "wordpress-seo" ) }
				description={ __( "There are unsaved changes in this step. Leaving means that those changes will be lost. Are you sure you want to leave this page?", "wordpress-seo" ) }
				okButtonLabel={ __( "Yes, leave page", "wordpress-seo" ) }
				cancelButtonLabel={ __( "No, continue editing", "wordpress-seo" ) }
			/>

			<UnsavedChangesModal
				hasUnsavedChanges={ indexingState === "in_progress" }
				title={ __( "SEO data optimization is still running...", "wordpress-seo" ) }
				description={ __( "The SEO data optimization is still running. Leaving this page means that this processs will be stopped. Are you sure you want to leave this page?", "wordpress-seo" ) }
				okButtonLabel={ __( "Yes, leave page", "wordpress-seo" ) }
				cancelButtonLabel={ __( "No, continue SEO data optimization", "wordpress-seo" ) }
			/>

		</div>
		/* eslint-enable max-len */
	);
}
/* eslint-enable complexity */
/* eslint-enable max-statements */
