<?php
/**
 * @package Premium\Redirect
 * @subpackage Premium
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
	 * @var string
	 */
	private $search_string;

	/**
	 * @var array
	 */
	protected $_column_headers;

	/**
	 * WPSEO_Redirect_Table constructor
	 *
	 * @param object $gwt
	 */
	public function __construct( $gwt ) {
		parent::__construct();

		// Set GWT client
		$this->gwt = $gwt;

		// Set page views
		add_filter( 'views_' . $this->screen->id, array( $this, 'add_page_views' ) );

		// Set search string
		if ( ( $search_string = filter_input( INPUT_GET, 's' ) ) != '' ) {
			$this->search_string = $search_string;
		}
	}

	/**
	 * Get the current view
	 *
	 * @return string
	 */
	private function get_current_view() {
		return ( $status = filter_input( INPUT_GET, 'category' )) ? $status : 'all' ;
	}

	/**
	 * Add page views
	 *
	 * @param array $views
	 *
	 * @return array
	 */
	public function add_page_views( $views ) {

		// Get current
		$current = $this->get_current_view();

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
			$new_views[ $key ] = "<a href='" . esc_attr( add_query_arg( array( 'category' => $key, 'paged' => 1 ) ) ) . "'" . ( ( $current == $key ) ? " class='current'" : '' ) . ">{$val}</a>";
		}

		return $new_views;
	}

	/**
	 * Search through the items
	 *
	 * @return array
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
	 * Setup the table variables, fetch the items from the database, search, sort and format the items.
	 * Set the items as the WPSEO_Redirect_Table items variable.
	 */
	public function prepare_items() {

		// Setup the columns
		$this->setup_columns();

		// Vies
		$this->views();

		$ci_args = $this->set_args();

		$crawl_issue_source = new WPSEO_Crawl_Issue_Table_Data( $this->gwt, $ci_args );

		$this->set_pagination( $crawl_issue_source->get_total_items(), $ci_args['posts_per_page'] );

		$this->items = $crawl_issue_source->get_crawl_issues();

		if ( ! empty ( $this->search_string) ) {
			$this->items = $this->do_search();
		}
	}

	/**
	 * URL column
	 *
	 * @param array $item
	 *
	 * @return string
	 */
	public function column_url( $item ) {
		$actions = array(
			'create_redirect' => '<a href="javascript:wpseo_create_redirect(\'' . urlencode( $item['url'] ) . '\', \'' . $this->get_current_view() . '\');">' . __( 'Create redirect', 'wordpress-seo-premium' ) . '</a>',
			'view'            => '<a href="' . $item['url'] . '" target="_blank">' . __( 'View', 'wordpress-seo-premium' ) . '</a>',
		);

		// Current view
		$current_view = $this->get_current_view();

		if ( 'ignored' == $current_view ) {
			$actions['unignore'] = '<a href="javascript:wpseo_unignore_redirect(\'' . urlencode( $item['url'] ) . '\');">' . __( 'Unignore', 'wordpress-seo-premium' ) . '</a>';
		}
		else {
			$actions['ignore'] = '<a href="javascript:wpseo_ignore_redirect(\'' . urlencode( $item['url'] ) . '\');">' . __( 'Ignore', 'wordpress-seo-premium' ) . '</a>';
		}

		return sprintf(
			'<span class="value">%1$s</span> %2$s',
			$item['url'],
			$this->row_actions( $actions )
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
			'<a href="%1$s" target="_blank">%1$s</a>', $item['linked_from']
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
		return $item[ $column_name ];
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
			'linked_from'    => __( 'Linked From', 'wordpress-seo-premium' ),
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
			'linked_from'    => array( 'linked_from', false ),
		);

		return $sortable_columns;
	}

	/**
	 * Setting the arguments
	 *
	 * @return array
	 */
	private function set_args() {
		// Build crawl issues args
		$ci_args = array();

		// Set the post status
		$ci_args['post_status'] = 'publish';

		// Set the orderby
		$ci_args['orderby'] = ( $orderby = filter_input( INPUT_GET, 'orderby' ) ) ? esc_sql( $orderby ) : 'title';

		// Set the order
		$ci_args['order']   = ( $order = filter_input( INPUT_GET, 'order' ) ) ? esc_sql( $order ) : 'asc';

		// Get variables needed for pagination
		$per_page     = $this->get_items_per_page( 'errors_per_page', 25 );
		$current_page = intval( ( $paged = filter_input( INPUT_GET, 'paged' ) ) ? $paged : 1 );

		// Set query pagination
		$ci_args['posts_per_page'] = $per_page;
		$ci_args['offset']         = ( ( $current_page - 1 ) * $per_page );

		return $ci_args;
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


}


class WPSEO_Crawl_Issue_Table_Data {

	private $issue_manager;

	private $arguments;

	private $gwt;

	private $crawl_issues;

	private $total_rows;

	/**
	 * @param $gwt
	 * @param $ci_args
	 */
	public function __construct( $gwt, $ci_args ) {

		$this->gwt       = $gwt;
		$this->arguments = $ci_args;

		// Get the crawl issues
		$this->issue_manager = new WPSEO_Crawl_Issue_Manager();
		$this->crawl_issues  = $this->issue_manager->get_crawl_issues( $this->gwt, $this->get_issues() );
	}

