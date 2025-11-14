<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Plans\Application;

use WPSEO_Addon_Manager;
use WPSEO_Admin_Utils;

/**
 * The Yoast SEO Duplicate Post plugin Manager.
 */
class Duplicate_Post_Manager {
	/**
	 * The Duplicate post main file.
	 *
	 * @var string
	 */
	public const PLUGIN_FILE = 'duplicate-post/duplicate-post.php';

	/**
	 * Holds the WPSEO_Addon_Manager.
	 *
	 * @var WPSEO_Addon_Manager
	 */
	private $addon_manager;

	/**
	 * Constructs the instance.
	 *
	 * @param WPSEO_Addon_Manager $addon_manager The WPSEO_Addon_Manager.
	 */
	public function __construct( WPSEO_Addon_Manager $addon_manager ) {

		$this->addon_manager = $addon_manager;
	}

	/**
	 * Checks if the plugin is installed and activated in WordPress.
	 *
	 * @return bool True when installed and activated.
	 */
	protected function is_activated() {
		return $this->addon_manager->is_plugin_active( static::PLUGIN_FILE );
	}

	/**
	 * Checks if the plugin is installed in WordPress.
	 *
	 * @return bool True when installed.
	 */
	protected function is_installed() {
		$plugins = $this->addon_manager->get_plugins();

		return isset( $plugins[ static::PLUGIN_FILE ] );
	}

	/**
	 * Gets the duplicate post plans page params
	 *
	 * @return array<string|bool> The list of params.
	 */
	public function get_params() {
		return [
			'isInstalled'     => $this->is_installed(),
			'isActivated'     => $this->is_activated(),
			'installationUrl' => \html_entity_decode( WPSEO_Admin_Utils::get_install_url( static::PLUGIN_FILE ) ),
			'activationUrl'   => \html_entity_decode( WPSEO_Admin_Utils::get_activation_url( static::PLUGIN_FILE ) ),
		];
	}
}
