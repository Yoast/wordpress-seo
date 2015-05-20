<?php
/**
 * @package Premium\Redirect
 * @subpackage Premium
 */

if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

/**
 * Class WPSEO_Crawl_Issue_Table
 */
class WPSEO_Crawl_Issue_Table extends WP_List_Table {

	/**
	 * @var string
	 */
	private $search_string;

	/**
	 * @var array
	 */
	protected $_column_headers;

	/**
	 * The category that is displayed
	 *
	 * @var mixed|string
	 */
	private $current_view;

	/**
	 * @var WPSEO_GWT_Platform_Tabs
	 */
	private $platform_tabs;

	/**
	 * @var WPSEO_Crawl_Issue_Table_Data
	 */
	private $crawl_issue_source;

	private $per_page     = 50;

	private $current_page = 1;

	/**
	 * WPSEO_Redirect_Table constructor
	 *
	 * @param WPSEO_GWT_Platform_Tabs $platform_tabs
	 * @param WPSEO_GWT_Service       $service
	 */
	public function __construct( WPSEO_GWT_Platform_Tabs $platform_tabs, WPSEO_GWT_Service $service ) {
		parent::__construct();

		// Set the current view
		$this->current_view = ( $status = filter_input( INPUT_GET, 'category' )) ? $status : 'not_found';

		// Set page views
		$this->platform_tabs = $platform_tabs;

		add_filter( 'views_' . $this->screen->id, array( $this, 'add_page_views' ) );

		// Set search string
		if ( ( $search_string = filter_input( INPUT_GET, 's' ) ) != '' ) {
			$this->search_string = $search_string;
		}

		$this->crawl_issue_source = new WPSEO_Crawl_Issue_Table_Data( $this->platform_tabs->current_tab(), $this->current_view, $service );
	}

	/**
	 * Setup the table variables, fetch the items from the database, search, sort and format the items.
	 * Set the items as the WPSEO_Redirect_Table items variable.
	 *
	 */
	public function prepare_items() {

		// Get variables needed for pagination
		$this->per_page     = $this->get_items_per_page( 'errors_per_page', $this->per_page );
		$this->current_page = intval( ( $paged = filter_input( INPUT_GET, 'paged' ) ) ? $paged : 1 );

		// Setup the columns
		$this->setup_columns();

		// Views
		$this->views();

		// Setting the items
		$this->set_items();

	}

	/**
	 * Add page views
	 *
	 * @return array
	 */
	public function add_page_views( ) {
		$page_view_filters = new WPSEO_GWT_Category_Filters( $this->platform_tabs->current_tab(), $this->current_view );

		return $page_view_filters->as_array();
	}

	/**
	 * Running the setup of the columns
	 */
	public function setup_columns() {
		$this->_column_headers = array( $this->get_columns(), array(), $this->get_sortable_columns() );
	}

	/**
	 * Set the table columns
	 *
	 * @return array
	 */
	public function get_columns() {
		$columns = array(
			'cb'             => '<input type="checkbox" />',
			'url'            => __( 'URL', 'wordpress-seo-premium' ),
			'last_crawled'   => __( 'Last crawled', 'wordpress-seo-premium' ),
			'first_detected' => __( 'First detected', 'wordpress-seo-premium' ),
			'response_code'  => __( 'Response code', 'wordpress-seo-premium' ),
		);

		return $columns;
	}

	/**
	 * Return the columns that are sortable
	 *
	 * @return array
	 */
	public function get_sortable_columns() {
		$sortable_columns = array(
			'url'            => array( 'url', false ),
			'last_crawled'   => array( 'last_crawled', false ),
			'first_detected' => array( 'first_detected', false ),
			'response_code'  => array( 'response_code', false ),
		);

		return $sortable_columns;
	}

	/**
	 * Default method to display a column
	 *
	 * @param array  $item
	 * @param string $column_name
	 *
	 * @return mixed
	 */
	protected function column_default( $item, $column_name ) {
		return $item[ $column_name ];
	}

	/**
	 * Checkbox column
	 *
	 * @param array $item
	 *
	 * @return string
	 */
	public function column_cb( $item ) {
		return sprintf(
			'<input type="checkbox" name="wpseo_crawl_issues_mark_as_fixed[]" value="%s" />', $item['url']
		);
	}

	/**
	 * Setting the table navigation
	 *
	 * @param int $total_items
	 * @param int $posts_per_page
	 */
	private function set_pagination( $total_items, $posts_per_page ) {
		$this->set_pagination_args( array(
			'total_items' => $total_items,
			'total_pages' => ceil( ( $total_items / $posts_per_page ) ),
			'per_page'    => $posts_per_page,
		) );
	}

	/**
	 * URL column
	 *
	 * @param array $item
	 *
	 * @return string
	 */
	protected function column_url( $item ) {
		$actions = array(
			'create_redirect' => '<a href="javascript:wpseo_create_redirect(\'' . urlencode( $item['url'] ) . '\', \'' . $this->current_view . '\');">' . __( 'Create redirect', 'wordpress-seo-premium' ) . '</a>',
			'view'            => '<a href="' . $item['url'] . '" target="_blank">' . __( 'View', 'wordpress-seo-premium' ) . '</a>',
			'markasfixed'     => '<a href="javascript:wpseo_mark_as_fixed(\'' . urlencode( $item['url'] ) . '\');">' . __( 'Mark as fixed', 'wordpress-seo-premium' ) . '</a>',
		);

		return sprintf(
			'<span class="value">%1$s</span> %2$s',
			$item['url'],
			$this->row_actions( $actions )
		);
	}

	/**
	 * Setting the items
	 */
	private function set_items() {
		$this->items = $this->crawl_issue_source->get_issues();

		if ( is_array( $this->items ) && count( $this->items ) > 0 ) {
			if ( ! empty ( $this->search_string) ) {
				$this->do_search();
			}

			$this->set_pagination( count( $this->items ), $this->per_page );

			$this->sort_items();
			$this->paginate_items();
		}
	}

	/**
	 * Search through the items
	 */
	private function do_search( ) {
		$results = array();

		foreach ( $this->items as $item ) {
			foreach ( $item as $value ) {

				if ( stristr( $value, $this->search_string ) !== false ) {
					$results[] = $item;
					continue;
				}
			}
		}

		$this->items = $results;
	}

	/**
	 * Running the pagination
	 */
	private function paginate_items() {
		// Setting the starting point. If starting point is below 1, overwrite it with value 0, otherwise it will be sliced of at the back
		$slice_start = ( $this->current_page - 1 );
		if ( $slice_start < 0 ) {
			$slice_start = 0;
		}

		// Apply 'pagination'
		$this->items = array_slice( $this->items, ( $slice_start * $this->per_page ), $this->per_page );
	}

	/**
	 * Sort the items by callback
	 */
	private function sort_items() {
		// Sort the results
		usort( $this->items, array( $this, 'do_reorder' ) );
	}
	/**
	 * Doing the sorting of the issues
	 *
	 * @param array $a
	 * @param array $b
	 *
	 * @return int
	 */
	private function do_reorder($a, $b) {
		// If no sort, default to title
		$orderby = ( $orderby = filter_input( INPUT_GET, 'orderby' ) ) ? $orderby : 'url';

		// If no order, default to asc
		$order = ( $order = filter_input( INPUT_GET, 'order' ) ) ? $order : 'asc';

		// Determine sort order
		$result = strcmp( $a[ $orderby ], $b[ $orderby ] );

		// Send final sort direction to usort
		return ( $order === 'asc' ) ? $result : ( -$result );
	}

}
