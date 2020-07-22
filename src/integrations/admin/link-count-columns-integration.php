<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Integrations\Admin
 */

namespace Yoast\WP\SEO\Integrations\Admin;

use wpdb;
use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Actions\Indexation\Post_Link_Indexing_Action;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Posts_Overview_Or_Ajax_Conditional;
use Yoast\WP\SEO\Conditionals\Should_Index_Links_Conditional;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Link_Count_Columns_Integration class
 */
class Link_Count_Columns_Integration implements Integration_Interface {

	/**
	 * Partial column name.
	 *
	 * @var string
	 */
	const COLUMN_LINKED = 'linked';

	/**
	 * Partial column name.
	 *
	 * @var string
	 */
	const COLUMN_LINKS = 'links';

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [
			Admin_Conditional::class,
			Posts_Overview_Or_Ajax_Conditional::class,
			Should_Index_Links_Conditional::class,
		];
	}

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * The database object.
	 *
	 * @var \wpdb
	 */
	protected $wpdb;

	/**
	 * The post link builder.
	 *
	 * @var Post_Link_Indexing_Action
	 */
	protected $post_link_indexing_action;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Cache of link counts.
	 *
	 * @var Indexable[]
	 */
	protected $link_counts_cache = [];

	/**
	 * Link_Count_Columns_Integration constructor
	 *
	 * @param Post_Type_Helper          $post_type_helper          The post type helper.
	 * @param wpdb                      $wpdb                      The wpdb object.
	 * @param Post_Link_Indexing_Action $post_link_indexing_action The post link indexing action.
	 * @param Indexable_Repository      $indexable_repository       The SEO meta repository.
	 */
	public function __construct(
		Post_Type_Helper $post_type_helper,
		wpdb $wpdb,
		Post_Link_Indexing_Action $post_link_indexing_action,
		Indexable_Repository $indexable_repository
	) {
		$this->post_type_helper          = $post_type_helper;
		$this->wpdb                      = $wpdb;
		$this->post_link_indexing_action = $post_link_indexing_action;
		$this->indexable_repository      = $indexable_repository;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		if ( \wp_doing_ajax() ) {
			\add_action( 'admin_init', [ $this, 'fill_cache' ] );
		}

		// Hook into tablenav to calculate links and linked.
		\add_action( 'manage_posts_extra_tablenav', [ $this, 'maybe_fill_cache' ] );

		\add_filter( 'posts_clauses', [ $this, 'order_by_links' ], 1, 2 );
		\add_filter( 'posts_clauses', [ $this, 'order_by_linked' ], 1, 2 );

		\add_filter( 'admin_init', [ $this, 'register_init_hooks' ] );

		// Adds a filter to exclude the attachments from the link count.
		\add_filter( 'wpseo_link_count_post_types', [ 'WPSEO_Post_Type', 'filter_attachment_post_type' ] );
	}

	/**
	 * Register hooks that need to be registered after `init`.
	 */
	public function register_init_hooks() {
		$public_post_types = apply_filters( 'wpseo_link_count_post_types', $this->post_type_helper->get_accessible_post_types() );

		if ( ! is_array( $public_post_types ) || empty( $public_post_types ) ) {
			return;
		}

		foreach ( $public_post_types as $post_type ) {
			\add_filter( 'manage_' . $post_type . '_posts_columns', [ $this, 'add_post_columns' ] );
			\add_action( 'manage_' . $post_type . '_posts_custom_column', [ $this, 'column_content' ], 10, 2 );
			\add_filter( 'manage_edit-' . $post_type . '_sortable_columns', [ $this, 'column_sort' ] );
		}
	}

	/**
	 * Adds the columns for the post overview.
	 *
	 * @param array $columns Array with columns.
	 *
	 * @return array The extended array with columns.
	 */
	public function add_post_columns( $columns ) {
		if ( ! is_array( $columns ) ) {
			return $columns;
		}

		$columns[ 'wpseo-' . self::COLUMN_LINKS ] = sprintf(
			'<span class="yoast-linked-to yoast-column-header-has-tooltip" data-tooltip-text="%1$s"><span class="screen-reader-text">%2$s</span></span>',
			esc_attr__( 'Number of outgoing internal links in this post. See "Yoast Columns" text in the help tab for more info.', 'wordpress-seo' ),
			esc_html__( 'Outgoing internal links', 'wordpress-seo' )
		);

		if ( $this->post_link_indexing_action->get_total_unindexed() === 0 ) {
			$columns[ 'wpseo-' . self::COLUMN_LINKED ] = sprintf(
				'<span class="yoast-linked-from yoast-column-header-has-tooltip" data-tooltip-text="%1$s"><span class="screen-reader-text">%2$s</span></span>',
				esc_attr__( 'Number of internal links linking to this post. See "Yoast Columns" text in the help tab for more info.', 'wordpress-seo' ),
				esc_html__( 'Received internal links', 'wordpress-seo' )
			);
		}

		return $columns;
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
	 * Builds the pieces for a sorting query.
	 *
	 * @param array     $pieces Array of Query pieces.
	 * @param \WP_Query $query  The Query on which to apply.
	 * @param string    $field  The field in the table to JOIN on.
	 *
	 * @return array Modified Query pieces.
	 */
	protected function build_sort_query_pieces( $pieces, $query, $field ) {
		// We only want our code to run in the main WP query.
		if ( ! $query->is_main_query() ) {
			return $pieces;
		}

		// Get the order query variable - ASC or DESC.
		$order = strtoupper( $query->get( 'order' ) );

		// Make sure the order setting qualifies. If not, set default as ASC.
		if ( ! in_array( $order, [ 'ASC', 'DESC' ], true ) ) {
			$order = 'ASC';
		}

		$table = Model::get_table_name( 'SEO_Links' );

		$pieces['join']   .= " LEFT JOIN $table AS yst_links ON yst_links.object_id = {$this->wpdb->posts}.ID ";
		$pieces['orderby'] = "yst_links.$field $order, FIELD( {$this->wpdb->posts}.post_status, 'publish' ) $order, {$pieces['orderby']}";

		return $pieces;
	}

	/**
	 * Makes sure we calculate all values in one query by filling our cache beforehand.
	 *
	 * @param string $target Extra table navigation location which is triggered.
	 */
	public function maybe_fill_cache( $target ) {
		if ( $target === 'top' ) {
			$this->fill_cache();
		}
	}

	/**
	 * Fills the cache of link counts with all known post IDs.
	 */
	public function fill_cache() {
		global $wp_query;

		$posts    = empty( $wp_query->posts ) ? $wp_query->get_posts() : $wp_query->posts;
		$post_ids = [];

		// Post lists return a list of objects.
		if ( isset( $posts[0] ) && is_object( $posts[0] ) ) {
			$post_ids = wp_list_pluck( $posts, 'ID' );
		}
		elseif ( ! empty( $posts ) ) {
			// Page list returns an array of post IDs.
			$post_ids = array_keys( $posts );
		}

		$indexables = $this->indexable_repository->find_by_multiple_ids_and_type( $post_ids, 'post' );

		foreach ( $indexables as $indexable ) {
			$this->link_counts_cache[ $indexable->object_id ] = $indexable;
		}
	}

	/**
	 * Displays the column content for the given column.
	 *
	 * @param string $column_name Column to display the content for.
	 * @param int    $post_id     Post to display the column content for.
	 */
	public function column_content( $column_name, $post_id ) {
		// Nothing to output if we don't have the value.
		if ( ! \array_key_exists( $post_id, $this->link_counts_cache ) ) {
			return;
		}

		switch ( $column_name ) {
			case 'wpseo-' . self::COLUMN_LINKS:
				echo (int) $this->link_counts_cache[ $post_id ]->link_count;
				return;
			case 'wpseo-' . self::COLUMN_LINKED:
				if ( get_post_status( $post_id ) === 'publish' ) {
					echo (int) $this->link_counts_cache[ $post_id ]->incoming_link_count;
				}
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
