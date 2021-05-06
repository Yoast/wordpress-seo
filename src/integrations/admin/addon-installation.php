<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Represents the Addon installation feature.
 */
class WPSEO_Addon_Installation implements Integration_Interface {

	const INSTALLATION_NONCE_ACTION = 'addon-installation';

	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
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
		// Only show the dialog on the "premium" / extensions page.
		if ( filter_input( INPUT_GET, 'page' ) !== 'wpseo_licenses' ) {
			return;
		}

		// Only show the dialog when we explicitly want to see it.
		if ( filter_input( INPUT_GET, 'install' ) === 'true' ) {
			$this->show_modal();
		}

		if ( filter_input( INPUT_GET, 'action' ) === 'install' ) {
			$this->install_and_activate_addons();
		}
	}

	/**
	 * Installs and activates missing addons.
	 *
	 * @returns void
	 */
	public function install_and_activate_addons() {
		// Todo: To be created.
	}

	/**
	 * Shows the modal.
	 *
	 * @returns void
	 */
	public function show_modal() {
		$addon_manager   = new \WPSEO_Addon_Manager();
		$licensed_addons = $addon_manager->get_myyoast_site_information()->subscriptions;

		$connected_addons = array_reduce(
			$licensed_addons,
			function ( $accumulator, $addon ) {
				$accumulator[ $addon->product->slug ] = $addon->product->name;

				return $accumulator;
			},
			[]
		);

		\wp_localize_script(
			\WPSEO_Admin_Asset_Manager::PREFIX . 'addon-installation',
			'wpseoAddonInstallationL10n',
			[
				'addons' => $connected_addons,
				'nonce'  => \wp_create_nonce( self::INSTALLATION_NONCE_ACTION ),
			]
		);

		$asset_manager = new \WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_script( 'addon-installation' );
	}
}
