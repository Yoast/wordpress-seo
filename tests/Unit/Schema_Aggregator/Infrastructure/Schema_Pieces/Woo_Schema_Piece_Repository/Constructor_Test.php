<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Schema_Pieces\Woo_Schema_Piece_Repository;

use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;

/**
 * Tests for the Woo_Schema_Piece_Repository constructor.
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\Woo_Schema_Piece_Repository::__construct
 *
 * @group schema-aggregator
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Constructor_Test extends Abstract_Woo_Schema_Piece_Repository_Test {

	/**
	 * Tests if the constructor sets properties correctly.
	 *
	 * @return void
	 */
	public function test_constructor(): void {
		$this->assertInstanceOf(
			WooCommerce_Conditional::class,
			$this->getPropertyValue( $this->instance, 'woocommerce_conditional' ),
		);
	}
}
