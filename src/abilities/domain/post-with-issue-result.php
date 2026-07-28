<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Domain;

/**
 * Immutable value object representing a post that has an SEO issue.
 */
class Post_With_Issue_Result {

	/**
	 * The post ID.
	 *
	 * @var int
	 */
	private $post_id;

	/**
	 * The post title.
	 *
	 * @var string
	 */
	private $title;

	/**
	 * Constructor.
	 *
	 * @param int    $post_id The post ID.
	 * @param string $title   The post title.
	 */
	public function __construct( int $post_id, string $title ) {
		$this->post_id = $post_id;
		$this->title   = $title;
	}

	/**
	 * Serializes the result to an array for ability output.
	 *
	 * @return array<string, int|string> The serialized result.
	 */
	public function to_array(): array {
		return [
			'post_id' => $this->post_id,
			'title'   => $this->title,
		];
	}
}
