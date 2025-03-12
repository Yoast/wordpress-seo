<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Endpoints;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\Dashboard\Infrastructure\Endpoints\Time_Based_SEO_Metrics_Endpoint;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Test class for the Time_Based_SEO_Metrics_Endpoint class.
 *
 * @group Endpoints
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Endpoints\Time_Based_SEO_Metrics_Endpoint
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Time_Based_SEO_Metrics_Endpoint_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Time_Based_SEO_Metrics_Endpoint
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	public function set_up() {
		$this->instance = new Time_Based_SEO_Metrics_Endpoint();
	}

	/**
	 * Tests if the name is the expected value.
	 *
	 * @covers ::get_name
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'timeBasedSeoMetrics', $this->instance->get_name() );
	}

	/**
	 * Tests if the namespace is the expected value.
	 *
	 * @covers ::get_namespace
	 * @return void
	 */
	public function test_get_namespace() {
		$this->assertSame( 'yoast/v1', $this->instance->get_namespace() );
	}

	/**
	 * Tests if the route is the expected value.
	 *
	 * @covers ::get_route
	 * @return void
	 */
	public function test_get_route() {
		$this->assertSame( '/time_based_seo_metrics', $this->instance->get_route() );
	}

	/**
	 * Tests if the rest url is the expected value.
	 *
	 * @covers ::get_url
	 * @return void
	 */
	public function test_get_url() {
		Functions\expect( 'rest_url' )
			->once()
			->with(
				'yoast/v1/time_based_seo_metrics'
			)->andReturnFirstArg();
		$this->assertSame( 'yoast/v1/time_based_seo_metrics', $this->instance->get_url() );
	}
}
