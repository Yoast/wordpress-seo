<?php
/**
 * @package WPSEO\Admin\Import
 */

/**
 * Abstract object for handling the importing and deactivating of the plugin
 */
abstract class WPSEO_Import_Hooks {

	/**
	 * @var string The main plugin file.
	 */
	protected $plugin_file;

	/**
	 * @var string The GET parameter for running the import.
	 */
	protected $import_listener;

	/**
	 * @var string The GET parameter for deactivating the plugin.
	 */
	protected $deactivation_listener;

	/**
	 * Throw a notice to import settings.
	 *
	 * @since 3.0
	 */
	abstract public function show_import_settings_notice();

	/**
	 * Throw a notice to inform the user that the plugin has been deactivated
	 *
	 * @since 3.0
	 */
	abstract public function show_deactivate_notice();

	/**
	 * Adding the hooks to show import/deactivate message when needed.
	 */
	public function __construct() {
		if ( $this->is_active() ) {
			$this->show_import_message();
			$this->show_deactivate_message();
		}
	}

	/**
	 * Handle deactivation & import of the data data
	 *
	 * @since 3.0
	 */
	public function show_import_message() {
		if ( filter_input( INPUT_GET, 'tool' ) !== 'import-export' ) {
			add_action( 'admin_notices', array( $this, 'show_import_settings_notice' ) );
		}
	}

	/**
	 * Handle deactivation of the plugin
	 *
	 * @since 3.0
	 */
	public function show_deactivate_message() {
		if ( filter_input( INPUT_GET, $this->deactivation_listener ) === '1' ) {
			// Deactivate AIO.
			deactivate_plugins( $this->plugin_file );

			// Show notice that aioseo has been deactivated.
			add_action( 'admin_notices', array( $this, 'show_deactivate_notice' ) );

			// Clean up the referrer url for later use.
			if ( isset( $_SERVER['REQUEST_URI'] ) ) {
				$_SERVER['REQUEST_URI'] = remove_query_arg( array( $this->deactivation_listener ), sanitize_text_field( $_SERVER['REQUEST_URI'] ) );
			}
		}
	}

	/**
	 * Check if the plugin is active.
	 *
	 * @return bool
	 */
	protected function is_active() {
		return is_plugin_active( $this->plugin_file );
	}
}
