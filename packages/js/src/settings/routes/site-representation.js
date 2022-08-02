import { Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Button, Radio, RadioGroup, SelectField, TextField } from "@yoast/ui-library";
import { Field, FieldArray, useFormikContext } from "formik";
import { find, get, map } from "lodash";
import { addLinkToString } from "../../helpers/stringHelpers";
import { FieldsetLayout, FormikMediaSelectField, FormikValueChangeField, FormikWithErrorField, FormLayout } from "../components";
import { useSelectSettings } from "../store";

/**
 * @returns {JSX.Element} The site representation route.
 */
const SiteRepresentation = () => {
	const { values } = useFormikContext();
	// eslint-disable-next-line camelcase
	const { company_or_person: companyOrPerson, company_or_person_user_id: companyOrPersonId } = values.wpseo_titles;
	const { other_social_urls: otherSocialUrls } = values.wpseo_social;

	const userEditUrl = useMemo( () => get( window, "wpseoScriptData.userEditUrl", [] ), [] );
	const users = useMemo( () => get( window, "wpseoScriptData.users", [] ), [] );
	const userOptions = useMemo( () => map( users, user => ( { value: parseInt( user.id, 10 ), label: user.display_name } ) ), [ users ] );
	const selectedUser = useMemo( () => (
		find( users, user => companyOrPersonId === parseInt( user.id, 10 ) ) || users[ 0 ] || {}
	), [ users, companyOrPersonId ] );
	const googleKnowledgeGraphLink = useSelectSettings( "selectLink", [], "https://yoa.st/1-p" );
	const structuredDataLink = useSelectSettings( "selectLink", [], "https://yoa.st/3r3" );

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
			<section>
				<RadioGroup label={ __( "Choose whether your site represents an organization or a person.", "wordpress-seo" ) }>
					<Field
						as={ Radio }
						type="radio"
						name="wpseo_titles.company_or_person"
						id="input-wpseo_titles-company_or_person-company"
						label={ __( "Organization", "wordpress-seo" ) }
						value="company"
					/>
					<Field
						as={ Radio }
						type="radio"
						name="wpseo_titles.company_or_person"
						id="input-wpseo_titles-company_or_person-person"
						label={ __( "Person", "wordpress-seo" ) }
						value="person"
					/>
				</RadioGroup>
			</section>
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
					<FieldsetLayout title={ __( "Organization", "wordpress-seo" ) }>
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
						<Field
							as={ TextField }
							name="wpseo_titles.company_name"
							id="input-wpseo_titles-company_name"
							label={ __( "Organization name", "wordpress-seo" ) }
						/>
						<FormikMediaSelectField
							id="wpseo_titles-company_logo"
							label={ __( "Organization logo", "wordpress-seo" ) }
							previewLabel={ createInterpolateElement(
								// translators: %1$s expands to an opening strong tag.
								// %2$s expands to a closing strong tag.
								// %3$s expands to the recommended image size.
								sprintf(
									__( "Recommended size for this image is %1$s%3$s%2$s", "wordpress-seo" ),
									"<strong>",
									"</strong>",
									"1200x675px"
								), {
									strong: <strong className="yst-font-semibold" />,
								} ) }
							mediaUrlName="wpseo_titles.company_logo"
							mediaIdName="wpseo_titles.company_logo_id"
						/>
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
					<FieldsetLayout title={ __( "Personal info", "wordpress-seo" ) }>
						<FormikValueChangeField
							as={ SelectField }
							name="wpseo_titles.company_or_person_user_id"
							id="input-wpseo_titles-company_or_person_user_id"
							label={ __( "Select a user", "wordpress-seo" ) }
							options={ userOptions }
						/>
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
									selectedUser.display_name
								), {
									strong: <strong className="yst-font-medium" />,
									// eslint-disable-next-line jsx-a11y/anchor-has-content
									a: <a
										id="link-person-user-profile" href={ `${ userEditUrl }?user_id=${ selectedUser.id }` } target="_blank"
										rel="noopener noreferrer"
									/>,
								} ) }
						</Alert>
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
						/>
					</FieldsetLayout>
				</Transition>
			</div>
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
				<FormikWithErrorField
					as={ TextField }
					name="wpseo_social.instagram_site"
					id="input-wpseo_social-instagram_site"
					label={ __( "Instagram", "wordpress-seo" ) }
					placeholder={ __( "E.g. https://instagram.com/yoast", "wordpress-seo" ) }
				/>
				<FormikWithErrorField
					as={ TextField }
					name="wpseo_social.twitter_site"
					id="input-wpseo_social-twitter_site"
					label={ __( "Twitter", "wordpress-seo" ) }
					placeholder={ __( "E.g. https://twitter.com/yoast", "wordpress-seo" ) }
				/>
				<FieldArray name="wpseo_social.other_social_urls">
					{ arrayHelpers => (
						<>
							{ otherSocialUrls.map( ( _, index ) => (
								<div key={ `wpseo_social.other_social_urls.${ index }` } className="yst-w-full yst-flex yst-items-start yst-gap-2">
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
								<PlusIcon className="yst--ml-1 yst-mr-1 yst-h-5 yst-w-5 yst-text-gray-400" />
								{ __( "Add another profile", "wordpress-seo" ) }
							</Button>
						</>
					) }
				</FieldArray>
			</FieldsetLayout>
		</FormLayout>
	);
};

export default SiteRepresentation;
