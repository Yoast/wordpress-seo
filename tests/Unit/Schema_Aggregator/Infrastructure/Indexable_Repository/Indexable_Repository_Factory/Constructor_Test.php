<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Indexable_Repository\Indexable_Repository_Factory;

use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository\Indexable_Repository;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository\WordPress_Query_Repository;

/**
 * Tests for the Indexable_Repository_Factory constructor.
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository\Indexable_Repository_Factory::__construct
 *
 * @group schema-aggregator
 */
final class Constructor_Test extends Abstract_Indexable_Repository_Factory_Test {

	/**
	 * Tests if the constructor sets properties correctly.
	 *
	 * @return void
	 */
	public function test_constructor(): void {
		$this->assertInstanceOf(
			Indexable_Repository::class,
			$this->getPropertyValue( $this->instance, 'native_repository' )
		);

		$this->assertInstanceOf(
			WordPress_Query_Repository::class,
			$this->getPropertyValue( $this->instance, 'wordpress_repository' )
		);
	}
}
