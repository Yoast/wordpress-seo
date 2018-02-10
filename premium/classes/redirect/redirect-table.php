<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Classes
 */

if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
}

/**
 * Class WPSEO_Redirect_Table.
 */
class WPSEO_Redirect_Table extends WP_List_Table {

	/**
	 * @var WPSEO_Redirect[]
	 */
	public $items;

	/** @var array */
	private $filter = array(
		'redirect_type' => null,
		'search_string' => null,
	);

	/**
	 * @var string The name of the first column.
	 */
	private $current_column;

	/**
	 * @var string The primary column.
	 */
	private $primary_column = 'type';

	/**
	 * WPSEO_Redirect_Table constructor.
	 *
	 * @param array|string     $type           Type of the redirects that is opened.
	 * @param string           $current_column The value of the first column.
	 * @param WPSEO_Redirect[] $redirects      The redirects.
	 */
	public function __construct( $type, $current_column, $redirects ) {
		parent::__construct( array( 'plural' => $type ) );

		$this->current_column = $current_column;

		$this->set_items( $redirects );

		add_filter( 'list_table_primary_column', array( $this, 'redirect_list_table_primary_column' ), 10, 2 );
	}

	/**
	 * Renders the extra table navigation.
	 *
	 * @param string $which Which tablenav is called.
	 *
	 * @return void
	 */
	public function extra_tablenav( $which ) {
		if ( $which !== 'top' ) {
			return;
		}

		$selected = filter_input( INPUT_GET, 'redirect-type' );
		if ( ! $selected ) {
			$selected = 0;
		}

		?>
		<div class="alignleft actions">
			<label for="filter-by-redirect" class="screen-reader-text"><?php esc_html_e( 'Filter by redirect type', 'wordpress-seo-premium' ); ?></label>
			<select name="redirect-type" id="filter-by-redirect">
				<option<?php selected( $selected, 0 ); ?> value="0"><?php esc_html_e( 'All redirect types', 'wordpress-seo-premium' ); ?></option>
				<?php
				$redirect_types = new WPSEO_Redirect_Types();

				foreach ( $redirect_types->get() as $http_code => $redirect_type ) {
					printf( "<option %s value='%s'>%s</option>\n",
						selected( $selected, $http_code, false ),
						esc_attr( $http_code ),
						esc_html( $redirect_type )
					);
				}
				?>
			</select>
			<?php submit_button( __( 'Filter', 'wordpress-seo-premium' ), '', 'filter_action', false, array( 'id' => 'post-query-submit' ) ); ?>
		</div>
		<?php
	}

	/**
	 * Set the table columns.
	 *
	 * @return array The table columns.
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
	 * Counts the total columns for the table.
	 *
	 * @return int The total amount of columns.
	 */
	public function count_columns() {
		return count( $this->get_columns() );
	}

	/**
	 * Filter for setting the primary table column.
	 *
	 * @param string $column The current column.
	 * @param string $screen The current opened window.
	 *
	 * @return string The primary table column.
	 */
	public function redirect_list_table_primary_column( $column, $screen ) {
		if ( 'seo_page_wpseo_redirects' === $screen ) {
			$column = $this->primary_column;
		}

		return $column;
	}

	/**
	 * Sets up the table variables, fetch the items from the database, search, sort and format the items.
	 * Sets the items as the WPSEO_Redirect_Table items variable.
	 *
	 * @return void
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

		$paged        = filter_input( INPUT_GET, 'paged' );
		$current_page = (int) ( ( isset( $paged ) && $paged !== false ) ? $paged : 0 );

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
	 * Returns the columns that are sortable.
	 *
	 * @return array An array containing the sortable columns.
	 */
	public function get_sortable_columns() {
		$sortable_columns = array(
			'old'  => array( 'old', false ),
			'new'  => array( 'new', false ),
			'type' => array( 'type', false ),
		);

		return $sortable_columns;
	}

	/**
	 * Reorders the items based on user input.
	 *
	 * @param array $a The current sort direction.
	 * @param array $b The new sort direction.
	 *
	 * @return int The order that should be used.
	 */
	public function do_reorder( $a, $b ) {
		// If no sort, default to title.
		$orderby = filter_input(
			INPUT_GET,
			'orderby',
			FILTER_VALIDATE_REGEXP,
			array(
				'options' => array(
					'default' => 'old',
					'regexp'  => '/^(old|new|type)$/',
				),
			)
		);

		// If no order, default to asc.
		$order = filter_input(
			INPUT_GET,
			'order',
			FILTER_VALIDATE_REGEXP,
			array(
				'options' => array(
					'default' => 'asc',
					'regexp'  => '/^(asc|desc)$/',
				),
			)
		);

		// Determine sort order.
		$result = strcmp( $a[ $orderby ], $b[ $orderby ] );

		// Send final sort direction to usort.
		return ( $order === 'asc' ) ? $result : ( - $result );
	}

