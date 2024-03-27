import { get } from "lodash";

const schemaTab = {
	pageType: get( window, "wpseoScriptData.metabox.metadata.schema_page_type", "" ),
	defaultPageType: get( window, "wpseoScriptData.metabox.metadata.schema_page_type_default", "" ),
	articleType: get( window, "wpseoScriptData.metabox.metadata.schema_article_type", "" ),
	defaultArticleType: get( window, "wpseoScriptData.metabox.metadata.schema_article_type_default", "" ),
};

export default schemaTab;
