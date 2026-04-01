<?php

namespace Yoast\WP\SEO\AI\Content_Planner\Domain;

/**
 * Value object for a Post Category.
 */
class Category {

	/**
	 * @var string The title.
	 */
	private string $title;

	/**
	 * @var string The ID.
	 */
	private string $id;

	/**
	 * The constructor.
	 *
	 * @param string $title The category title.
	 * @param string $id    The category ID.
	 */
	public function __construct( string $title, string $id ) {
		$this->title = $title;
		$this->id    = $id;
	}

	/**
	 * Returns this object in array format.
	 *
	 * @return array<string,int>
	 */
	public function to_array(): array {
		return [
			'title' => $this->title,
			'id'    => $this->id,
		];
	}
}
