import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { FieldsetLayout, FormikMediaSelectField, FormikReplacementVariableEditorField, FormLayout } from "../components";
import { useSelectSettings } from "../store";

/**
 * @returns {JSX.Element} The homepage route.
 */
const Homepage = () => {
	const replacementVariables = useSelectSettings( "selectReplacementVariablesFor", [], "post" );
	const recommendedReplacementVariables = useSelectSettings( "selectRecommendedReplacementVariablesFor", [], "homepage" );
	const recommendedSize = useMemo( () => createInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s expands to an opening strong tag.
			 * %2$s expands to a closing strong tag.
			 * %3$s expands to the recommended image size.
			 */
			__( "Recommended size for this image is %1$s%3$s%2$s", "wordpress-seo" ),
			"<strong>",
			"</strong>",
			"1200x675"
		),
		{
			strong: <strong className="yst-font-semibold" />,
		}
	) );

	return (
		<FormLayout
			title={ __( "Homepage", "wordpress-seo" ) }
			description={ __( "Choose how your Homepage should look in search engines and on social media. Note that this is what people probably will see when they search for your brand name.", "wordpress-seo" ) }
		>
			<FieldsetLayout
				title={ __( "Search appearance", "wordpress-seo" ) }
				description={ __( "Choose how your Homepage should look in search engines.", "wordpress-seo" ) }
			>
				<FormikReplacementVariableEditorField
					type="title"
					name="wpseo_titles.title-home-wpseo"
					fieldId="input:wpseo_titles.title-home-wpseo"
					label={ __( "SEO title", "wordpress-seo" ) }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
				/>
				<FormikReplacementVariableEditorField
					type="description"
					name="wpseo_titles.metadesc-home-wpseo"
					fieldId="input:wpseo_titles.metadesc-home-wpseo"
					label={ __( "Meta description", "wordpress-seo" ) }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
					className="yst-replacevar--description"
				/>
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout
				title={ __( "Social appearance", "wordpress-seo" ) }
				description={ __( "Choose how your Homepage should look on social media.", "wordpress-seo" ) }
			>
				<FormikMediaSelectField
					id="wpseo_titles.open_graph_frontpage_image"
					label={ __( "Site image", "wordpress-seo" ) }
					previewLabel={ recommendedSize }
					mediaUrlName="wpseo_titles.open_graph_frontpage_image"
					mediaIdName="wpseo_titles.open_graph_frontpage_image_id"
				/>
				<FormikReplacementVariableEditorField
					type="title"
					name="wpseo_titles.open_graph_frontpage_title"
					fieldId="input:wpseo_titles.open_graph_frontpage_title"
					label={ __( "Social title", "wordpress-seo" ) }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
				/>
				<FormikReplacementVariableEditorField
					type="description"
					name="wpseo_titles.open_graph_frontpage_desc"
					fieldId="input:wpseo_titles.open_graph_frontpage_desc"
					label={ __( "Social description", "wordpress-seo" ) }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
					className="yst-replacevar--description"
				/>
			</FieldsetLayout>
		</FormLayout>
	);
};

export default Homepage;
