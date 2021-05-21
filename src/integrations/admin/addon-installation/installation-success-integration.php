<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Discussed in Tech Council, a better solution is being worked on.

namespace Yoast\WP\SEO\Integrations\Admin\Addon_Installation;

use WPSEO_Configuration_Page;
use Yoast\WP\SEO\Conditionals\Admin\Licenses_Page_Conditional;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Represents the Addon installation feature.
 */
class Installation_Success_Integration implements Integration_Interface {

	/**
	 * {@inheritDoc}
	 */
	public static function get_conditionals() {
		return [
			Admin_Conditional::class,
			Licenses_Page_Conditional::class,
		];
	}

	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
		add_action( 'admin_init', [ $this, 'installation_success_alert' ] );
	}

	/**
	 * Checks if all addons are installed (`activation_success` is present in the URL). If so, display a success message.
	 *
	 * @return void
	 */
	public function installation_success_alert() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reason: This is not a form.
		if ( ! isset( $_GET['activation_success'] ) || $_GET['activation_success'] !== 'true' ) {
			return;
		}
		add_action( 'admin_enqueue_scripts', [ $this, 'generate_success_box' ] );
	}

	/**
	 * Displays success message.
	 *
	 * @returns void
	 */
	public function generate_success_box() {
		$configuration_wizard_url = admin_url( '?page=' . WPSEO_Configuration_Page::PAGE_IDENTIFIER );

		\wp_localize_script(
			\WPSEO_Admin_Asset_Manager::PREFIX . 'addon-installation-successful',
			'wpseoAddonInstallationL10n',
			[
				'configurationWizardUrl' => $configuration_wizard_url,
			]
		);

		$asset_manager = new \WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_script( 'addon-installation-successful' );
	}
}
