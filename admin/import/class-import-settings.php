<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Import
 */

/**
 * Class WPSEO_Import_Settings
 *
 * Class with functionality to import the Yoast SEO settings.
 */
class WPSEO_Import_Settings {
	/**
	 * @var WPSEO_Import_Status
	 */
	public $status;

	/**
	 * @var array
	 */
	private $content;

	/**
	 * @var string
	 */
	private $old_wpseo_version = null;

	/**
	 * Class constructor
	 */
	public function __construct() {
		$this->status  = new WPSEO_Import_Status( 'import', false );
		$this->content = filter_input( INPUT_POST, 'settings_import' );
		if ( empty( $this->content ) ) {
			return $this->status;
		}

		$this->parse_options();
	}

	/**
	 * Parse the option file
	 */
	private function parse_options() {
		$options = parse_ini_string( $this->content, true, INI_SCANNER_RAW );

		if ( is_array( $options ) && $options !== array() ) {
			$this->import_options( $options );

			return;
		}
		$this->status->set_msg( __( 'Settings could not be imported:', 'wordpress-seo' ) . ' ' . __( 'No settings found in file.', 'wordpress-seo' ) );
	}

	/**
	 * Parse the option group and import it
	 *
	 * @param string $name         Name string.
	 * @param array  $option_group Option group data.
	 * @param array  $options      Options data.
	 */
	private function parse_option_group( $name, $option_group, $options ) {
		// Make sure that the imported options are cleaned/converted on import.
		$option_instance = WPSEO_Options::get_option_instance( $name );
		if ( is_object( $option_instance ) && method_exists( $option_instance, 'import' ) ) {
			$option_instance->import( $option_group, $this->old_wpseo_version, $options );
		}
	}

	/**
	 * Imports the options if found.
	 *
	 * @param array $options The options parsed from the ini file.
	 */
	private function import_options( $options ) {
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
