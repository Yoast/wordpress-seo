<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Conditionals\Traits\Admin_Conditional_Trait;
use Yoast\WP\SEO\Integrations\Cleanup_Integration;

/**
 * This integration registers a run of the cleanup routine whenever the plugin is activated.
 */
class Activation_Indexation_Integration implements Integration_Interface {

	use Admin_Conditional_Trait;

	/**
	 * Registers the action to register a cleanup routine run after the plugin is activated.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'wpseo_activate', [ $this, 'register_cleanup_routine' ] );
	}

	/**
	 * Registers a run of the cleanup routine if this has not happened yet.
	 *
	 * @return void
	 */
	public function register_cleanup_routine() {
		if ( ! \wp_next_scheduled( Cleanup_Integration::START_HOOK ) ) {
			\wp_schedule_single_event( ( time() + ( MINUTE_IN_SECONDS * 5 ) ), Cleanup_Integration::START_HOOK );
		}
	}
}
