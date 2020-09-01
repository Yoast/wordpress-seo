<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WP_Post;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Admin_Columns_Cache_Integration class.
 */
class Admin_Columns_Cache_Integration implements Integration_Interface {

	/**
	 * Cache of indexables.
	 *
	 * @var Indexable[]
	 */
	protected $indexable_cache = [];

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Admin_Columns_Cache_Integration constructor.
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 */
	public function __construct( Indexable_Repository $indexable_repository ) {
		$this->indexable_repository = $indexable_repository;
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
	 * Fills the cache of indexables for all known post IDs.
	 */
	public function fill_cache() {
		global $wp_query;

		$posts    = empty( $wp_query->posts ) ? $wp_query->get_posts() : $wp_query->posts;
		$post_ids = [];

		// Post lists return a list of objects.
		if ( isset( $posts[0] ) && is_object( $posts[0] ) ) {
			$post_ids = \wp_list_pluck( $posts, 'ID' );
		}
		elseif ( ! empty( $posts ) ) {
			// Page list returns an array of post IDs.
			$post_ids = \array_keys( $posts );
		}

		if ( empty( $post_ids ) ) {
			return;
		}

		if ( isset( $posts[0] ) && ! \is_a( $posts[0], WP_Post::class ) ) {
			// Prime the post caches as core would to avoid duplicate queries.
			// This needs to be done as this executes before core does.
			\_prime_post_caches( $post_ids );
		}

		$indexables = $this->indexable_repository->find_by_multiple_ids_and_type( $post_ids, 'post' );

		foreach ( $indexables as $indexable ) {
			$this->indexable_cache[ $indexable->object_id ] = $indexable;
		}
	}

	/**
	 * Returns the indexable for a given post ID.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return Indexable|false. The indexable. False if none could be found.
	 */
	public function get_indexable( $post_id ) {
		if ( ! \array_key_exists( $post_id, $this->indexable_cache ) ) {
			$this->indexable_cache[ $post_id ] = $this->indexable_repository->find_by_id_and_type( $post_id, 'post' );
		}
		return $this->indexable_cache[ $post_id ];
	}
}
