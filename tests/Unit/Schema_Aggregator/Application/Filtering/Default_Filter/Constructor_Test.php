<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Filtering\Default_Filter;

use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Elements_Context_Map\Elements_Context_Map_Repository;

/**
 * Tests for the Default_Filter constructor.
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Default_Filter::__construct
 *
 * @group schema-aggregator
 */
final class Constructor_Test extends Abstract_Default_Filter_Test {

	/**
	 * Tests if the constructor sets properties correctly.
	 *
	 * @return void
	 */
	public function test_constructor(): void {
		$this->assertInstanceOf(
			Elements_Context_Map_Repository::class,
			$this->getPropertyValue( $this->instance, 'elements_context_map_repository' )
		);
	}
}
