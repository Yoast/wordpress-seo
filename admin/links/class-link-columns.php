<?php
/**
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the link columns. This class will add and handle the link columns.
 */
class WPSEO_Link_Columns {

	/**
	 * @var string Partial column name.
	 */
	const COLUMN_LINKED = 'linked';

	/**
	 * @var string Partial column name.
	 */
	const COLUMN_LINKS = 'links';

	/**
	 * @var WPSEO_Link_Column_Count
	 */
	protected $link_count;

	/**
	 * @var WPSEO_Meta_Storage Storage to use.
	 */
	protected $storage;

	/**
	 * @var array List of public post types.
	 */
	protected $public_post_types = array();

	/**
	 * WPSEO_Link_Columns constructor.
	 *
	 * @param WPSEO_Meta_Storage $storage The storage object to use.
	 */
	public function __construct( WPSEO_Meta_Storage $storage ) {
		$this->storage = $storage;
	}

	/**
	 * Registers the hooks.
	 */
	public function register_hooks() {
		global $pagenow;
		$is_ajax_request = defined( 'DOING_AJAX' ) && DOING_AJAX;

		if ( ! WPSEO_Metabox::is_post_overview( $pagenow ) && ! $is_ajax_request ) {
			return;
		}

		// When table doesn't exists.
		if ( ! WPSEO_Link_Table_Accessible::check_table_is_accessible() || ! WPSEO_Meta_Table_Accessible::check_table_is_accessible() ) {
			return;
		}

		if ( $is_ajax_request ) {
			add_action( 'admin_init', array( $this, 'set_count_objects' ) );
		}

		// Hook into tablenav to calculate links and linked.
		add_action( 'manage_posts_extra_tablenav', array( $this, 'count_objects' ) );

		add_filter( 'posts_clauses', array( $this, 'order_by_links' ), 1, 2 );
		add_filter( 'posts_clauses', array( $this, 'order_by_linked' ), 1, 2 );

		add_filter( 'admin_init', array( $this, 'register_init_hooks' ) );
	}

	/**
	 * Register hooks that require to be registered after `init`.
	 */
	public function register_init_hooks() {
		$this->public_post_types = apply_filters( 'wpseo_link_count_post_types', WPSEO_Post_Type::get_accessible_post_types() );

		if ( is_array( $this->public_post_types ) && $this->public_post_types !== array() ) {
			array_walk( $this->public_post_types, array( $this, 'set_post_type_hooks' ) );
		}
	}

	/**
	 * Modifies the query pieces to allow ordering column by links to post.
	 *
	 * @param array     $pieces Array of Query pieces.
	 * @param \WP_Query $query  The Query on which to apply.
	 *
	 * @return array
	 */
	public function order_by_links( $pieces, $query ) {
		if ( 'wpseo-' . self::COLUMN_LINKS !== $query->get( 'orderby' ) ) {
			return $pieces;
		}

		return $this->build_sort_query_pieces( $pieces, $query, 'internal_link_count' );
	}

	/**
	 * Modifies the query pieces to allow ordering column by links to post.
	 *
	 * @param array     $pieces Array of Query pieces.
	 * @param \WP_Query $query  The Query on which to apply.
	 *
	 * @return array
	 */
	public function order_by_linked( $pieces, $query ) {
		if ( 'wpseo-' . self::COLUMN_LINKED !== $query->get( 'orderby' ) ) {
			return $pieces;
		}

		return $this->build_sort_query_pieces( $pieces, $query, 'incoming_link_count' );
	}

	/**
	 * Builds the pieces for a sorting query.
	 *
	 * @param array     $pieces Array of Query pieces.
	 * @param \WP_Query $query  The Query on which to apply.
	 * @param string    $field  The field in the table to JOIN on.
	 *
	 * @return array Modified Query pieces.
	 */
	protected function build_sort_query_pieces( $pieces, $query, $field ) {
		global $wpdb;

		// We only want our code to run in the main WP query.
		if ( ! $query->is_main_query() ) {
			return $pieces;
		}

		// Get the order query variable - ASC or DESC.
		$order = strtoupper( $query->get( 'order' ) );

		// Make sure the order setting qualifies. If not, set default as ASC.
		if ( ! in_array( $order, array( 'ASC', 'DESC' ), true ) ) {
			$order = 'ASC';
		}

		$table = $this->storage->get_table_name();

		$pieces['join']   .= " LEFT JOIN $table AS yst_links ON yst_links.object_id = {$wpdb->posts}.ID ";
		$pieces['orderby'] = "{$field} $order, FIELD( {$wpdb->posts}.post_status, 'publish' ) $order, {$pieces['orderby']}";

		return $pieces;
	}

