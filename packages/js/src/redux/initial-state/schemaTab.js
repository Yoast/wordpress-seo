import { get } from "lodash";

export const schemaInitialState = {
	pageType: get( window, "wpseoScriptData.metabox.metadata.schema_page_type", "" ),
	defaultPageType: get( window, "wpseoScriptData.metabox.schemaDefaults.pageType", "" ),
	articleType: get( window, "wpseoScriptData.metabox.metadata.schema_article_type", "" ),
	defaultArticleType: get( window, "wpseoScriptData.metabox.schemaDefaults.articleType", "" ),
	showArticleType: get( window, "wpseoScriptData.metabox.metadata.schema_article_type", false ) !== false,
};
