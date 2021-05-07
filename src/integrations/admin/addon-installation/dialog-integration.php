<?php

namespace Yoast\WP\SEO\Integrations\Admin\Addon_Installation;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Represents the Addon installation feature.
 */
class Dialog_Integration implements Integration_Interface {

	/**
	 * The addon manager.
	 *
	 * @var \WPSEO_Addon_Manager
	 */
	protected $addon_manager;

	/**
	 * {@inheritDoc}
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Addon_Installation constructor.
	 *
	 * @param \WPSEO_Addon_Manager $addon_manager The addon manager.
	 */
	public function __construct( \WPSEO_Addon_Manager $addon_manager ) {
		$this->addon_manager = $addon_manager;
	}

	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
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
			$this->bust_myyoast_addon_information_cache();
			$this->show_modal();
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
				'nonce'  => \wp_create_nonce( 'wpseo_addon_installation' ),
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
	protected function get_connected_addons() {
		$connected_addons = [];

		foreach ( $this->addon_manager->get_myyoast_site_information()->subscriptions as $addon ) {
			$connected_addons[ $addon->product->slug ] = $addon->product->name;
		}

		return $connected_addons;
	}

	/**
	 * Bust the site information transients to have fresh data.
	 *
	 * @return void
	 */
	private function bust_myyoast_addon_information_cache() {
		$this->addon_manager->remove_site_information_transients();
	}
}
