<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Premium_Import_Manager
 */
class WPSEO_Premium_Import_Manager {

	/**
	 * Indicates whether redirects where imported
	 *
	 * @var bool
	 */
	private $redirects_imported = false;

	/**
	 * Holds the import object
	 *
	 * @var object
	 */
	private $import;

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Handle premium imports.
		add_filter( 'wpseo_handle_import', array( $this, 'do_premium_imports' ) );

		// Add htaccess import block.
		add_action( 'wpseo_import_tab_content', array( $this, 'add_redirect_import_block' ) );
		add_action( 'wpseo_import_tab_header', array( $this, 'redirects_import_header' ) );
	}

	/**
	 * Imports redirects from specified file or location.
	 *
	 * @param object|bool $import The import object.
	 *
	 * @return object
	 */
	public function do_premium_imports( $import ) {
		if ( ! $import ) {
			$import = (object) array(
				'msg'     => '',
				'success' => false,
				'status'  => null,
			);
		}

		$this->import = $import;
		$this->htaccess_import();
		$this->do_plugin_imports();
		$this->do_csv_imports();
		return $this->import;
	}

	/**
	 * Outputs a tab header for the htaccess import block.
	 */
	public function redirects_import_header() {
		/* translators: %s: '.htaccess' file name */
		echo '<a class="nav-tab" id="import-htaccess-tab" href="#top#import-htaccess">' . esc_html__( 'Import redirects', 'wordpress-seo-premium' ) . '</a>';
	}

	/**
	 * Adding the import block for redirects.
	 */
	public function add_redirect_import_block() {
		// The plugins we have import functions for.
		$plugins = array(
			'redirection'           => __( 'Redirection', 'wordpress-seo-premium' ) . '<br/>',
			'safe_redirect_manager' => __( 'Safe Redirect Manager', 'wordpress-seo-premium' ) . '<br/>',
			'simple-301-redirects'  => __( 'Simple 301 Redirects', 'wordpress-seo-premium' ) . '<br/>',
		);

		// Display the forms.
		require WPSEO_PREMIUM_PATH . 'classes/views/import-redirects.php';
	}

	/**
	 * Redirection import success message.
	 */
	private function message_redirect_import_success() {
		$this->import->msg .= __( 'Redirects have been imported.', 'wordpress-seo-premium' );
	}

	/**
	 * Redirection plugin not found message.
	 */
	private function message_redirection_plugin_not_find() {
		$this->import->msg .= __( 'Redirect import failed: Redirection plugin not installed or activated.', 'wordpress-seo-premium' );
	}

	/**
	 * Redirection import no redirects found message.
	 */
	private function message_redirect_import_no_redirects() {
		$this->import->msg .= __( 'Redirect import failed: No redirects found.', 'wordpress-seo-premium' );
	}

	/**
	 * Apache import success message.
	 */
	private function message_htaccess_success() {
		/* translators: %s: '.htaccess' file name */
		$this->import->msg .= sprintf( __( '%s redirects have been imported.', 'wordpress-seo-premium' ), '<code>.htaccess</code>' );
	}

	/**
	 * Apache import no redirects found message.
	 */
	private function message_htaccess_no_redirects() {
		/* translators: %s: '.htaccess' file name */
		$this->import->msg .= sprintf( __( '%s import failed: No redirects found.', 'wordpress-seo-premium' ), '<code>.htaccess</code>' );
	}

	/**
	 * CSV import invalid file message.
	 */
	protected function message_csv_file_invalid() {
		$this->import->msg .= __( 'CSV import failed: The provided file could not be parsed using a CSV parser.', 'wordpress-seo-premium' );
	}

	/**
	 * Do .htaccess file import.
	 *
	 * @return void
	 */
	private function htaccess_import() {
		$htaccess = stripcslashes( filter_input( INPUT_POST, 'htaccess' ) );

		if ( ! $htaccess || $htaccess === '' ) {
			return;
		}

		$loader = new WPSEO_Redirect_HTAccess_Loader( $htaccess );

		if ( $this->import_redirects_from_loader( $loader ) ) {
			$this->message_htaccess_success();
			return;
		}

		$this->message_htaccess_no_redirects();
	}

	/**
	 * Handles plugin imports.
	 */
	private function do_plugin_imports() {
		$wpseo_post = filter_input( INPUT_POST, 'wpseo', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );

		if ( ! isset( $wpseo_post['import_plugin'] ) ) {
			return;
		}

		$loader = $this->get_plugin_loader( $wpseo_post['import_plugin'] );

		if ( $loader === false ) {
			$this->message_redirection_plugin_not_find();
			return;
		}

		if ( $this->import_redirects_from_loader( $loader ) ) {
			$this->message_redirect_import_success();
			return;
		}

		$this->message_redirect_import_no_redirects();
	}

	/**
	 * Returns a loader for the given plugin.
	 *
	 * @param string $plugin_name The plugin we want to load redirects from.
	 *
	 * @return bool|WPSEO_Redirect_Abstract_Loader The redirect loader.
	 */
	protected function get_plugin_loader( $plugin_name ) {
		global $wpdb;

		switch ( $plugin_name ) {
			case 'redirection':
				// Only do import if Redirections is active.
				if ( ! defined( 'REDIRECTION_VERSION' ) ) {
					return false;
				}
				return new WPSEO_Redirect_Redirection_Loader( $wpdb );
			case 'safe_redirect_manager':
				return new WPSEO_Redirect_Safe_Redirect_Loader();
			case 'simple-301-redirects':
				return new WPSEO_Redirect_Simple_301_Redirect_Loader();
			default:
				return false;
		}
	}

	/**
	 * Processes a CSV import.
	 */
	protected function do_csv_imports() {
		if ( ! isset( $_FILES['redirects_csv_file'] ) ) {
			return;
		}

		if ( ! $this->validate_uploaded_csv_file( $_FILES['redirects_csv_file'] ) ) {
			$this->message_csv_file_invalid();
			return;
		}

		// Load the redirects from the uploaded file.
		$loader = new WPSEO_Redirect_CSV_Loader( $_FILES['redirects_csv_file']['tmp_name'] );

		if ( $this->import_redirects_from_loader( $loader ) ) {
			$this->message_redirect_import_success();
			return;
		}

		$this->message_redirect_import_no_redirects();
	}

	/**
	 * Validates an uploaded CSV file.
	 *
	 * @param array $csv_file The file to upload, from the $_FILES object.
	 *
	 * @return bool Whether or not the file passes the validation.
	 */
	protected function validate_uploaded_csv_file( $csv_file ) {
		// If the file upload failed for any reason.
		if ( ! isset( $csv_file['error'] ) || ! $csv_file['error'] === UPLOAD_ERR_OK ) {
			return false;
		}

		// If somehow the file is larger than it should be.
		if ( $csv_file['size'] > wp_max_upload_size() ) {
			return false;
		}

		// If it's not a CSV file.
		$filetype = wp_check_filetype( $csv_file['name'] );
		if ( $filetype['ext'] !== 'csv' ) {
			return false;
		}

		return true;
	}

	/**
	 * Imports all redirects from the loader.
	 *
	 * @param WPSEO_Redirect_Abstract_Loader $loader The loader to import redirects from.
	 *
	 * @return bool Whether or not any redirects were imported.
	 */
	protected function import_redirects_from_loader( WPSEO_Redirect_Abstract_Loader $loader ) {
		if ( ! $loader ) {
			return false;
		}

		$redirects = $loader->load();

		if ( count( $redirects ) === 0 ) {
			return false;
		}

		$importer = new WPSEO_Redirect_Importer();
		$importer->import( $redirects );

		$this->import->success = true;
		return true;
	}
}
