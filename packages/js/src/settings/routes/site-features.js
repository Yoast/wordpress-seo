
import { ExternalLinkIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/outline";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button } from "@yoast/ui-library";
import { useFormikContext } from "formik";
import { FormLayout, RouteLayout, FeaturesSection } from "../components";
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
	const isAllFeaturesOpen = useSelectSettings( "selectIsAllFeaturesOpen", [] );
	const { toggleAllFeatures } = useDispatchSettings();
	const { values, initialValues } = useFormikContext();
	const { enable_xml_sitemap: enableXmlSitemap } = values.wpseo;
	const { enable_xml_sitemap: initialEnableXmlSitemap } = initialValues.wpseo;
	const navigate = useNavigate();
	const handleLlmsTxtNavigate = useCallback( () => {
		navigate( "/llms-txt" );
	}, [] );

	const aiToolsFeaturesWithCallback = aiToolsFeatures.map( feature => {
		if ( feature.name === "wpseo.enable_llms_txt" ) {
			return {
				...feature,
				children: <Button
					onClick={ handleLlmsTxtNavigate }
					id="link-llms"
					variant="secondary"
					target="_blank"
					rel="noopener"
					className="yst-self-start yst-mt-4"
				>
					{ __( "Customize llms.txt file", "wordpress-seo" ) }
				</Button>,
			};
		}
		return feature;
	} );

	const technicalSeoFeaturesUpdated = technicalSeoFeatures.map( feature => {
		if ( feature.name === "wpseo.enable_xml_sitemap" ) {
			return {
				...feature,
				children: initialEnableXmlSitemap && enableXmlSitemap && <Button
					as="a"
					id="link-xml-sitemaps"
					href={ sitemapUrl }
					variant="secondary"
					target="_blank"
					rel="noopener"
					className="yst-self-start yst-mt-4"
				>
					{ __( "View the XML sitemap", "wordpress-seo" ) }
					<ExternalLinkIcon className="yst--me-1 yst-ms-1 yst-h-5 yst-w-5 yst-text-slate-400 rtl:yst-rotate-[270deg]" />
				</Button>,
			};
		}
		return feature;
	} );

	const ChevronIcon = isAllFeaturesOpen ? ChevronUpIcon : ChevronDownIcon;

	return (
		<RouteLayout
			title={ __( "Site features", "wordpress-seo" ) }
			description={ <>
				<p className="yst-text-tiny yst-mt-3">{ __( "Tell us which features you want to use.", "wordpress-seo" ) }</p>
				<Button
					variant="secondary"
					size="small"
					className="yst-mt-3"
					onClick={ toggleAllFeatures }
				>
					<ChevronIcon className="yst-h-4 yst-w-4 yst-text-slate-400 yst-me-2" />
					{ isAllFeaturesOpen ? __( "Collapse all", "wordpress-seo" ) : __( "Expand all", "wordpress-seo" ) }
				</Button>
			</> }
		>
			<FormLayout>
				<div className="yst-max-w-2xl yst-mb-8">
					<FeaturesSection id="ai-tools" title={ __( "AI tools", "wordpress-seo" ) } features={ aiToolsFeaturesWithCallback } />
					<FeaturesSection id="content-optimization" title={ __( "Content optimization", "wordpress-seo" ) } features={ contentOptimizationFeatures } />
					<FeaturesSection id="site-structure" title={ __( "Site structure", "wordpress-seo" ) } features={ siteStructureFeatures } />
					<FeaturesSection id="technical-seo" title={ __( "Technical SEO", "wordpress-seo" ) } features={ technicalSeoFeaturesUpdated }  />
					<FeaturesSection id="social-sharing" title={ __( "Social sharing", "wordpress-seo" ) } features={ socialSharingFeatures }  />
					<FeaturesSection id="tools" title={ __( "Tools", "wordpress-seo" ) } features={ toolsFeatures }  />
				</div>
			</FormLayout>
		</RouteLayout>
	);
};

export default SiteFeatures;