	/**
	 * Sets the hooks for each post type.
	 *
	 * @param string $post_type The post type.
	 */
	public function set_post_type_hooks( $post_type ) {
		add_filter( 'manage_' . $post_type . '_posts_columns', array( $this, 'add_post_columns' ) );
		add_action( 'manage_' . $post_type . '_posts_custom_column', array( $this, 'column_content' ), 10, 2 );
		add_filter( 'manage_edit-' . $post_type . '_sortable_columns', array( $this, 'column_sort' ) );
	}

	/**
	 * Adds the columns for the post overview.
	 *
	 * @param array $columns Array with columns.
	 *
	 * @return array The extended array with columns.
	 */
	public function add_post_columns( array $columns ) {
		$columns[ 'wpseo-' . self::COLUMN_LINKS ] = '<span class="yoast-linked-to yoast-column-header-has-tooltip" data-label="' . esc_attr__( 'Number of internal links in this post. See "Yoast Columns" text in the help tab for more info.', 'wordpress-seo' ) . '"><span class="screen-reader-text">' . __( '# links in post', 'wordpress-seo' ) . '</span></span>';

		if ( ! WPSEO_Link_Query::has_unprocessed_posts( $this->public_post_types ) ) {
			$columns[ 'wpseo-' . self::COLUMN_LINKED ] = '<span class="yoast-linked-from yoast-column-header-has-tooltip" data-label="' . esc_attr__( 'Number of internal links linking to this post. See "Yoast Columns" text in the help tab for more info.', 'wordpress-seo' ) . '"><span class="screen-reader-text">' . __( '# internal links to', 'wordpress-seo' ) . '</span></span>';
		}

		return $columns;
	}

	/**
	 * Makes sure we calculate all values in one query.
	 *
	 * @param string $target Extra table navigation location which is triggered.
	 */
	public function count_objects( $target ) {
		if ( 'top' === $target ) {
			$this->set_count_objects();
		}
	}

	/**
	 * Sets the objects to use for the count.
	 */
	public function set_count_objects() {
		global $wp_query;

		$posts    = $wp_query->get_posts();
		$post_ids = array();

		// Post lists return a list of objects.
		if ( isset( $posts[0] ) && is_object( $posts[0] ) ) {
			$post_ids = wp_list_pluck( $posts, 'ID' );
		}
		elseif ( ! empty( $posts ) ) {
			// Page list returns an array of post IDs.
			$post_ids = array_keys( $posts );
		}

		$post_ids = WPSEO_Link_Query::filter_unprocessed_posts( $post_ids );

		$links = new WPSEO_Link_Column_Count();
		$links->set( $post_ids );

		$this->link_count = $links;
	}

	/**
	 * Displays the column content for the given column
	 *
	 * @param string $column_name Column to display the content for.
	 * @param int    $post_id     Post to display the column content for.
	 */
	public function column_content( $column_name, $post_id ) {
		$link_count = null;

		switch ( $column_name ) {
			case 'wpseo-' . self::COLUMN_LINKS:
				$link_count = $this->link_count->get( $post_id, 'internal_link_count' );
				break;
			case 'wpseo-' . self::COLUMN_LINKED:
				if ( get_post_status( $post_id ) === 'publish' ) {
					$link_count = $this->link_count->get( $post_id, 'incoming_link_count' );
				}
				break;
		}

		if ( isset( $link_count ) ) {
			echo (int) $link_count;
		}
	}

	/**
	 * Sets the sortable columns.
	 *
	 * @param array $columns Array with sortable columns.
	 *
	 * @return array The extended array with sortable columns.
	 */
	public function column_sort( array $columns ) {
		$columns[ 'wpseo-' . self::COLUMN_LINKS ]  = 'wpseo-' . self::COLUMN_LINKS;
		$columns[ 'wpseo-' . self::COLUMN_LINKED ] = 'wpseo-' . self::COLUMN_LINKED;

		return $columns;
	}
}
