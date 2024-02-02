import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert } from "@yoast/ui-library";
import { useFormikContext } from "formik";
import { addLinkToString } from "../../helpers/stringHelpers";
import {
	FieldsetLayout,
	FormikMediaSelectField,
	FormikReplacementVariableEditorField,
	FormLayout,
	OpenGraphDisabledAlert,
	RouteLayout,
} from "../components";
import { useSelectSettings } from "../hooks";

/**
 * @returns {JSX.Element} The element.
 */
const LatestPosts = () => {
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

	return <>
		<FieldsetLayout
			title={ __( "Search appearance", "wordpress-seo" ) }
			description={ __( "Determine how your homepage should look in the search results.", "wordpress-seo" ) }
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
			title={ __( "Social media appearance", "wordpress-seo" ) }
			description={ __( "Determine how your homepage should look on social media.", "wordpress-seo" ) }
		>
			<OpenGraphDisabledAlert
				isEnabled={ opengraph }
				/* translators: %1$s expands to an opening emphasis tag. %2$s expands to a closing emphasis tag. */
				text={ __( "The %1$ssocial image%2$s, %1$ssocial title%2$s and %1$ssocial description%2$s require Open Graph data, which is currently disabled in the ‘Social sharing’ section in %3$sSite features%4$s.", "wordpress-seo" ) }
			/>
			<FormikMediaSelectField
				id="wpseo_titles-open_graph_frontpage_image"
				label={ __( "Social image", "wordpress-seo" ) }
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
				disabled={ ! opengraph }
			/>
			<FormikReplacementVariableEditorField
				type="description"
				name="wpseo_titles.open_graph_frontpage_desc"
				fieldId="input-wpseo_titles-open_graph_frontpage_desc"
				label={ __( "Social description", "wordpress-seo" ) }
				replacementVariables={ replacementVariables }
				recommendedReplacementVariables={ recommendedReplacementVariables }
				className="yst-replacevar--description"
				disabled={ ! opengraph }
			/>
		</FieldsetLayout>
	</>;
};

/**
 * @returns {JSX.Element} The element.
 */
const PageAndPosts = () => {
	const homepagePageEditUrl = useSelectSettings( "selectPreference", [], "homepagePageEditUrl" );
	const homepagePostsEditUrl = useSelectSettings( "selectPreference", [], "homepagePostsEditUrl" );

	const homepagePageEditDescription = useMemo( () => addLinkToString(
		sprintf(
			/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
			__( "You can determine the title and description for the homepage by %1$sediting the homepage itself%2$s.", "wordpress-seo" ),
			"<a>",
			"</a>"
		),
		homepagePageEditUrl,
		"link-homepage-page-edit"
	) );
	const homepagePostsEditDescription = useMemo( () => addLinkToString(
		sprintf(
			/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
			__( "You can determine the title and description for the blog page by %1$sediting the blog page itself%2$s.", "wordpress-seo" ),
			"<a>",
			"</a>"
		),
		homepagePostsEditUrl,
		"link-homepage-posts-page-edit"
	) );

	return (
		<div className="yst-max-w-screen-sm">
			<Alert>
				<p>{ homepagePageEditDescription }</p>
				{ homepagePostsEditUrl && <p className="yst-pt-2">{ homepagePostsEditDescription }</p> }
			</Alert>
		</div>
	);
};

/**
 * @returns {JSX.Element} The homepage route.
 */
const Homepage = () => {
	const homepageIsLatestPosts = useSelectSettings( "selectPreference", [], "homepageIsLatestPosts" );

	return (
		<RouteLayout
			title={ __( "Homepage", "wordpress-seo" ) }
			description={ __( "Determine how your homepage should look in the search results and on social media. This is what people probably will see when they search for your brand name.", "wordpress-seo" ) }
		>
			<FormLayout>
				<div className="yst-max-w-5xl">
					{ homepageIsLatestPosts && <LatestPosts /> }
					{ ! homepageIsLatestPosts && <PageAndPosts /> }
				</div>
			</FormLayout>
		</RouteLayout>
	);
};

export default Homepage;
