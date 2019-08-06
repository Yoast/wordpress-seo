<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Import
 */

/**
 * Class WPSEO_Import_Settings.
 *
 * Class with functionality to import the Yoast SEO settings.
 */
class WPSEO_Import_Settings {

	/**
	 * Nonce action key.
	 *
	 * @var string
	 */
	const NONCE_ACTION = 'wpseo-import-settings';

	/**
	 * Holds the import status instance.
	 *
	 * @var WPSEO_Import_Status
	 */
	public $status;

	/**
	 * Holds the old WPSEO version.
	 *
	 * @var string
	 */
	private $old_wpseo_version;

	/**
	 * Class constructor.
	 */
	public function __construct() {
		$this->status = new WPSEO_Import_Status( 'import', false );
	}

	/**
	 * Imports the data submitted by the user.
	 *
	 * @return void
	 */
	public function import() {
		check_admin_referer( self::NONCE_ACTION );

		if ( ! WPSEO_Capability_Utils::current_user_can( 'wpseo_manage_options' ) ) {
			return;
		}

		$content = filter_input( INPUT_POST, 'settings_import' );
		if ( empty( $content ) ) {
			return;
		}

		$this->parse_options( $content );
	}

	/**
	 * Parse the options.
	 *
	 * @param string $raw_options The content to parse.
	 *
	 * @return void
	 */
	protected function parse_options( $raw_options ) {
		// If we're not on > PHP 5.3, return, as we'll otherwise error out.
		if ( ! defined( 'WPSEO_NAMESPACES' ) || ! WPSEO_NAMESPACES ) {
			return;
		}

		// @codingStandardsIgnoreLine
		$options = parse_ini_string( $raw_options, true, INI_SCANNER_RAW ); // phpcs:ignore PHPCompatibility.FunctionUse.NewFunctions.parse_ini_stringFound -- We won't get to this function if PHP < 5.3 due to the WPSEO_NAMESPACES check above.

		if ( is_array( $options ) && $options !== array() ) {
			$this->import_options( $options );

			return;
		}

		$this->status->set_msg( __( 'Settings could not be imported:', 'wordpress-seo' ) . ' ' . __( 'No settings found.', 'wordpress-seo' ) );
	}

	/**
	 * Parse the option group and import it.
	 *
	 * @param string $name         Name string.
	 * @param array  $option_group Option group data.
	 * @param array  $options      Options data.
	 */
	protected function parse_option_group( $name, $option_group, $options ) {
		// Make sure that the imported options are cleaned/converted on import.
		$option_instance = WPSEO_Options::get_option_instance( $name );
		if ( is_object( $option_instance ) && method_exists( $option_instance, 'import' ) ) {
			$option_instance->import( $option_group, $this->old_wpseo_version, $options );
		}
	}

	/**
	 * Imports the options if found.
	 *
	 * @param array $options The options parsed from the provided settings.
	 */
	protected function import_options( $options ) {
		if ( isset( $options['wpseo']['version'] ) && $options['wpseo']['version'] !== '' ) {
			$this->old_wpseo_version = $options['wpseo']['version'];
		}

		foreach ( $options as $name => $option_group ) {
			$this->parse_option_group( $name, $option_group, $options );
		}

		$this->status->set_msg( __( 'Settings successfully imported.', 'wordpress-seo' ) );
		$this->status->set_status( true );
	}
}
