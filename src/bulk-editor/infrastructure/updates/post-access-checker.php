<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Infrastructure\Updates;

use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Post_Access_Checker_Interface;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;

/**
 * Checks post access through the WordPress APIs.
 */
class Post_Access_Checker implements Post_Access_Checker_Interface {

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * The constructor.
	 *
	 * @param Post_Type_Helper $post_type_helper The post type helper.
	 */
	public function __construct( Post_Type_Helper $post_type_helper ) {
		$this->post_type_helper = $post_type_helper;
	}

	/**
	 * Whether the post exists.
	 *
	 * @param int $post_id The ID of the post.
	 *
	 * @return bool Whether the post exists.
	 */
	public function exists( int $post_id ): bool {
		return \get_post( $post_id ) !== null;
	}

	/**
	 * Whether the post is of an indexable post type.
	 *
	 * @param int $post_id The ID of the post.
	 *
	 * @return bool Whether the post is of an indexable post type.
	 */
	public function is_supported_type( int $post_id ): bool {
		$post = \get_post( $post_id );
		if ( $post === null ) {
			return false;
		}

		return $this->post_type_helper->is_of_indexable_post_type( $post->post_type );
	}

	/**
	 * Whether the current user is allowed to edit the post.
	 *
	 * @param int $post_id The ID of the post.
	 *
	 * @return bool Whether the current user is allowed to edit the post.
	 */
	public function can_edit( int $post_id ): bool {
		return \current_user_can( 'edit_post', $post_id );
	}
}
