<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts;

use WP_Post;
use WP_Query;
use Yoast\WP\SEO\Bulk_Editor\Application\Posts\Posts_Collector_Interface;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Post;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_List;

/**
 * Collects bulk editor posts by reading raw Yoast post meta.
 *
 * This is the fallback used when indexables are disabled.
 */
class Post_Meta_Posts_Collector implements Posts_Collector_Interface {

	/**
	 * The Yoast post meta key prefix.
	 */
	private const META_PREFIX = '_yoast_wpseo_';

	/**
	 * Collects a page of posts for the given content type.
	 *
	 * @param string $content_type The content type to collect posts for.
	 * @param int    $per_page     The number of posts to collect.
	 *
	 * @return Posts_List The collected posts.
	 */
	public function get_posts( string $content_type, int $per_page ): Posts_List {
		$posts_list = new Posts_List();

		foreach ( $this->query_posts( $content_type, $per_page ) as $post ) {
			$posts_list->add(
				new Post(
					$post->ID,
					\get_the_title( $post->ID ),
					$post->post_status,
					(string) \get_edit_post_link( $post->ID, 'raw' ),
					$this->get_meta( $post->ID, 'focuskw' ),
					$this->get_meta( $post->ID, 'title' ),
					$this->get_meta( $post->ID, 'metadesc' ),
					$this->get_meta( $post->ID, 'opengraph-title' ),
					$this->get_meta( $post->ID, 'opengraph-description' ),
				),
			);
		}

		return $posts_list;
	}

	/**
	 * Runs the query for a page of posts of the given content type.
	 *
	 * @param string $content_type The content type to query.
	 * @param int    $per_page     The number of posts to query.
	 *
	 * @return array<WP_Post> The matched posts.
	 */
	protected function query_posts( string $content_type, int $per_page ): array {
		$query = new WP_Query(
			[
				'post_type'           => $content_type,
				'post_status'         => Posts_Collector_Interface::STATUSES,
				'posts_per_page'      => $per_page,
				// Order by post ID so the result matches the indexable collector's ordering.
				'orderby'             => 'ID',
				'order'               => 'DESC',
				// We only render a single page, so the total row count is not needed.
				'no_found_rows'       => true,
				'ignore_sticky_posts' => true,
			],
		);

		return $query->posts;
	}

	/**
	 * Reads a raw Yoast post meta value.
	 *
	 * Reads the raw meta directly so the stored value round-trips with the bulk update endpoint,
	 * regardless of which social options are enabled.
	 *
	 * @param int    $post_id The post ID.
	 * @param string $key     The meta key, without the Yoast prefix.
	 *
	 * @return string The meta value.
	 */
	private function get_meta( int $post_id, string $key ): string {
		return (string) \get_post_meta( $post_id, self::META_PREFIX . $key, true );
	}
}
