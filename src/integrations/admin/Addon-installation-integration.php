<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;

/**
 * Represents the Addon installation feature.
 */
class WPSEO_Addon_Installation implements Integration_Interface {

	const INSTALLATION_NONCE_ACTION = 'addon-installation';

	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
	}

	/**
	 * {@inheritDoc}
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Enqueues scripts.
	 */
	public function enqueue_scripts() {
		if ( 'wpseo_licenses' !== filter_input( INPUT_GET, 'page' ) ) {
			return;
		}

		$addon_manager = new \WPSEO_Addon_Manager();
		$licensed_addons = $addon_manager->get_myyoast_site_information()->subscriptions;

		$addon_slugs = array_map(
			function( $addon ) {
				return $addon->product->slug;
			},
			$licensed_addons
		);

		// Unknown addon, let's just bail.
		if ( ! in_array( filter_input( INPUT_GET, 'install-addon' ), $addon_slugs, true ) ) {
			return;
		}

		\wp_localize_script(
			\WPSEO_Admin_Asset_Manager::PREFIX . 'addon-installation',
			'wpseoAddonInstallationL10n',
			array(
				'nonce' => \wp_create_nonce( self::INSTALLATION_NONCE_ACTION )
			)
		);

		$asset_manager = new \WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_script( 'addon-installation' );
	}
}
