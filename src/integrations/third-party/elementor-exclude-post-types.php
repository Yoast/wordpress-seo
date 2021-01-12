<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use Yoast\WP\SEO\Conditionals\Third_Party\Elementor_Activated_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Exclude certain Elementor-specific post types from the indexable table.
 *
 * Posts with these post types will not be saved to the indexable table.
 */
class Elementor_Exclude_Post_Types implements Integration_Interface {

	/**
	 * Initializes the integration.
	 */
	public function register_hooks() {
		\add_filter( 'wpseo_indexable_excluded_post_types', [ $this, 'exclude_elementor_post_types' ] );
	}

	/**
	 * This integration is only active when the Elementor plugin
	 * is installed and activated.
	 *
	 * @return array|string[] The conditionals.
	 */
	public static function get_conditionals() {
		return [ Elementor_Activated_Conditional::class ];
	}

	/**
	 * Exclude certain Elementor-specific post types from the indexable table.
	 *
	 * Posts with these post types will not be saved to the indexable table.
	 *
	 * @param array $excluded_post_types The excluded post types.
	 *
	 * @return array The excluded post types, including the excluded Elementor post types.
	 */
	public function exclude_elementor_post_types( $excluded_post_types ) {
		$excluded_post_types[] = 'elementor_library';

		return $excluded_post_types;
	}
}
