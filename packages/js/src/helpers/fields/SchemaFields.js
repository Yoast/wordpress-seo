import { metaKeySchemaArticleType, metaKeySchemaPageType } from "../../shared-admin/constants/meta-keys";
import { getMetaValue, setMetaValue } from "./rest-meta";

/**
 * This class is responsible for handling the interaction with the hidden fields for Schema.
 *
 * When `wpseoScriptData.disableMetaboxInBlockEditor` is true the hidden DOM fields are not rendered.
 * In that case getters read from the `core/editor` store and setters dispatch to it so that
 * WordPress saves the values via the REST API on post save.
 */
export default class SchemaFields {
	/**
	 * Gets the ArticleType hidden input.
	 *
	 * @returns {Object} The ArticleType input.
	 */
	static get articleTypeInput() {
		return document.getElementById( "yoast_wpseo_schema_article_type" );
	}

	/**
	 * Gets the default ArticleType from the hidden input.
	 *
	 * @returns {string} The default ArticleType.
	 */
	static get defaultArticleType() {
		return SchemaFields.articleTypeInput?.getAttribute( "data-default" ) ?? "";
	}

	/**
	 * Gets the ArticleType from the hidden input or the REST meta store.
	 *
	 * @returns {string} The ArticleType.
	 */
	static get articleType() {
		return getMetaValue( metaKeySchemaArticleType, SchemaFields.articleTypeInput, "" );
	}

	/**
	 * Sets the ArticleType on the hidden input or dispatches to the REST meta store.
	 *
	 * @param {string} articleType The selected ArticleType.
	 *
	 * @returns {void}
	 */
	static set articleType( articleType ) {
		setMetaValue( metaKeySchemaArticleType, SchemaFields.articleTypeInput, articleType );
	}

	/**
	 * Gets the PageType hidden input.
	 *
	 * @returns {Object} The PageType input.
	 */
	static get pageTypeInput() {
		return document.getElementById( "yoast_wpseo_schema_page_type" );
	}

	/**
	 * Gets the default PageType from the hidden input.
	 *
	 * @returns {string} The default PageType.
	 */
	static get defaultPageType() {
		return SchemaFields.pageTypeInput?.getAttribute( "data-default" ) ?? "";
	}

	/**
	 * Gets the PageType from the hidden input or the REST meta store.
	 *
	 * @returns {string} The PageType.
	 */
	static get pageType() {
		return getMetaValue( metaKeySchemaPageType, SchemaFields.pageTypeInput, "" );
	}

	/**
	 * Sets the PageType on the hidden input or dispatches to the REST meta store.
	 *
	 * @param {string} pageType The selected PageType.
	 *
	 * @returns {void}
	 */
	static set pageType( pageType ) {
		setMetaValue( metaKeySchemaPageType, SchemaFields.pageTypeInput, pageType );
	}
}
