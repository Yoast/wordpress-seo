<?php

namespace Yoast\WP\SEO\AI\Content_Planner\Domain;

/**
 * List of posts.
 */
class Post_List {

	/**
	 * @var array<Post> The posts.
	 */
	private array $posts = [];

	/**
	 * Adds a post to the list.
	 *
	 * @param Post $post A post.
	 *
	 * @return void
	 */
	public function add_post( Post $post ): void {
		$this->posts[] = $post;
	}

	/**
	 * Returns this object in array format.
	 *
	 * @return array<array<string, string|bool|array<string, int>>> The posts as an array.
	 */
	public function to_array(): array {
		$result = [];
		foreach ( $this->posts as $post ) {
			$result[] = $post->to_array();
		}

		return $result;
	}
}
