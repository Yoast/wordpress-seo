import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { useFormikContext } from "formik";
import { FormLayout,
	RouteLayout,
	FeaturesSection,
	LlmsTxtButton,
	XmlSitemapButton,
	SiteFeatureDescription,
	SchemaDisableConfirmationModal,
	SchemaProgrammaticallyDisabledModal } from "../components";
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
import { values as getValues } from "lodash";

/**
 * @returns {JSX.Element} The site preferences route.
 */
const SiteFeatures = () => {
	const sitemapUrl = useSelectSettings( "selectPreference", [], "sitemapUrl" );
	const isPremium = useSelectSettings( "selectPreference", [], "isPremium" );
	const isAllFeaturesOpen = useSelectSettings( "selectIsAllFeaturesOpen", [] );
	const isSchemaDisabledProgrammatically = useSelectSettings( "selectSchemaIsSchemaDisabledProgrammatically", [] );
	const { toggleAllFeatures } = useDispatchSettings();
	const { values, initialValues } = useFormikContext();
	const { enable_xml_sitemap: enableXmlSitemap } = values.wpseo;
	const { enable_xml_sitemap: initialEnableXmlSitemap } = initialValues.wpseo;
	const navigate = useNavigate();
	const handleLlmsTxtNavigate = useCallback( () => {
		navigate( "/llms-txt" );
	}, [] );

	aiToolsFeatures.llmsTxt.children = <LlmsTxtButton onClick={ handleLlmsTxtNavigate } />;
	technicalSeoFeatures.xmlSitemaps.children = initialEnableXmlSitemap && enableXmlSitemap && <XmlSitemapButton href={ sitemapUrl } />;

	if ( isPremium ) {
		siteStructureFeatures.internalLinkingSuggestions.learnMoreUrl = "https://yoa.st/17g";
	}

	technicalSeoFeatures.schemaFramework.disableConfirmationModal = SchemaDisableConfirmationModal;
	if ( isSchemaDisabledProgrammatically ) {
		technicalSeoFeatures.schemaFramework.programmaticallyDisabledModal = SchemaProgrammaticallyDisabledModal;
	}

	const featureSections = [
		{ id: "ai-tools", title: __( "AI tools", "wordpress-seo" ), features: aiToolsFeatures },
		{ id: "content-optimization", title: __( "Content optimization", "wordpress-seo" ), features: contentOptimizationFeatures },
		{ id: "site-structure", title: __( "Site structure", "wordpress-seo" ), features: siteStructureFeatures },
		{ id: "technical-seo", title: __( "Technical SEO", "wordpress-seo" ), features: technicalSeoFeatures },
		{ id: "social-sharing", title: __( "Social sharing", "wordpress-seo" ), features: socialSharingFeatures },
		{ id: "tools", title: __( "Tools", "wordpress-seo" ), features: toolsFeatures },
	];

	return (
		<RouteLayout
			title={ __( "Site features", "wordpress-seo" ) }
			description={ <SiteFeatureDescription isAllFeaturesOpen={ isAllFeaturesOpen } toggleAllFeatures={ toggleAllFeatures } /> }
		>
			<FormLayout>
				<div className="yst-max-w-2xl">
					{ featureSections.map( ( section ) => (
						<FeaturesSection
							key={ section.id }
							id={ section.id }
							title={ section.title }
							features={ getValues( section.features ) }
						/>
					) ) }
				</div>
			</FormLayout>
		</RouteLayout>
	);
};

export default SiteFeatures;
