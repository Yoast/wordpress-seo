<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Aggregator_Config;

use Mockery;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Aggregator_Config;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Aggregator_Config tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Aggregator_Config_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Aggregator_Config
	 */
	protected $instance;

	/**
	 * The WooCommerce Conditional mock.
	 *
	 * @var Mockery\MockInterface|WooCommerce_Conditional
	 */
	protected $woocommerce_conditional;

	/**
	 * The Post Type Helper mock.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->woocommerce_conditional = Mockery::mock( WooCommerce_Conditional::class );
		$this->post_type_helper        = Mockery::mock( Post_Type_Helper::class );
		$this->instance                = new Aggregator_Config( $this->woocommerce_conditional, $this->post_type_helper );
	}
}
