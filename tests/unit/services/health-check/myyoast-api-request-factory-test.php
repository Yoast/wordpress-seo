<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use WPSEO_MyYoast_Api_Request;
use Yoast\WP\SEO\Services\Health_Check\MyYoast_Api_Request_Factory;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * MyYoast_Api_Request_Factory_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Services\Health_Check\MyYoast_Api_Request_Factory
 *
 * phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class MyYoast_Api_Request_Factory_Test extends TestCase {

	/**
	 * The MyYoast_Api_Request_Factory instance to be tested.
	 *
	 * @var MyYoast_Api_Request_Factory
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->instance = new MyYoast_Api_Request_Factory();
	}

	/**
	 * Checks if the factory returns a new instance.
	 *
	 * @return void
	 * @covers ::create
	 */
	public function test_factory_returns_instance() {
		$url      = 'sites/current';
		$args     = [ 'someArg' ];
		$instance = $this->instance->create( $url, $args );

		$expected_type = WPSEO_MyYoast_Api_Request::class;

		$this->assertInstanceOf( $expected_type, $instance );
	}
}
