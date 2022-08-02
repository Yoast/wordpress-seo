import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import classNames from "classnames";
import { useFormikContext } from "formik";
import { FieldsetLayout, FormikMediaSelectField, FormikReplacementVariableEditorField, FormLayout, OpenGraphDisabledAlert } from "../components";
import { useSelectSettings } from "../store";

/**
 * @returns {JSX.Element} The homepage route.
 */
const Homepage = () => {
	const replacementVariables = useSelectSettings( "selectReplacementVariablesFor", [], "homepage", "page" );
	const recommendedReplacementVariables = useSelectSettings( "selectRecommendedReplacementVariablesFor", [], "homepage", "page" );

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
			"1200x675px"
		),
		{
			strong: <strong className="yst-font-semibold" />,
		}
	), [] );

	const { values } = useFormikContext();
	const { opengraph } = values.wpseo_social;

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
					fieldId="input-wpseo_titles-title-home-wpseo"
					label={ __( "SEO title", "wordpress-seo" ) }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
				/>
				<FormikReplacementVariableEditorField
					type="description"
					name="wpseo_titles.metadesc-home-wpseo"
					fieldId="input-wpseo_titles-metadesc-home-wpseo"
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
				<OpenGraphDisabledAlert
					isEnabled={ opengraph }
					/* translators: %1$s expands to an opening emphasis tag. %2$s expands to a closing emphasis tag. */
					text={ __( "The %1$sSite image%2$s, %1$sSocial title%2$s and %1$sSocial description%2$s require Open Graph data, which is currently disabled in the ‘Social sharing’ section in %3$sSite preferences%4$s.", "wordpress-seo" ) }
				/>
				<FormikMediaSelectField
					id="wpseo_titles-open_graph_frontpage_image"
					label={ __( "Site image", "wordpress-seo" ) }
					previewLabel={ recommendedSize }
					mediaUrlName="wpseo_titles.open_graph_frontpage_image"
					mediaIdName="wpseo_titles.open_graph_frontpage_image_id"
					disabled={ ! opengraph }
				/>
				<FormikReplacementVariableEditorField
					type="title"
					name="wpseo_titles.open_graph_frontpage_title"
					fieldId="input-wpseo_titles-open_graph_frontpage_title"
					label={ __( "Social title", "wordpress-seo" ) }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
					className={ classNames( ! opengraph && "yst-opacity-50" ) }
					isDisabled={ ! opengraph }
				/>
				<FormikReplacementVariableEditorField
					type="description"
					name="wpseo_titles.open_graph_frontpage_desc"
					fieldId="input-wpseo_titles-open_graph_frontpage_desc"
					label={ __( "Social description", "wordpress-seo" ) }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
					className={ classNames( "yst-replacevar--description", ! opengraph && "yst-opacity-50" ) }
					isDisabled={ ! opengraph }
				/>
			</FieldsetLayout>
		</FormLayout>
	);
};

export default Homepage;
