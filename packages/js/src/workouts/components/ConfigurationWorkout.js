import apiFetch from "@wordpress/api-fetch";
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { createInterpolateElement, useCallback, useReducer, useState, useEffect, Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { cloneDeep } from "lodash";
import PropTypes from "prop-types";

import { Alert, NewButton as Button, RadioButtonGroup, SingleSelect, TextInput } from "@yoast/components";
import { ReactComponent as WorkoutDoneImage } from "../../../../../images/mirrored_fit_bubble_woman_1_optim.svg";
import { ReactComponent as WorkoutStartImage } from "../../../images/motivated_bubble_woman_1_optim.svg";
import { addLinkToString } from "../../helpers/stringHelpers.js";
import { Step, Steps, FinishButtonSection } from "./Steps";
import { STEPS, WORKOUTS } from "../config";
import { OrganizationSection } from "./OrganizationSection";
import { PersonSection } from "./PersonSection";
import { NewsletterSignup } from "./NewsletterSignup";
import { WorkoutIndexation } from "./WorkoutIndexation";
import SocialInputSection from "./SocialInputSection";
import { scrollToStep } from "../helpers";

window.wpseoScriptData = window.wpseoScriptData || {};
window.wpseoScriptData.searchAppearance = {
	...window.wpseoScriptData.searchAppearance,
	userEditUrl: "/wp-admin/user-edit.php?user_id={user_id}",
};

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
	const newState = cloneDeep( state );
	switch ( action.type ) {
		case "SET_COMPANY_OR_PERSON":
			newState.companyOrPerson = action.payload;
			newState.companyOrPersonLabel = window.wpseoWorkoutsData.configuration.companyOrPersonOptions.filter( ( item ) => {
				return item.value === action.payload;
			} ).pop().name;
			return newState;
		case "CHANGE_COMPANY_NAME":
			newState.companyName = action.payload;
			return newState;
		case "SET_COMPANY_LOGO":
			newState.companyLogo = action.payload.url;
			newState.companyLogoId = action.payload.id;
			return newState;
		case "REMOVE_COMPANY_LOGO":
			newState.companyLogo = "";
			newState.companyLogoId = "";
			return newState;
		case "SET_PERSON_LOGO":
			newState.personLogo = action.payload.url;
			newState.personLogoId = action.payload.id;
			return newState;
		case "REMOVE_PERSON_LOGO":
			newState.personLogo = "";
			newState.personLogoId = "";
			return newState;
		case "SET_PERSON_ID":
			newState.personId = action.payload;
			return newState;
		case "CHANGE_SOCIAL_PROFILE":
			newState.socialProfiles[ action.payload.socialMedium ] = action.payload.value;
			return newState;
		case "SET_ERROR_FIELDS":
			newState.errorFields = action.payload;
			return newState;
		case "CHANGE_SITE_TAGLINE":
			newState.siteTagline = action.payload;
			return newState;
		case "SET_TRACKING":
			newState.tracking = action.payload;
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
		description: state.siteTagline,
		/* eslint-enable camelcase */
	};

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

/**
 * The configuration workout.
 *
 * @param {function}  toggleStep                The function to toggle the step state.
 * @param {function}  finishSteps               The function to finish steps.
 * @param {function}  reviseStep                The function to revise steps.
 * @param {function}  toggleWorkout             The function to toggle the workout state.
 * @param {function}  isStepFinished            The function to check whether a step is finished.
 * @param {string}    seoDataOptimizationNeeded The flag signaling if SEO optimization is needed.
 * @returns {WPElement} The ConfigurationWorkout component.
 */
export function ConfigurationWorkout( { toggleStep, finishSteps, reviseStep, toggleWorkout, clearActiveWorkout, isStepFinished } ) {
	const [ state, dispatch ] = useReducer( configurationWorkoutReducer, { ...window.wpseoWorkoutsData.configuration, errorFields: [] } );
	const [ indexingState, setIndexingState ] = useState( () => window.yoastIndexingData.amount === "0" ? "completed" : "idle" );
	const [ siteRepresentationEmpty, setSiteRepresentationEmpty ] = useState( false );
	const [ savedSteps, setSavedSteps ] = useState( [] );
	const steps = STEPS.configuration;

	const isTrackingOptionSelected = state.tracking === 0 || state.tracking === 1;

	/**
	 * If indexing has been completed, finish step 1, else, unfinish it.
	 */
	useEffect( () => {
		if ( indexingState === "completed" ) {
			finishSteps( "configuration", [ steps.optimizeSeoData ] );
		} else {
			reviseStep( "configuration", steps.optimizeSeoData );
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
		setSavedSteps( ( prevState ) => {
			return [ stepNumber, ...prevState ];
		} );
	};

	/**
	 * Sets a step to not saved.
	 *
	 * @param {number} stepNumber The number of the step to unsave.
	 *
	 * @returns {void}
	 */
	const setStepIsNotSaved = ( stepNumber ) => {
		setSavedSteps( prevState => {
			return prevState.filter( step => step !== stepNumber );
		} );
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
	 * Returns a function that toggles a specific step (based on step name).
	 *
	 * @param {string} stepName The name of the step to toggle.
	 *
	 * @returns {func} A function that toggles a specific step.
	 */
	const makeStepToggle = ( stepName ) => () => toggleStep( "configuration", stepName );

	const toggleStepSiteRepresentation = makeStepToggle( steps.siteRepresentation );
	const toggleStepSocialProfiles = makeStepToggle( steps.socialProfiles );
	const toggleStepEnableTracking = makeStepToggle( steps.enableTracking );

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
		if ( isStep2Finished ) {
			setStepIsNotSaved( 2 );
			toggleStepSiteRepresentation();
		} else {
			if ( ! siteRepresentationEmpty &&
				state.companyOrPerson === "company" &&
				( ! state.companyName || ! state.companyLogo ) ) {
				setSiteRepresentationEmpty( true );
			} else if (  ! siteRepresentationEmpty &&
				state.companyOrPerson === "person" &&
				( ! state.personId || ! state.personLogo ) ) {
				setSiteRepresentationEmpty( true );
			} else {
				setSiteRepresentationEmpty( false );
				updateSiteRepresentation( state )
					.then( () => setStepIsSaved( 2 ) )
					.then( toggleStepSiteRepresentation );
				scrollToStep( 3 );
			}
		}
	}

	/**
	 * Runs checks of finishing the social profiles step.
	 *
	 * @returns {void}
	 */
	function updateOnFinishSocialProfiles() {
		if ( isStep3Finished ) {
			setStepIsNotSaved( 3 );
			toggleStepSocialProfiles();
		} else {
			updateSocialProfiles( state )
				.then( () => setStepIsSaved( 3 ) )
				.then( () => {
					setErrorFields( [] );
					toggleStepSocialProfiles();
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
	}

	/**
	 * Runs checks of finishing the enable tracking step.
	 *
	 * @returns {void}
	 */
	function updateOnFinishEnableTracking() {
		if ( isStep4Finished ) {
			setStepIsNotSaved( 4 );
			toggleStepEnableTracking();
		} else {
			updateTracking( state )
				.then( () => setStepIsSaved( 4 ) )
				.then( toggleStepEnableTracking );
			scrollToStep( 5 );
		}
	}

	const toggleConfigurationWorkout = useCallback(
		async() => {
			const stepsToFinish = [];

			if ( isWorkoutFinished ) {
				setSavedSteps( [] );
				reviseStep( "configuration", steps.siteRepresentation );
				reviseStep( "configuration", steps.socialProfiles );
				reviseStep( "configuration", steps.enableTracking );
				reviseStep( "configuration", steps.newsletterSignup );
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
							"https://yoa.st/config-workout-guide",
							"yoast-configuration-workout-guide-link"
						)
					}
				</i>
			</p>
			<hr />
			<p>
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
			<br />
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
						"https://yoa.st/config-workout-index-data",
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
					{ ! window.wpseoWorkoutsData.configuration.shouldForceCompany && ! isStep2Finished &&
					<SingleSelect
						id="organization-person-select"
						htmlFor="organization-person-select"
						name="organization"
						label={ __( "Does your site represent an Organization or Person?", "wordpress-seo" ) }
						selected={ state.companyOrPerson }
						onChange={ onOrganizationOrPersonChange }
						options={  window.wpseoWorkoutsData.configuration.companyOrPersonOptions }
					/> }
					{ (  window.wpseoWorkoutsData.configuration.shouldForceCompany || isStep2Finished ) &&
					<TextInput
						id="organization-forced-readonly-text"
						name="organization"
						label={ __( "Does you site represent an Organization or Person?", "wordpress-seo" ) }
						value={ state.companyOrPersonLabel }
						readOnly={ true }
					/> }
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
							isDisabled={ isStep2Finished }
						/>
					</Fragment> }
					{ state.companyOrPerson === "person" && <Fragment>
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
							isDisabled={ isStep2Finished }
						/>
					</Fragment> }
					<TextInput
						id="site-tagline-input"
						name="site-tagline"
						label={ __( "Site tagline", "wordpress-seo" ) }
						description={ sprintf( __( "Add a catchy tagline that describes your site in the best light. Use the keywords you want people to find your site with. Example: %1$s’s tagline is ‘SEO for everyone.’", "wordpress-seo" ), "Yoast" ) }
						value={ state.siteTagline }
						onChange={ onSiteTaglineChange }
						readOnly={ isStep2Finished }
					/>
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
						isSaved={ savedSteps.includes( 2 ) }
						hasDownArrow={ ! isStep2Finished }
						finishText={ isStep2Finished ? __( "Revise this step", "wordpress-seo" ) : __( "Save and continue", "wordpress-seo" ) }
						onFinishClick={ updateOnFinishSiteRepresentation }
						isFinished={ isStep2Finished }
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
						isDisabled={ isStep3Finished }
					/> }
					{ state.companyOrPerson === "person" && <div>
						<p>
							{
								createInterpolateElement(
									sprintf(
										__(
											// translators: %1$s and %2$s are replaced by opening and closing <b> tags, %3$s and %4$s are replaced by opening and closing anchor tags
											"%1$sNote%2$s: In this step, you need to add the personal social profiles of the person your site represents. To do that, you should go to the %3$sUsers%4$s > Profile page in a new browser tab.",
											"wordpress-seo"
										),
										"<b>",
										"</b>",
										"<a>",
										"</a>"
									),
									{
										b: <b />,
										// eslint-disable-next-line jsx-a11y/anchor-has-content
										a: <a id="yoast-configuration-workout-user-page-link-1" href={ window.wpseoWorkoutsData.usersPageUrl } target="_blank" rel="noopener noreferrer" />,
									}
								)
							}
						</p>
						<p>
							{
								addLinkToString(
									sprintf(
										__(
											// translators: %1$s and %2$s are replaced by opening and closing anchor tags.
											"On the %1$sUsers%2$s page, hover your mouse over the username you want to edit. Click ‘Edit’ to access the user’s profile. Then, scroll down to the ‘Contact info’ section and fill in the URLs of the personal social profiles you want to add.",
											"wordpress-seo"
										),
										"<a>",
										"</a>"
									),
									window.wpseoWorkoutsData.usersPageUrl,
									"yoast-configuration-workout-user-page-link-2"
								)
							}
						</p>
						<p>
							<b>{ __( "Screenshot:", "wordpress-seo" ) }</b>
							<img
								src={ window.wpseoWorkoutsData.pluginUrl + "/images/profile-social-fields.png" }
								alt={ __( "A screenshot of the Contact Info section of a user's Profile page", "wordpress-seo" ) }
							/>
						</p>
					</div>
					}
					<FinishButtonSection
						buttonId="yoast-configuration-workout-step-social-profiles-button"
						stepNumber={ 3 }
						isSaved={ savedSteps.includes( 3 ) }
						hasDownArrow={ ! isStep3Finished }
						finishText={ isStep3Finished ? __( "Revise this step", "wordpress-seo" ) : __( "Save and continue", "wordpress-seo" ) }
						onFinishClick={ updateOnFinishSocialProfiles }
						isFinished={ isStep3Finished }
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
						isSaved={ savedSteps.includes( 4 ) }
						hasDownArrow={ ! isStep4Finished }
						finishText={ isStep4Finished ? __( "Revise this step", "wordpress-seo" ) : __( "Save and continue", "wordpress-seo" ) }
						onFinishClick={ updateOnFinishEnableTracking }
						isFinished={ isStep4Finished }
						additionalButtonProps={ { disabled: ! isTrackingOptionSelected } }
					/>
				</Step>
				<Step
					id="yoast-configuration-workout-step-newsletter"
					title={ __( "Sign up for the Yoast newsletter!", "wordpress-seo" ) }
					isFinished={ isStep5Finished }
				>
					<NewsletterSignup />
				</Step>
				<FinishButtonSection
					buttonId="yoast-configuration-workout-finish-workout-button"
					finishText={ isWorkoutFinished ? __( "Do workout again", "wordpress-seo" ) : __( "Finish this workout", "wordpress-seo" ) }
					onFinishClick={ toggleConfigurationWorkout }
					isFinished={ isWorkoutFinished }
					additionalButtonProps={ { disabled: indexingState !== "completed" || ! isTrackingOptionSelected } }
				>
					{ indexingState !== "completed" && <Alert type="warning">
						{ indexingState === "idle" && __( "Before you finish this workout, please start the SEO data optimization in step 1 and wait until it is completed...", "wordpress-seo" ) }
						{ indexingState === "in_progress" && __( "Before you finish this workout, please wait on this page until the SEO data optimization in step 1 is completed...", "wordpress-seo" ) }
					</Alert> }
				</FinishButtonSection>
			</Steps>
			{ isWorkoutFinished && <div id="yoast-configuration-workout-congratulations">
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
	toggleStep: PropTypes.func.isRequired,
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
