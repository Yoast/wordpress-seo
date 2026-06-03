<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Infrastructure\Updates;

use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Search\Search_Meta_Writer_Interface;

/**
 * Persists the search appearance (SEO title and meta description) to Yoast post meta.
 */
class Search_Meta_Writer extends Abstract_Post_Meta_Writer implements Search_Meta_Writer_Interface {

	/**
	 * Gets the meta key (without prefix) the SEO title is stored under.
	 *
	 * @return string The meta key the SEO title is stored under.
	 */
	protected function get_title_meta_key(): string {
		return 'title';
	}

	/**
	 * Gets the meta key (without prefix) the meta description is stored under.
	 *
	 * @return string The meta key the meta description is stored under.
	 */
	protected function get_description_meta_key(): string {
		return 'metadesc';
	}
}
