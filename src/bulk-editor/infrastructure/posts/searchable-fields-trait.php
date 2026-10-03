<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts;

/**
 * Provides the fields matched by the bulk editor's catch-all search.
 */
trait Searchable_Fields_Trait {

	/**
	 * The fields matched by the catch-all search, as a map of indexable column to Yoast meta key suffix.
	 *
	 * The post title is searched separately by both collectors because it lives in the posts table, not here.
	 *
	 * @return array<string, string> The searchable fields.
	 */
	protected function searchable_fields(): array {
		return [
			'primary_focus_keyword'  => 'focuskw',
			'title'                  => 'title',
			'description'            => 'metadesc',
			'open_graph_title'       => 'opengraph-title',
			'open_graph_description' => 'opengraph-description',
		];
	}
}
