<?php
/**
 * @package Premium\Redirect
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

/**
 * Class WPSEO_Crawl_Issue_Table
 */
class WPSEO_Crawl_Issue_Table extends WP_List_Table {

	/**
	 * @var WPSEO_GWT_Google_Client
	 */
	private $gwt;

	/**
	 * @var String
	 */
	private $search_string;

	/**
	 * WPSEO_Redirect_Table constructor
	 */
	public function __construct( $gwt ) {
		parent::__construct();

		// Set GWT client
		$this->gwt = $gwt;

		// Set search string
		if ( isset( $_GET['s'] ) && $_GET['s'] != '' ) {
			$this->search_string = $_GET['s'];
		}
	}

	/**
	 * Search through the items
	 *
	 * @param $items
	 *
	 * @return array
	 */
	private function do_search( $items ) {

		$results = array();

		if ( is_array( $items ) ) {

			foreach ( $items as $item ) {

				$item_array = $item->to_array();

				foreach ( $item_array as $value ) {
					if ( false !== stripos( $value, $this->search_string ) ) {
						$results[] = $item;
						continue;
					}
				}

			}

		}

		return $results;
	}

	/**
	 * Set the table columns
	 *
	 * @return array
	 */
	public function get_columns() {
		$columns = array(
			//'cb'            => '<input type="checkbox" />',
				'url'           => __( 'URL', 'wordpress-seo' ),
				'issue_type'    => __( 'Issue Type', 'wordpress-seo' ),
				'date_detected' => __( 'Date detected', 'wordpress-seo' ),
				'detail'        => __( 'Details', 'wordpress-seo' ),
				'linked_from'   => __( 'Linked From', 'wordpress-seo' ),
		);

		return $columns;
	}

	/**
	 * Setup the table variables, fetch the items from the database, search, sort and format the items.
	 * Set the items as the WPSEO_Redirect_Table items variable.
	 */
	public function prepare_items() {

		// Setup the columns
		$columns               = $this->get_columns();
		$hidden                = array();
		$sortable              = $this->get_sortable_columns();
		$this->_column_headers = array( $columns, $hidden, $sortable );

		// Vies
		$this->views();

		// Get the items
		$service = new WPSEO_GWT_Service( $this->gwt );

		// Get crawl issues
		$site_url     = trailingslashit( get_option( 'siteurl' ) );
		$crawl_issues = $service->get_crawl_issues( $site_url );

		// Handle the search
		if ( null != $this->search_string ) {
			$crawl_issues = $this->do_search( $crawl_issues );
		}

		// Format the data
		$formatted_items = array();
		if ( is_array( $crawl_issues ) && count( $crawl_issues ) > 0 ) {
			foreach ( $crawl_issues as $crawl_issue ) {
				$formatted_items[] = $crawl_issue->to_array();
			}
		}

		// Sort the results
		if ( count( $formatted_items ) > 0 ) {
			usort( $formatted_items, array( $this, 'do_reorder' ) );
		}

		// Get variables needed for pagination
		$per_page    = $this->get_items_per_page( 'errors_per_page', 25 );
		$total_items = count( $formatted_items );

		// Set pagination
		$this->set_pagination_args( array(
				'total_items' => count( $formatted_items ),
				'total_pages' => ceil( $total_items / $per_page ),
				'per_page'    => $per_page,
		) );

		$current_page = intval( ( ( isset( $_GET['paged'] ) ) ? $_GET['paged'] : 0 ) );

		// Apply 'pagination'
		$formatted_items = array_slice( $formatted_items, ( ( $current_page - 1 ) * $per_page ), $per_page );

		// Set items
		$this->items = $formatted_items;
	}

	/**
	 * Return the columns that are sortable
	 *
	 * @return array
	 */
	public function get_sortable_columns() {
		$sortable_columns = array(
				'url'           => array( 'url', false ),
//				'crawl_type'    => array( 'crawl_type', false ),
				'issue_type'    => array( 'issue_type', false ),
				'date_detected' => array( 'date_detected', false ),
				'detail'        => array( 'detail', false ),
				'linked_from'   => array( 'linked_from', false ),
		);

		return $sortable_columns;
	}

	/**
	 * Reorder the items based on user input
	 *
	 * @param $a
	 * @param $b
	 *
	 * @return int
	 */
	public function do_reorder( $a, $b ) {
		// If no sort, default to title
		$orderby = ( ! empty( $_GET['orderby'] ) ) ? $_GET['orderby'] : 'url';

		// If no order, default to asc
		$order = ( ! empty( $_GET['order'] ) ) ? $_GET['order'] : 'asc';

		// Determine sort order
		$result = strcmp( $a[$orderby], $b[$orderby] );

		// Send final sort direction to usort
		return ( $order === 'asc' ) ? $result : - $result;
	}

	public function column_url( $item ) {
		$actions = array(
				'create_redirect' => '<a href="javascript:create_redirect(\'' . urlencode( $item['url'] ) . '\');">' . __( 'Create redirect', 'wordpress-seo' ) . '</a>',
				'view'            => '<a target="_blank" href="' . $item['url'] . '">' . __( 'View', 'wordpress-seo' ) . '</a>',
		);

		return sprintf(
				'%1$s %2$s',
				$item['url'],
				$this->row_actions( $actions )
		);
	}

	/**
	 * Checkbox column
	 *
	 * @param $item
	 *
	 * @return string
	 */
	public function column_cb( $item ) {
		return sprintf(
				'<input type="checkbox" name="create_redirects[]" value="%s" />', $item['url']
		);
	}

	/**
	 * Linked from column
	 *
	 * @param $item
	 *
	 * @return string
	 */
	public function column_linked_from( $item ) {
		return sprintf(
				'<a target="_blank" href="%1$s">%1$s</a>', $item['linked_from']
		);
	}

	/**
	 * Default method to display a column
	 *
	 * @param $item
	 * @param $column_name
	 *
	 * @return mixed
	 */
	public function column_default( $item, $column_name ) {
		return $item[$column_name];
	}

	/**
	 * Return available bulk actions
	 *
	 * @return array
	 */
	public function get_bulk_actions() {
		return array(); // No bulk action at the moment, please try again later.
		$actions = array(
				'create_redirects' => __( 'Create Redirects', 'wordpress-seo' )
		);

		return $actions;
	}

}
