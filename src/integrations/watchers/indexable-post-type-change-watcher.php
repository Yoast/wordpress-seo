<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * WordPress Post watcher.
 *
 * Fills the Indexable according to Post data.
 */

class Indexable_Post_Type_Change_Watcher implements Integration_Interface {

	/**
	 * Holds the Options_Helper instance.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class, Migrations_Conditional::class ];
	}

	/**
	 * Indexable_Post_Type_Change_Watcher constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 */
	public function __construct(
		Options_Helper $options
	) {
		$this->options = $options;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'admin_init', [ $this, 'check_post_types_viewability' ] );
	}

	public function check_post_types_viewability() {
		// We have to make sure this is just a plain http request, no ajax/rest
		$post_types = \get_post_types();

		if ( ! function_exists( '\is_post_type_viewable' ) ) {
			return;
		}

		$viewable_post_types            = \array_filter( $post_types, '\is_post_type_viewable' );
		$last_known_viewable_post_types = $this->options->get( 'last_known_viewable_post_types', [] );

		$newly_made_viewable_post_types     = \array_diff( $viewable_post_types, $last_known_viewable_post_types );
		$newly_made_non_viewable_post_types = \array_diff( $last_known_viewable_post_types, $viewable_post_types );

		// The very first time this is gonna be false, as the last_known_viewable_post_types option will be empty
		// We want to change this
		if ( empty( $newly_made_viewable_post_types ) && ( empty( $newly_made_non_viewable_post_types ) ) ) {
			return;
		}

		if ( ! empty( $newly_made_viewable_post_types ) ) {
			$this->options->set( 'post_type_made_viewable', $newly_made_viewable_post_types );
			return;
		}

		if ( ! empty( $newly_made_non_viewable_post_types ) ) {
			$this->options->set( 'post_type_made_non_viewable', $newly_made_non_viewable_post_types );
			return;
		}
	}
}
