import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { createInterpolateElement, useCallback, useReducer, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { cloneDeep } from "lodash";

import { NewButton as Button, RadioButtonGroup, SingleSelect, TextInput } from "@yoast/components";
import { ReactComponent as WorkoutImage } from "../../../images/motivated_bubble_woman_1_optim.svg";
import { addLinkToString } from "../../helpers/stringHelpers.js";
import { Step, Steps } from "./Steps";
import Indexation from "../../components/Indexation";
import { STEPS, WORKOUTS } from "../config";
import { OrganizationSection } from "./OrganizationSection";
import { PersonSection } from "./PersonSection";
import { SocialInput } from "./SocialInput";
import PropTypes from "prop-types";

window.wpseoScriptData = window.wpseoScriptData || {};
window.wpseoScriptData.searchAppearance = {
	...window.wpseoScriptData.searchAppearance,
	userEditUrl: "/wp-admin/user-edit.php?user_id={user_id}",
};

/**
 * A function to request a sign up to the newsletter.
 *
 * @param {string} email The email to signup to the newsletter.
 *
 * @returns {Object} The request's response.
 */
async function postSignUp( email ) {
	const response = await fetch( "https://my.yoast.com/api/Mailing-list/subscribe", {
		method: "POST",
		mode: "cors",
		cache: "no-cache",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json",
		},
		redirect: "follow",
		referrerPolicy: "no-referrer",
		body: JSON.stringify(
			{
				customerDetails: {
					firstName: "",
					email,
				},
				list: "Yoast newsletter",
			}
		),
	} );
	return response.json();
}

/**
 * The newsletter signup section.
 *
 * @returns {WPElement} A newslettersignup element.
 */
