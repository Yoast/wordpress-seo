import { Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { createInterpolateElement, useEffect } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Button, Radio, RadioGroup, TextField, usePrevious } from "@yoast/ui-library";
import { Field, FieldArray, useFormikContext } from "formik";
import { isEmpty } from "lodash";
import { addLinkToString } from "../../helpers/stringHelpers";
import {
	FieldsetLayout,
	FormikMediaSelectField,
	FormikUserSelectField,
	FormikValueChangeField,
	FormikWithErrorField,
	FormLayout,
} from "../components";
import { fetchUserSocialProfiles } from "../helpers";
import { withFormikError } from "../hocs";
import { useDispatchSettings, useSelectSettings } from "../hooks";

const TWITTER_URL_REGEXP = /^https?:\/\/(?:www\.)?twitter\.com\/(?<handle>[A-Za-z0-9_]{1,25})\/?$/;

/**
 * Transforms the handle of the Twitter URL.
 *
 * If the value is a Twitter URL, e.g. `https://www.twitter.com/foo`.
 * Then this function will return `foo`.
 * Otherwise, the original value will be returned.
 *
 * @param {Object} event The change event.
 * @returns {string} The original value or the handle.
 */
const transformTwitterUrl = event => {
	const match = event.target.value.match( TWITTER_URL_REGEXP );
	return match?.groups?.handle ? match.groups.handle : event.target.value;
};

const FormikValueChangeWithErrorField = withFormikError( FormikValueChangeField );

/**
 * @returns {JSX.Element} The person social profiles form.
 */
const PersonSocialProfiles = () => {
	const { addNotification } = useDispatchSettings();
	const { values, status, setStatus, setFieldValue } = useFormikContext();
	const { company_or_person_user_id: userId } = values.wpseo_titles;
	const previousUserId = usePrevious( userId );

	useEffect( () => {
		if ( previousUserId === userId || userId < 1 ) {
			return;
		}

		setStatus( { ...status, isFetchingPersonSocialProfiles: true } );
		fetchUserSocialProfiles( userId )
			.then( socialProfiles => {
				setFieldValue( "person_social_profiles", socialProfiles );
			} )
			.catch( error => {
				addNotification( {
					id: "social-profiles-error",
					variant: "error",
					title: __( "Oops! Something went wrong while retrieving the user social profiles.", "wordpress-seo" ),
				} );
				console.error( "Error while fetching the social profiles:", error.message );
			} )
			.finally( () => {
				setStatus( { ...status, isFetchingPersonSocialProfiles: false } );
			} );
	}, [ previousUserId, userId, setFieldValue, setStatus, addNotification ] );

	return (
		<FieldsetLayout
			title={ __( "Other profiles", "wordpress-seo" ) }
			description={ __( "Tell us about the other profiles on the web that belong to the person.", "wordpress-seo" ) }
		>
			<FormikWithErrorField
				as={ TextField }
				name="person_social_profiles.facebook"
				id="input-person_social_profiles-facebook"
				label={ __( "Facebook", "wordpress-seo" ) }
				placeholder={ __( "E.g. https://facebook.com/yoast", "wordpress-seo" ) }
			/>
			<FormikWithErrorField
				as={ TextField }
				name="person_social_profiles.instagram"
				id="input-person_social_profiles-instagram"
				label={ __( "Instagram", "wordpress-seo" ) }
				placeholder={ __( "E.g. https://instagram.com/yoast", "wordpress-seo" ) }
			/>
			<FormikWithErrorField
				as={ TextField }
				name="person_social_profiles.linkedin"
				id="input-person_social_profiles-linkedin"
				label={ __( "LinkedIn", "wordpress-seo" ) }
				placeholder={ __( "E.g. https://linkedin.com/yoast", "wordpress-seo" ) }
			/>
			<FormikWithErrorField
				as={ TextField }
				name="person_social_profiles.myspace"
				id="input-person_social_profiles-myspace"
				label={ __( "MySpace", "wordpress-seo" ) }
				placeholder={ __( "E.g. https://myspace.com/yoast", "wordpress-seo" ) }
			/>
			<FormikWithErrorField
				as={ TextField }
				name="person_social_profiles.pinterest"
				id="input-person_social_profiles-pinterest"
				label={ __( "Pinterest", "wordpress-seo" ) }
				placeholder={ __( "E.g. https://pinterest.com/yoast", "wordpress-seo" ) }
			/>
			<FormikWithErrorField
				as={ TextField }
				name="person_social_profiles.soundcloud"
				id="input-person_social_profiles-soundcloud"
				label={ __( "SoundCloud", "wordpress-seo" ) }
				placeholder={ __( "E.g. https://soundcloud.com/yoast", "wordpress-seo" ) }
			/>
			<FormikWithErrorField
				as={ TextField }
				name="person_social_profiles.tumblr"
				id="input-person_social_profiles-tumblr"
				label={ __( "Tumblr", "wordpress-seo" ) }
				placeholder={ __( "E.g. https://tumblr.com/yoast", "wordpress-seo" ) }
			/>
			<FormikValueChangeWithErrorField
				as={ TextField }
				name="person_social_profiles.twitter"
				id="input-person_social_profiles-twitter"
				label={ __( "Twitter", "wordpress-seo" ) }
				placeholder={ __( "E.g. https://twitter.com/yoast", "wordpress-seo" ) }
				transformValue={ transformTwitterUrl }
			/>
			<FormikWithErrorField
				as={ TextField }
				name="person_social_profiles.youtube"
				id="input-person_social_profiles-youtube"
				label={ __( "YouTube", "wordpress-seo" ) }
				placeholder={ __( "E.g. https://youtube.com/yoast", "wordpress-seo" ) }
			/>
			<FormikWithErrorField
				as={ TextField }
				name="person_social_profiles.wikipedia"
				id="input-person_social_profiles-wikipedia"
				label={ __( "Wikipedia", "wordpress-seo" ) }
				placeholder={ __( "E.g. https://wikipedia.com/yoast", "wordpress-seo" ) }
			/>
		</FieldsetLayout>
	);
};

