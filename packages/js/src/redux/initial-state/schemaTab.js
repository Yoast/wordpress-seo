import { get } from "lodash";

const schemaTab = {
	pageType: get( window, "wpseoScriptData.metabox.metadata.schema_page_type", "" ),
	defaultPageType: get( window, "wpseoScriptData.metabox.schemaDefaults.defaultPageType", "" ),
	articleType: get( window, "wpseoScriptData.metabox.metadata.schema_article_type", "" ),
	defaultArticleType: get( window, "wpseoScriptData.metabox.schemaDefaults.defaultArticleType", "" ),
	showArticleTypeInput: get( window, "wpseoScriptData.metabox.metadata.schema_article_type", false ) !== false,
};

export default schemaTab;
