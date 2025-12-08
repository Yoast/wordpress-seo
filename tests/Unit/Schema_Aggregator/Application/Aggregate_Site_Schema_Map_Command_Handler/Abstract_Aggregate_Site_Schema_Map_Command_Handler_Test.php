<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Aggregate_Site_Schema_Map_Command_Handler;

use Mockery;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Map_Command_Handler;
use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Builder;
use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Xml_Renderer;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Map\Schema_Map_Repository_Factory;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for Aggregate_Site_Schema_Map_Command_Handler tests.
 */
abstract class Abstract_Aggregate_Site_Schema_Map_Command_Handler_Test extends TestCase {

	/**
	 * The schema map repository factory mock.
	 *
	 * @var Mockery\MockInterface|Schema_Map_Repository_Factory
	 */
	protected $schema_map_repository_factory;

	/**
	 * The schema map builder mock.
	 *
	 * @var Mockery\MockInterface|Schema_Map_Builder
	 */
	protected $schema_map_builder;

	/**
	 * The schema map XML renderer mock.
	 *
	 * @var Mockery\MockInterface|Schema_Map_Xml_Renderer
	 */
	protected $schema_map_xml_renderer;

	/**
	 * The indexable helper mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * The instance under test.
	 *
	 * @var Aggregate_Site_Schema_Map_Command_Handler
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->schema_map_repository_factory = Mockery::mock( Schema_Map_Repository_Factory::class );
		$this->schema_map_builder            = Mockery::mock( Schema_Map_Builder::class );
		$this->schema_map_xml_renderer       = Mockery::mock( Schema_Map_Xml_Renderer::class );
		$this->indexable_helper              = Mockery::mock( Indexable_Helper::class );

		$this->instance = new Aggregate_Site_Schema_Map_Command_Handler(
			$this->schema_map_repository_factory,
			$this->schema_map_builder,
			$this->schema_map_xml_renderer,
			$this->indexable_helper
		);
	}
}
