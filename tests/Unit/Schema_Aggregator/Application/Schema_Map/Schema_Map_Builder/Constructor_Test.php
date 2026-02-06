<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Schema_Map\Schema_Map_Builder;

use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config;

/**
 * Tests the Schema_Map_Builder constructor.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Builder::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Constructor_Test extends Abstract_Schema_Map_Builder_Test {

	/**
	 * Tests if the constructor sets properties correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Config::class,
			$this->getPropertyValue( $this->instance, 'config' )
		);
	}
}
