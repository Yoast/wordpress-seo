<?php
namespace Yoast\WP\SEO\NLWeb\Schema_Aggregator\Infrastructure\Adapters;

use Yoast\WP\SEO\Context\Meta_Tags_Context;

/**
 * Default meta tags context adapter for unknown page types.
 * Includes all fields as a fallback.
 */
class Default_Meta_Tags_Context_Memoizer_Adapter extends Abstract_Meta_Tags_Context_Memoizer_Adapter {

	/**
	 * Gets all optional fields as a fallback for unknown page types.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 * @return array<string, string|int|bool> All optional fields.
	 */
	protected function get_specific_fields( Meta_Tags_Context $context ): array {
		$fields = [
			'alternate_site_name'       => $context->alternate_site_name,
			'wordpress_site_name'       => $context->wordpress_site_name,
			'company_name'              => $context->company_name,
			'company_alternate_name'    => $context->company_alternate_name,
			'company_logo_id'           => $context->company_logo_id,
			'company_logo_meta'         => $context->company_logo_meta,
			'person_logo_id'            => $context->person_logo_id,
			'person_logo_meta'          => $context->person_logo_meta,
			'site_user_id'              => $context->site_user_id,
			'site_represents'           => $context->site_represents,
			'site_represents_reference' => $context->site_represents_reference,
			'schema_article_type'       => $context->schema_article_type,
			'open_graph_enabled'        => $context->open_graph_enabled,
			'open_graph_publisher'      => $context->open_graph_publisher,
			'twitter_card'              => $context->twitter_card,
			'has_image'                 => $context->has_image,
			'main_image_id'             => $context->main_image_id,
			'main_image_url'            => $context->main_image_url,
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