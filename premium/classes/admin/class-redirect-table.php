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
 *
 * @todo Create pagination
 * @todo Create default post top tab to adjust posts per page backend param
 * @todo Fix sorting in combination with search
 */
class WPSEO_Redirect_Table extends WP_List_Table {

	private $data;
	private $search_string;

	/**
	 * WPSEO_Redirect_Table constructor
	 */
	public function __construct() {
		parent::__construct();
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
	 * Set the search string
	 *
	 * @param $search_string
	 */
	public function set_search( $search_string ) {
		$this->search_string = $search_string;
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
		$redirect_items = array();
		for ( $i = 0; $i < 100; $i ++ ) {
			$redirect_items[$i . ' OLD_URL'] = $i . ' NEW_URL';
		}

		// Handle the search
		if ( null != $this->search_string ) {
			$redirect_items = $this->do_search( $redirect_items );
		}

		// Format the data
		$formatted_items = array();
		if ( count( $redirect_items ) > 0 ) {
			foreach ( $redirect_items as $old => $new ) {
				$formatted_items[] = array( 'old' => $old, 'new' => $new );
			}
		}

		// Sort the results
		if ( count( $formatted_items ) > 0 ) {
			usort( $formatted_items, array( $this, 'do_reorder' ) );
		}

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
				'edit'  => '<a href="javascript:;">' . __( 'Edit', 'sub-posts' ) . '</a>',
				'trash' => '<a href="javascript:;" >' . __( 'Delete', 'sub-posts' ) . '</a>',
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
				'<input type="checkbox" name="wpseo_redirects_bulk[]" value="%s" />', $item['ID']
		);
	}

	/**
	 * Checkbox column
	 *
	 * @param $item
	 *
	 * @return string
	 */
	public function column_actions( $item ) {
		return sprintf(
				'<a href="javascript:;">' . __( 'Edit', 'wordpress-seo' ) . '</a> | <a href="javascript:;">' . __( 'Delete', 'wordpress-seo' ) . '</a>'
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

		switch ( $column_name ) {
			case 'new':
				return "<div class='val'>" . $item[$column_name] . "</a>";
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

}