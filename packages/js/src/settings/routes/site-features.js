import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { useFormikContext } from "formik";
import { FormLayout, RouteLayout, FeaturesSection, LlmsTxtButton, XmlSitemapButton, SiteFeatureDescription } from "../components";
import { useSelectSettings, useDispatchSettings } from "../hooks";
import { useNavigate } from "react-router-dom";
import {
	aiToolsFeatures,
	technicalSeoFeatures,
	socialSharingFeatures,
	siteStructureFeatures,
	contentOptimizationFeatures,
	toolsFeatures,
} from "../site-features";

/**
 * @returns {JSX.Element} The site preferences route.
 */
const SiteFeatures = () => {
	const sitemapUrl = useSelectSettings( "selectPreference", [], "sitemapUrl" );
	const isPremium = useSelectSettings( "selectPreference", [], "isPremium" );
	const isAllFeaturesOpen = useSelectSettings( "selectIsAllFeaturesOpen", [] );
	const { toggleAllFeatures } = useDispatchSettings();
	const { values, initialValues } = useFormikContext();
	const { enable_xml_sitemap: enableXmlSitemap } = values.wpseo;
	const { enable_xml_sitemap: initialEnableXmlSitemap } = initialValues.wpseo;
	const navigate = useNavigate();
	const handleLlmsTxtNavigate = useCallback( () => {
		navigate( "/llms-txt" );
	}, [] );

	const aiToolsFeaturesUpdated = aiToolsFeatures.map( feature => {
		if ( feature.name === "wpseo.enable_llms_txt" ) {
			return {
				...feature,
				children: <LlmsTxtButton onClick={ handleLlmsTxtNavigate } />,
			};
		}
		return feature;
	} );

	const technicalSeoFeaturesUpdated = technicalSeoFeatures.map( feature => {
		if ( feature.name === "wpseo.enable_xml_sitemap" ) {
			return {
				...feature,
				children: initialEnableXmlSitemap && enableXmlSitemap && <XmlSitemapButton href={ sitemapUrl } />,
			};
		}
		return feature;
	} );

	const siteStructureFeaturesUpdated = siteStructureFeatures.map( feature => {
		if ( feature.name === "wpseo.enable_link_suggestions" && isPremium ) {
			return {
				...feature,
				learnMoreUrl: "https://yoa.st/17g",
			};
		}
		return feature;
	} );

	return (
		<RouteLayout
			title={ __( "Site features", "wordpress-seo" ) }
			description={ <SiteFeatureDescription isAllFeaturesOpen={ isAllFeaturesOpen } toggleAllFeatures={ toggleAllFeatures } /> }
		>
			<FormLayout>
				<div className="yst-max-w-2xl">
					<FeaturesSection id="ai-tools" title={ __( "AI tools", "wordpress-seo" ) } features={ aiToolsFeaturesUpdated } />
					<FeaturesSection id="content-optimization" title={ __( "Content optimization", "wordpress-seo" ) } features={ contentOptimizationFeatures } />
					<FeaturesSection id="site-structure" title={ __( "Site structure", "wordpress-seo" ) } features={ siteStructureFeaturesUpdated } />
					<FeaturesSection id="technical-seo" title={ __( "Technical SEO", "wordpress-seo" ) } features={ technicalSeoFeaturesUpdated }  />
					<FeaturesSection id="social-sharing" title={ __( "Social sharing", "wordpress-seo" ) } features={ socialSharingFeatures }  />
					<FeaturesSection id="tools" title={ __( "Tools", "wordpress-seo" ) } features={ toolsFeatures }  />
				</div>
			</FormLayout>
		</RouteLayout>
	);
};

export default SiteFeatures;
