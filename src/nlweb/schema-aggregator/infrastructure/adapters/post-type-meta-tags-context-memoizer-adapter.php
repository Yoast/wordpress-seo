<?php
namespace Yoast\WP\SEO\NLWeb\Schema_Aggregator\Infrastructure\Adapters;

use Yoast\WP\SEO\Context\Meta_Tags_Context;

/**
 * Meta tags context adapter for post type pages.
 */
class Post_Type_Meta_Tags_Context_Memoizer_Adapter extends Abstract_Meta_Tags_Context_Memoizer_Adapter {

	/**
	 * Gets fields specific to post type pages.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 * @return array<string, string|int|bool> The post type specific fields.
	 */
	protected function get_specific_fields( Meta_Tags_Context $context ): array {
		$fields = [
			'schema_article_type'       => $context->schema_article_type,
			'has_image'                 => $context->has_image,
			'main_image_id'             => $context->main_image_id,
			'main_image_url'            => $context->main_image_url,
			'open_graph_enabled'        => $context->open_graph_enabled,
			'open_graph_publisher'      => $context->open_graph_publisher,
			'twitter_card'              => $context->twitter_card,
		];

		// Access public property directly (not through __get magic method)
		$fields['has_article'] = $context->has_article;

		// Access dynamic property if it exists
		if ( isset( $context->main_entity_of_page ) ) {
			$fields['main_entity_of_page'] = $context->main_entity_of_page;
		}

		return $fields;
	}
}