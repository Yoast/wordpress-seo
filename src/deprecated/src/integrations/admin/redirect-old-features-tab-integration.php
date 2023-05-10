<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin\Non_Network_Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Redirect_Old_Features_Tab_Integration class
 *
 * @deprecated 20.4
 * @codeCoverageIgnore
 */
class Redirect_Old_Features_Tab_Integration implements Integration_Interface {

	/**
	 * Asset manager instance.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Redirect_Old_Features_Tab_Integration constructor.
	 *
	 * @param WPSEO_Admin_Asset_Manager $asset_manager The admin asset manager.
	 */
	public function __construct( WPSEO_Admin_Asset_Manager $asset_manager ) {
		$this->asset_manager = $asset_manager;
	}

	/**
	 * {@inheritDoc}
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 */
	public function register_hooks() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_redirect_old_features_tab_script' ] );
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * In this case: only when on an admin page and on a non-multisite installation.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @return array The conditionals.
	 */
	public static function get_conditionals() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );
		return [
			Admin_Conditional::class,
			Non_Network_Admin_Conditional::class,
		];
	}

	/**
	 * Enqueues the redirect-old-features-tab script.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function enqueue_redirect_old_features_tab_script() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Date is not processed or saved.
		if ( ! isset( $_GET['page'] ) || $_GET['page'] !== 'wpseo_dashboard' ) {
			return;
		}
		$this->asset_manager->enqueue_script( 'redirect-old-features-tab' );
	}
}
