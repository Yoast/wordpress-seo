import { __ } from "@wordpress/i18n";
import { cloneDeep } from "lodash";

import classNames from "classnames";

export const socialMedia = [
	{ name: "Facebook", placeholder: __( "E.g. https://www.facebook.com/yoast", "wordpress-seo" ) },
	{ name: "Instagram", placeholder: __( "E.g. https://www.instagram.com/yoast", "wordpress-seo" ) },
	{ name: "LinkedIn", placeholder: __( "E.g. https://www.linkedin.com/yoast", "wordpress-seo" ) },
	{ name: "MySpace", placeholder: __( "E.g. https://www.myspace.com/yoast", "wordpress-seo" ) },
	{ name: "Pinterest", placeholder: __( "E.g. https://www.pinterest.com/yoast", "wordpress-seo" ) },
	{ name: "SoundCloud", placeholder: __( "E.g. https://www.soundcloud.com/yoast", "wordpress-seo" ) },
	{ name: "Tumblr", placeholder: __( "E.g. https://www.tumblr.com/yoast", "wordpress-seo" ) },
	{ name: "Twitter", placeholder: __( "E.g. https://www.twitter.com/yoast", "wordpress-seo" ) },
	{ name: "YouTube", placeholder: __( "E.g. https://www.youtube.com/yoast", "wordpress-seo" ) },
	{ name: "Wikipedia", placeholder: __( "E.g. https://www.wikipedia.com/yoast", "wordpress-seo" ) },
];

/**
 * Creates the error ID for the error component.
 *
 * @param {string} inputId The id of the input component.
 *
 * @returns {string} The ID for the error component.
 */
export const getErrorId = ( inputId ) => `error-${ inputId }`;

/**
  * Get props needed to properly display an error in input components.
  *
  * @param {string} inputId The id of the input component.
  * @param {ValidationError} error The error object.
  * @param {boolean} error.isVisible The error object.
  *
  * @returns {Object} Object containing relevant props for displaying.
  */
export const getErrorAriaProps = ( inputId, { isVisible } ) => isVisible ? {
	"aria-invalid": true,
	"aria-describedby": getErrorId( inputId ),
} : {};

/**
 * Helper function to get active styles for select options.
 *
 * @param {boolean} options.active Whether the option is active.
 *
 * @returns {string} Styles for an active option.
 */
export function getOptionActiveStyles( { active, selected } ) {
	return classNames(
		"yst-relative yst-cursor-default yst-select-none yst-py-2 yst-pl-3 yst-pr-9 yst-my-0",
		selected && "yst-bg-primary-500 yst-text-white",
		( active && ! selected ) && "yst-bg-primary-200 yst-text-gray-700",
		( ! active && ! selected ) && "yst-text-gray-700"
	);
}


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

/**
 * Manages updating of the error notices when one (or more) field are removed from the user
 *
 * @param {object} prevState An array of fields names with errors
 * @param {int} index The index of the field to be removed
 *
 * @returns {Array} The filtered list of fields with errors
 */
export function removeFieldAndUpdateErrors( prevState, index ) {
	// Map through all the fields with errors
	return prevState.map( ( errorField ) => {
		// Find the index of the current error
		const errorFieldIndex = parseInt( errorField.replace( "other_social_urls-", "" ), 10 );
		// If the error occurs on the field to be removed, mark it for removal
		if ( errorFieldIndex === index ) {
			return "remove";
		// If the field index is past the field to be removed, decrease it by one since we'll remove the previous field
		} else if ( errorFieldIndex > index ) {
			return `other_social_urls-${ errorFieldIndex - 1 }`;
		}
		return errorField;
	// Keep all the errors not marked to be removed
	} ).filter( errorField => errorField !== "remove" );
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
export function configurationReducer( state, action ) {
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
			newState.errorFields = newState.errorFields.filter( errorField => {
				if ( action.payload.socialMedium === "facebookUrl" ) {
					return errorField !== "facebook_site";
				} else if ( action.payload.socialMedium === "twitterUsername" ) {
					return errorField !== "twitter_site";
				}
				return true;
			} );
			return newState;
		case "CHANGE_OTHERS_SOCIAL_PROFILE":
			newState = handleStepEdit( newState, 3 );
			newState.socialProfiles.otherSocialUrls[ action.payload.index ] = action.payload.value;
			newState.errorFields = newState.errorFields.filter( errorField => errorField !== `other_social_urls-${ action.payload.index }` );
			return newState;
		case "ADD_OTHERS_SOCIAL_PROFILE":
			newState = handleStepEdit( newState, 3 );
			newState.socialProfiles.otherSocialUrls = [ ...newState.socialProfiles.otherSocialUrls, action.payload.value ];
			return newState;
		case "REMOVE_OTHERS_SOCIAL_PROFILE":
			newState = handleStepEdit( newState, 3 );
			newState.socialProfiles.otherSocialUrls.splice( action.payload.index, 1 );
			newState.errorFields = removeFieldAndUpdateErrors( newState.errorFields, action.payload.index );
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
/* eslint-enable complexity */