	/**
	 * Creates a column for a checkbox.
	 *
	 * @param array $item Array with the row data.
	 *
	 * @return string The column with a checkbox.
	 */
	public function column_cb( $item ) {
		return sprintf(
			'<label class="screen-reader-text" for="wpseo-redirects-bulk-cb-%2$s">%3$s</label> <input type="checkbox" name="wpseo_redirects_bulk_delete[]" id="wpseo-redirects-bulk-cb-%2$s" value="%1$s" />',
			esc_attr( $item['old'] ),
			$item['row_number'],
			esc_html( __( 'Select this redirect', 'wordpress-seo-premium' ) )
		);
	}

	/**
	 * Displays a default column.
	 *
	 * @param array  $item        Array with the row data.
	 * @param string $column_name The name of the needed column.
	 *
	 * @return string The default column.
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

			case 'old':
				$classes = '';
				if ( $is_regex === true ) {
					$classes = ' remove-slashes';
				}

				return "<div class='val" . $classes . "'>" . esc_html( $item['old'] ) . '</div>' . $row_actions;

			case 'type':
				return '<div class="val type">' . esc_html( $item['type'] ) . '</div>' . $row_actions;

			default:
				return $item[ $column_name ];
		}
	}
	/**
	 * Returns the available bulk actions.
	 *
	 * @return array Array containing the available bulk actions.
	 */
	public function get_bulk_actions() {
		$actions = array(
			'delete' => __( 'Delete', 'wordpress-seo-premium' ),
		);

		return $actions;
	}

	/**
	 * Sets the items and orders them.
	 *
	 * @param array $items The data that will be showed.
	 *
	 * @return void
	 */
	private function set_items( $items ) {
		// Getting the items.
		$this->items = $this->filter_items( $items );

		$this->format_items();

		// Sort the results.
		if ( count( $this->items ) > 0 ) {
			usort( $this->items, array( $this, 'do_reorder' ) );
		}
	}

	/**
	 * Filters the given items.
	 *
	 * @param WPSEO_Redirect[] $items The items to filter.
	 *
	 * @return array The filtered items.
	 */
	private function filter_items( array $items ) {
		$search_string = filter_input( INPUT_GET, 's', FILTER_DEFAULT, array( 'options' => array( 'default' => '' ) ) );
		if ( $search_string !== '' ) {
			$this->filter['search_string'] = trim( $search_string, '/' );

			$items = array_filter( $items, array( $this, 'filter_by_search_string' ) );
		}

		$redirect_type = (int) filter_input( INPUT_GET, 'redirect-type' );
		if ( ! empty( $redirect_type ) ) {
			$this->filter['redirect_type'] = $redirect_type;

			$items = array_filter( $items, array( $this, 'filter_by_type' ) );
		}

		return $items;
	}

	/**
	 * Formats the items.
	 */
	private function format_items() {
		// Format the data.
		$formatted_items = array();

		$counter = 1;

		foreach ( $this->items as $old => $redirect ) {
			$formatted_items[] = array(
				'old'        => $redirect->get_origin(),
				'new'        => $redirect->get_target(),
				'type'       => $redirect->get_type(),
				'row_number' => $counter,
			);

			$counter++;
		}

		$this->items = $formatted_items;
	}

	/**
	 * Filters the redirect by entered search string.
	 *
	 * @param WPSEO_Redirect $redirect The redirect to filter.
	 *
	 * @return bool True when the search strings match.
	 */
	private function filter_by_search_string( WPSEO_Redirect $redirect ) {
		return ( stripos( $redirect->get_origin(), $this->filter['search_string'] ) !== false || stripos( $redirect->get_target(), $this->filter['search_string'] ) !== false );
	}

	/**
	 * Filters the redirect by redirect type.
	 *
	 * @param WPSEO_Redirect $redirect The redirect to filter.
	 *
	 * @return bool True when type matches redirect type.
	 */
	private function filter_by_type( WPSEO_Redirect $redirect ) {
		return $redirect->get_type() === $this->filter['redirect_type'];
	}

	/**
	 * The old column actions.
	 *
	 * @param string $column The column name to verify.
	 *
	 * @return string
	 */
	private function get_row_actions( $column ) {
		if ( $column === $this->primary_column ) {
			$actions = array(
				'edit'  => '<a href="#" role="button" class="redirect-edit">' . __( 'Edit', 'wordpress-seo-premium' ) . '</a>',
				'trash' => '<a href="#" role="button" class="redirect-delete">' . __( 'Delete', 'wordpress-seo-premium' ) . '</a>',
			);

			return $this->row_actions( $actions );
		}

		return '';
	}
}
