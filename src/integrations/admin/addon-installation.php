<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Actions\Addon_Installation\Addon_Activate_Action;
use Yoast\WP\SEO\Actions\Addon_Installation\Addon_Install_Action;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Represents the Addon installation feature.
 */
class Addon_Installation implements Integration_Interface {

	const INSTALLATION_NONCE_ACTION = 'addon-installation';

	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
		add_action( 'wpseo_install_and_activate_addons', [ $this, 'install_and_activate_addons' ] );
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
	}

	/**
	 * Installs and activates missing addons.
	 *
	 * @returns void
	 */
	public function install_and_activate_addons() {
		if ( filter_input( INPUT_GET, 'action' ) !== 'install' ) {
			return;
		}

		// todo: add nonce check.

		$addon_manager   = new \WPSEO_Addon_Manager();
		$licensed_addons = $addon_manager->get_myyoast_site_information()->subscriptions;

		$install_action = new Addon_Install_Action( $addon_manager );
		$active_action  = new Addon_Activate_Action( $addon_manager );

		foreach ( $licensed_addons as $addon ) {
			if ( $install_action->install_addon( $addon->product->slug, $addon->product->download ) ) {
				$active_action->activate_addon( $addon->product->slug, $addon->product->name );
			}
		}
	}

	/**
	 * Shows the modal.
	 *
	 * @returns void
	 */
	public function show_modal() {
		\wp_localize_script(
			\WPSEO_Admin_Asset_Manager::PREFIX . 'addon-installation',
			'wpseoAddonInstallationL10n',
			[
				'addons' => $this->get_connected_addons(),
				'nonce'  => \wp_create_nonce( self::INSTALLATION_NONCE_ACTION ),
			]
		);

		$asset_manager = new \WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_script( 'addon-installation' );
	}

	/**
	 * Retrieves a list of connected addons for the site in MyYoast.
	 *
	 * @return array List of connected addons with slug as key and name as value.
	 */
	public function get_connected_addons() {
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

		return $connected_addons;
	}
}
