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
	 * @var WPSEO_Redirect[]
	 */
	public $items;

	/**
	 * @var string The name of the first column
	 */
	private $current_column;

	/**
	 * @var string The primary column
	 */
	private $primary_column = 'type';

	/**
	 * @var boolean Whether or not the target column has a trailing slash
	 */
	private $target_has_trailing_slash = null;

	/**
	 * WPSEO_Redirect_Table constructor
	 *
	 * @param array|string     $type           Type of the redirects that is opened.
	 * @param string           $current_column The value of the first column.
	 * @param WPSEO_Redirect[] $redirects      The redirects.
	 */
	public function __construct( $type, $current_column, $redirects ) {
		parent::__construct( array( 'plural' => $type ) );

		$this->current_column = $current_column;

		$this->set_items( $redirects );

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
			'type' => _x( 'Type', 'noun', 'wordpress-seo-premium' ),
			'old'  => $this->current_column,
			'new'  => __( 'New URL', 'wordpress-seo-premium' ),
		);

		return $columns;
	}

	/**
	 * Counts the total columns for the table
	 *
	 * @return int
	 */
	public function count_columns() {
		return count( $this->get_columns() );
	}

	/**
	 * Filter for setting the primary table column
	 *
	 * @param string $column The current column.
	 * @param string $screen The current opened window.
	 *
	 * @return string
	 */
	public function redirect_list_table_primary_column( $column, $screen ) {
		if ( 'seo_page_wpseo_redirects' === $screen ) {
			$column = $this->primary_column;
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
	 * @param array $a The current sort direction.
	 * @param array $b The new sort direction.
	 *
	 * @return int
	 */
	public function do_reorder( $a, $b ) {
		// If no sort, default to title.
		$orderby = filter_input( INPUT_GET, 'orderby', FILTER_VALIDATE_REGEXP, array( 'options' => array( 'default' => 'old', 'regexp' => '/^(old|new|type)$/' ) ) );

		// If no order, default to asc.
		$order   = filter_input( INPUT_GET, 'order', FILTER_VALIDATE_REGEXP, array( 'options' => array( 'default' => 'asc', 'regexp' => '/^(asc|desc)$/' ) ) );

		$order = ( ( $order = filter_input( INPUT_GET, 'order' ) ) != '' ) ? $order : 'asc';

		// Determine sort order.
		$result   = strcmp( $a[ $orderby ], $b[ $orderby ] );

		// Send final sort direction to usort.
		return ( $order === 'asc' ) ? $result : ( - $result );
	}

	/**
	 * Checkbox columns
	 *
	 * @param array $item Array with the row data.
	 *
	 * @return string
	 */
	public function column_cb( $item ) {
		return sprintf( '<input type="checkbox" name="wpseo_redirects_bulk_delete[]" value="%s" />', esc_attr( $item['old'] ) );
	}

	/**
	 * Default method to display a column
	 *
	 * @param array  $item        Array with the row data.
	 * @param string $column_name The name of the needed column.
	 *
	 * @return string
	 */
	public function column_default( $item, $column_name ) {

		$is_regex    = ( filter_input( INPUT_GET, 'tab' ) === 'regex' );
		$row_actions = $this->get_row_actions( $column_name );

		switch ( $column_name ) {
			case 'new':
				$classes = array( 'val' );
				$new_url = $item['new'];

				if ( ! $is_regex && WPSEO_Redirect_Util::requires_trailing_slash( $new_url ) ) {
					$classes[] = 'has-trailing-slash';
				}

				if (
					'' === $new_url ||
					'/' === $new_url ||
					! WPSEO_Redirect_Util::is_relative_url( $new_url )
				) {
					$classes[] = 'remove-slashes';
				}

				return "<div class='" . esc_attr( implode( ' ', $classes ) ) . "'>" . esc_html( $new_url ) . '</div>' . $row_actions;
				break;
			case 'old':
				$classes = '';
				if ( $is_regex === true ) {
					$classes = 'remove-slashes';
				}

				return "<div class='val " . $classes . "'>" . esc_html( $item['old'] ). '</div>' . $row_actions;
				break;
			case 'type';
				return '<div class="val type">' . esc_html( $item['type'] ) .'</div>' . $row_actions;
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
	 * Returns whether or not the target should have a trailing slash
	 */
	private function has_target_trailing_slash() {
		if ( null === $this->target_has_trailing_slash ) {
			$permalink_structure = get_option( 'permalink_structure' );

			$this->target_has_trailing_slash = substr( $permalink_structure, -1 ) === '/';
		}

		return $this->target_has_trailing_slash;
	}

	/**
	 * Setting the items
	 *
	 * @param array $items The data that will be showed.
	 */
	private function set_items( $items ) {
		// Getting the items.
		$this->items = $items;

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
			$formatted_items[] = array(
				'old'  => $redirect->get_origin(),
				'new'  => $redirect->get_target(),
				'type' => $redirect->get_type(),
			);
		}

		$this->items = $formatted_items;
	}

	/**
	 * Search through the items
	 *
	 * @param string $search_string The entered search string.
	 */
	private function do_search( $search_string ) {
		$results = array();

		foreach ( $this->items as $old => $redirect ) {
			if ( false !== stripos( $redirect->get_origin(), $search_string ) || false !== stripos( $redirect->get_target(), $search_string ) ) {
				$results[ $old ] = $redirect;
			}
		}

		$this->items = $results;
	}

	/**
	 * The old column actions
	 *
	 * @param string $column The column name to verify.
	 *
	 * @return string
	 */
	private function get_row_actions( $column ) {
		if ( $column === $this->primary_column ) {
			$actions = array(
				'edit'  => '<a href="javascript:;">' . __( 'Edit', 'wordpress-seo-premium' ) . '</a>',
				'trash' => '<a href="javascript:;" >' . __( 'Delete', 'wordpress-seo-premium' ) . '</a>',
			);

			return $this->row_actions( $actions );
		}

		return '';
	}
}
