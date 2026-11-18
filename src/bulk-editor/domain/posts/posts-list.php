<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Domain\Posts;

/**
 * This class describes a list of posts.
 */
class Posts_List {

	/**
	 * The posts.
	 *
	 * @var Post[]
	 */
	private $posts = [];

	/**
	 * Adds a post to the list.
	 *
	 * @param Post $post The post to add.
	 *
	 * @return void
	 */
	public function add( Post $post ): void {
		$this->posts[] = $post;
	}

	/**
	 * Returns the posts in the list.
	 *
	 * @return Post[] The posts in the list.
	 */
	public function get(): array {
		return $this->posts;
	}

	/**
	 * Parses the post list to the expected key value representation.
	 *
	 * @return array<array<string, int|string>> The post list presented as the expected key value representation.
	 */
	public function to_array(): array {
		return \array_map(
			static function ( Post $post ) {
				return $post->to_array();
			},
			$this->posts,
		);
	}
}
