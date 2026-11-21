<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Domain;

/**
 * Class to contain the count of indexables for a specific post type.
 */
class Indexable_Count {

	/**
	 * The count of indexables.
	 *
	 * @var int
	 */
	private $count;

	/**
	 * The post type.
	 *
	 * @var string
	 */
	private $post_type;

	/**
	 * Constructor for Indexable_Count.
	 *
	 * @param string $post_type The post type.
	 * @param int    $count     The count of indexables.
	 */
	public function __construct( string $post_type, int $count ) {
		$this->post_type = $post_type;
		$this->count     = $count;
	}

	/**
	 * Gets the count of indexables.
	 *
	 * @return int The count of indexables.
	 */
	public function get_count(): int {
		return $this->count;
	}

	/**
	 * Gets the post type.
	 *
	 * @return string The post type.
	 */
	public function get_post_type(): string {
		return $this->post_type;
	}
}
