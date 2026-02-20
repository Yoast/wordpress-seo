<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Site_Schema_Aggregator_Route;

use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Aggregator_Conditional;

/**
 * Tests the Site_Schema_Aggregator_Route get_conditionals method.
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Aggregator_Route::get_conditionals
 *
 * @group schema-aggregator
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Get_Conditionals_Test extends Abstract_Site_Schema_Aggregator_Route_Test {

	/**
	 * Tests the get_conditionals method.
	 *
	 * @return void
	 */
	public function test_get_conditionals(): void {
		$expected = [
			Schema_Aggregator_Conditional::class,
		];

		$this->assertSame( $expected, $this->instance::get_conditionals() );
	}
}
