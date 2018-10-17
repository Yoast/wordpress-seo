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
	private $file;

	/**
	 * @var string
	 */
	private $filename;

	/**
	 * @var string
	 */
	private $old_wpseo_version = null;

	/**
	 * @var string
	 */
	private $path;

	/**
	 * @var array
	 */
	private $upload_dir;

	/**
	 * Class constructor
	 */
	public function __construct() {
		$this->status = new WPSEO_Import_Status( 'import', false );
		if ( ! $this->handle_upload() ) {
			return $this->status;
		}

		$this->determine_path();

		if ( ! $this->unzip_file() ) {
			$this->clean_up();

			return $this->status;
		}

		$this->parse_options();

		$this->clean_up();
	}

	/**
	 * Handle the file upload
	 *
	 * @return boolean Import status.
	 */
	private function handle_upload() {
		$overrides  = array( 'mimes' => array( 'zip' => 'application/zip' ) ); // Explicitly allow zip in multisite.
		$this->file = wp_handle_upload( $_FILES['settings_import_file'], $overrides );

		if ( is_wp_error( $this->file ) ) {
			$this->status->set_msg( __( 'Settings could not be imported:', 'wordpress-seo' ) . ' ' . $this->file->get_error_message() );

			return false;
		}

		if ( is_array( $this->file ) && isset( $this->file['error'] ) ) {
			$this->status->set_msg( __( 'Settings could not be imported:', 'wordpress-seo' ) . ' ' . $this->file['error'] );

			return false;
		}

		if ( ! isset( $this->file['file'] ) ) {
			$this->status->set_msg( __( 'Settings could not be imported:', 'wordpress-seo' ) . ' ' . __( 'Upload failed.', 'wordpress-seo' ) );

			return false;
		}

		return true;
	}

	/**
	 * Determine the path to the import file
	 */
	private function determine_path() {
		$this->upload_dir = wp_upload_dir();

		if ( ! defined( 'DIRECTORY_SEPARATOR' ) ) {
			define( 'DIRECTORY_SEPARATOR', '/' );
		}
		$this->path = $this->upload_dir['basedir'] . DIRECTORY_SEPARATOR . 'wpseo-import' . DIRECTORY_SEPARATOR;

		if ( ! isset( $GLOBALS['wp_filesystem'] ) || ! is_object( $GLOBALS['wp_filesystem'] ) ) {
			$url         = wp_nonce_url(
				self_admin_url( 'admin.php?page=wpseo_tools&tool=import-export' ),
				'wpseo-import'
			);
			$credentials = request_filesystem_credentials( esc_url_raw( $url ) );
			WP_Filesystem( $credentials );
		}
	}

	/**
	 * Unzip the file
	 *
	 * @return boolean
	 */
	private function unzip_file() {
		$unzipped = unzip_file( $this->file['file'], $this->path );
		$msg_base = __( 'Settings could not be imported:', 'wordpress-seo' ) . ' ';

		if ( is_wp_error( $unzipped ) ) {
			/* translators: %s expands to an error message. */
			$this->status->set_msg( $msg_base . sprintf( __( 'Unzipping failed with error "%s".', 'wordpress-seo' ), $unzipped->get_error_message() ) );

			return false;
		}

		$this->filename = $this->path . 'settings.ini';
		if ( ! is_file( $this->filename ) || ! is_readable( $this->filename ) ) {
			$this->status->set_msg( $msg_base . __( 'Unzipping failed - file settings.ini not found.', 'wordpress-seo' ) );

			return false;
		}

		return true;
	}

	/**
	 * Parse the option file
	 */
	private function parse_options() {
		if ( defined( 'INI_SCANNER_RAW' ) ) {
			/*
			 * Implemented INI_SCANNER_RAW to make sure variables aren't parsed.
			 *
			 * http://php.net/manual/en/function.parse-ini-file.php#99943
			 */
			$options = parse_ini_file( $this->filename, true, INI_SCANNER_RAW );
		}
		else {
			// PHP 5.2 does not implement the 3rd argument, this is a fallback.
			$options = parse_ini_file( $this->filename, true );
		}

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
	 * Remove the files
	 */
	private function clean_up() {
		if ( file_exists( $this->filename ) && is_writable( $this->filename ) ) {
			unlink( $this->filename );
		}
		if ( ! empty( $this->file['file'] ) && file_exists( $this->file['file'] ) && is_writable( $this->file['file'] ) ) {
			unlink( $this->file['file'] );
		}
		if ( file_exists( $this->path ) && is_writable( $this->path ) ) {
			$wp_file = new WP_Filesystem_Direct( $this->path );
			$wp_file->rmdir( $this->path, true );
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
