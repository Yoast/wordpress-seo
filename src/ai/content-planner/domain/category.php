<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI\Content_Planner\Domain;

/**
 * Value object for a Post Category.
 */
class Category {

	/**
	 * The name.
	 *
	 * @var string
	 */
	private $name;

	/**
	 * The ID.
	 *
	 * @var string
	 */
	private $id;

	/**
	 * The constructor.
	 *
	 * @param string $name The category title.
	 * @param string $id   The category ID.
	 */
	public function __construct( string $name, string $id ) {
		$this->name = $name;
		$this->id   = $id;
	}

	/**
	 * Returns this object in array format.
	 *
	 * @return array<string,int>
	 */
	public function to_array(): array {
		return [
			'name' => $this->name,
			'id'   => $this->id,
		];
	}
}
