<?php
namespace Yoast\WP\SEO\NLWeb\Schema_Aggregator\Infrastructure\Adapters;

use Yoast\WP\SEO\Context\Meta_Tags_Context;

/**
 * Interface for converting Meta_Tags_Context objects to arrays.
 */
interface Meta_Tags_Context_Memoizer_Adapter_Interface {

	/**
	 * Converts a Meta_Tags_Context object to an array.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 * @return array<string, string|int|bool> The meta tags context as an array.
	 */
	public function meta_tags_context_to_array( Meta_Tags_Context $context ): array;
}