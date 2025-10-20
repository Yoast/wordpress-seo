<?php
namespace Yoast\WP\SEO\NLWeb\Schema_Aggregator\Infrastructure;

use Yoast\WP\SEO\Context\Meta_Tags_Context;

/**
 * Meta tags context to array converter.
 */
class Meta_Tags_Context_Memoizer_Adapter {

	/**
	 * Converts a Meta_Tags_Context object to an array.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 * @return array<string, string|int|bool> The meta tags context as an array.
	 */
	public function meta_tags_context_to_array( Meta_Tags_Context $context ): array {
		return [
			'canonical'                 => $context->canonical,
			'permalink'                 => $context->permalink,
			'title'                     => $context->title,
			'description'               => $context->description,
			'id'                        => $context->id,
			'site_name'                 => $context->site_name,
			'alternate_site_name'       => $context->alternate_site_name,
			'wordpress_site_name'       => $context->wordpress_site_name,
			'site_url'                  => $context->site_url,
			'company_name'              => $context->company_name,
			'company_alternate_name'    => $context->company_alternate_name,
			'company_logo_id'           => $context->company_logo_id,
			'company_logo_meta'         => $context->company_logo_meta,
			'person_logo_id'            => $context->person_logo_id,
			'person_logo_meta'          => $context->person_logo_meta,
			'site_user_id'              => $context->site_user_id,
			'site_represents'           => $context->site_represents,
			'site_represents_reference' => $context->site_represents_reference,
			'schema_page_type'          => $context->schema_page_type,
			'schema_article_type'       => $context->schema_article_type,
			'main_schema_id'            => $context->main_schema_id,
			'main_entity_of_page'       => $context->main_entity_of_page,
			'open_graph_enabled'        => $context->open_graph_enabled,
			'open_graph_publisher'      => $context->open_graph_publisher,
			'twitter_card'              => $context->twitter_card,
			'page_type'                 => $context->page_type,
			'has_article'               => $context->has_article,
			'has_image'                 => $context->has_image,
			'main_image_id'             => $context->main_image_id,
			'main_image_url'            => $context->main_image_url,
		];
	}
}
