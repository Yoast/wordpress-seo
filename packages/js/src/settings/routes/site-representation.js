import { __, sprintf } from "@wordpress/i18n";
import { Field, useFormikContext } from "formik";
import { createInterpolateElement, useMemo } from "@wordpress/element";
import { map, get, find } from "lodash";
import { addLinkToString } from "../../helpers/stringHelpers";
import { RadioGroup, Radio, Alert, Title, TextField, SelectField } from "@yoast/ui-library";
import { Transition } from "@headlessui/react";
import { FormLayout, FormikValueChangeField, FormikMediaSelectField } from "../components";

/**
 * @returns {JSX.Element} The site representation route.
 */
const SiteRepresentation = () => {
	const { values } = useFormikContext();
	const { company_or_person, company_or_person_user_id } = values.wpseo_titles;

	const userEditUrl = useMemo( () => get( window, "wpseoScriptData.userEditUrl", [] ), [] );
	const users = useMemo( () => get( window, "wpseoScriptData.users", [] ), [] );
	const userOptions = useMemo( () => map( users, user => ( { value: parseInt( user.id, 10 ), label: user.display_name } ) ), [ users ] );
	const selectedUser = useMemo( () => find( users, user => (
		company_or_person_user_id === parseInt( user.id, 10 )
	) ), [ users, company_or_person_user_id ] );

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
				"https://yoa.st/1-p",
				"link:google-knowledge-graph"
			) }
		>
			<section>
				<RadioGroup label={ __( "Choose whether your site represents an organization or a person.", "wordpress-seo" ) }>
					<Field
						as={ Radio }
						type="radio"
						name="wpseo_titles.company_or_person"
						id="input:wpseo_titles.company_or_person.company"
						label={ __( "Organization", "wordpress-seo" ) }
						value="company"
					/>
					<Field
						as={ Radio }
						type="radio"
						name="wpseo_titles.company_or_person"
						id="input:wpseo_titles.company_or_person.person"
						label={ __( "Person", "wordpress-seo" ) }
						value="person"
					/>
				</RadioGroup>
			</section>
			<hr className="yst-my-8" />
			<div className="yst-relative">
				<Transition
					show={ company_or_person === "company" }
					enter="yst-transition yst-ease-out yst-duration-300 yst-delay-300"
					enterFrom="yst-transform yst-opacity-0 yst-translate-y-4 sm:yst-translate-y-0 sm:yst-scale-90"
					enterTo="yst-transform yst-opacity-100 yst-translate-y-0 sm:yst-scale-100"
					leave="yst-transition yst-absolute yst-top-0 yst-left-0 yst-ease-out yst-duration-300"
					leaveFrom="yst-transform yst-opacity-100 yst-translate-y-0 sm:yst-scale-100"
					leaveTo="yst-transform yst-opacity-0 yst-translate-y-4 sm:yst-translate-y-0 sm:yst-scale-90"
				>
					<fieldset className="lg:yst-grid lg:yst-grid-cols-3 lg:yst-gap-12">
						<div className="lg:yst-col-span-1">
							<Title as="legend" size="4" className="yst-max-w-screen-sm">
								{ __( "Organization", "wordpress-seo" ) }
							</Title>
						</div>
						<div className="yst-mt-8 lg:yst-mt-0 lg:yst-col-span-2 yst-space-y-8">
							<Alert id="alert:organization-name-logo" variant="warning">
								{ addLinkToString(
									sprintf(
										// translators: %1$s and %2$s are replaced by opening and closing <a> tags.
										__( "An organization name and logo need to be set for structured data to work properly. %1$sLearn more about the importance of structured data%2$s.", "wordpress-seo" ),
										"<a>",
										"</a>"
									),
									"https://yoa.st/3r3",
									"link:structured-data"
								) }
							</Alert>
							<Field
								as={ TextField }
								name="wpseo_titles.company_name"
								id="input:wpseo_titles.company_name"
								label={ __( "Organization name", "wordpress-seo" ) }
							/>
							<FormikMediaSelectField
								id="wpseo_titles.company_logo"
								label={ __( "Organization logo", "wordpress-seo" ) }
								previewLabel={ createInterpolateElement(
									// translators: %1$s expands to an opening strong tag.
									// %2$s expands to a closing strong tag.
									// %3$s expands to the recommended image size.
									sprintf(
										__( "Recommended size for this image is %1$s%3$s%2$s", "wordpress-seo" ),
										"<strong>",
										"</strong>",
										"1200x675"
									), {
										strong: <strong className="yst-font-semibold" />,
									} ) }
								mediaUrlName="wpseo_titles.company_logo"
								mediaIdName="wpseo_titles.company_logo_id"
							/>
						</div>
					</fieldset>
				</Transition>
				<Transition
					show={ company_or_person === "person" }
					enter="yst-transition yst-ease-out yst-duration-300 yst-delay-300"
					enterFrom="yst-transform yst-opacity-0 yst-translate-y-4 sm:yst-translate-y-0 sm:yst-scale-90"
					enterTo="yst-transform yst-opacity-100 yst-translate-y-0 sm:yst-scale-100"
					leave="yst-transition yst-absolute yst-top-0 yst-left-0 yst-ease-out yst-duration-300"
					leaveFrom="yst-transform yst-opacity-100 yst-translate-y-0 sm:yst-scale-100"
					leaveTo="yst-transform yst-opacity-0 yst-translate-y-4 sm:yst-translate-y-0 sm:yst-scale-90"
				>
					<fieldset className="lg:yst-grid lg:yst-grid-cols-3 lg:yst-gap-12">
						<div className="lg:yst-col-span-1">
							<Title as="legend" size="4" className="yst-max-w-screen-sm">
								{ __( "Personal info", "wordpress-seo" ) }
							</Title>
						</div>
						<div className="yst-mt-8 lg:yst-mt-0 lg:yst-col-span-2 yst-space-y-8">
							<FormikValueChangeField
								as={ SelectField }
								name="wpseo_titles.company_or_person_user_id"
								id="input:wpseo_titles.company_or_person_user_id"
								label={ __( "Select a user", "wordpress-seo" ) }
								options={ userOptions }
							/>
							<Alert id="alert:person-user-profile">
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
										a: <a id="link:person-user-profile" href={ `${ userEditUrl }?user_id=${ selectedUser.id }` } target="_blank" rel="noopener noreferrer" />,
									} ) }
							</Alert>
							<FormikMediaSelectField
								id="wpseo_titles.person_logo"
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
										"696x696"
									), {
										strong: <strong className="yst-font-semibold" />,
									} ) }
								mediaUrlName="wpseo_titles.person_logo"
								mediaIdName="wpseo_titles.person_logo_id"
							/>
						</div>
					</fieldset>
				</Transition>
			</div>
			<hr className="yst-my-8" />
		</FormLayout>
	);
};

export default SiteRepresentation;
