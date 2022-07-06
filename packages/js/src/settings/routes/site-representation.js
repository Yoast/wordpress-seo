import { __, sprintf } from "@wordpress/i18n";
import { Field, useFormikContext } from "formik";
import { createInterpolateElement } from "@wordpress/element";
import { addLinkToString } from "../../helpers/stringHelpers";
import { RadioGroup, Radio, Alert, Title, TextField, SelectField } from "@yoast/ui-library";
import { Transition } from "@headlessui/react";
import { FormLayout, FormikValueChangeField, FormikMediaSelectField } from "../components";

/**
 * @returns {JSX.Element} The site representation route.
 */
const SiteRepresentation = () => {
	const { values } = useFormikContext();
	const { company_or_person } = values.wpseo_titles;

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
								name="wpseo_titles.post_types-post-maintax"
								id="input:wpseo_titles.post_types-post-maintax"
								label={ __( "Posts", "wordpress-seo" ) }
								options={ [ {
									value: 1,
									label: "User #1",
								}, {
									value: 2,
									label: "User #2",
								}, {
									value: 3,
									label: "User #3",
								} ] }
							/>
							<Alert id="alert:person-user-profile">
								{ addLinkToString(
									sprintf(
										// translators: %1$s and %2$s are replaced by opening and closing <a> tags.
										__( "You have selected the user Jane Doe as the person this site represents. Their user profile information will now be used in search results. %1$sUpdate their profile to make sure the information is correct%2$s.", "wordpress-seo" ),
										"<a>",
										"</a>"
									),
									"https://yoa.st/",
									"link:person-user-profile"
								) }
							</Alert>
							<FormikMediaSelectField
								label={ __( "Personal logo or avatar", "wordpress-seo" ) }
								description={ createInterpolateElement(
									sprintf(
										__( "Recommended size for this image is %1$s%3$s%2$s", "wordpress-seo" ),
										"<span>",
										"</span>",
										"696x696"
									), {
										span: <span className="yst-font-semibold" />,
									} ) }
								imageUrlName="wpseo_titles.person_logo"
								imageIdName="wpseo_titles.person_logo_id"
								className="yst-w-48"
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
