<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application;

use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Builder;
use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Xml_Renderer;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Map\Schema_Map_Indexable_Repository;

/**
 * Class that handles the command to aggregate site schema map.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aggregate_Site_Schema_Map_Command_Handler {

	/**
	 * The schema map indexable repository.
	 *
	 * @var Schema_Map_Indexable_Repository
	 */
	private $schema_map_indexable_repository;

	/**
	 * The schema map builder.
	 *
	 * @var Schema_Map_Builder
	 */
	private $schema_map_builder;

	/**
	 * The schema map XML renderer.
	 *
	 * @var Schema_Map_Xml_Renderer
	 */
	private $schema_map_xml_renderer;

	/**
	 * Aggregate_Site_Schema_Map_Command_Handler constructor.
	 *
	 * @param Schema_Map_Indexable_Repository $schema_map_indexable_repository The schema map indexable repository.
	 * @param Schema_Map_Builder              $schema_map_builder              The schema map builder.
	 * @param Schema_Map_Xml_Renderer         $schema_map_xml_renderer         The schema map XML renderer.
	 */
	public function __construct( Schema_Map_Indexable_Repository $schema_map_indexable_repository, Schema_Map_Builder $schema_map_builder, Schema_Map_Xml_Renderer $schema_map_xml_renderer ) {
		$this->schema_map_indexable_repository = $schema_map_indexable_repository;
		$this->schema_map_builder              = $schema_map_builder;
		$this->schema_map_xml_renderer         = $schema_map_xml_renderer;
	}

	/**
	 * Handles the Aggregate_Site_Schema_Map_Command.
	 *
	 * @param Aggregate_Site_Schema_Map_Command $command The command.
	 *
	 * @return string The schema map xml.
	 */
	public function handle( Aggregate_Site_Schema_Map_Command $command ): string {

		$indexable_counts = $this->schema_map_indexable_repository->get_indexable_count_per_post_type( $command->get_post_types() );

		$threshold = $command->get_schema_map_threshold();

		$schema_map = $this->schema_map_builder->build( $indexable_counts, $threshold );

		return $this->schema_map_xml_renderer->render( $schema_map );
	}
}
