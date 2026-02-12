<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Elements_Context_Map_Repository;

use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Elements_Context_Map\Map_Loader_Interface;

/**
 * Tests for the Elements_Context_Map_Repository constructor.
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Elements_Context_Map\Elements_Context_Map_Repository::__construct
 *
 * @group schema-aggregator
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Constructor_Test extends Abstract_Elements_Context_Map_Repository_Test {

	/**
	 * Tests if the constructor sets properties correctly.
	 *
	 * @return void
	 */
	public function test_constructor(): void {
		$this->assertInstanceOf(
			Map_Loader_Interface::class,
			$this->getPropertyValue( $this->instance, 'map_loader' )
		);
	}
}
