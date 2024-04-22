<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\User_Meta\Framework\Custom_Meta;

use Yoast\WP\SEO\User_Meta\Domain\Custom_Meta_Interface;

/**
 * The Noindex_Author custom meta.
 */
class Noindex_Author implements Custom_Meta_Interface {

	/**
	 * Returns the db key of the Noindex_Author custom meta.
	 *
	 * @return string The db key of the Noindex_Author custom meta.
	 */
	public function get_key(): string {
		return 'wpseo_noindex_author';
	}

	/**
	 * Returns the id of the custom meta's form field.
	 *
	 * @return string The id of the custom meta's form field.
	 */
	public function get_field_id(): string {
		return 'wpseo_noindex_author';
	}

	/**
	 * Returns whether the custom meta is allowed to be empty.
	 *
	 * @return bool Whether the custom meta is allowed to be empty.
	 */
	public function is_empty_allowed(): bool {
		return false;
	}
}
