/* eslint-disable complexity */
import { Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { createInterpolateElement, Fragment, useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Badge, Button, FeatureUpsell, Link, Radio, RadioGroup, TextField, TextareaField } from "@yoast/ui-library";
import { Field, FieldArray, useFormikContext } from "formik";
import { isEmpty } from "lodash";
import AnimateHeight from "react-animate-height";
import { addLinkToString } from "../../helpers/stringHelpers";
import { FieldsetLayout, FormikAutocompleteField, FormikMediaSelectField, FormikUserSelectField, FormikWithErrorField, FormLayout, RouteLayout } from "../components";
import { withFormikDummyField, withFormikDummySelectField } from "../hocs";
import { useSelectSettings } from "../hooks";

const FormikWithErrorFieldWithDummy = withFormikDummyField( FormikWithErrorField );
const FormikDummyAutocompleteField = withFormikDummySelectField( FormikAutocompleteField );

/**
 * @returns {JSX.Element} The site representation route.
 */
const SiteRepresentation = () => {
	const { values } = useFormikContext();
	const {
		website_name: websiteName,
		company_or_person: companyOrPerson,
		company_or_person_user_id: companyOrPersonId,
		company_name: companyName,
		company_logo_id: companyLogoId,
	} = values.wpseo_titles;
	const { other_social_urls: otherSocialUrls } = values.wpseo_social;

	const personUser = useSelectSettings( "selectUserById", [ companyOrPersonId ], companyOrPersonId );
	const googleKnowledgeGraphLink = useSelectSettings( "selectLink", [], "https://yoa.st/1-p" );
	const structuredDataLink = useSelectSettings( "selectLink", [], "https://yoa.st/3r3" );
	const organizationAdditionalInfoUpsellLink = useSelectSettings( "selectLink", [], "https://yoa.st/site-representation-org-additional-info-upsell" );
	const organizationIdentifiersUpsellLink = useSelectSettings( "selectLink", [], "https://yoa.st/site-representation-org-identifiers" );
	const organizationPersonLink = useSelectSettings( "selectLink", [], "https://yoa.st/site-representation-organization-person" );
	const editUserUrl = useSelectSettings( "selectPreference", [], "editUserUrl" );
	const isLocalSeoActive = useSelectSettings( "selectPreference", [], "isLocalSeoActive" );
	const companyOrPersonMessage = useSelectSettings( "selectPreference", [], "companyOrPersonMessage" );
	const siteLogoId = useSelectSettings( "selectFallback", [], "siteLogoId" );
	const canEditUser = useSelectSettings( "selectCanEditUser", [ personUser?.id ], personUser?.id );
	const isPremium = useSelectSettings( "selectPreference", [], "isPremium" );
	const premiumUpsellConfig = useSelectSettings( "selectUpsellSettingsAsProps" );
	const mastodonPremiumLink = useSelectSettings( "selectLink", [], "https://yoa.st/get-mastodon-integration" );
	const mastodonUrlLink = useSelectSettings( "selectLink", [], "https://yoa.st/site-representation-mastodon" );
	const businessInfoSettingsUrl = useSelectSettings( "selectPreference", [], "localSeoPageSettingUrl" );
	let alertMessageIdentifiers = createInterpolateElement(
		sprintf(
			/* translators: %1$s expands for Yoast Local SEO, %2$s and %3$s expands to a link tags. */
			__( "You have %1$s activated on your site. You can provide your VAT ID and Tax ID in the %2$s‘Business info’ settings%3$s.", "wordpress-seo" ),
			"Yoast Local SEO",
			"<a>",
			"</a>"
		),
		{
			// eslint-disable-next-line
			a: <a href={ businessInfoSettingsUrl } target="_blank" className="yst-underline yst-font-medium" />,
		}
	);
	let alertMessagePhoneEmail = createInterpolateElement(
		sprintf(
			/* translators: %1$s expands for Yoast Local SEO, %2$s and %3$s expands to a link tags. */
			__( "You have %1$s activated on your site. You can provide your email and phone in the %2$s‘Business info’ settings%3$s.", "wordpress-seo" ),
			"Yoast Local SEO",
			"<a>",
			"</a>"
		),
		{
			// eslint-disable-next-line
			a: <a href={ businessInfoSettingsUrl } target="_blank" className="yst-underline yst-font-medium" />,
		}
	);
	if ( businessInfoSettingsUrl.includes( "wpseo_locations" ) ) {
		alertMessageIdentifiers = createInterpolateElement(
			sprintf(
				/* translators: %1$s expands for Yoast Local SEO, %2$s and %3$s expands to a link tags. */
				__( "You have %1$s activated on your site, and you've configured your business for multiple locations. This allows you to provide your VAT ID and Tax ID for %2$seach specific location%3$s.", "wordpress-seo" ),
				"Yoast Local SEO",
				"<a>",
				"</a>"
			),
			{
			// eslint-disable-next-line
			a: <a href={ businessInfoSettingsUrl } target="_blank" className="yst-underline yst-font-medium" />,
			}
		);
		alertMessagePhoneEmail = createInterpolateElement(
			sprintf(
				/* translators: %1$s expands for Yoast Local SEO, %2$s and %3$s expands to a link tags. */
				__( "You have %1$s activated on your site, and you've configured your business for multiple locations. This allows you to provide your email and phone for %2$seach specific location%3$s.", "wordpress-seo" ),
				"Yoast Local SEO",
				"<a>",
				"</a>"
			),
			{
				// eslint-disable-next-line
				a: <a href={ businessInfoSettingsUrl } target="_blank" className="yst-underline yst-font-medium" />,
			}
		);
	}

	const handleAddProfile = useCallback( async( arrayHelpers ) => {
		await arrayHelpers.push( "" );
		document.getElementById( `input-wpseo_social-other_social_urls-${ otherSocialUrls.length }` )?.focus();
	}, [ otherSocialUrls ] );

	return (
		<RouteLayout
			title={ __( "Site representation", "wordpress-seo" ) }
			description={ addLinkToString(
				sprintf(
					// translators: %1$s and %2$s are replaced by opening and closing <a> tags.
					__( "This info is intended to appear in %1$sGoogle's Knowledge Graph%2$s.", "wordpress-seo" ),
					"<a>",
					"</a>"
				),
				googleKnowledgeGraphLink,
				"link-google-knowledge-graph"
			) }
		>
			<FormLayout>
				<div className="yst-max-w-5xl">
					<FieldsetLayout
						title={ __( "Organization/person", "wordpress-seo" ) }
						description={ addLinkToString(
							sprintf(
								// translators: %1$s and %2$s are replaced by opening and closing <a> tags.
								__( "Choose whether your site represents an organization or a person. %1$sLearn more about the differences and choosing between Organization and Person%2$s.", "wordpress-seo" ),
								"<a>",
								"</a>"
							),
							organizationPersonLink,
							"link-site-representation-organization-person"
						) }
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
						<AnimateHeight
							easing="ease-out"
							duration={ 300 }
							delay={ 300 }
							height={ companyOrPerson === "company" ? "auto" : 0 }
							animateOpacity={ true }
						>
							<FieldsetLayout
								title={ __( "Organization", "wordpress-seo" ) }
								description={ __( "Please tell us more about your organization. This information will help Google to understand your website, and improve your chance of getting rich results.", "wordpress-seo" ) }
							>
								{ ( ! companyName || companyLogoId < 1 ) && (
									<Alert id="alert-organization-name-logo" variant="info">
										{ addLinkToString(
											sprintf(
												// translators: %1$s and %2$s are replaced by opening and closing <a> tags.
												__( "An organization name and logo need to be set for structured data to work properly. Since you haven’t set these yet, we are using the site name and logo as default values. %1$sLearn more about the importance of structured data%2$s.", "wordpress-seo" ),
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
									placeholder={ websiteName }
								/>
								<Field
									as={ TextField }
									name="wpseo_titles.company_alternate_name"
									id="input-wpseo_titles-company_alternate_name"
									label={ __( "Alternate organization name", "wordpress-seo" ) }
									description={ __( "Use the alternate organization name for acronyms, or a shorter version of your organization's name.", "wordpress-seo" ) }
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
								id="fieldset-wpseo_social-other_social_urls"
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
									name="wpseo_social.twitter_site"
									id="input-wpseo_social-twitter_site"
									label={ __( "X", "wordpress-seo" ) }
									placeholder={ __( "E.g. https://x.com/yoast", "wordpress-seo" ) }
								/>
								<FeatureUpsell
									shouldUpsell={ ! isPremium }
									variant="card"
									cardLink={ mastodonPremiumLink }
									cardText={ sprintf(
										/* translators: %1$s expands to Premium. */
										__( "Unlock with %1$s", "wordpress-seo" ),
										"Premium"
									) }
									{ ...premiumUpsellConfig }
								>
									<FormikWithErrorFieldWithDummy
										as={ TextField }
										name="wpseo_social.mastodon_url"
										id="input-wpseo_social-mastodon_url"
										label={ __( "Mastodon", "wordpress-seo" ) }
										placeholder={ __( "E.g. https://mastodon.social/@yoast", "wordpress-seo" ) }
										labelSuffix={ isPremium && <Badge className="yst-ms-1.5" size="small" variant="upsell">Premium</Badge> }
										isDummy={ ! isPremium }
										description={ <>
											{ __( "Get your site verified in your Mastodon profile.", "wordpress-seo" ) }
											{ " " }
											<Link id="link-wpseo_social-mastodon_url" href={ mastodonUrlLink } target="_blank" rel="noopener">
												{ __( "Read more about how to get your site verified.", "wordpress-seo" ) }
											</Link>
										</> }
									/>
								</FeatureUpsell>
								<FieldArray name="wpseo_social.other_social_urls">
									{ arrayHelpers => (
										<>
											{ otherSocialUrls.map( ( _, index ) => (
												<Transition
													key={ `wpseo_social.other_social_urls.${ index }` }
													as={ Fragment }
													appear={ true }
													show={ true }
													enter="yst-transition yst-ease-out yst-duration-300"
													enterFrom="yst-transform yst-opacity-0"
													enterTo="yst-transform yst-opacity-100"
													leave="yst-transition yst-ease-out yst-duration-300"
													leaveFrom="yst-transform yst-opacity-100"
													leaveTo="yst-transform yst-opacity-0"
												>
													<div className="yst-w-full yst-flex yst-items-start yst-gap-2">
														<FormikWithErrorField
															as={ TextField }
															name={ `wpseo_social.other_social_urls.${ index }` }
															id={ `input-wpseo_social-other_social_urls-${ index }` }
															// translators: %1$s expands to array index + 1.
															label={ sprintf( __( "Other profile %1$s", "wordpress-seo" ), index + 1 ) }
															placeholder={ __( "E.g. https://example.com/yoast", "wordpress-seo" ) }
															className="yst-grow"
														/>
														<Button
															variant="secondary"
															// eslint-disable-next-line react/jsx-no-bind
															onClick={ arrayHelpers.remove.bind( null, index ) }
															className="yst-mt-7 yst-p-2.5"
															// translators: %1$s expands to array index + 1.
															aria-label={ sprintf( __( "Remove Other profile %1$s", "wordpress-seo" ), index + 1 ) }
														>
															<TrashIcon className="yst-h-5 yst-w-5" />
														</Button>
													</div>
												</Transition>
											) ) }
											{ /* eslint-disable-next-line react/jsx-no-bind */ }
											<Button id="button-add-social-profile" variant="secondary" onClick={ ()=>handleAddProfile( arrayHelpers ) }>
												<PlusIcon className="yst--ms-1 yst-me-1 yst-h-5 yst-w-5 yst-text-slate-400" />
												{ __( "Add another profile", "wordpress-seo" ) }
											</Button>
										</>
									) }
								</FieldArray>
							</FieldsetLayout>
							<hr className="yst-my-8" />
							<FieldsetLayout
								title={ <>
									{ __( "Additional organization info", "wordpress-seo" ) }
									{ isPremium && <Badge className="yst-ms-1.5" size="small" variant="upsell">Premium</Badge> }
								</> }
								description={ __( "Enrich your organization's profile by providing more in-depth information. The more details you share, the better Google understands your website.", "wordpress-seo" ) }
							>
								<FeatureUpsell
									shouldUpsell={ ! isPremium }
									variant="card"
									cardLink={ organizationAdditionalInfoUpsellLink }
									cardText={ sprintf(
										/* translators: %1$s expands to Premium. */
										__( "Unlock with %1$s", "wordpress-seo" ),
										"Premium"
									) }
									{ ...premiumUpsellConfig }
								>
									<FormikWithErrorFieldWithDummy
										as={ TextareaField }
										name="wpseo_titles.org-description"
										id="input-wpseo_titles-org-description"
										label={ __( "Organization description", "wordpress-seo" ) }
										isDummy={ ! isPremium }
										// The maxLength limitation is a random number for sanity check.
										maxLength={ 2000 }
									/>

									{ isLocalSeoActive && isPremium && (
										<Alert id="alert-local-seo-vat-or-tax-id" variant="info">
											{ alertMessagePhoneEmail }
										</Alert>
									) }
									<FormikWithErrorFieldWithDummy
										as={ TextField }
										name="wpseo_titles.org-email"
										id="input-wpseo_titles-org-email"
										type="email"
										label={ __( "Organization email address", "wordpress-seo" ) }
										isDummy={ ! isPremium || isLocalSeoActive }
									/>
									<FormikWithErrorFieldWithDummy
										as={ TextField }
										name="wpseo_titles.org-phone"
										id="input-wpseo_titles-org-phone"
										label={ __( "Organization phone number", "wordpress-seo" ) }
										isDummy={ ! isPremium || isLocalSeoActive }
									/>
									<FormikWithErrorFieldWithDummy
										as={ TextField }
										name="wpseo_titles.org-legal-name"
										id="input-wpseo_titles-org-legal-name"
										label={ __( "Organization's legal name", "wordpress-seo" ) }
										isDummy={ ! isPremium }
									/>
									<FormikWithErrorFieldWithDummy
										as={ TextField }
										className="yst-w-3/5"
										name="wpseo_titles.org-founding-date"
										id="input-wpseo_titles-org-founding-date"
										label={ __( "Organization's founding date", "wordpress-seo" ) }
										type="date"
										isDummy={ ! isPremium }
									/>
									<FormikDummyAutocompleteField
										name="wpseo_titles.org-number-employees"
										className="yst-w-3/5"
										id="input-wpseo_titles-org-number-employees"
										label={ __( "Number of employees", "wordpress-seo" ) }
										placeholder={ __( "Select a range / Enter a number", "wordpress-seo" ) }
										isDummy={ ! isPremium }
										options={ [
											{ value: "", label: "None" },
											{ value: "1-10", label: __( "1-10 employees", "wordpress-seo" ) },
											{ value: "11-50", label: __( "11-50 employees", "wordpress-seo" ) },
											{ value: "51-200", label: __( "51-200 employees", "wordpress-seo" ) },
											{ value: "201-500", label: __( "201-500 employees", "wordpress-seo" ) },
											{ value: "501-1000", label: __( "501-1000 employees", "wordpress-seo" ) },
											{ value: "1001-5000", label: __( "1001-5000 employees", "wordpress-seo" ) },
											{ value: "5001-10000", label: __( "5001-10000 employees", "wordpress-seo" ) },
										] }
									/>

								</FeatureUpsell>
							</FieldsetLayout>
							<hr className="yst-my-8" />
							<FieldsetLayout
								title={ <>
									{ __( "Organization identifiers", "wordpress-seo" ) }
									{ isPremium && <Badge className="yst-ms-1.5" size="small" variant="upsell">Premium</Badge> }
								</> }
								description={ __( "Please tell us more about your organization’s identifiers. This information will help Google to display accurate and helpful details about your organization.", "wordpress-seo" ) }
							>
								<FeatureUpsell
									shouldUpsell={ ! isPremium }
									variant="card"
									cardLink={ organizationIdentifiersUpsellLink }
									cardText={ sprintf(
										/* translators: %1$s expands to Premium. */
										__( "Unlock with %1$s", "wordpress-seo" ),
										"Premium"
									) }
									{ ...premiumUpsellConfig }
								>
									{ isLocalSeoActive && isPremium && (
										<Alert id="alert-local-seo-vat-or-tax-id" variant="info">
											{ alertMessageIdentifiers }
										</Alert>
									) }
									<FormikWithErrorFieldWithDummy
										as={ TextField }
										name="wpseo_titles.org-vat-id"
										id="input-wpseo_titles-org-vat-id"
										label={ __( "VAT ID", "wordpress-seo" ) }
										isDummy={ ! isPremium || isLocalSeoActive }
									/>
									<FormikWithErrorFieldWithDummy
										as={ TextField }
										name="wpseo_titles.org-tax-id"
										id="input-wpseo_titles-org-tax-id"
										label={ __( "Tax ID", "wordpress-seo" ) }
										isDummy={ ! isPremium || isLocalSeoActive }
									/>
									<FormikWithErrorFieldWithDummy
										as={ TextField }
										name="wpseo_titles.org-iso"
										id="input-wpseo_titles-org-iso"
										label={ __( "ISO 6523", "wordpress-seo" ) }
										isDummy={ ! isPremium }
									/>
									<FormikWithErrorFieldWithDummy
										as={ TextField }
										name="wpseo_titles.org-duns"
										id="input-wpseo_titles-org-duns"
										label={ __( "DUNS", "wordpress-seo" ) }
										isDummy={ ! isPremium }
									/>
									<FormikWithErrorFieldWithDummy
										as={ TextField }
										name="wpseo_titles.org-leicode"
										id="input-wpseo_titles-org-leicode"
										label={ __( "LEI code", "wordpress-seo" ) }
										isDummy={ ! isPremium }
									/>
									<FormikWithErrorFieldWithDummy
										as={ TextField }
										name="wpseo_titles.org-naics"
										id="input-wpseo_titles-org-naics"
										label={ __( "NAICS", "wordpress-seo" ) }
										isDummy={ ! isPremium }
									/>
								</FeatureUpsell>
							</FieldsetLayout>
						</AnimateHeight>
						<AnimateHeight
							easing="ease-out"
							duration={ 300 }
							delay={ 300 }
							height={ companyOrPerson === "person" ? "auto" : 0 }
							animateOpacity={ true }
						>
							<FieldsetLayout
								title={ __( "Personal info", "wordpress-seo" ) }
								description={ __( "Please tell us more about the person this site represents.", "wordpress-seo" ) }
							>
								<FormikUserSelectField
									name="wpseo_titles.company_or_person_user_id"
									id="input-wpseo_titles-company_or_person_user_id"
									label={ __( "Select a user", "wordpress-seo" ) }
									className="yst-max-w-sm"
								/>
								{ ! isEmpty( personUser ) && (
									<Alert id="alert-person-user-profile">
										{ canEditUser && createInterpolateElement(
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
													id="link-person-user-profile" href={ `${ editUserUrl }?user_id=${ personUser?.id }` }
													target="_blank" rel="noopener noreferrer"
												/>,
											} ) }
										{ ! canEditUser && createInterpolateElement(
											sprintf(
												// translators: %1$s and %2$s are replaced by opening and closing <span> tags.
												// %3$s is replaced by the selected user display name.
												__( "You have selected the user %1$s%3$s%2$s as the person this site represents. Their user profile information will now be used in search results. We're sorry, you're not allowed to edit this user's profile. Please contact your admin or %1$s%3$s%2$s to check and/or update the profile.", "wordpress-seo" ),
												"<strong>",
												"</strong>",
												personUser?.name
											), {
												strong: <strong className="yst-font-medium" />,
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
									disabled={ ! companyOrPersonId }
								/>
							</FieldsetLayout>
						</AnimateHeight>
					</div>
				</div>
			</FormLayout>
		</RouteLayout>
	);
};

export default SiteRepresentation;
