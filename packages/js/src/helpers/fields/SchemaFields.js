/**
 * This class is responsible for handling the interaction with the hidden fields for Schema.
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
		return SchemaFields.articleTypeInput.getAttribute( "data-default" );
	}

	/**
	 * Gets the ArticleType from the hidden input.
	 *
	 * @returns {string} The ArticleType.
	 */
	static get articleType() {
		return SchemaFields.articleTypeInput.value;
	}

	/**
	 * Sets the ArticleType on the hidden input.
	 *
	 * @param {string} articleType The selected ArticleType.
	 *
	 * @returns {void}
	 */
	static set articleType( articleType ) {
		SchemaFields.articleTypeInput.value = articleType;
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
		return SchemaFields.pageTypeInput.getAttribute( "data-default" );
	}

	/**
	 * Gets the PageType from the hidden input.
	 *
	 * @returns {string} The PageType.
	 */
	static get pageType() {
		return SchemaFields.pageTypeInput.value;
	}

	/**
	 * Sets the PageType on the hidden input.
	 *
	 * @param {string} pageType The selected PageType.
	 *
	 * @returns {void}
	 */
	static set pageType( pageType ) {
		SchemaFields.pageTypeInput.value = pageType;
	}
}
