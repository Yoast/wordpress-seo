<?php
namespace Yoast\WP\SEO\NLWeb\Schema_Aggregator\Infrastructure\Adapters;

use Yoast\WP\SEO\Context\Meta_Tags_Context;

/**
 * Meta tags context adapter for search result pages.
 */
class Search_Result_Meta_Tags_Context_Memoizer_Adapter extends Abstract_Meta_Tags_Context_Memoizer_Adapter {

	/**
	 * Gets fields specific to search result pages.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 * @return array<string, string|int|bool> The search specific fields.
	 */
	protected function get_specific_fields( Meta_Tags_Context $context ): array {
		return [
			'open_graph_enabled'        => $context->open_graph_enabled,
			'twitter_card'              => $context->twitter_card,
		];
	}
}