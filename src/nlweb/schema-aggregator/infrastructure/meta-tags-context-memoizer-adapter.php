<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\NLWeb\Schema_Aggregator\Infrastructure;

use Yoast\WP\SEO\Context\Meta_Tags_Context;

/**
 * Class for converting Meta_Tags_Context objects to arrays.
 */
class Meta_Tags_Context_Memoizer_Adapter {

	/**
	 * Converts a Meta_Tags_Context object to an array.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 * @return array<string, string|int|bool> The meta tags context as an array.
	 */
	public function meta_tags_context_to_array( Meta_Tags_Context $context ): array {
		return $context->presentation->schema;
	}
}
