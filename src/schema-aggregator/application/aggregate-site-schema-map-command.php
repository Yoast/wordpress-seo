<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application;

/**
 * Class that represents the command to aggregate site schema map.
 */
class Aggregate_Site_Schema_Map_Command {

	/**
	 * The post types to include in the schema map.
	 *
	 * @var array<string>
	 */
	private $post_types;

	/**
	 * The constructor.
	 *
	 * @param array<string> $post_types The post types to include in the schema map.
	 */
	public function __construct( array $post_types ) {
		$this->post_types = $post_types;
	}

	/**
	 * Gets the post types to include in the schema map.
	 *
	 * @return array<string> The post types.
	 */
	public function get_post_types(): array {
		return $this->post_types;
	}
}
