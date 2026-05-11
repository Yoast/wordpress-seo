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
	 * @var int
	 */
	private $id;

	/**
	 * The constructor.
	 *
	 * @param string $name The category title.
	 * @param int    $id   The category ID.
	 */
	public function __construct( string $name, int $id ) {
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
