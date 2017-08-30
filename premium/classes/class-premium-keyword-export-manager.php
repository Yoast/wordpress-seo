<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Export_Keywords_Manager
 *
 * Manages exporting keywords.
 */
class WPSEO_Premium_Keyword_Export_Manager implements WPSEO_WordPress_Integration {
	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
		// Hook into the request in case of CSV download and return our generated CSV instead.
		add_action( 'admin_init', array( $this, 'keywords_csv_export' ) );

		// Add htaccess import block.
		add_action( 'wpseo_import_tab_content', array( $this, 'add_keyword_export_block' ) );
		add_action( 'wpseo_import_tab_header', array( $this, 'keywords_export_header' ) );
	}

	/**
	 * Outputs a tab header for the CSV export block.
	 */
	public function keywords_export_header() {
		if ( current_user_can( 'export' ) ) {
			echo '<a class="nav-tab" id="keywords-export-tab" href="#top#keywords-expot">' .
			        __( 'Export keywords', 'wordpress-seo-premium' ) .
			     '</a>';
		}
	}

	/**
	 * Adding the export block for CSV. Makes it able to export redirects to CSV.
	 */
	public function add_keyword_export_block() {
		// Display the forms.
		if ( current_user_can( 'export' ) ) {
			$yform = Yoast_Form::get_instance();
			require( 'views/export-keywords.php' );
		}
	}

	/**
	 * Hooks into the request and returns a CSV file if we're on the right page with the right method and the right capabilities.
	 */
	public function keywords_csv_export() {
		if ( ! $this->is_valid_csv_export_request() || ! current_user_can( 'export' ) ) {
			return;
		}

		// Check if we have a valid nonce.
		check_admin_referer( 'wpseo-export' );

		// Clean any content that has been already outputted, for example by other plugins or faulty PHP files.
		if ( ob_get_contents() ) {
			ob_clean();
		}

		// Set CSV headers and content.
		$this->set_csv_headers();
		echo $this->get_csv_contents();

		// And exit so we don't start appending HTML to our CSV file.
		// NOTE: this makes this entire class untestable as it will exit all tests but WordPress seems to have no elegant way of handling this.
		exit();
	}

	/**
	 * Returns whether this is a POST request for a CSV export of posts and keywords.
	 *
	 * @return bool True if this is a valid CSV export request.
	 */
	protected function is_valid_csv_export_request() {
		return filter_input( INPUT_GET, 'page' ) === 'wpseo_tools' &&
		       filter_input( INPUT_GET, 'tool' ) === 'import-export' &&
		       filter_input( INPUT_POST, 'export-posts' );
	}

	/**
	 * Sets the headers to trigger an CSV download in the browser.
	 */
	protected function set_csv_headers() {
		header( 'Content-type: text/csv' );
		header( 'Content-Disposition: attachment; filename=' . date( 'Y-m-d' ) . '-wordpress-seo-keywords.csv' );
		header( 'Pragma: no-cache' );
		header( 'Expires: 0' );
	}

	/**
	 * Generates CSV from all posts.
	 *
	 * @return string A CSV string.
	 */
	protected function get_csv_contents() {
		global $wpdb;

		$columns    = array();
		$post_wpseo = filter_input( INPUT_POST, 'wpseo', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );
		if ( is_array( $post_wpseo ) ) {
			$columns = $this->get_export_columns( $post_wpseo );
		}

		$query = new WPSEO_Export_Keywords_Query( $columns, $wpdb );
		$presenter = new WPSEO_Export_Keywords_Presenter( $columns );

		$results = $query->get_data();

		$data = array_map( array( $presenter, 'present' ), $results );

		$builder = new WPSEO_Export_Keywords_CSV( $columns );
		return $builder->export( $data );
	}

	/**
	 * Returns a string array of the requested columns.
	 *
	 * @param array $post_object An associative array with the post data.
	 *
	 * @return array The requested columns.
	 */
	protected function get_export_columns( array $post_object ) {
		$columns = array();

		$exportable_columns = array(
			'export-post-title'     => 'post_title',
			'export-post-url'       => 'post_url',
			'export-seo-score'      => 'seo_score',
			'export-keywords'       => 'keywords',
			'export-keywords-score' => 'keywords_score',
		);

		foreach ( $exportable_columns as $exportable_column => $column ) {
			if ( array_key_exists( $exportable_column, $post_object ) ) {
				$columns[] = $column;
			}
		}

		return $columns;
	}
}
