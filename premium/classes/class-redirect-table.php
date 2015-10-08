<?php
/**
 * @package WPSEO\Premium\Classes
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

	/**
	 * @var string
	 */
	private $search_string;

	/**
	 * @var string
	 */
	private $type;

	/**
	 * @var mixed
	 */
	private $redirect_manager;

	/**
	 * WPSEO_Redirect_Table constructor
	 *
	 * @param string $type The type of the redirects page, can be URL or Regex.
	 */
	public function __construct( $type ) {
		parent::__construct( array( 'plural' => $type ) );

		$this->type             = $type;
		$class_name             = 'WPSEO_' . strtoupper( $this->type ) . '_Redirect_Manager';
		$this->redirect_manager = new $class_name();

		$this->handle_bulk_action();

		if ( ( $search_string = filter_input( INPUT_GET, 's' ) ) != '' ) {
			$this->search_string = $search_string;
		}
	}

	/**
	 * Search through the items
	 *
	 * @param array $items Array with the redirects.
	 *
	 * @return array
	 */
	private function do_search( $items ) {
		$results = array();

		if ( is_array( $items ) ) {

			foreach ( $items as $old => $redirect ) {
				if ( false !== stripos( $old, $this->search_string ) || false !== stripos( $redirect['url'], $this->search_string ) ) {
					$results[ $old ] = $redirect;
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
			'cb'   => '<input type="checkbox" />',
			'old'  => $this->type,
			'new'  => __( 'New URL', 'wordpress-seo-premium' ),
			'type' => _x( 'Type', 'noun', 'wordpress-seo-premium' ),
		);

		return $columns;
	}

	/**
	 * Setup the table variables, fetch the items from the database, search, sort and format the items.
	 * Set the items as the WPSEO_Redirect_Table items variable.
	 */
	public function prepare_items() {

		// Setup the columns.
		$columns               = $this->get_columns();
		$hidden                = array();
		$sortable              = $this->get_sortable_columns();
		$this->_column_headers = array( $columns, $hidden, $sortable );

		// Get the items.
		$redirect_items = $this->redirect_manager->get_redirects();

		// Handle the search.
		if ( null != $this->search_string ) {
			$redirect_items = $this->do_search( $redirect_items );
		}

		// Format the data.
		$formatted_items = array();
		if ( is_array( $redirect_items ) && count( $redirect_items ) > 0 ) {
			foreach ( $redirect_items as $old => $redirect ) {
				$formatted_items[] = array( 'old' => $old, 'new' => $redirect['url'], 'type' => $redirect['type'] );
			}
		}

		// Sort the results.
		if ( count( $formatted_items ) > 0 ) {
			usort( $formatted_items, array( $this, 'do_reorder' ) );
		}

		// Get variables needed for pagination.
		$per_page    = $this->get_items_per_page( 'redirects_per_page', 25 );
		$total_items = count( $formatted_items );

		// Set pagination.
		$this->set_pagination_args( array(
			'total_items' => $total_items,
			'total_pages' => ceil( $total_items / $per_page ),
			'per_page'    => $per_page,
		) );

		$current_page = intval( ( ( $paged = filter_input( INPUT_GET, 'paged' ) ) ? $paged : 0 ) );

		// Setting the starting point. If starting point is below 1, overwrite it with value 0, otherwise it will be sliced of at the back.
		$slice_start = ( $current_page - 1 );
		if ( $slice_start < 0 ) {
			$slice_start = 0;
		}

		// Apply 'pagination'.
		$formatted_items = array_slice( $formatted_items, ( $slice_start * $per_page ), $per_page );

		// Set items.
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
			'new' => array( 'new', false ),
			'type' => array( 'type', false ),
		);

		return $sortable_columns;
	}

	/**
	 * Reorder the items based on user input
	 *
	 * @param array $a Array with the values that will be sorted.
	 * @param array $b Array with the values that will be compared.
	 *
	 * @return int
	 */
	public function do_reorder( $a, $b ) {
		// If no sort, default to title.
		$orderby = ( ( $orderby = filter_input( INPUT_GET, 'orderby' ) ) != '' ) ? $orderby : 'old';

		// If no order, default to asc.
		$order = ( ( $order = filter_input( INPUT_GET, 'order' ) ) != '' ) ? $order : 'asc';

		// Determine sort order.
		$result = strcmp( $a[ $orderby ], $b[ $orderby ] );

		// Send final sort direction to usort.
		return ( $order === 'asc' ) ? $result : ( - $result );
	}

	/**
	 * The old column actions
	 *
	 * @param array $item Array with item details.
	 *
	 * @return string
	 */
	public function column_old( $item ) {
		$actions = array(
			'edit'  => '<a href="javascript:;">' . __( 'Edit', 'wordpress-seo-premium' ) . '</a>',
			'trash' => '<a href="javascript:;" >' . __( 'Delete', 'wordpress-seo-premium' ) . '</a>',
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
	 * @param array $item Array with the item details.
	 *
	 * @return string
	 */
	public function column_cb( $item ) {
		return sprintf(
			'<input type="checkbox" name="wpseo_redirects_bulk_delete[]" value="%s" />', $item['old']
		);
	}

	/**
	 * Default method to display a column
	 *
	 * @param array  $item        Array with the item details.
	 * @param string $column_name The name of the column that will be showed.
	 *
	 * @return string
	 */
	public function column_default( $item, $column_name ) {

		switch ( $column_name ) {
			case 'new':
				return "<div class='val'>" . $item[ $column_name ] . '</div>';
				break;
			case 'type':
				return "<div class='val type'>" . $item[ $column_name ] . '</div>';
				break;
			default:
				return $item[ $column_name ];
		}
	}

	/**
	 * Return available bulk actions
	 *
	 * @return array
	 */
	public function get_bulk_actions() {
		$actions = array(
			'delete' => __( 'Delete', 'wordpress-seo-premium' ),
		);

		return $actions;
	}

	/**
	 * Function that handles bulk action
	 */
	private function handle_bulk_action() {
		if ( filter_input( INPUT_POST, 'action' ) === 'delete' || filter_input( INPUT_POST, 'action2' ) === 'delete' ) {
			if ( ( $redirects_bulk_delete = filter_input( INPUT_POST, 'wpseo_redirects_bulk_delete', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY ) ) && count( $redirects_bulk_delete ) > 0 ) {
				$this->redirect_manager->delete_redirect( $redirects_bulk_delete );
			}
		}

	}

}
