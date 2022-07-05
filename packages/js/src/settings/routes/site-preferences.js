import { __ } from "@wordpress/i18n";
import { Button, Title, ToggleField } from "@yoast/ui-library";
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
			<Form className="yst-max-w-5xl yst-p-8">
				<div className="lg:yst-grid lg:yst-grid-cols-3 lg:yst-gap-12">
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
					</fieldset>
				</div>

				<footer>
					<Button type="submit" isLoading={ isSubmitting } disabled={ isSubmitting }>
						{ __( "Save changes", "wordpress-seo" ) }
					</Button>
				</footer>
			</Form>
		</div>
	);
};

export default SitePreferences;
