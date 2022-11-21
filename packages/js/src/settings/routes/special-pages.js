import { __ } from "@wordpress/i18n";
import { FieldsetLayout, FormikReplacementVariableEditorField, FormLayout, RouteLayout } from "../components";
import { useSelectSettings } from "../hooks";

/**
 * @returns {JSX.Element} The special pages route.
 */
const SpecialPages = () => {
	const searchReplacementVariables = useSelectSettings( "selectReplacementVariablesFor", [], "search", "search" );
	const searchRecommendedReplacementVariables = useSelectSettings( "selectRecommendedReplacementVariablesFor", [], "search", "search" );
	const notFoundReplacementVariables = useSelectSettings( "selectReplacementVariablesFor", [], "404", "404" );
	const notFoundRecommendedReplacementVariables = useSelectSettings( "selectRecommendedReplacementVariablesFor", [], "404", "404" );

	return (
		<RouteLayout title={ __( "Special pages", "wordpress-seo" ) }>
			<FormLayout>
				<div className="yst-max-w-5xl">
					<FieldsetLayout
						title={ __( "Internal search pages", "wordpress-seo" ) }
						description={ __( "Determine how the title of your internal search pages should look in the browser.", "wordpress-seo" ) }
					>
						<FormikReplacementVariableEditorField
							type="title"
							name="wpseo_titles.title-search-wpseo"
							fieldId="input-wpseo_titles.title-search-wpseo"
							label={ __( "Page title", "wordpress-seo" ) }
							replacementVariables={ searchReplacementVariables }
							recommendedReplacementVariables={ searchRecommendedReplacementVariables }
						/>
					</FieldsetLayout>
					<hr className="yst-my-8" />
					<FieldsetLayout
						title={ __( "404 error pages", "wordpress-seo" ) }
						description={ __( "Determine how the title of your 404 error pages should look in the browser.", "wordpress-seo" ) }
					>
						<FormikReplacementVariableEditorField
							type="title"
							name="wpseo_titles.title-404-wpseo"
							fieldId="input-wpseo_titles.title-404-wpseo"
							label={ __( "Page title", "wordpress-seo" ) }
							replacementVariables={ notFoundReplacementVariables }
							recommendedReplacementVariables={ notFoundRecommendedReplacementVariables }
						/>
					</FieldsetLayout>
				</div>
			</FormLayout>
		</RouteLayout>
	);
};

export default SpecialPages;
