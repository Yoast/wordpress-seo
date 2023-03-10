<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Integrations\Cleanup_Integration;
use Yoast\WP\SEO\Conditionals\No_Conditionals;

/**
 * This integration registers a run of the cleanup routine whenever the plugin is activated.
 */
class Activation_Cleanup_Integration implements Integration_Interface {

	use No_Conditionals;

	/**
	 * Registers the action to register a cleanup routine run after the plugin is activated.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'wpseo_activate', [ $this, 'register_cleanup_routine' ], 11 );
	}

	/**
	 * Registers a run of the cleanup routine if this has not happened yet.
	 *
	 * @return void
	 */
	public function register_cleanup_routine() {
		$first_activated_on = \WPSEO_Options::get( 'first_activated_on', false );

		if ( ! $first_activated_on || time() > ( $first_activated_on + ( MINUTE_IN_SECONDS * 5 ) ) ) {
			if ( ! \wp_next_scheduled( Cleanup_Integration::START_HOOK ) ) {
				\wp_schedule_single_event( ( time() + HOUR_IN_SECONDS ), Cleanup_Integration::START_HOOK );
			}
		}
	}
}
