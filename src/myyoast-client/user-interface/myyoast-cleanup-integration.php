<?php

namespace Yoast\WP\SEO\MyYoast_Client\User_Interface;

use Yoast\WP\SEO\Conditionals\MyYoast_Connection_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client_Cleanup;

/**
 * Handles cleanup of all MyYoast client data on plugin uninstall.
 */
class MyYoast_Cleanup_Integration implements Integration_Interface {

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
	 * Returns the conditionals based on which this integration should be loaded.
	 *
	 * @return array<string> The array of conditionals.
	 */
	public static function get_conditionals() {
		return [ MyYoast_Connection_Conditional::class ];
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
	}
}
