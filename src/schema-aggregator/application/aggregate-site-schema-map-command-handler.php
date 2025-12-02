<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application;

use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Builder;
use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Xml_Renderer;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Map\Schema_Map_Repository_Factory;

/**
 * Class that handles the command to aggregate site schema map.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aggregate_Site_Schema_Map_Command_Handler {

	/**
	 * The schema map factory.
	 *
	 * @var Schema_Map_Repository_Factory
	 */
	private $schema_map_repository_factory;

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
	 * The indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	private $indexable_helper;

	/**
	 * Aggregate_Site_Schema_Map_Command_Handler constructor.
	 *
	 * @param Schema_Map_Repository_Factory $schema_map_repository_factory The schema map factory.
	 * @param Schema_Map_Builder            $schema_map_builder            The schema map builder.
	 * @param Schema_Map_Xml_Renderer       $schema_map_xml_renderer       The schema map XML renderer.
	 * @param Indexable_Helper              $indexable_helper              The indexable helper.
	 */
	public function __construct( Schema_Map_Repository_Factory $schema_map_repository_factory, Schema_Map_Builder $schema_map_builder, Schema_Map_Xml_Renderer $schema_map_xml_renderer, Indexable_Helper $indexable_helper ) {
		$this->schema_map_repository_factory = $schema_map_repository_factory;
		$this->schema_map_builder            = $schema_map_builder;
		$this->schema_map_xml_renderer       = $schema_map_xml_renderer;
		$this->indexable_helper              = $indexable_helper;
	}

	/**
	 * Handles the Aggregate_Site_Schema_Map_Command.
	 *
	 * @param Aggregate_Site_Schema_Map_Command $command The command.
	 *
	 * @return string The schema map xml.
	 */
	public function handle( Aggregate_Site_Schema_Map_Command $command ): string {

		$schema_map_repository = $this->schema_map_repository_factory->get_repository( $this->indexable_helper->should_index_indexables() );
		$indexable_counts      = $schema_map_repository->get_indexable_count_per_post_type( $command->get_post_types() );

		$schema_map = $this->schema_map_builder
			->with_repository( $schema_map_repository )
			->build( $indexable_counts );

		return $this->schema_map_xml_renderer->render( $schema_map );
	}
}
