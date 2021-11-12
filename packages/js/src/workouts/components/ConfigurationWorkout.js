import { createInterpolateElement, useState, useReducer, useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { cloneDeep } from "lodash";

import { NewButton as Button, TextInput, ImageSelect, SingleSelect, RadioButtonGroup } from "@yoast/components";
import { ReactComponent as WorkoutImage } from "../../../images/motivated_bubble_woman_1_optim.svg";
import { addLinkToString } from "../../helpers/stringHelpers.js";
import { openMedia } from "../../helpers/selectMedia.js";
import { Step, Steps } from "./Steps";
import Indexation from "../../components/Indexation";
import WordPressUserSelectorSearchAppearance from "../../components/WordPressUserSelectorSearchAppearance";

window.yoastIndexingData = {};
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
 * @param {object} props        The props object.
 * @param {bool} props.signedUp Whether or not the user has signed up.
 *
 * @returns {WPElement} A newslettersignup element.
 */
function NewsletterSignup() {
	const [ newsletterEmail, setNewsletterEmail ] = useState( "" );
	const [ signUpState, setSignUpState ] = useState( "ready" );

	const onSignUpClick = useCallback(
		async () => {
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
 * The Organization section.
 *
 * @returns {WPElement} The organization section.
 */
function OrganizationSection( { dispatch, imageUrl } ) {
	const [ organizationName, setOrganizationName ] = useState( "" );
	const openImageSelect = useCallback( () => {
		openMedia( ( selectedImage ) => {
			dispatch( { type: "SET_COMPANY_LOGO", payload: { ...selectedImage } } );
		} );
	}, [ openMedia ] );

	const removeImage = useCallback( () => {
		dispatch( { type: "REMOVE_COMPANY_LOGO" } );
	} );

	return (
		<>
			<TextInput
				id="organization-name-input"
				name="organization-name"
				label={ __( "Organization name", "wordpress-seo" ) }
				value={ organizationName }
				onChange={ setOrganizationName }
			/>
			<ImageSelect
				imageUrl={ imageUrl }
				onClick={ openImageSelect }
				onRemoveImageClick={ removeImage }
				imageAltText=""
				hasPreview={ true }
				label={ __( "Organization logo", "wordpress-seo" ) }
			/>
		</>
	);
}

/**
 * The Person section.
 * @returns {WPElement} The person section.
 */
function PersonSection( { dispatch, imageUrl } ) {
	const openImageSelect = useCallback( () => {
		openMedia( ( selectedImage ) => {
			dispatch( { type: "SET_PERSON_LOGO", payload: { ...selectedImage } } );
		} );
	}, [ openMedia ] );

	const removeImage = useCallback( () => {
		dispatch( { type: "REMOVE_PERSON_LOGO" } );
	} );
	return (
		<>
			<WordPressUserSelectorSearchAppearance />
			<ImageSelect
				imageUrl={ imageUrl }
				onClick={ openImageSelect }
				onRemoveImageClick={ removeImage }
				imageAltText=""
				hasPreview={ true }
				label={ __( "Person logo / avatar *", "wordpress-seo" ) }
			/>
		</>
	);
}

/**
 * A wrapped TextInput for the social inputs
 *
 * @param {Object} dispatch The props for the SocialInput.
 *
 * @returns {WPElement} A wrapped TextInput for the social inputs.
 */
function SocialInput( { dispatch, socialMedium, ...restProps } ) {
	const onChangeHandler = useCallback(
		( newValue ) => dispatch( { type: "CHANGE_SOCIAL_PROFILE", payload: { socialMedium, value: newValue } } ),
		[ socialMedium ]
	);

	return <TextInput
		onChange={ onChangeHandler }
		{ ...restProps }
	/>;
}

/**
 * The configuration workout.
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The ConfigurationWorkout compoinent.
 */
export default function ConfigurationWorkout( { seoDataOptimizationNeeded = "1", isStepFinished = () => {} } ) {
	const [ state, dispatch ] = useReducer( configurationWorkoutReducer, window.wpseoWorkoutsData.configuration );

	const setTracking = useCallback( ( value ) => {
		dispatch( { type: "SET_TRACKING", payload: parseInt( value, 10 ) } );
	} );

	/* eslint-disable max-len */
	return (
		<div className="card">
			<input id="person_id" value={ state.personId } style={ { display: "none" } } readOnly={ true } />
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
					onFinishClick={ () => { console.log( "you clicked continue" ); } }
					isFinished={ isStepFinished( "configuration", "one" ) }
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
					onFinishClick={ () => { console.log( "you clicked continue" ); } }
					isFinished={ isStepFinished( "configuration", "one" ) }
				>
					<SingleSelect
						id="organization-person-select"
						htmlFor="organization-person-select"
						name="organization"
						label={ __( "Does you site represent an Organization or Person?", "wordpress-seo" ) }
						selected={ state.companyOrPerson }
						onChange={ ( value ) => dispatch( { type: "SET_COMPANY_OR_PERSON", payload: value } ) }
						options={ [ {
							name: "Organization",
							value: "company",
						},
						{
							name: "Person",
							value: "person",
						} ] }
					/>
					{ state.companyOrPerson === "company" && <OrganizationSection dispatch={ dispatch } imageUrl={ state.companyLogo } /> }
					{ state.companyOrPerson === "person" && <PersonSection dispatch={ dispatch } imageUrl={ state.personLogo } /> }
					<TextInput
						id="site-tagline-input"
						name="site-tagline"
						label={ __( "Site tagline", "wordpress-seo" ) }
						// translators: %1$s expands to Yoast
						description={ sprintf( __( "Add a catchy tagline that describes your site in the best light. Use the keywords you want people to find your site with. Example: %1$s’s tagline is ‘SEO for everyone.’", "wordpress-seo" ), "Yoast" ) }
						value={ state.siteTagline }
						onChange={ ( value ) => dispatch( { type: "CHANGE_SITE_TAGLINE", payload: value } ) }
					/>
				</Step>
				<Step
					hasDownArrow={ true }
					title={ __( "Social profiles", "wordpress-seo" ) }
					subtitle={ __( "Do you have profiles for your site on social media? Then, add all of their URLs here.", "wordpress-seo" ) }
					finishText={ "Save and continue" }
					onFinishClick={ () => { console.log( "Social profiles finished" ); } }
					isFinished={ isStepFinished( "configuration", "social-profiles" ) }
				>
					<div className="yoast-social-profiles-input-fields">
						<SocialInput
							label={ __( "Facebook URL", "wordpress-seo" ) }
							value={ state.socialProfiles.facebookUrl }
							socialMedium="facebookUrl"
							dispatch={ dispatch }
						/>
						<SocialInput
							label={ __( "Twitter URL", "wordpress-seo" ) }
							value={ state.socialProfiles.twitterUsername }
							socialMedium="twitterUsername"
							dispatch={ dispatch }
						/>
						<SocialInput
							label={ __( "Instagram URL", "wordpress-seo" ) }
							value={ state.socialProfiles.instagramUrl }
							socialMedium="instagramUrl"
							dispatch={ dispatch }
						/>
						<SocialInput
							label={ __( "LinkedIn URL", "wordpress-seo" ) }
							value={ state.socialProfiles.linkedinUrl }
							socialMedium="linkedinUrl"
							dispatch={ dispatch }
						/>
						<SocialInput
							label={ __( "MySpace URL", "wordpress-seo" ) }
							value={ state.socialProfiles.myspaceUrl }
							socialMedium="myspaceUrl"
							dispatch={ dispatch }
						/>
						<SocialInput
							label={ __( "Pinterest URL", "wordpress-seo" ) }
							value={ state.socialProfiles.pinterestUrl }
							socialMedium="pinterestUrl"
							dispatch={ dispatch }
						/>
						<SocialInput
							label={ __( "YouTube URL", "wordpress-seo" ) }
							value={ state.socialProfiles.youtubeUrl }
							socialMedium="youtubeUrl"
							dispatch={ dispatch }
						/>
						<SocialInput
							label={ __( "Wikipedia URL", "wordpress-seo" ) }
							value={ state.socialProfiles.wikipediaUrl }
							socialMedium="wikipediaUrl"
							dispatch={ dispatch }
						/>
					</div>
				</Step>
				<Step
					hasDownArrow={ true }
					title={ __( "Help us improve Yoast SEO", "wordpress-seo" ) }
					finishText={ "Save and continue" }
					onFinishClick={ () => { console.log( "Tracking finished" ); } }
					isFinished={ isStepFinished( "configuration", "tracking" ) }
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
					onFinishClick={ () => { console.log( "Sign up finished" ); } }
					isFinished={ isStepFinished( "configuration", "newsletter-signup" ) }
				>
					<NewsletterSignup />
				</Step>
			</Steps>
		</div>
		/* eslint-enable max-len */
	);
}
