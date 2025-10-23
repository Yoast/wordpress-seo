<?php
namespace Yoast\WP\SEO\NLWeb\Schema_Aggregator\Infrastructure\Adapters;

use Yoast\WP\SEO\Context\Meta_Tags_Context;

/**
 * Abstract base class for Meta_Tags_Context_Memoizer_Adapter implementations.
 */
abstract class Abstract_Meta_Tags_Context_Memoizer_Adapter implements Meta_Tags_Context_Memoizer_Adapter_Interface {

	/**
	 * Converts a Meta_Tags_Context object to an array.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 * @return array<string, string|int|bool> The meta tags context as an array.
	 */
	public function meta_tags_context_to_array( Meta_Tags_Context $context ): array {
		return \array_merge(
			$this->get_base_fields( $context ),
			$this->get_specific_fields( $context )
		);
	}

	/**
	 * Gets the base fields that are relevant for all page types.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 * @return array<string, string|int|bool> The base fields.
	 */
	protected function get_base_fields( Meta_Tags_Context $context ): array {
		return [
			'canonical'         => $context->canonical,
			'permalink'         => $context->permalink,
			'title'             => $context->title,
			'description'       => $context->description,
			'id'                => $context->id,
			'site_name'         => $context->site_name,
			'site_url'          => $context->site_url,
			'schema_page_type'  => $context->schema_page_type,
			'main_schema_id'    => $context->main_schema_id,
			'page_type'         => $context->page_type,
		];
	}

	/**
	 * Gets the page-type specific fields.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 * @return array<string, string|int|bool> The page-type specific fields.
	 */
	abstract protected function get_specific_fields( Meta_Tags_Context $context ): array;
}