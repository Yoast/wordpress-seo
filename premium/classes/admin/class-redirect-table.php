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
 * Class WPSEO_Redirect_Table
 */
class WPSEO_Redirect_Table extends WP_List_Table {

	private $search_string;

	/**
	 * WPSEO_Redirect_Table constructor
	 */
	public function __construct() {
		parent::__construct();
		$this->handle_bulk_action();

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

			foreach ( $items as $old => $new ) {
				if ( false !== stripos( $old, $this->search_string ) || false !== stripos( $new, $this->search_string ) ) {
					$results[$old] = $new;
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
				'cb'  => '<input type="checkbox" />',
				'old' => __( 'Old URL', 'wordpress-seo' ),
				'new' => __( 'New URL', 'wordpress-seo' ),
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

		// Get the items
		$redirect_items = WPSEO_Redirect_Manager::get_redirects();

		// Handle the search
		if ( null != $this->search_string ) {
			$redirect_items = $this->do_search( $redirect_items );
		}

		// Format the data
		$formatted_items = array();
		if ( is_array( $redirect_items ) && count( $redirect_items ) > 0 ) {
			foreach ( $redirect_items as $old => $new ) {
				$formatted_items[] = array( 'old' => $old, 'new' => $new );
			}
		}

		// Sort the results
		if ( count( $formatted_items ) > 0 ) {
			usort( $formatted_items, array( $this, 'do_reorder' ) );
		}

		// Get variables needed for pagination
		$per_page    = $this->get_items_per_page( 'redirects_per_page', 25 );
		$total_items = count( $formatted_items );

		// Set pagination
		$this->set_pagination_args( array(
				'total_items' => count( $formatted_items ),
				'total_pages' => ceil( $total_items / $per_page ),
				'per_page'    => $per_page,
		) );

		$current_page = intval( $_GET['paged'] );

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
				'old' => array( 'old', false ),
				'new' => array( 'new', false )
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
		$orderby = ( ! empty( $_GET['orderby'] ) ) ? $_GET['orderby'] : 'old';

		// If no order, default to asc
		$order = ( ! empty( $_GET['order'] ) ) ? $_GET['order'] : 'asc';

		// Determine sort order
		$result = strcmp( $a[$orderby], $b[$orderby] );

		// Send final sort direction to usort
		return ( $order === 'asc' ) ? $result : - $result;
	}

	public function column_old( $item ) {
		$actions = array(
				'edit'  => '<a href="javascript:;">' . __( 'Edit', 'wordpress-seo' ) . '</a>',
				'trash' => '<a href="javascript:;" >' . __( 'Delete', 'wordpress-seo' ) . '</a>',
		);

		return sprintf(
				'<div class="val">%1$s</div> %2$s',
				$item['old'],
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
				'<input type="checkbox" name="wpseo_redirects_bulk_delete[]" value="%s" />', $item['old']
		);
	}

	/**
	 * Checkbox column
	 *
	 * @param $item
	 *
	 * @return string
	 */
	/*
	public function column_actions( $item ) {
		return sprintf(
				'<a href="javascript:;">' . __( 'Edit', 'wordpress-seo' ) . '</a> | <a href="javascript:;">' . __( 'Delete', 'wordpress-seo' ) . '</a>'
		);
	}
	*/

	/**
	 * Default method to display a column
	 *
	 * @param $item
	 * @param $column_name
	 *
	 * @return mixed
	 */
	public function column_default( $item, $column_name ) {

		switch ( $column_name ) {
			case 'new':
				return "<div class='val'>" . $item[$column_name] . "</div>";
				break;
			default:
				return $item[$column_name];
		}
	}

	/**
	 * Return available bulk actions
	 *
	 * @return array
	 */
	public function get_bulk_actions() {
		$actions = array(
				'delete' => __( 'Delete', 'wordpress-seo' )
		);

		return $actions;
	}

	/**
	 * Function that handles bulk action
	 */
	private function handle_bulk_action() {
		if ( isset( $_POST['action'] ) ) {

			switch ( $_POST['action'] ) {
				case 'delete':
					if ( is_array( $_POST['wpseo_redirects_bulk_delete'] ) && count( $_POST['wpseo_redirects_bulk_delete'] ) > 0 ) {
						WPSEO_Redirect_Manager::delete_redirects( $_POST['wpseo_redirects_bulk_delete'] );
					}
					break;
			}
		}
	}

}