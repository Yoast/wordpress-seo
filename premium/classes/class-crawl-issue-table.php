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

		// Set page views
		add_filter( 'views_' . $this->screen->id, array( $this, 'add_page_views' ) );

		// Set search string
		if ( isset( $_GET['s'] ) && $_GET['s'] != '' ) {
			$this->search_string = $_GET['s'];
		}
	}

	/**
	 * Get the current view
	 *
	 * @return string
	 */
	private function get_current_view() {
		return ( isset ( $_GET['status'] ) ? $_GET['status'] : 'all' );
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
			'all'            => __( 'All', 'wordpress-seo-premium' ),
			'not-redirected' => __( 'Not redirected', 'wordpress-seo-premium' ),
			'ignored'        => __( 'Ignored', 'wordpress-seo-premium' ),
		);

		$new_views = array();

		foreach ( $views_arr as $key => $val ) {
			$new_views[$key] = "<a href='" . add_query_arg( array( 'status' => $key, 'paged' => 1 ) ) . "'" . ( ( $current == $key ) ? " class='current'" : "" ) . ">{$val}</a>";
		}

		return $new_views;
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
			'url'           => __( 'URL', 'wordpress-seo-premium' ),
			'issue_type'    => __( 'Issue Type', 'wordpress-seo-premium' ),
			'date_detected' => __( 'Date Detected', 'wordpress-seo-premium' ),
			'detail'        => __( 'Details', 'wordpress-seo-premium' ),
			'linked_from'   => __( 'Linked From', 'wordpress-seo-premium' ),
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

		// Get current view
		$current_view = $this->get_current_view();

		// Build crawl issues args
		$ci_args = array();

		// Set the post status
		$ci_args['post_status'] = 'publish';

		// Set the orderby
		$orderby            = ( ! empty( $_GET['orderby'] ) ) ? $_GET['orderby'] : 'title';
		$ci_args['orderby'] = $orderby;

		// Set the order
		$order            = ( ! empty( $_GET['order'] ) ) ? $_GET['order'] : 'asc';
		$ci_args['order'] = $order;

		// Prepares the issue filter
		$this->prepare_issue_filter();

		// Set the issue filter
		if ( $issue_filter = get_transient( 'gwt-issue_filter' ) ) {
			$filter_posts = $this->issue_filter( $issue_filter );

			if ( is_array( $filter_posts ) && ! empty ( $filter_posts ) ) {
				$ci_args['post__in'] = $filter_posts;
			}
		}

		// Get variables needed for pagination
		$per_page     = $this->get_items_per_page( 'errors_per_page', 25 );
		$current_page = intval( ( ( isset( $_GET['paged'] ) ) ? $_GET['paged'] : 1 ) );

		// Set query pagination
		$ci_args['posts_per_page'] = $per_page;
		$ci_args['offset']         = ( ( $current_page - 1 ) * $per_page );

		// Check current view
		if ( 'ignored' == $current_view ) {
			$ci_args['post_status'] = 'trash';
		}

		// Filter crawl errors
		if ( 'not-redirected' == $current_view ) {
			$url_redirect_manager = new WPSEO_URL_Redirect_Manager();
			$redirects            = $url_redirect_manager->get_redirects();
			$wpseo_urls           = array();
			if ( count( $redirects ) > 0 ) {
				foreach ( $redirects as $old_url => $new_url ) {
					$wpseo_urls[] = $old_url;
				}
			}
			$ci_args['wpseo_urls'] = $wpseo_urls;
		}

		// Get the crawl issues
		$crawl_issue_manager = new WPSEO_Crawl_Issue_Manager();
		$crawl_issues        = $crawl_issue_manager->get_crawl_issues( $this->gwt, $ci_args );

		// Get the total items
		$total_items = $crawl_issue_manager->get_latest_query()->found_posts;

		// Set table pagination
		$this->set_pagination_args( array(
			'total_items' => $total_items,
			'total_pages' => ceil( $total_items / $per_page ),
			'per_page'    => $per_page,
		) );

		// Set items
		$items_array = array();
		if ( is_array( $crawl_issues ) && count( $crawl_issues ) > 0 ) {
			foreach ( $crawl_issues as $crawl_issue ) {
				$items_array[] = $crawl_issue->to_array();
			}
		}
		$this->items = $items_array;
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
	 * URL column
	 *
	 * @param $item
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
		} else {
			$actions['ignore'] = '<a href="javascript:wpseo_ignore_redirect(\'' . urlencode( $item['url'] ) . '\');">' . __( 'Ignore', 'wordpress-seo-premium' ) . '</a>';
		}

		return sprintf(
			'<span class="value">%1$s</span> %2$s',
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
			'create_redirects' => __( 'Create Redirects', 'wordpress-seo-premium' )
		);

		return $actions;
	}

	/**
	 * Adds a dropdown to the top for filtering crawl issues - based on the excisting issue types in de database
	 *
	 *
	 * @param $which
	 */
	public function extra_tablenav( $which ) {

		if ( 'top' === $which ) {
			global $wpdb;

			$issue_types = $wpdb->get_results(
				"
					SELECT DISTINCT meta_value
					FROM {$wpdb->postmeta}
					WHERE meta_key = 'wpseo_ci_issue_type'
					ORDER BY meta_value ASC
				"
			);

			if ( false === ( $selected = get_transient( 'gwt-issue_filter' ) ) ) {
				$selected = '1';
			}

			$options = '<option value="-1">Show All Crawl Issues</option>';
			if ( is_array( $issue_types ) && $issue_types !== array() ) {
				foreach ( $issue_types as $issue_type ) {
					$options .= sprintf( '<option value="%2$s" %3$s>%1$s</option>', $issue_type->meta_value, $issue_type->meta_value, selected( $selected, $issue_type->meta_value, false ) );
				}
			}

			echo '<div class="alignleft actions">';
			echo sprintf( '<select name="gwt-issue_filter">%1$s</select>', $options );
			submit_button( __( 'Filter', 'wordpress-seo-premium' ), 'button', false, false, array( 'id' => 'post-query-submit' ) );
			echo '</div>';
		}

	}

	/**
	 * Setting transient for filtering issues based on the dropdown shown on the page.
	 *
	 */
	public function prepare_issue_filter() {

		// Page uses $_POST, using a transient let us remember the current filter
		if ( !empty( $_POST ) ) {
			if ( !empty ( $_POST['gwt-issue_filter'] ) ) {
				// Set temporary var
				set_transient( 'gwt-issue_filter', $_POST['gwt-issue_filter'], HOUR_IN_SECONDS );
			}
		} else {
			// We saves the current status, because the user can switch between them.
			if ( ! empty( $_GET['status'] ) ) {

				// User switched between status - unset the filter
				if ( $_GET['status'] !== get_transient( 'gwt-status' ) ) {
					delete_transient( 'gwt-issue_filter' );
				}

				set_transient( 'gwt-status', $_GET['status'], HOUR_IN_SECONDS );
			}

			// If the values below aren't set, it looks like the page was visited for first time
			if ( empty( $_GET['status'] ) && empty( $_GET['paged'] ) && empty( $_GET['order'] ) && empty( $_GET['orderby'] ) ) {

				delete_transient( 'gwt-issue_filter' );
			}
		}
	}

	/**
	 * This method will get the ids of the posts that should be displayed, based on the given filter
	 *
	 * @param string $filter Issue type to filter
	 *
	 * @return array
	 */
	public function issue_filter( $filter ) {
		$post_ids = array();

		if ( $filter !== '-1' ) {
			global $wpdb;

			$post_ids = $wpdb->get_col(
				"
					SELECT DISTINCT post_id
					FROM {$wpdb->postmeta}
					WHERE meta_key = 'wpseo_ci_issue_type' AND meta_value = '{$filter}'
					ORDER BY meta_value ASC
				"
			);

		}

		return $post_ids;
	}

}
