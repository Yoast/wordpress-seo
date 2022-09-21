import { __ } from "@wordpress/i18n";
import { FieldsetLayout, FormikReplacementVariableEditorField, FormLayout } from "../components";
import { useSelectSettings } from "../hooks";

/**
 * @returns {JSX.Element} The search pages route.
 */
const SearchPages = () => {
	const replacementVariables = useSelectSettings( "selectReplacementVariablesFor", [], "search", "search" );
	const recommendedReplacementVariables = useSelectSettings( "selectRecommendedReplacementVariablesFor", [], "search", "search" );

	return (
		<FormLayout
			title={ __( "Search pages", "wordpress-seo" ) }
		>
			<FieldsetLayout
				title={ __( "Search appearance", "wordpress-seo" ) }
				description={ __( "Choose how your Search pages should look in search engines.", "wordpress-seo" ) }
			>
				<FormikReplacementVariableEditorField
					type="title"
					name="wpseo_titles.title-search-wpseo"
					fieldId="input-wpseo_titles.title-search-wpseo"
					label={ __( "SEO title", "wordpress-seo" ) }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
				/>
			</FieldsetLayout>
		</FormLayout>
	);
};

export default SearchPages;
