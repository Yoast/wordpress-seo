<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Schema_Pieces\Woo_Schema_Piece_Repository;

use Mockery;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\Woo_Schema_Piece_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Woo_Schema_Piece_Repository tests.
 *
 * @group schema-aggregator
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Woo_Schema_Piece_Repository_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Woo_Schema_Piece_Repository
	 */
	protected $instance;

	/**
	 * Holds the WooCommerce_Conditional mock.
	 *
	 * @var Mockery\MockInterface|WooCommerce_Conditional
	 */
	protected $woocommerce_conditional;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->woocommerce_conditional = Mockery::mock( WooCommerce_Conditional::class );

		$this->instance = new Woo_Schema_Piece_Repository(
			$this->woocommerce_conditional
		);
	}
}
