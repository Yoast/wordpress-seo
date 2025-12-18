<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Schema_Aggregator_Watcher;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Tests the constructor.
 *
 * @group schema-aggregator
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Aggregator_Watcher::__construct
 */
final class Constructor_Test extends Abstract_Schema_Aggregator_Watcher_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
	}
}