function NewsletterSignup() {
	const [ newsletterEmail, setNewsletterEmail ] = useState( "" );
	const [ signUpState, setSignUpState ] = useState( "ready" );

	const onSignUpClick = useCallback(
		async function() {
			setSignUpState( "loading" );
			await postSignUp( newsletterEmail );
			setSignUpState( "ready" );
		},
		[ newsletterEmail ]
	);

	return (
		<>
			<ul className="yoast-list--usp">
				<li>{ __( "Receive best-practice tips and learn how to rank on search engines", "wordpress-seo" ) }</li>
				<li>{ __( "Stay up-to-date with the latest SEO news", "wordpress-seo" ) }</li>
				<li>{ __( "Get guidance on how to use Yoast SEO to the fullest", "wordpress-seo" ) }</li>
			</ul>
			<div className="yoast-newsletter-signup">
				<TextInput
					label={ __( "Email address", "wordpress-seo" ) }
					id="newsletter-email"
					name="newsletter email"
					value={ newsletterEmail }
					onChange={ setNewsletterEmail }
					type="email"
				/>
				<Button
					variant="primary"
					onClick={ onSignUpClick }
					disabled={ signUpState === "loading" }
				>
					{ __( "Sign up!", "wordpress-seo" ) }
				</Button>
			</div>
			<p className="yoast-privacy-policy">
				{
					addLinkToString(
						sprintf(
							// translators: %1$s and %2$s are replaced by opening and closing anchor tags.
							__(
								"Yoast respects your privacy. Read %1$sour privacy policy%2$s on how we handle your personal information.",
								"wordpress-seo"
							),
							"<a>",
							"</a>"
						),
						"https://yoast.com"
					)
				}
			</p>
		</>
	);
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
	const newState = cloneDeep( state );
	switch ( action.type ) {
		case "SET_COMPANY_OR_PERSON":
			newState.companyOrPerson = action.payload;
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
/* eslint-enable complexity */

/**
 * The configuration workout.
 *
 * @param {function}  toggleStep                The function to toggle the step state.
 * @param {function}  toggleWorkout             The function to toggle the workout state.
 * @param {function}  isStepFinished            The function to check whether a step is finished.
 * @param {string}    seoDataOptimizationNeeded The flag signaling if SEO optimization is needed.
 * @returns {WPElement} The ConfigurationWorkout component.
 */
export function ConfigurationWorkout( { toggleStep, toggleWorkout, isStepFinished, seoDataOptimizationNeeded } ) {
	const [ state, dispatch ] = useReducer( configurationWorkoutReducer, window.wpseoWorkoutsData.configuration );

	const setTracking = useCallback( ( value ) => {
		dispatch( { type: "SET_TRACKING", payload: parseInt( value, 10 ) } );
	} );

	const steps = STEPS.configuration;
	const onFinishOptimizeSeoData = useCallback(
		toggleStep.bind( null, "configuration", steps.optimizeSeoData ),
		[ toggleStep, steps.optimizeSeoData ]
	);
	const onFinishSiteRepresentation = useCallback(
		toggleStep.bind( null, "configuration", steps.siteRepresentation ),
		[ toggleStep, steps.siteRepresentation ]
	);
	const onFinishSocialProfiles = useCallback(
		toggleStep.bind( null, "configuration", steps.socialProfiles ),
		[ toggleStep, steps.socialProfiles ]
	);
	const onFinishEnableTracking = useCallback(
		toggleStep.bind( null, "configuration", steps.enableTracking ),
		[ toggleStep, steps.enableTracking ]
	);
	const toggleConfigurationWorkout = useCallback(
		toggleWorkout.bind( null, "configuration" ),
		[ toggleWorkout ]
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
		<div className="card">
			<h2>{ __( "Configuration", "wordpress-seo" ) }</h2>
			<h3>{ __( "Configure Yoast SEO with optimal SEO settings for your site", "wordpress-seo" ) }</h3>
			{ seoDataOptimizationNeeded === "1" && <div>seoDataoptimization alert</div> }
			<p>
				{
					__(
						"This workout will guide you through the most important steps you need to take to configure the Yoast SEO plugin on your site.",
						"wordpress-seo"
					)
				}
			</p>
			<p>
				<i>
					{
						addLinkToString(
							sprintf(
								__(
									// translators: %1$s and %2$s are replaced by opening and closing anchor tags.
									"Need more guidance? We've covered every step in more detail in the %1$sYoast SEO configuration workout guide.%2$s",
									"wordpress-seo"
								),
								"<a>",
								"</a>"
							),
							"https://yoast.com"
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
			<Steps>
				<Step
					hasDownArrow={ true }
					title={ __( "Optimize SEO data", "wordpress-seo" ) }
					subtitle={ addLinkToString(
						sprintf(
							__(
								"Speed up your site and get internal linking insights by clicking the button below! It will let us optimize how your SEO data is stored. Do you have a lot of content? " +
								"Then the optimization might take a while. But trust us, it's worth it. %1$sLearn more about the benefits of optimized SEO data.%2$s",
								"wordpress-seo"
							),
							"<a>",
							"</a>"
						),
						"https://yoast.com"
					) }
					ImageComponent={ WorkoutImage }
					finishText={ __( "Continue", "wordpress-seo" ) }
					onFinishClick={ onFinishOptimizeSeoData }
					isFinished={ isStepFinished( "configuration", steps.optimizeSeoData ) }
				>
					<div className="indexation-container">
						<Indexation />
					</div>
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
					hasDownArrow={ true }
					title={ __( "Site representation", "wordpress-seo" ) }
					subtitle={ __( "Tell Google what kind of site you have. Select ‘Organization’ if you are working on a site for a business or an organization. Select ‘Person’ if you have, say, a personal blog.", "wordpress-seo" ) }
					finishText={ __( "Continue and save", "wordpress-seo" ) }
					onFinishClick={ onFinishSiteRepresentation }
					isFinished={ isStepFinished( "configuration", steps.siteRepresentation ) }
				>
					<SingleSelect
						id="organization-person-select"
						htmlFor="organization-person-select"
						name="organization"
						label={ __( "Does you site represent an Organization or Person?", "wordpress-seo" ) }
						selected={ state.companyOrPerson }
						onChange={ onOrganizationOrPersonChange }
						options={ [ {
							name: "Organization",
							value: "company",
						},
						{
							name: "Person",
							value: "person",
						} ] }
						readOnly={ isStepFinished( "configuration", steps.siteRepresentation ) }

					/>
					{ state.companyOrPerson === "company" && <OrganizationSection
						dispatch={ dispatch }
						imageUrl={ state.companyLogo }
						organizationName={ state.companyName }
						isDisabled={ isStepFinished( "configuration", steps.siteRepresentation ) }
					/> }
					{ state.companyOrPerson === "person" && <PersonSection
						dispatch={ dispatch }
						imageUrl={ state.personLogo }
						personId={ state.personId }
						isDisabled={ isStepFinished( "configuration", steps.siteRepresentation ) }
					/> }
					<TextInput
						id="site-tagline-input"
						name="site-tagline"
						label={ __( "Site tagline", "wordpress-seo" ) }
						// translators: %1$s expands to Yoast
						description={ sprintf( __( "Add a catchy tagline that describes your site in the best light. Use the keywords you want people to find your site with. Example: %1$s’s tagline is ‘SEO for everyone.’", "wordpress-seo" ), "Yoast" ) }
						value={ state.siteTagline }
						onChange={ onSiteTaglineChange }
						readOnly={ isStepFinished( "configuration", steps.siteRepresentation ) }
					/>
				</Step>
				<Step
					hasDownArrow={ true }
					title={ __( "Social profiles", "wordpress-seo" ) }
					subtitle={ __( "Do you have profiles for your site on social media? Then, add all of their URLs here.", "wordpress-seo" ) }
					finishText={ "Save and continue" }
					onFinishClick={ onFinishSocialProfiles }
					isFinished={ isStepFinished( "configuration", steps.socialProfiles ) }
				>
					<div className="yoast-social-profiles-input-fields">
						<SocialInput
							label={ __( "Facebook URL", "wordpress-seo" ) }
							value={ state.socialProfiles.facebookUrl }
							socialMedium="facebookUrl"
							dispatch={ dispatch }
							isDisabled={ isStepFinished( "configuration", steps.socialProfiles ) }
						/>
						<SocialInput
							label={ __( "Twitter URL", "wordpress-seo" ) }
							value={ state.socialProfiles.twitterUsername }
							socialMedium="twitterUsername"
							dispatch={ dispatch }
							isDisabled={ isStepFinished( "configuration", steps.socialProfiles ) }
						/>
						<SocialInput
							label={ __( "Instagram URL", "wordpress-seo" ) }
							value={ state.socialProfiles.instagramUrl }
							socialMedium="instagramUrl"
							dispatch={ dispatch }
							isDisabled={ isStepFinished( "configuration", steps.socialProfiles ) }
						/>
						<SocialInput
							label={ __( "LinkedIn URL", "wordpress-seo" ) }
							value={ state.socialProfiles.linkedinUrl }
							socialMedium="linkedinUrl"
							dispatch={ dispatch }
							isDisabled={ isStepFinished( "configuration", steps.socialProfiles ) }
						/>
						<SocialInput
							label={ __( "MySpace URL", "wordpress-seo" ) }
							value={ state.socialProfiles.myspaceUrl }
							socialMedium="myspaceUrl"
							dispatch={ dispatch }
							isDisabled={ isStepFinished( "configuration", steps.socialProfiles ) }
						/>
						<SocialInput
							label={ __( "Pinterest URL", "wordpress-seo" ) }
							value={ state.socialProfiles.pinterestUrl }
							socialMedium="pinterestUrl"
							dispatch={ dispatch }
							isDisabled={ isStepFinished( "configuration", steps.socialProfiles ) }
						/>
						<SocialInput
							label={ __( "YouTube URL", "wordpress-seo" ) }
							value={ state.socialProfiles.youtubeUrl }
							socialMedium="youtubeUrl"
							dispatch={ dispatch }
							isDisabled={ isStepFinished( "configuration", steps.socialProfiles ) }
						/>
						<SocialInput
							label={ __( "Wikipedia URL", "wordpress-seo" ) }
							value={ state.socialProfiles.wikipediaUrl }
							socialMedium="wikipediaUrl"
							dispatch={ dispatch }
							isDisabled={ isStepFinished( "configuration", steps.socialProfiles ) }
						/>
					</div>
				</Step>
				<Step
					hasDownArrow={ true }
					title={ __( "Help us improve Yoast SEO", "wordpress-seo" ) }
					finishText={ "Save and continue" }
					onFinishClick={ onFinishEnableTracking }
					isFinished={ isStepFinished( "configuration", steps.enableTracking ) }
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
						label={ __( "Can we collect anonymous information about your website and how you use it?", "wordpress-seo" ) }
						groupName="yoast-configuration-workout-tracking"
						selected={ state.tracking }
						onChange={ setTracking }
						vertical={ true }
						options={ [
							{
								value: 0,
								label: __( "No, I don’t want to allow you to track my site data", "wordpress-seo" ),
							},
							{
								value: 1,
								label: __( "Yes, you can track my site data", "wordpress-seo" ),
							},
						] }
					/>
					<i> {
						__( "Important: We will never sell this data. And of course, as always, we won't collect any personal data about you or your visitors!", "wordpress-seo" )
					} </i>
				</Step>
				<Step
					title={ __( "Sign up for the Yoast newsletter!", "wordpress-seo" ) }
					finishText={ "Finish this workout" }
					onFinishClick={ toggleConfigurationWorkout }
					isFinished={ isStepFinished( "configuration", steps.newsletterSignup ) }
				>
					<NewsletterSignup />
				</Step>
			</Steps>
		</div>
		/* eslint-enable max-len */
	);
}

ConfigurationWorkout.propTypes = {
	toggleStep: PropTypes.func.isRequired,
	toggleWorkout: PropTypes.func.isRequired,
	isStepFinished: PropTypes.func.isRequired,
	seoDataOptimizationNeeded: PropTypes.string,
};

ConfigurationWorkout.defaultProps = {
	seoDataOptimizationNeeded: "1",
};

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
					toggleWorkout,
					moveIndexables,
				} = dispatch( "yoast-seo/workouts" );

				return {
					toggleStep,
					toggleWorkout,
					moveIndexables,
				};
			}
		),
	]
)( ConfigurationWorkout );
