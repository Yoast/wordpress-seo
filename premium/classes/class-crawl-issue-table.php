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
	 * @var WPSEO_GWT_Client
	 */
	private $gwt;

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
	 * WPSEO_Redirect_Table constructor
	 *
	 * @param WPSEO_GWT_Client $gwt
	 */
	public function __construct( WPSEO_GWT_Client $gwt ) {
		parent::__construct();

		// Set GWT client
		$this->gwt = $gwt;

		// Set the current view
		$this->current_view = ( $status = filter_input( INPUT_GET, 'category' )) ? $status : 'all';

		// Set page views
		add_filter( 'views_' . $this->screen->id, array( $this, 'add_page_views' ) );

		// Set search string
		if ( ( $search_string = filter_input( INPUT_GET, 's' ) ) != '' ) {
			$this->search_string = $search_string;
		}
	}

	/**
	 * Setup the table variables, fetch the items from the database, search, sort and format the items.
	 * Set the items as the WPSEO_Redirect_Table items variable.
	 *
	 */
	public function prepare_items() {

		// Setup the columns
		$this->setup_columns();

		// Vies
		$this->views();

		$ci_args = $this->set_args();

		$crawl_issue_source = new WPSEO_Crawl_Issue_Table_Data( $this->gwt, $ci_args );

		$this->set_pagination( $crawl_issue_source->get_total_items(), $ci_args['posts_per_page'] );

		$this->items = $crawl_issue_source->parse_crawl_issues();

		if ( ! empty ( $this->search_string) ) {
			$this->items = $this->do_search();
		}
	}

	/**
	 * Add page views
	 *
	 * @return array
	 */
	public function add_page_views( ) {

		$views_arr = array(
			'all'                  => __( 'All', 'wordpress-seo-premium' ),
			'auth_permissions'     => __( 'Authentication permissions', 'wordpress-seo' ),
			'many_to_one_redirect' => __( 'Many to one redirect', 'wordpress-seo' ),
			'not_followed'         => __( 'Not followed', 'wordpress-seo' ),
			'not_found'            => __( 'Not found', 'wordpress-seo' ),
			'other'                => __( 'Other', 'wordpress-seo' ),
			'roboted'              => __( 'Roboted', 'wordpress-seo' ),
			'server_error'         => __( 'Server Error', 'wordpress-seo' ),
			'soft_404'             => __( 'Soft 404', 'wordpress-seo' ),
		);

		$new_views = array();

		foreach ( $views_arr as $key => $val ) {
			$new_views[ $key ] = $this->create_view_link( $key, $val );
		}

		return $new_views;
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
			'url'            => __( 'URL', 'wordpress-seo-premium' ),
			'issue_category' => __( 'Issue category', 'wordpress-seo-premium' ),
			'date_detected'  => __( 'Date detected', 'wordpress-seo-premium' ),
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
			'issue_category' => array( 'issue_category', false ),
			'date_detected'  => array( 'date_detected', false ),
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
	 * Setting the arguments
	 *
	 * @return array
	 */
	private function set_args() {
		// Build crawl issues args
		$ci_args = array();

		$this->set_order( $ci_args );

		// Get variables needed for pagination
		$per_page     = $this->get_items_per_page( 'errors_per_page', 25 );
		$current_page = intval( ( $paged = filter_input( INPUT_GET, 'paged' ) ) ? $paged : 1 );

		// Set query pagination
		$ci_args['posts_per_page'] = $per_page;
		$ci_args['offset']         = ( ( $current_page - 1 ) * $per_page );

		// Set the post status
		$ci_args['post_status'] = 'publish';

		return $ci_args;
	}

	/**
	 * Setting the order arguments
	 *
	 * @param array $ci_args
	 */
	private function set_order( & $ci_args ) {
		// Set the orderby
		$ci_args['orderby'] = ( $orderby = filter_input( INPUT_GET, 'orderby' ) ) ? esc_sql( $orderby ) : 'title';

		// Set the order
		$ci_args['order']   = ( $order = filter_input( INPUT_GET, 'order' ) ) ? esc_sql( $order ) : 'asc';
	}

	/**
	 * Search through the items
	 *
	 * @return array
	 *
	 * @todo: Probably this had to be done in the query
	 */
	private function do_search( ) {
		$results = array();

		if ( is_array( $this->items ) ) {
			foreach ( $this->items as $item ) {
				foreach ( $item as $value ) {
					if ( stristr( $value, $this->search_string ) !== false ) {
						$results[] = $item;
						continue;
					}
				}
			}
		}

		return $results;
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
	 * Creates a filter link
	 *
	 * @param string $key
	 * @param string $val
	 *
	 * @return string
	 */
	private function create_view_link( $key, $val ) {
		return "<a href='" . esc_attr( add_query_arg( array( 'category' => $key, 'paged' => 1 ) ) ) . "'" . ( ( $this->current_view == $key ) ? " class='current'" : '' ) . ">{$val}</a>";
	}

}
