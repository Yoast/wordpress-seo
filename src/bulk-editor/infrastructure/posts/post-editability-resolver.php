<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts;

use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Post_Access_Checker_Interface;

/**
 * Resolves, for a page of posts, whether the current user may edit each one.
 *
 * The database query narrows the candidates by post type, status and author (a sound approximation that
 * keeps pagination cheap). This resolver then applies the exact per-post check, current_user_can(
 * 'edit_post', $id ), so the collector can lock and blank the posts the update endpoint would refuse (for
 * example a post that a plugin blocks for the current user through map_meta_cap). It runs on the page only,
 * never the whole result set, so the cost stays bound to the page size.
 */
class Post_Editability_Resolver {

	/**
	 * The post access checker.
	 *
	 * @var Post_Access_Checker_Interface
	 */
	private $post_access_checker;

	/**
	 * The constructor.
	 *
	 * @param Post_Access_Checker_Interface $post_access_checker The post access checker.
	 */
	public function __construct( Post_Access_Checker_Interface $post_access_checker ) {
		$this->post_access_checker = $post_access_checker;
	}

	/**
	 * Returns, for each given post ID, whether the current user may edit it.
	 *
	 * @param array<int> $post_ids The post IDs on the current page.
	 *
	 * @return array<int, bool> A map of post ID to whether the current user may edit it.
	 */
	public function resolve( array $post_ids ): array {
		if ( $post_ids === [] ) {
			return [];
		}

		// Prime the post cache once so the per-post edit check does not run a query per post.
		\_prime_post_caches( $post_ids, false, false );

		$editability = [];
		foreach ( $post_ids as $post_id ) {
			$editability[ $post_id ] = $this->post_access_checker->can_edit( $post_id );
		}

		return $editability;
	}
}
