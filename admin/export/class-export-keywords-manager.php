<?php
/**
 * @package WPSEO\Admin\Export
 */

class WPSEO_Export_Keywords_Manager {
	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
		// Hijack the request in case of CSV download and return our generated CSV instead.
		add_action( 'admin_init', array( $this, 'keywords_csv_export' ) );
	}

	/**
	 * Hijacks the request and returns a CSV file if we're on the right page with the right method and the right capabilities.
	 */
	public function keywords_csv_export() {
		if ( $this->is_valid_csv_export_request() && current_user_can( 'export' ) ) {
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
	}

	/**
	 * Are we on the wpseo_tools page in the import-export tool and have we received an export-keywords post request?
	 *
	 * @return bool
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
		header( 'Content-Disposition: attachment; filename=wordpress-seo-keywords.csv' );
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
		$query = new WPSEO_Export_Keywords_Query( $this->get_export_columns(), $wpdb );

		$builder = new WPSEO_Export_Keywords_CSV();
		return $builder->export( $query );
	}

	/**
	 * Returns a string array of the requested columns.
	 *
	 * @return array[int]string
	 */
	protected function get_export_columns() {
		$columns = array();
		$post_wpseo = filter_input( INPUT_POST, 'wpseo', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );

		if ( ! empty( $post_wpseo['export-post-title'] ) ) {
			$columns[] = 'post_title';
		}

		if ( ! empty( $post_wpseo['export-post-url'] ) ) {
			$columns[] = 'post_url';
		}

		if ( ! empty( $post_wpseo['export-seo-score'] ) ) {
			$columns[] = 'seo_score';
		}

		if ( ! empty( $post_wpseo['export-keywords'] ) ) {
			$columns[] = 'keywords';
		}

		if ( ! empty( $post_wpseo['export-keywords-score'] ) ) {
			$columns[] = 'keywords_score';
		}

		return $columns;
	}
}
