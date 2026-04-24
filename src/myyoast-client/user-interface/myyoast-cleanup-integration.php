<?php

namespace Yoast\WP\SEO\MyYoast_Client\User_Interface;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client_Cleanup;

/**
 * Handles cleanup of all MyYoast client data on plugin uninstall.
 */
class MyYoast_Cleanup_Integration implements Integration_Interface {
	use No_Conditionals;

	/**
	 * The cleanup service.
	 *
	 * @var MyYoast_Client_Cleanup
	 */
	private $cleanup;

	/**
	 * MyYoast_Cleanup_Integration constructor.
	 *
	 * @param MyYoast_Client_Cleanup $cleanup The cleanup service.
	 */
	public function __construct( MyYoast_Client_Cleanup $cleanup ) {
		$this->cleanup = $cleanup;
	}

	/**
	 * Registers hooks.
	 *
	 * @return void
	 */
	public function register_hooks(): void {
		\add_action( 'uninstall_' . \WPSEO_BASENAME, [ $this, 'cleanup' ] );
	}

	/**
	 * Cleans up all MyYoast client data.
	 *
	 * @return void
	 */
	public function cleanup(): void {
		$this->cleanup->execute();

		// Unschedule cron (WordPress-specific, stays in UI).
		\wp_clear_scheduled_hook( 'Yoast\WP\SEO\myyoast_key_rotation' );
	}
}
