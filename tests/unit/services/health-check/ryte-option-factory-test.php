<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use WPSEO_Ryte_Option;
use Yoast\WP\SEO\Services\Health_Check\Ryte_Option_Factory;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Ryte_Option_Factory
 *
 * @coversDefaultClass Yoast\WP\SEO\Services\Health_Check\Ryte_Option_Factory
 */
class Ryte_Option_Factory_Test extends TestCase {

	/**
	 * The Ryte_Option_Factory instance to be tested.
	 *
	 * @var Ryte_Option_Factory
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->instance = new Ryte_Option_Factory();
	}

	/**
	 * Checks if the factory returns a new instance.
	 *
	 * @return void
	 * @covers ::create
	 */
	public function test_factory_returns_instance() {
		$instance = $this->instance->create();

		$expected_type = WPSEO_Ryte_Option::class;

		$this->assertInstanceOf( $expected_type, $instance );
	}
}
