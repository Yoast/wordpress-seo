<?php
/**
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the link columns. This class will add and handle the link columns.
 */
class WPSEO_Link_Columns {

	const COLUMN_LINKED = 'linked';
	const COLUMN_LINKS = 'links';

	/** @var WPSEO_Link_Column_Count */
	protected $count_linked;

	/** @var WPSEO_Link_Column_Count */
	protected $count_links;

	/** @var array List of public post types. */
	protected $public_post_types = array();

	/**
	 * Registers the hooks.
	 */
	public function register_hooks() {
		global $pagenow;
		if ( $pagenow !== 'edit.php' ) {
			return;
		}

		// Hook into tablenav to calculate links and linked.
		add_action( 'manage_posts_extra_tablenav', array( $this, 'count_objects' ) );

		$this->public_post_types = WPSEO_Link_Utils::get_public_post_types();

		if ( is_array( $this->public_post_types ) && $this->public_post_types !== array() ) {
			array_walk( $this->public_post_types, array( $this, 'set_post_type_hooks' ) );
		}
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
		/* translators: %1$s expands to a hashtag (#)  */
		$columns[ 'wpseo-' . self::COLUMN_LINKS ] = sprintf( __( '%1$s Links in', 'wordpress-seo' ), '#' );

		if ( ! WPSEO_Link_Query::has_unprocessed_posts( $this->public_post_types ) ) {
			/* translators: %1$s expands to a hashtag (#) */
			$columns[ 'wpseo-' . self::COLUMN_LINKED ] = sprintf( __( '%1$s Links out', 'wordpress-seo' ), '#' );
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

		$linked = new WPSEO_Link_Column_Count( 'target_post_id' );
		$linked->set( $post_ids );

		$links = new WPSEO_Link_Column_Count( 'post_id' );
		$links->set( $post_ids );

		$this->count_linked = $linked;
		$this->count_links  = $links;
	}

	/**
	 * Displays the column content for the given column
	 *
	 * @param string $column_name Column to display the content for.
	 * @param int    $post_id     Post to display the column content for.
	 */
	public function column_content( $column_name, $post_id ) {
		switch ( $column_name ) {
			case 'wpseo-' . self::COLUMN_LINKS :
				echo $this->count_links->get( $post_id );
				break;
			case 'wpseo-' . self::COLUMN_LINKED :
				echo $this->count_linked->get( $post_id );
				break;
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
