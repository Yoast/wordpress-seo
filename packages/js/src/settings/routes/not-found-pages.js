import { __ } from "@wordpress/i18n";
import { FieldsetLayout, FormikReplacementVariableEditorField, FormLayout } from "../components";
import { useSelectSettings } from "../hooks";

/**
 * @returns {JSX.Element} The 404 pages route.
 */
const NotFoundPages = () => {
	const replacementVariables = useSelectSettings( "selectReplacementVariablesFor", [], "404", "404" );
	const recommendedReplacementVariables = useSelectSettings( "selectRecommendedReplacementVariablesFor", [], "404", "404" );

	return (
		<FormLayout
			title={ __( "404 pages", "wordpress-seo" ) }
		>
			<FieldsetLayout
				title={ __( "Search appearance", "wordpress-seo" ) }
				description={ __( "Choose how your 404 pages should look in search engines.", "wordpress-seo" ) }
			>
				<FormikReplacementVariableEditorField
					type="title"
					name="wpseo_titles.title-404-wpseo"
					fieldId="input-wpseo_titles.title-404-wpseo"
					label={ __( "SEO title", "wordpress-seo" ) }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
				/>
			</FieldsetLayout>
		</FormLayout>
	);
};

export default NotFoundPages;
