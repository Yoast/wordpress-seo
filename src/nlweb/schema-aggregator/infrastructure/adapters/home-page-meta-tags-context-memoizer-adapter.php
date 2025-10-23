<?php
namespace Yoast\WP\SEO\NLWeb\Schema_Aggregator\Infrastructure\Adapters;

use Yoast\WP\SEO\Context\Meta_Tags_Context;

/**
 * Meta tags context adapter for home pages.
 */
class Home_Page_Meta_Tags_Context_Memoizer_Adapter extends Abstract_Meta_Tags_Context_Memoizer_Adapter {

	/**
	 * Gets fields specific to home pages.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 * @return array<string, string|int|bool> The home page specific fields.
	 */
	protected function get_specific_fields( Meta_Tags_Context $context ): array {
		return [
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
			'open_graph_enabled'        => $context->open_graph_enabled,
			'open_graph_publisher'      => $context->open_graph_publisher,
			'twitter_card'              => $context->twitter_card,
		];
	}
}