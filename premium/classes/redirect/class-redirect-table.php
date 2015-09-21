<?php
/**
 * @package WPSEO\Premium\Classes
 */

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
	private $type;

	/**
	 * @var WPSEO_Redirect_Manager
	 */
	private $redirect_manager;

	/**
	 * WPSEO_Redirect_Table constructor
	 *
	 * @param string                 $type
	 * @param WPSEO_Redirect_Manager $redirect_manager
	 */
	public function __construct( $type, WPSEO_Redirect_Manager $redirect_manager ) {
		parent::__construct( array( 'plural' => $type ) );

		$this->type             = $type;
		$this->redirect_manager = $redirect_manager;

		$this->handle_bulk_action();
		$this->set_items();

		add_filter( 'list_table_primary_column', array( $this, 'redirect_list_table_primary_column' ) , 10, 2 );
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
	 * Filter for setting the primary table column
	 *
	 * @param string $column
	 * @param string $screen
	 *
	 * @return string
	 */
	public function redirect_list_table_primary_column( $column, $screen ) {
		if ( 'seo_page_wpseo_redirects' === $screen ) {
			$column = 'old';
		}

		return $column;
	}

	/**
	 * Setup the table variables, fetch the items from the database, search, sort and format the items.
	 * Set the items as the WPSEO_Redirect_Table items variable.
	 */
	public function prepare_items() {
		// Setup the columns.
		$this->_column_headers = array( $this->get_columns(), array(), $this->get_sortable_columns() );

		// Get variables needed for pagination.
		$per_page    = $this->get_items_per_page( 'redirects_per_page', 25 );
		$total_items = count( $this->items );

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
		$formatted_items = array_slice( $this->items, ( $slice_start * $per_page ), $per_page );

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
	 * @param array $a
	 * @param array $b
	 *
	 * @return int
	 */
	public function do_reorder( $a, $b ) {
		// If no sort, default to title.
		$orderby = filter_input( INPUT_GET, 'orderby', FILTER_VALIDATE_REGEXP, array( 'options' => array( 'default' => 'old', 'regexp' => '/^(old|new|type)$/' ) ) );

		// If no order, default to asc.
		$order   = filter_input( INPUT_GET, 'order', FILTER_VALIDATE_REGEXP, array( 'options' => array( 'default' => 'asc', 'regexp' => '/^(asc|desc)$/' ) ) );

		// Determine sort order.
		$result   = strcmp( $a[ $orderby ], $b[ $orderby ] );

		// Send final sort direction to usort.
		return ( $order === 'asc' ) ? $result : ( - $result );
	}

	/**
	 * The old column actions
	 *
	 * @param array $item
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
	 * Checkbox columns
	 *
	 * @param array $item
	 * @return string
	 */
	public function column_cb( $item ) {
		return sprintf( '<input type="checkbox" name="wpseo_redirects_bulk_delete[]" value="%s" />', $item['old'] );
	}

	/**
	 * Default method to display a column
	 *
	 * @param array  $item
	 * @param string $column_name
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

	/**
	 * Setting the items
	 */
	private function set_items() {
		// Getting the items.
		$this->items = $this->redirect_manager->get_redirects();

		if ( ! is_array( $this->items ) ) {
			$this->items = array();
		}

		if ( ( $search_string = filter_input( INPUT_GET, 's', FILTER_DEFAULT, array( 'options' => array( 'default' => '' ) ) ) ) !== '' ) {
			$this->do_search( $search_string );
		}

		$this->format_items();

		// Sort the results.
		if ( count( $this->items ) > 0 ) {
			usort( $this->items, array( $this, 'do_reorder' ) );
		}
	}

	/**
	 * Format the items
	 */
	private function format_items() {
		// Format the data.
		$formatted_items = array();
		foreach ( $this->items as $old => $redirect ) {
			$formatted_items[] = array( 'old' => $old, 'new' => $redirect['url'], 'type' => $redirect['type'] );
		}

		$this->items = $formatted_items;
	}

	/**
	 * Search through the items
	 *
	 * @param string $search_string
	 */
	private function do_search( $search_string ) {
		$results = array();

		foreach ( $this->items as $old => $redirect ) {
			if ( false !== stripos( $old, $search_string ) || false !== stripos( $redirect['url'], $search_string ) ) {
				$results[ $old ] = $redirect;
			}
		}

		$this->items = $results;
	}

}
