<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Application\Posts;

use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_Page;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_Query;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Indexable_Posts_Collector;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Post_Meta_Posts_Collector;
use Yoast\WP\SEO\Helpers\Indexable_Helper;

/**
 * The repository to get posts for the bulk editor.
 */
class Posts_Repository {

	/**
	 * The collector that reads from the indexable table.
	 *
	 * @var Indexable_Posts_Collector
	 */
	private $indexable_posts_collector;

	/**
	 * The collector that reads from post meta.
	 *
	 * @var Post_Meta_Posts_Collector
	 */
	private $post_meta_posts_collector;

	/**
	 * The indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	private $indexable_helper;

	/**
	 * The constructor.
	 *
	 * @param Indexable_Posts_Collector $indexable_posts_collector The collector that reads from the indexable table.
	 * @param Post_Meta_Posts_Collector $post_meta_posts_collector The collector that reads from post meta.
	 * @param Indexable_Helper          $indexable_helper          The indexable helper.
	 */
	public function __construct(
		Indexable_Posts_Collector $indexable_posts_collector,
		Post_Meta_Posts_Collector $post_meta_posts_collector,
		Indexable_Helper $indexable_helper
	) {
		$this->indexable_posts_collector = $indexable_posts_collector;
		$this->post_meta_posts_collector = $post_meta_posts_collector;
		$this->indexable_helper          = $indexable_helper;
	}

	/**
	 * Returns a page of posts for the given query.
	 *
	 * Reads from the indexable table when indexables are active, and falls back to post meta otherwise.
	 *
	 * @param Posts_Query $query The query describing the page to get.
	 *
	 * @return Posts_Page The posts together with the totals for pagination.
	 */
	public function get_posts( Posts_Query $query ): Posts_Page {
		if ( $this->indexable_helper->should_index_indexables() ) {
			return $this->indexable_posts_collector->get_posts( $query );
		}

		return $this->post_meta_posts_collector->get_posts( $query );
	}
}
