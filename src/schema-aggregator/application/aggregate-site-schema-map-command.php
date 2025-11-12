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
	 * The schema map threshold.
	 *
	 * @var int
	 */
	private $schema_map_threshold;

	/**
	 * The constructor.
	 *
	 * @param array<string> $post_types           The post types to include in the schema map.
	 * @param int           $schema_map_threshold The schema map threshold.
	 */
	public function __construct( array $post_types, int $schema_map_threshold ) {
		$this->post_types           = $post_types;
		$this->schema_map_threshold = $schema_map_threshold;
	}

	/**
	 * Gets the post types to include in the schema map.
	 *
	 * @return array<string> The post types.
	 */
	public function get_post_types(): array {
		return $this->post_types;
	}

	/**
	 * Gets the schema map threshold.
	 *
	 * @return int The schema map threshold.
	 */
	public function get_schema_map_threshold(): int {
		return $this->schema_map_threshold;
	}
}