	/**
	 * @return mixed
	 */
	public function get_issues () {
		global $wpdb;

		$subquery = $this->filter_issues();

		$this->total_rows = $wpdb->get_var(
			'
				SELECT COUNT(ID)
				FROM ' . $wpdb->posts . '
				WHERE post_status = "' . $this->arguments['post_status'] . '" && post_type = "wpseo_crawl_issue" && ID IN('. $subquery .')
			'
		);

		return $wpdb->get_results(
			'
				SELECT *
				FROM ' . $wpdb->posts . '
				WHERE post_status = "' . $this->arguments['post_status'] . '" &&
					  post_type   = "wpseo_crawl_issue" &&
					  ID IN(' . $subquery . ' )
				LIMIT ' . $this->arguments['offset'] . ' , ' . $this->arguments['posts_per_page'] . '
			',
			OBJECT
		);

		// ORDER BY {$this->arguments['orderby']}  {$this->arguments['order']}
	}

	/**
	 * @return array
	 */
	public function get_crawl_issues() {
		// Set items
		$return = array();
		if ( is_array( $this->crawl_issues ) && count( $this->crawl_issues ) > 0 ) {
			foreach ( $this->crawl_issues as $crawl_issue ) {
				$return[] = $crawl_issue->to_array();
			}
		}

		return $return;
	}

	/**
	 * Get the total items
	 *
	 * @return mixed
	 */
	public function get_total_items() {
		return $this->total_rows;
	}

	/**
	 * Filtering the issues
	 */
	private function filter_issues() {

		// Prepares the issue filter
//		$this->prepare_issue_filter();

		// First filter the platform
		$platform = ( $platform = filter_input( INPUT_GET, 'tab' ) ) ? $platform : 'web';



		$subquery = "SELECT platform.post_id FROM wp_postmeta platform ";

		if($category = filter_input( INPUT_GET, 'category' )) {
			$subquery .= "INNER JOIN wp_postmeta category ON category.post_id = platform.post_id && category.meta_key = 'wpseo_ci_issue_type' AND category.meta_value = '" . WPSEO_GWT_Mapper::category( $category ) . "'";
		}

		$subquery .= "WHERE platform.meta_key = 'wpseo_ci_crawl_type' && platform.meta_value = '" . WPSEO_GWT_Mapper::platform( $platform ) . "'";

		return $subquery;

//	INNER JOIN wp_postmeta category ON category.post_id = platform.post_id && category.meta_key = 'wpseo_ci_issue_type' AND category.meta_value = 'notFollewed'






//		$this->arguments['meta_key']   = 'wpseo_ci_crawl_type';
//		$this->arguments['meta_value'] = WPSEO_GWT_Mapper::platform( $platform );


//		// Set the issue filter
		if ( $category = filter_input( INPUT_GET, 'category' ) ) {
			$filter_posts = $this->issue_filter( 'wpseo_ci_issue_type', WPSEO_GWT_Mapper::category( $category ), WPSEO_GWT_Mapper::platform( $platform ) );

			if ( is_array( $filter_posts ) && ! empty ( $filter_posts ) ) {
				$this->arguments['post__in'] = $filter_posts;
			}
			else {
				$this->arguments['post__in'] = [];
			}
		}
	}


	/**
	 * Setting transient for filtering issues based on the dropdown shown on the page.
	 *
	 */
	private function prepare_issue_filter() {

		$platform = ( $platform = filter_input( INPUT_GET, 'category' ) ) ? $platform : 'web';

		// User switched between types unset the filter
		if ( $platform !== get_transient( 'gwt-platform' ) ) {
			delete_transient( 'gwt-category' );
		}

		set_transient( 'gwt-platform', $platform, HOUR_IN_SECONDS );


		// We saves the current status, because the user can switch between them.
		if ( $category = filter_input( INPUT_GET, 'category' ) ) {
			// User switched between status - unset the filter
			if ( $category !== get_transient( 'gwt-category' ) ) {
				delete_transient( 'gwt-issue_filter' );
			}

			set_transient( 'gwt-category', $category, HOUR_IN_SECONDS );
		}

		// If the values below aren't set, it looks like the page was visited for first time
		if ( empty( $_GET['category'] ) && empty( $_GET['paged'] ) && empty( $_GET['order'] ) && empty( $_GET['orderby'] ) ) {
			delete_transient( 'gwt-issue_filter' );
		}

	}


	/**
	 * This method will get the ids of the posts that should be displayed, based on the given filter
	 *
	 * @param string $meta_key
	 * @param string $meta_value
	 *
	 * @return array
	 */
	public function issue_filter( $meta_key, $meta_value, $platform ) {
		$post_ids = array();
		if ( $meta_value !== '-1' ) {
			global $wpdb;

			$post_ids = $wpdb->get_col(
				"
					SELECT DISTINCT a.post_id
					FROM {$wpdb->postmeta} AS a, {$wpdb->postmeta} AS b
					WHERE
						a.meta_key = '{$meta_key}' AND a.meta_value = '{$meta_value}' &&
						a.post_id = b.post_id && b.meta_key = 'wpseo_ci_crawl_type' AND b.meta_value = '{$platform}'
					ORDER BY a.meta_value ASC
				"
			);
		}

		return $post_ids;
	}

}
