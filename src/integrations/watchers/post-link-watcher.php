<?php
/**
 * Term/Taxonomy watcher to fill the related Indexable.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\SEO\Integrations\Watchers;

use WP_Post;
use Yoast\WP\SEO\Builders\Post_Link_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Repositories\SEO_Links_Repository;
use Yoast\WP\SEO\Repositories\SEO_Meta_Repository;

/**
 * Post_Link_Watcher class
 */
class Post_Link_Watcher implements Integration_Interface {

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Migrations_Conditional::class ];
	}

	/**
	 * The post link builder.
	 *
	 * @var Post_Link_Builder
	 */
	protected $post_link_builder;

	/**
	 * The SEO links repository.
	 *
	 * @var SEO_Links_Repository
	 */
	protected $seo_links_repository;

	/**
	 * The SEO meta repository.
	 *
	 * @var SEO_Meta_Repository
	 */
	protected $seo_meta_repository;

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * Constructor
	 *
	 * @param Post_Link_Builder $post_link_builder The post link builder.
	 */
	public function __construct(
		Post_Link_Builder $post_link_builder,
		SEO_Links_Repository $seo_links_repository,
		SEO_Meta_Repository $seo_meta_repository,
		Post_Type_Helper $post_type_helper
	) {
		$this->post_link_builder    = $post_link_builder;
		$this->seo_links_repository = $seo_links_repository;
		$this->post_type_helper     = $post_type_helper;
	}

	/**
	 * Registers the hooks.
	 *
	 * @returns void
	 */
	public function register_hooks() {
		add_action( 'save_post', [ $this, 'save_post' ], 10, 2 );
		add_action( 'delete_post', [ $this, 'delete_post' ] );
	}

	/**
	 * Saves the links that are used in the post.
	 *
	 * @param int     $post_id The post id to.
	 * @param WP_Post $post    The post object.
	 *
	 * @return void
	 */
	public function save_post( $post_id, $post ) {
		if ( ! $post instanceof WP_Post ) {
			return;
		}

		// Bail if this is a multisite installation and the site has been switched.
		if ( \is_multisite() && \ms_is_switched() ) {
			return;
		}

		/**
		 * Filter: 'wpseo_should_index_links' - Allows disabling of Yoast's links indexation.
		 *
		 * @api bool To disable the indexation, return false.
		 */
		if ( ! apply_filters( 'wpseo_should_index_links', true ) ) {
			return;
		}

		// When the post is a revision.
		if ( \wp_is_post_revision( $post->ID ) ) {
			return;
		}

		$post_statuses_to_skip = [ 'auto-draft', 'trash' ];

		if ( \in_array( $post->post_status, $post_statuses_to_skip, true ) ) {
			return;
		}

		// When the post isn't processable, just remove the saved links.
		if ( ! $this->is_processable( $post_id ) ) {
			return;
		}

		$this->post_link_builder->build( $post_id, $post->post_content );
	}

	/**
	 * Removes the seo links when the post is deleted.
	 *
	 * @param int $post_id The post id.
	 *
	 * @return void
	 */
	public function delete_post( $post_id ) {
		/** This filter is documented in admin/links/class-link-watcher.php */
		if ( ! apply_filters( 'wpseo_should_index_links', true ) ) {
			return;
		}

		$links = $this->seo_links_repository->find_all_by_post_id( $post_id );
		$this->seo_links_repository->delete_all_by_post_id( $post_id );

		$linked_post_ids = [];
		foreach ( $links as $link ) {
			$linked_post_ids[] = $link->target_post_id;
		}

		$counts = $this->seo_links_repository->get_incoming_link_counts_for_post_ids( $linked_post_ids );
		foreach ( $counts as $count ) {
			$this->seo_meta_repository->update_incoming_link_count( $count['post_id'], $count['incoming'] );
		}
	}

	/**
	 * Checks if the post is processable.
	 *
	 * @param int $post_id The post id.
	 *
	 * @return bool True when the post is processable.
	 */
	protected function is_processable( $post_id ) {
		/*
		 * Do not use the `wpseo_link_count_post_types` because we want to always count the links,
		 * even if we don't show them.
		 */
		$post_types = $this->post_type_helper->get_accessible_post_types();

		return isset( $post_types[ get_post_type( $post_id ) ] );
	}
}
