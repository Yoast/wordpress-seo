<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Premium_Export_Manager
 */
class WPSEO_Premium_Export_Manager {

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Add export CSV block, the import and export settings are confusingly named only import.
		add_action( 'wpseo_import_tab_content', array( $this, 'add_redirect_export_block' ) );
		add_action( 'wpseo_import_tab_header', array( $this, 'redirects_export_header' ) );

		// Hijack the request in case of CSV download and return our generated CSV instead.
		add_action( 'admin_init', array( $this, 'redirects_csv_export' ) );
	}

	/**
	 * Outputs a tab header for the CSV export block
	 */
	public function redirects_export_header() {
		/* translators: %s: 'export' file name */
		if ( current_user_can( 'export' ) ) {
			echo '<a class="nav-tab" id="export-redirects-tab" href="#top#export-redirects">' .
			        __( 'Export redirects', 'wordpress-seo-premium' ) .
			     '</a>';
		}
	}

	/**
	 * Adding the import block for htaccess. Makes it able to import redirects from htaccess
	 */
	public function add_redirect_export_block() {
		// Display the forms.
		if ( current_user_can('export') ) {
			require( 'views/export-redirects.php' );
		}
	}

	/**
	 * Hijacks the request and returns a CSV file if we're on the right page with the right method and the right capabilities.
	 */
	public function redirects_csv_export() {
		if (
			filter_input( INPUT_GET, 'page' ) == 'wpseo_tools' &&
			filter_input( INPUT_GET, 'tool' ) == 'import-export' &&
			filter_input( INPUT_POST, 'export') && current_user_can('export')
		) {
			// Check if we have a valid nonce.
			check_admin_referer( 'wpseo-export' );

			// Clean any content that has been already output. For example by other plugins or faulty PHP files.
			if ( ob_get_contents() ) {
				ob_clean();
			}

			// Set CSV headers and content.
			$this->set_csv_headers();
			echo $this->get_csv_contents();

			// And exit so we don't start appending HTML to our CSV file.
			exit();
		}
	}

	private function set_csv_headers() {
		header( 'Content-type: text/csv' );
		header( 'Content-Disposition: attachment; filename=wordpress-seo-redirects.csv' );
		header( 'Pragma: no-cache' );
		header( 'Expires: 0' );
	}

	private function get_csv_contents() {
		// Grab all our redirects.
		$redirect_manager = new WPSEO_Redirect_Manager();
		$redirects = $redirect_manager->get_all_redirects();

		// Generate our CSV file.
		$redirect_csv_exporter = new WPSEO_Redirect_CSV_Exporter();
		return $redirect_csv_exporter->export( $redirects );
	}
}
