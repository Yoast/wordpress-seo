<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Enhancement\Schema_Enhancement_Factory;

use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Article_Schema_Enhancer;
use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Person_Schema_Enhancer;

/**
 * Tests the Schema_Enhancement_Factory constructor.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Schema_Enhancement_Factory::__construct
 */
final class Constructor_Test extends Abstract_Schema_Enhancement_Factory_Test {

	/**
	 * Tests if the constructor sets properties correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Article_Schema_Enhancer::class,
			$this->getPropertyValue( $this->instance, 'article_schema_enhancer' )
		);
		$this->assertInstanceOf(
			Person_Schema_Enhancer::class,
			$this->getPropertyValue( $this->instance, 'person_schema_enhancer' )
		);
	}
}
