<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;

/**
 * Watcher for the wpseo option.
 *
 * Represents the option wpseo watcher.
 */
class Option_Wpseo_Watcher implements Integration_Interface {

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'update_option_wpseo', [ $this, 'check_semrush_option' ], 10, 2 );
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Migrations_Conditional::class ];
	}

	/**
	 * Checks if the SEMrush integration is disabled; if so, deletes the tokens.
	 *
	 * We delete the tokens it the SEMrush integration is disabled, no matter if
	 * the value has actually changed or not.
	 *
	 * @param array $old_value The old value of the option.
	 * @param array $new_value The new value of the option.
	 *
	 * @return bool Whether the SEMrush tokens have been deleted or not.
	 */
	public function check_semrush_option( $old_value, $new_value ) {
		if ( \array_key_exists( 'semrush_integration_active', $new_value )
			&& $new_value['semrush_integration_active'] === false ) {
			YoastSEO()->helpers->options->set( 'semrush_tokens', [] );
			return true;
		}
		return false;
	}
}