/**
 * @returns {JSX.Element} The site representation route.
 */
const SiteRepresentation = () => {
	const { values } = useFormikContext();
	const { blogname } = values;
	// eslint-disable-next-line camelcase
	const {
		company_or_person: companyOrPerson,
		company_or_person_user_id: companyOrPersonId,
		company_name: companyName,
		company_logo_id: companyLogoId,
	} = values.wpseo_titles;
	const { other_social_urls: otherSocialUrls } = values.wpseo_social;

	const personUser = useSelectSettings( "selectUserById", [ companyOrPersonId ], companyOrPersonId );
	const googleKnowledgeGraphLink = useSelectSettings( "selectLink", [], "https://yoa.st/1-p" );
	const structuredDataLink = useSelectSettings( "selectLink", [], "https://yoa.st/3r3" );
	const editUserUrl = useSelectSettings( "selectPreference", [], "editUserUrl" );
	const isLocalSeoActive = useSelectSettings( "selectPreference", [], "isLocalSeoActive" );
	const companyOrPersonMessage = useSelectSettings( "selectPreference", [], "companyOrPersonMessage" );
	const siteLogoId = useSelectSettings( "selectFallback", [], "siteLogoId" );

	return (
		<FormLayout
			title={ __( "Site representation", "wordpress-seo" ) }
			description={ addLinkToString(
				sprintf(
					// translators: %1$s and %2$s are replaced by opening and closing <a> tags.
					__( "This info is intended to appear in %1$sGoogle's Knowledge Graph%2$s. You can be either an organization, or a person.", "wordpress-seo" ),
					"<a>",
					"</a>"
				),
				googleKnowledgeGraphLink,
				"link-google-knowledge-graph"
			) }
		>
			<FieldsetLayout
				title={ __( "Person/organization", "wordpress-seo" ) }
				description={ __( "Choose whether your site represents an organization or a person.", "wordpress-seo" ) }
			>
				{ isLocalSeoActive && (
					<Alert id="alert-local-seo-company-or-person" variant="info">
						{ companyOrPersonMessage }
					</Alert>
				) }
				<RadioGroup disabled={ isLocalSeoActive }>
					<Field
						as={ Radio }
						type="radio"
						name="wpseo_titles.company_or_person"
						id="input-wpseo_titles-company_or_person-company"
						label={ __( "Organization", "wordpress-seo" ) }
						value="company"
						disabled={ isLocalSeoActive }
					/>
					<Field
						as={ Radio }
						type="radio"
						name="wpseo_titles.company_or_person"
						id="input-wpseo_titles-company_or_person-person"
						label={ __( "Person", "wordpress-seo" ) }
						value="person"
						disabled={ isLocalSeoActive }
					/>
				</RadioGroup>
			</FieldsetLayout>
			<section className="yst-space-y-8" />
			<hr className="yst-my-8" />
			<div className="yst-relative">
				<Transition
					show={ companyOrPerson === "company" }
					enter="yst-transition yst-ease-out yst-duration-300 yst-delay-300"
					enterFrom="yst-transform yst-opacity-0 yst-translate-y-4 sm:yst-translate-y-0 sm:yst-scale-90"
					enterTo="yst-transform yst-opacity-100 yst-translate-y-0 sm:yst-scale-100"
					leave="yst-transition yst-absolute yst-top-0 yst-left-0 yst-ease-out yst-duration-300"
					leaveFrom="yst-transform yst-opacity-100 yst-translate-y-0 sm:yst-scale-100"
					leaveTo="yst-transform yst-opacity-0 yst-translate-y-4 sm:yst-translate-y-0 sm:yst-scale-90"
				>
					<FieldsetLayout
						title={ __( "Organization", "wordpress-seo" ) }
						description={ __( "Please tell us more about your organization. This information will help Google to understand your website, and improve your chance of getting rich results.", "wordpress-seo" ) }
					>
						{ ( ! companyName || companyLogoId < 1 ) && (
							<Alert id="alert-organization-name-logo" variant="warning">
								{ addLinkToString(
									sprintf(
										// translators: %1$s and %2$s are replaced by opening and closing <a> tags.
										__( "An organization name and logo need to be set for structured data to work properly. %1$sLearn more about the importance of structured data%2$s.", "wordpress-seo" ),
										"<a>",
										"</a>"
									),
									structuredDataLink,
									"link-structured-data"
								) }
							</Alert>
						) }
						<Field
							as={ TextField }
							name="wpseo_titles.company_name"
							id="input-wpseo_titles-company_name"
							label={ __( "Organization name", "wordpress-seo" ) }
							placeholder={ blogname }
						/>
						<FormikMediaSelectField
							id="wpseo_titles-company_logo"
							label={ __( "Organization logo", "wordpress-seo" ) }
							variant="square"
							previewLabel={ createInterpolateElement(
								sprintf(
									// translators: %1$s expands to an opening strong tag.
									// %2$s expands to a closing strong tag.
									// %3$s expands to the recommended image size.
									__( "Recommended size for this image is %1$s%3$s%2$s", "wordpress-seo" ),
									"<strong>",
									"</strong>",
									"696x696px"
								), {
									strong: <strong className="yst-font-semibold" />,
								} ) }
							mediaUrlName="wpseo_titles.company_logo"
							mediaIdName="wpseo_titles.company_logo_id"
							fallbackMediaId={ siteLogoId }
						/>
					</FieldsetLayout>
					<hr className="yst-my-8" />
					<FieldsetLayout
						title={ __( "Other profiles", "wordpress-seo" ) }
						description={ __( "Tell us if you have any other profiles on the web that belong to your organization. This can be any number of profiles, like YouTube, LinkedIn, Pinterest, or even Wikipedia.", "wordpress-seo" ) }
					>
						<FormikWithErrorField
							as={ TextField }
							name="wpseo_social.facebook_site"
							id="input-wpseo_social-facebook_site"
							label={ __( "Facebook", "wordpress-seo" ) }
							placeholder={ __( "E.g. https://facebook.com/yoast", "wordpress-seo" ) }
						/>
						<FormikValueChangeWithErrorField
							as={ TextField }
							name="wpseo_social.twitter_site"
							id="input-wpseo_social-twitter_site"
							label={ __( "Twitter", "wordpress-seo" ) }
							placeholder={ __( "E.g. https://twitter.com/yoast", "wordpress-seo" ) }
							transformValue={ transformTwitterUrl }
						/>
						<FieldArray name="wpseo_social.other_social_urls">
							{ arrayHelpers => (
								<>
									{ otherSocialUrls.map( ( _, index ) => (
										<div
											key={ `wpseo_social.other_social_urls.${ index }` }
											className="yst-w-full yst-flex yst-items-start yst-gap-2"
										>
											<FormikWithErrorField
												as={ TextField }
												name={ `wpseo_social.other_social_urls.${ index }` }
												id={ `input-wpseo_social-other_social_urls-${ index }` }
												label={ __( "Add another profile", "wordpress-seo" ) }
												placeholder={ __( "E.g. https://example.com/yoast", "wordpress-seo" ) }
												className="yst-grow"
											/>
											<button
												// eslint-disable-next-line react/jsx-no-bind
												onClick={ arrayHelpers.remove.bind( null, index ) }
												className="yst-mt-7 yst-p-2.5 yst-rounded-md focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-primary-500"
											>
												<TrashIcon className="yst-h-5 yst-w-5" />
											</button>
										</div>
									) ) }
									{ /* eslint-disable-next-line react/jsx-no-bind */ }
									<Button id="button-add-social-profile" variant="secondary" onClick={ arrayHelpers.push.bind( null, "" ) }>
										<PlusIcon className="yst--ml-1 yst-mr-1 yst-h-5 yst-w-5 yst-text-slate-400" />
										{ __( "Add another profile", "wordpress-seo" ) }
									</Button>
								</>
							) }
						</FieldArray>
					</FieldsetLayout>
				</Transition>
				<Transition
					show={ companyOrPerson === "person" }
					enter="yst-transition yst-ease-out yst-duration-300 yst-delay-300"
					enterFrom="yst-transform yst-opacity-0 yst-translate-y-4 sm:yst-translate-y-0 sm:yst-scale-90"
					enterTo="yst-transform yst-opacity-100 yst-translate-y-0 sm:yst-scale-100"
					leave="yst-transition yst-absolute yst-top-0 yst-left-0 yst-ease-out yst-duration-300"
					leaveFrom="yst-transform yst-opacity-100 yst-translate-y-0 sm:yst-scale-100"
					leaveTo="yst-transform yst-opacity-0 yst-translate-y-4 sm:yst-translate-y-0 sm:yst-scale-90"
				>
					<FieldsetLayout
						title={ __( "Personal info", "wordpress-seo" ) }
						description={ __( "Please tell us more about the person this site represents.", "wordpress-seo" ) }
					>
						<FormikUserSelectField
							name="wpseo_titles.company_or_person_user_id"
							id="input-wpseo_titles-company_or_person_user_id"
							label={ __( "Select a user", "wordpress-seo" ) }
						/>
						{ ! isEmpty( personUser ) && (
							<Alert id="alert-person-user-profile">
								{ createInterpolateElement(
									sprintf(
										// translators: %1$s and %2$s are replaced by opening and closing <span> tags.
										// %3$s and %4$s are replaced by opening and closing <a> tags.
										// %5$s is replaced by the selected user display name.
										__( "You have selected the user %1$s%5$s%2$s as the person this site represents. Their user profile information will now be used in search results. %3$sUpdate their profile to make sure the information is correct%4$s.", "wordpress-seo" ),
										"<strong>",
										"</strong>",
										"<a>",
										"</a>",
										personUser?.name
									), {
										strong: <strong className="yst-font-medium" />,
										// eslint-disable-next-line jsx-a11y/anchor-has-content
										a: <a
											id="link-person-user-profile" href={ `${ editUserUrl }?user_id=${ personUser?.id }` } target="_blank"
											rel="noopener noreferrer"
										/>,
									} ) }
							</Alert>
						) }

						<FormikMediaSelectField
							id="wpseo_titles-person_logo"
							label={ __( "Personal logo or avatar", "wordpress-seo" ) }
							variant="square"
							previewLabel={ createInterpolateElement(
								sprintf(
									// translators: %1$s expands to an opening strong tag.
									// %2$s expands to a closing strong tag.
									// %3$s expands to the recommended image size.
									__( "Recommended size for this image is %1$s%3$s%2$s", "wordpress-seo" ),
									"<strong>",
									"</strong>",
									"696x696px"
								), {
									strong: <strong className="yst-font-semibold" />,
								} ) }
							mediaUrlName="wpseo_titles.person_logo"
							mediaIdName="wpseo_titles.person_logo_id"
							fallbackMediaId={ siteLogoId }
						/>
					</FieldsetLayout>
					<hr className="yst-my-8" />
					<PersonSocialProfiles />
				</Transition>
			</div>
		</FormLayout>
	);
};

export default SiteRepresentation;
