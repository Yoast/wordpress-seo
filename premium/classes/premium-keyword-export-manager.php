<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Export_Keywords_Manager.
 *
 * Manages exporting keywords.
 */
class WPSEO_Premium_Keyword_Export_Manager implements WPSEO_WordPress_Integration {

	/**
	 * A WordPress database object.
	 *
	 * @var wpdb instance
	 */
	protected $wpdb;

	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
		// Hook into the request in case of CSV download and return our generated CSV instead.
		add_action( 'admin_init', array( $this, 'keywords_csv_export' ) );

		// Add htaccess import block.
		add_action( 'wpseo_import_tab_content', array( $this, 'add_keyword_export_tab_block' ) );
		add_action( 'wpseo_import_tab_header', array( $this, 'keywords_export_tab_header' ) );
	}

	/**
	 * Outputs a tab header for the CSV export block.
	 */
	public function keywords_export_tab_header() {
		if ( current_user_can( 'export' ) ) {
			echo '<a class="nav-tab" id="keywords-export-tab" href="#top#keywords-export">'
				. esc_html__( 'Export keywords', 'wordpress-seo-premium' )
				. '</a>';
		}
	}

	/**
	 * Adds the export block for CSV. Makes it able to export redirects to CSV.
	 */
	public function add_keyword_export_tab_block() {
		// Display the forms.
		if ( current_user_can( 'export' ) ) {
			$yform = Yoast_Form::get_instance();
			require WPSEO_PREMIUM_PATH . 'classes/views/export-keywords.php';
		}
	}

	/**
	 * Hooks into the request and returns a CSV file if we're on the right page with the right method and the right capabilities.
	 */
	public function keywords_csv_export() {
		global $wpdb;

		if ( ! $this->is_valid_csv_export_request() || ! current_user_can( 'export' ) ) {
			return;
		}

		// Check if we have a valid nonce.
		check_admin_referer( 'wpseo-export' );

		$this->wpdb = $wpdb;

		// Clean any content that has been already outputted, for example by other plugins or faulty PHP files.
		if ( ob_get_contents() ) {
			ob_clean();
		}

		// Make sure we don't time out during the collection of items.
		set_time_limit( 0 );

		// Set CSV headers and content.
		$this->set_csv_headers();
		echo $this->get_csv_contents();

		// And exit so we don't start appending HTML to our CSV file.
		// NOTE: this makes this entire class untestable as it will exit all tests but WordPress seems to have no elegant way of handling this.
		exit;
	}

	/**
	 * Returns whether this is a POST request for a CSV export of posts and keywords.
	 *
	 * @return bool True if this is a valid CSV export request.
	 */
	protected function is_valid_csv_export_request() {
		return filter_input( INPUT_GET, 'page' ) === 'wpseo_tools'
			&& filter_input( INPUT_GET, 'tool' ) === 'import-export'
			&& filter_input( INPUT_POST, 'export-posts' );
	}

	/**
	 * Sets the headers to trigger a CSV download in the browser.
	 */
	protected function set_csv_headers() {
		header( 'Content-type: text/csv' );
		header( 'Content-Disposition: attachment; filename=' . date( 'Y-m-d' ) . '-yoast-seo-keywords.csv' );
		header( 'Pragma: no-cache' );
		header( 'Expires: 0' );
	}

	/**
	 * Generates the CSV to be exported.
	 *
	 * @return void
	 */
	protected function get_csv_contents() {
		$columns = array( 'keywords' );

		$post_wpseo = filter_input( INPUT_POST, 'wpseo', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );

		if ( is_array( $post_wpseo ) ) {
			$columns = array_merge( $columns, $this->get_export_columns( $post_wpseo ) );
		}

		$builder = new WPSEO_Export_Keywords_CSV( $columns );
		$builder->print_headers();
		$this->prepare_export( $builder, $columns );
	}

	/**
	 * Returns an array of the requested columns.
	 *
	 * @param array $post_object An associative array with the post data.
	 *
	 * @return array List of export columns.
	 */
	protected function get_export_columns( array $post_object ) {
		$exportable_columns = array(
			'export-keywords-score'    => 'keywords_score',
			'export-url'               => 'url',
			'export-title'             => 'title',
			'export-seo-title'         => 'seo_title',
			'export-meta-description'  => 'meta_description',
			'export-readability-score' => 'readability_score',
		);

		// Need to call array_values to ensure that we get a numerical key back.
		return array_values( array_intersect_key( $exportable_columns, $post_object ) );
	}

	/**
	 * Feeds post and term items to the CSV builder.
	 *
	 * @param WPSEO_Export_Keywords_CSV $builder The builder to use.
	 * @param array                     $columns The columns that need to be exported.
	 *
	 * @return void
	 */
	protected function prepare_export( WPSEO_Export_Keywords_CSV $builder, array $columns ) {
		$this->feed_to_builder(
			$builder,
			new WPSEO_Export_Keywords_Post_Query( $this->wpdb, $columns, 1000 ),
			new WPSEO_Export_Keywords_Post_Presenter( $columns )
		);

		$this->feed_to_builder(
			$builder,
			new WPSEO_Export_Keywords_Term_Query( $this->wpdb, $columns, 1000 ),
			new WPSEO_Export_Keywords_Term_Presenter( $columns )
		);
	}

	/**
	 * Fetches the items and feeds them to the builder.
	 *
	 * @param WPSEO_Export_Keywords_CSV       $builder      Builder to feed the items to.
	 * @param WPSEO_Export_Keywords_Query     $export_query Query to use to get the items.
	 * @param WPSEO_Export_Keywords_Presenter $presenter    Presenter to present the items in the builder format.
	 *
	 * @return void
	 */
	protected function feed_to_builder( WPSEO_Export_Keywords_CSV $builder, WPSEO_Export_Keywords_Query $export_query, WPSEO_Export_Keywords_Presenter $presenter ) {
		$page_size = $export_query->get_page_size();

		$page = 1;
		do {
			$results = $export_query->get_data( $page );

			if ( ! is_array( $results ) ) {
				break;
			}

			$result_count = count( $results );

			// Present the result.
			$presented = array_map( array( $presenter, 'present' ), $results );

			// Feed presented item to the builder.
			array_walk( $presented, array( $builder, 'print_row' ) );

			++$page;

			// If we have the number of items per page, there will be more items ahead.
		} while ( $result_count === $page_size );
	}
}
