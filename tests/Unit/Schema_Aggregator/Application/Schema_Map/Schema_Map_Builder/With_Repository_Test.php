<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Schema_Map\Schema_Map_Builder;

use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Builder;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Map\Schema_Map_Repository_Interface;

/**
 * Tests the Schema_Map_Builder with_repository method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Builder::with_repository
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class With_Repository_Test extends Abstract_Schema_Map_Builder_Test {

	/**
	 * Tests that with_repository returns the instance for fluent interface.
	 *
	 * @return void
	 */
	public function test_with_repository_returns_self() {
		$config     = Mockery::mock( Config::class );
		$repository = Mockery::mock( Schema_Map_Repository_Interface::class );

		$instance = new Schema_Map_Builder( $config );
		$result   = $instance->with_repository( $repository );

		$this->assertSame( $instance, $result );
	}

	/**
	 * Tests that with_repository sets the schema_map_repository property.
	 *
	 * @return void
	 */
	public function test_with_repository_sets_property() {
		$this->assertInstanceOf(
			Schema_Map_Repository_Interface::class,
			$this->getPropertyValue( $this->instance, 'schema_map_repository' )
		);
	}
}
