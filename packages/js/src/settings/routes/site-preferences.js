import { __ } from "@wordpress/i18n";
import { Badge, Button, Title, ToggleField } from "@yoast/ui-library";
import { Form, useFormikContext } from "formik";
import { FormikValueChangeField } from "../hocs";

/**
 * @returns {JSX.Element} The site preferences route.
 */
const SitePreferences = () => {
	const { isSubmitting } = useFormikContext();

	return (
		<div className="yst-rounded-lg yst-overflow-hidden yst-bg-white yst-shadow">
			<header className="yst-border-b yst-border-gray-200">
				<div className="yst-max-w-screen-sm yst-p-8">
					<Title>{ __( "Site preferences", "wordpress-seo" ) }</Title>
					<p className="yst-text-tiny yst-mt-3">
						{ __( "Tell us which features you want to use.", "wordpress-seo" ) }
					</p>
				</div>
			</header>
			<Form>
				<div className="yst-p-8 lg:yst-grid lg:yst-grid-cols-3 lg:yst-gap-12 yst-max-w-5xl">
					<div className="lg:yst-col-span-1">
						<div className="yst-max-w-screen-sm">
							<Title as="h3" className="yst-text-base yst-mb-2">{ __( "Copywriting", "wordpress-seo" ) }</Title>
						</div>
					</div>
					<div className="yst-mt-8 lg:yst-mt-0 lg:yst-col-span-2">
						<fieldset>
							<FormikValueChangeField
								as={ ToggleField }
								type="checkbox"
								name="wpseo.keyword_analysis_active"
								data-id="input:wpseo.keyword_analysis_active"
								label={ __( "SEO analysis", "wordpress-seo" ) }
								className="yst-mb-8"
							>
								{ __( "The SEO analysis offers suggestions to improve the SEO of your text.", "wordpress-seo" ) }
							</FormikValueChangeField>
							<FormikValueChangeField
								as={ ToggleField }
								type="checkbox"
								name="wpseo.content_analysis_active"
								data-id="input:wpseo.content_analysis_active"
								label={ __( "Readability analysis", "wordpress-seo" ) }
								className="yst-mb-8"
							>
								{ __( "The readability analysis offers suggestions to improve the structure and style of your text.", "wordpress-seo" ) }
							</FormikValueChangeField>
							<FormikValueChangeField
								as={ ToggleField }
								type="checkbox"
								name="wpseo.enable_metabox_insights"
								data-id="input:wpseo.enable_metabox_insights"
								label={ __( "Insights", "wordpress-seo" ) }
								className="yst-mb-8"
								labelSuffix={ <Badge className="yst-ml-1.5" variant="upsell">Premium</Badge> }
							>
								{ __( "The Insights section in our metabox shows you useful data about your content, like what words you use most often.", "wordpress-seo" ) }
							</FormikValueChangeField>
						</fieldset>
					</div>
				</div>

				<footer className="yst-p-8 yst-bg-gray-50">
					<Button type="submit" isLoading={ isSubmitting } disabled={ isSubmitting }>
						{ __( "Save changes", "wordpress-seo" ) }
					</Button>
				</footer>
			</Form>
		</div>
	);
};

export default SitePreferences;
