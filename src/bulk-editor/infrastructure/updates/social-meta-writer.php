<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Infrastructure\Updates;

use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Social\Social_Meta_Writer_Interface;

/**
 * Persists the social appearance (Open Graph title and description) to Yoast post meta.
 */
class Social_Meta_Writer extends Abstract_Post_Meta_Writer implements Social_Meta_Writer_Interface {

	/**
	 * Gets the meta key (without prefix) the Open Graph title is stored under.
	 *
	 * @return string The meta key the Open Graph title is stored under.
	 */
	protected function get_title_meta_key(): string {
		return 'opengraph-title';
	}

	/**
	 * Gets the meta key (without prefix) the Open Graph description is stored under.
	 *
	 * @return string The meta key the Open Graph description is stored under.
	 */
	protected function get_description_meta_key(): string {
		return 'opengraph-description';
	}
}
