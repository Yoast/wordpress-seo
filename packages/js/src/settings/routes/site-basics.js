import { createInterpolateElement, useEffect, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, FeatureUpsell, Radio, RadioGroup, TextField, ToggleField } from "@yoast/ui-library";
import { Field, useFormikContext } from "formik";
import { get, map } from "lodash";
import {
	FieldsetLayout,
	FormikMediaSelectField,
	FormikValueChangeField,
	FormikWithErrorField,
	FormLayout,
	OpenGraphDisabledAlert,
	RouteLayout,
} from "../components";
import FormikPageSelectField from "../components/formik-page-select-field";
import { withDisabledMessageSupport, withFormikDummyField } from "../hocs";
import { useDispatchSettings, useSelectSettings } from "../hooks";

const ToggleFieldWithDisabledMessageSupport = withDisabledMessageSupport( ToggleField );
const FormikSelectPageWithDummy = withFormikDummyField( FormikPageSelectField );

/**
 * @returns {JSX.Element} The site defaults route.
 */
const SiteBasics = () => {
	const separators = useMemo( () => get( window, "wpseoScriptData.separators", {} ), [] );
	const generalSettingsUrl = useSelectSettings( "selectPreference", [], "generalSettingsUrl" );
	const canManageOptions = useSelectSettings( "selectPreference", [], "canManageOptions", false );
	const showForceRewriteTitlesSetting = useSelectSettings( "selectPreference", [], "showForceRewriteTitlesSetting", false );
	const replacementVariablesLink = useSelectSettings( "selectLink", [], "https://yoa.st/site-basics-replacement-variables" );
	const usageTrackingLink = useSelectSettings( "selectLink", [], "https://yoa.st/usage-tracking-2" );
	const sitePoliciesLink = useSelectSettings( "selectLink", [], "https://yoa.st/site-policies-learn-more" );
	const siteTitle = useSelectSettings( "selectPreference", [], "siteTitle", "" );
	const PublishingPremiumLink = useSelectSettings( "selectLink", [], "https://yoa.st/site-policies-upsell" );
	const isPremium = useSelectSettings( "selectPreference", [], "isPremium" );
	const premiumUpsellConfig = useSelectSettings( "selectUpsellSettingsAsProps" );
	const { fetchPages } = useDispatchSettings();

	const usageTrackingDescription = useMemo( () => createInterpolateElement(
		sprintf(
			/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
			__( "Usage tracking allows us to track some data about your site to improve our plugin. %1$sLearn more about which data we track and why%2$s.", "wordpress-seo" ),
			"<a>",
			"</a>"
		),
		{
			// eslint-disable-next-line jsx-a11y/anchor-has-content, react/jsx-no-target-blank
			a: <a id="link-usage-tracking" href={ usageTrackingLink } target="_blank" rel="noopener" />,
		}
	), [] );

	const sitePoliciesDescription = useMemo( () => createInterpolateElement(
		sprintf(
			/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
			__( "Set specific site policy pages. By defining your site policies, you provide Google with an important indicator of your site's trustworthiness. %1$sLearn more about why setting your site policies is important%2$s.", "wordpress-seo" ),
			"<a>",
			"</a>"
		),
		{
			// eslint-disable-next-line jsx-a11y/anchor-has-content, react/jsx-no-target-blank
			a: <a id="link-site-policies" href={ sitePoliciesLink } target="_blank" rel="noopener" />,
		}
	), [] );
	const siteInfoDescription = useMemo( () => createInterpolateElement(
		sprintf(
			/* translators: %1$s and %2$s expand to an opening and closing emphasis tag. %3$s and %4$s expand to an opening and closing anchor tag. */
			__( "Set the basic info for your website. You can use %1$stagline%2$s and %1$sseparator%2$s as %3$sreplacement variables%4$s when configuring the search appearance of your content.", "wordpress-seo" ),
			"<em>",
			"</em>",
			"<a>",
			"</a>"
		),
		{
			em: <em />,
			// eslint-disable-next-line jsx-a11y/anchor-has-content, react/jsx-no-target-blank
			a: <a
				id="site-basics-replacement-variables" href={ replacementVariablesLink } target="_blank"
				rel="noopener"
			/>,
		}
	), [] );
	const canNotManageOptionsAlertText = useMemo( () => createInterpolateElement(
		sprintf(
			/* translators: %1$s expands to an opening emphasis tag. %2$s expands to a closing emphasis tag. */
			__( "We're sorry, you're not allowed to edit the %1$swebsite name%2$s and %1$stagline%2$s.", "wordpress-seo" ),
			"<em>",
			"</em>"
		),
		{ em: <em /> }
	), [] );
	const siteImageRecommendedSize = useMemo( () => createInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s expands to an opening strong tag.
			 * %2$s expands to a closing strong tag.
			 * %3$s expands to the recommended image size.
			 */
			__( "Recommended size for this image is %1$s%3$s%2$s", "wordpress-seo" ),
			"<strong>",
			"</strong>",
			"1200x675px"
		),
		{
			strong: <strong className="yst-font-semibold" />,
		}
	), [] );
	const taglineDescription = useMemo( () => createInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s expands to an opening anchor tag.
			 * %2$s expands to a closing anchor tag.
			 */
			__( "This field updates the %1$stagline in your WordPress settings%2$s.", "wordpress-seo" ),
			"<a>",
			"</a>"
		),
		{
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a href={ `${ generalSettingsUrl }#blogdescription` } target="_blank" rel="noopener noreferrer" />,
		}
	), [] );

	const { values } = useFormikContext();
	const { opengraph } = values.wpseo_social;

	useEffect( () => {
		// Get initial options.
		fetchPages();
	}, [] );
	return (
		<RouteLayout
			title={ __( "Site basics", "wordpress-seo" ) }
			description={ __( "Configure the basics for your website.", "wordpress-seo" ) }
		>
			<FormLayout>
				<div className="yst-max-w-5xl">
					<FieldsetLayout
						title={ __( "Site info", "wordpress-seo" ) }
						description={ siteInfoDescription }
					>
						{ ! canManageOptions && (
							<Alert variant="warning" id="alert-site-defaults-variables" className="yst-mb-8">
								{ canNotManageOptionsAlertText }
							</Alert>
						) }
						<div className="lg:yst-mt-0 lg:yst-col-span-2 yst-space-y-8">
							<FormikWithErrorField
								as={ TextField }
								name="wpseo_titles.website_name"
								id="input-wpseo_titles-website_name"
								label={ __( "Website name", "wordpress-seo" ) }
								placeholder={ siteTitle }
							/>
							<FormikWithErrorField
								as={ TextField }
								name="wpseo_titles.alternate_website_name"
								id="input-wpseo_titles-alternate_website_name"
								label={ __( "Alternate website name", "wordpress-seo" ) }
								description={ __( "Use the alternate website name for acronyms, or a shorter version of your website's name.", "wordpress-seo" ) }
							/>
							<Field
								as={ TextField }
								type="text"
								name="blogdescription"
								id="input-blogdescription"
								label={ __( "Tagline", "wordpress-seo" ) }
								description={ canManageOptions && taglineDescription }
								readOnly={ ! canManageOptions }
							/>
						</div>
						<RadioGroup label={ __( "Title separator", "wordpress-seo" ) } variant="inline-block">
							{ map( separators, ( { label, aria_label: ariaLabel }, value ) => (
								<Field
									key={ value }
									as={ Radio }
									type="radio"
									variant="inline-block"
									name="wpseo_titles.separator"
									id={ `input-wpseo_titles-separator-${ value }` }
									label={ label }
									isLabelDangerousHtml={ true }
									aria-label={ ariaLabel }
									value={ value }
								/>
							) ) }
						</RadioGroup>
						<OpenGraphDisabledAlert
							isEnabled={ opengraph }
							text={
								/* translators: %1$s expands to an opening emphasis tag. %2$s expands to a closing emphasis tag. */
								__( "The %1$sSite image%2$s requires Open Graph data, which is currently disabled in the ‘Social sharing’ section in %3$sSite features%4$s.", "wordpress-seo" )
							}
						/>
						<FormikMediaSelectField
							id="wpseo_social-og_default_image"
							label={ __( "Site image", "wordpress-seo" ) }
							description={ __( "This image is used as a fallback for posts/pages that don't have any images set.", "wordpress-seo" ) }
							previewLabel={ siteImageRecommendedSize }
							mediaUrlName="wpseo_social.og_default_image"
							mediaIdName="wpseo_social.og_default_image_id"
							disabled={ ! opengraph }
						/>
					</FieldsetLayout>

					<hr className="yst-my-8" />
					<FieldsetLayout title={ __( "Site preferences", "wordpress-seo" ) }>
						{ showForceRewriteTitlesSetting && (
							<FormikValueChangeField
								as={ ToggleField }
								type="checkbox"
								name="wpseo_titles.forcerewritetitle"
								id="input-wpseo_titles-forcerewritetitle"
								label={ __( "Force rewrite titles", "wordpress-seo" ) }
								description={ sprintf(
									/* translators: %1$s expands to "Yoast SEO" */
									__( "%1$s has auto-detected whether it needs to force rewrite the titles for your pages, if you think it's wrong and you know what you're doing, you can change the setting here.", "wordpress-seo" ),
									"Yoast SEO"
								) }
								className="yst-max-w-sm"
							/>
						) }
						<FormikValueChangeField
							as={ ToggleField }
							type="checkbox"
							name="wpseo.disableadvanced_meta"
							id="input-wpseo-disableadvanced_meta"
							label={ __( "Restrict advanced settings for authors", "wordpress-seo" ) }
							description={ sprintf(
								/* translators: %1$s expands to "Yoast SEO" */
								__( "By default only editors and administrators can access the Advanced and Schema section of the %1$s sidebar or metabox. Disabling this allows access to all users.", "wordpress-seo" ),
								"Yoast SEO"
							) }
							className="yst-max-w-sm"
						/>
						<FormikValueChangeField
							as={ ToggleFieldWithDisabledMessageSupport }
							type="checkbox"
							name="wpseo.tracking"
							id="input-wpseo-tracking"
							label={ __( "Usage tracking", "wordpress-seo" ) }
							description={ usageTrackingDescription }
							className="yst-max-w-sm"
						/>
					</FieldsetLayout>
					<hr className="yst-my-8" />
					<FieldsetLayout
						title={ __( "Site policies", "wordpress-seo" ) }
						description={ sitePoliciesDescription }
					>
						<FeatureUpsell
							shouldUpsell={ ! isPremium }
							variant="card"
							cardLink={ PublishingPremiumLink }
							cardText={ sprintf(
								/* translators: %1$s expands to Premium. */
								__( "Unlock with %1$s", "wordpress-seo" ),
								"Premium"
							) }
							{ ...premiumUpsellConfig }
						>
							<FormikSelectPageWithDummy
								name="wpseo_titles.publishing_principles_id"
								id="input-wpseo_titles-publishing_principles_id"
								label={ __( "Publishing principles", "wordpress-seo" ) }
								className="yst-max-w-sm"
								description={ __( "The publishing principles describe the editorial principles of your organization.", "wordpress-seo" ) }
								isDummy={ ! isPremium }
							/>
							<FormikSelectPageWithDummy
								name="wpseo_titles.ownership_funding_info_id"
								id="input-wpseo_titles-ownership_funding_info_id"
								label={ __( "Ownership / Funding info", "wordpress-seo" ) }
								className="yst-max-w-sm"
								description={ __( "Ownership/funding info describes the ownership structure of your organization. It should include information about funding and grants. This information is a relevant signal relating to editorial independence.", "wordpress-seo" ) }
								isDummy={ ! isPremium }
							/>
							<FormikSelectPageWithDummy
								name="wpseo_titles.actionable_feedback_policy_id"
								id="input-wpseo_titles-actionable_feedback_policy_id"
								label={ __( "Actionable feedback policy", "wordpress-seo" ) }
								className="yst-max-w-sm"
								description={ __( "The actionable feedback policy provides insight into your organization's commitment to actively listening to public feedback. It showcases your organization's efforts to engage the public, rectify errors promptly, and prioritize transparency.", "wordpress-seo" ) }
								isDummy={ ! isPremium }
							/>
							<FormikSelectPageWithDummy
								name="wpseo_titles.corrections_policy_id"
								id="input-wpseo_titles-corrections_policy_id"
								label={ __( "Corrections policy", "wordpress-seo" ) }
								className="yst-max-w-sm"
								description={ __( "The corrections policy should clearly outline the procedure for addressing errors.", "wordpress-seo" ) }
								isDummy={ ! isPremium }
							/>
							<FormikSelectPageWithDummy
								name="wpseo_titles.ethics_policy_id"
								id="input-wpseo_titles-ethics_policy_id"
								label={ __( "Ethics policy", "wordpress-seo" ) }
								className="yst-max-w-sm"
								description={ __( "The ethics policy describes the personal, organizational, and corporate standards of behavior expected by your organization.", "wordpress-seo" ) }
								isDummy={ ! isPremium }
							/>
							<FormikSelectPageWithDummy
								name="wpseo_titles.diversity_policy_id"
								id="input-wpseo_titles-diversity_policy_id"
								label={ __( "Diversity policy", "wordpress-seo" ) }
								className="yst-max-w-sm"
								description={ __( "This page should provide comprehensive information on diversity policies, covering aspects such as staffing diversity and diversity in sourcing information.", "wordpress-seo" ) }
								isDummy={ ! isPremium }
							/>
							<FormikSelectPageWithDummy
								name="wpseo_titles.diversity_staffing_report_id"
								id="input-wpseo_titles-diversity_staffing_report_id"
								label={ __( "Diversity staffing report", "wordpress-seo" ) }
								className="yst-max-w-sm"
								description={ __( "This page should address the topic of staffing diversity, outlining relevant issues and considerations.", "wordpress-seo" ) }
								isDummy={ ! isPremium }
							/>
						</FeatureUpsell>
					</FieldsetLayout>
				</div>
			</FormLayout>
		</RouteLayout>
	);
};

export default SiteBasics;
