import { createInterpolateElement, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";

import { TextInput, ImageSelect, SingleSelect } from "@yoast/components";
import { ReactComponent as WorkoutImage } from "../../../images/motivated_bubble_woman_1_optim.svg";
import { addLinkToString } from "../../helpers/stringHelpers.js";
import { Step, Steps } from "./Steps";
import Indexation from "../../components/Indexation";
import WordPressUserSelectorSearchAppearance from "../../components/WordPressUserSelectorSearchAppearance";

// TEMPORARY
window.yoastIndexingData = {};
window.wpseoScriptData = window.wpseoScriptData || {};
window.wpseoScriptData.searchAppearance = {
	...window.wpseoScriptData.searchAppearance,
	userEditUrl: "/wp-admin/user-edit.php?user_id={user_id}",
};
window.wpseoWorkoutsData = {
	configuration: {
		isCompany: 1,
		companyName: "",
		companyLogo: "",
		companyLogoId: "",
		personId: 1,
		personLogo: "",
		personLogoId: 1,
		siteTagline: "",
		socialProfiles: {
			facebookUrl: "facebook",
			twitterUsername: "twitter",
			instagramUrl: "instagram",
			linkedinUrl: "linkedin",
			myspaceUrl: "myspace",
			pinterestUrl: "pinterest",
			youtubeUrl: "youtube",
			wikipediaUrl: "wikipedia",
		},
		tracking: 1,
	},
};
// END TEMPORARY

const {
	configuration: {
		// isCompany: isCompany,
		// companyName: companyName,
		// companyLogo: companyLogo,
		// companyLogoId: companyLogoId,
		// personId: personId,
		// personLogo: personLogo,
		// personLogoId: personLogoId,
		// siteTagline: siteTagline,
		socialProfiles: {
			facebookUrl: facebookUrl,
			twitterUsername: twitterUsername,
			instagramUrl: instagramUrl,
			linkedinUrl: linkedinUrl,
			myspaceUrl: myspaceUrl,
			pinterestUrl: pinterestUrl,
			youtubeUrl: youtubeUrl,
			wikipediaUrl: wikipediaUrl,
		},
		// tracking: trackingOn,
	},
} = window.wpseoWorkoutsData;

/**
 * The Organization section.
 * @returns {WPElement} The organization section.
 */
function OrganizationSection() {
	const [ organizationName, setOrganizationName ] = useState( "" );

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
function PersonSection() {
	return (
		<>
			<WordPressUserSelectorSearchAppearance />
			<ImageSelect
				imageAltText=""
				hasPreview={ true }
				label={ __( "Person logo / avatar *", "wordpress-seo" ) }
			/>
		</>
	);
}

/**
 * The configuration workout.
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The ConfigurationWorkout compoinent.
 */
export default function ConfigurationWorkout( { seoDataOptimizationNeeded = "1", isStepFinished = () => {} } ) {
	const [ organizationOrPerson, setOrganizationOrPerson ] = useState( "organization" );
	const [ siteTagline, setSiteTagline ] = useState( "SEO for everyone" );

	const SiteRepresentationSection = organizationOrPerson === "organization" ? OrganizationSection : PersonSection;
	/* eslint-disable max-len */
	return (
		<div className="card">
			<h2>{ __( "Configuration", "wordpress-seo" ) }</h2>
			<h3>{ __( "Configure Yoast SEO with optimal SEO settings for your site", "wordpress-seo" ) }</h3>
			{ seoDataOptimizationNeeded === "1" && <div>seoDataoptimization alert</div> }
			<input id="person_id" value={ 1 } style={ { display: "none" } } readOnly={ true } />
			<p>
				{
					__(
						"This workout will guide you through the most important steps you need to take to configure the Yoast SEO plugin on your site.",
						"wordpress-seo"
					)
				}
			</p>
			<p>
				<em>
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
				</em>
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
					finishText={ __( "Continue", "wordpress-seo" ) }
					onFinishClick={ () => { console.log( "you clicked continue" ); } }
					isFinished={ isStepFinished( "configuration", "one" ) }
				>
					<WorkoutImage
						className="workflow__image"
						style={ { "float": "right", "height": "24px", "width": "24px" } }
					/>
					<Indexation />
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
						selected={ organizationOrPerson }
						onChange={ setOrganizationOrPerson }
						options={ [ {
							name: "Organization",
							value: "organization",
						},
						{
							name: "Person",
							value: "person",
						} ] }
					/>
					<SiteRepresentationSection />
					<TextInput
						id="site-tagline-input"
						name="site-tagline"
						label={ __( "Site tagline", "wordpress-seo" ) }
						// translators: %1$s expands to Yoast
						description={ sprintf( __( "Add a catchy tagline that describes your site in the best light. Use the keywords you want people to find your site with. Example: %1$s’s tagline is ‘SEO for everyone.’", "wordpress-seo" ), "Yoast" ) }
						value={ siteTagline }
						onChange={ setSiteTagline }
					/>
				</Step>
				<Step
					title={ __( "Social profiles", "wordpress-seo" ) }
					subtitle={ __( "Do you have profiles for your site on social media? Then, add all of their URLs here.", "wordpress-seo" ) }
					finishText={ "Save and continue" }
					onFinishClick={ () => { console.log( "Social profiles finished" ); } }
					isFinished={ isStepFinished( "configuration", "social-profiles" ) }
				>
					<div className="yoast-social-profiles-input-fields">
						<TextInput
							label={ __( "Facebook URL", "wordpress-seo" ) }
							value={ facebookUrl }
						/>
						<TextInput
							label={ __( "Twitter URL", "wordpress-seo" ) }
							value={ twitterUsername }
						/>
						<TextInput
							label={ __( "Instagram URL", "wordpress-seo" ) }
							value={ instagramUrl }
						/>
						<TextInput
							label={ __( "LinkedIn URL", "wordpress-seo" ) }
							value={ linkedinUrl }
						/>
						<TextInput
							label={ __( "MySpace URL", "wordpress-seo" ) }
							value={ myspaceUrl }
						/>
						<TextInput
							label={ __( "Pinterest URL", "wordpress-seo" ) }
							value={ pinterestUrl }
						/>
						<TextInput
							label={ __( "YouTube URL", "wordpress-seo" ) }
							value={ youtubeUrl }
						/>
						<TextInput
							label={ __( "Wikipedia URL", "wordpress-seo" ) }
							value={ wikipediaUrl }
						/>
					</div>
				</Step>
				<Step />
			</Steps>
		</div>
		/* eslint-enable max-len */
	);
}
