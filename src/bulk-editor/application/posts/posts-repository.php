<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Application\Posts;

use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_List;
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
	 * Returns a page of posts for the given content type.
	 *
	 * Reads from the indexable table when indexables are active, and falls back to post meta otherwise.
	 *
	 * @param string $content_type The content type to get posts for.
	 * @param int    $per_page     The number of posts to get.
	 *
	 * @return Posts_List The posts.
	 */
	public function get_posts( string $content_type, int $per_page ): Posts_List {
		if ( $this->indexable_helper->should_index_indexables() ) {
			return $this->indexable_posts_collector->get_posts( $content_type, $per_page );
		}

		return $this->post_meta_posts_collector->get_posts( $content_type, $per_page );
	}
}
