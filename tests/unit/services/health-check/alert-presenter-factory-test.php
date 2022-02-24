<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use Yoast\WP\SEO\Presenters\Admin\Alert_Presenter;
use Yoast\WP\SEO\Services\Health_Check\Alert_Presenter_Factory;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Brain\Monkey;

/**
 * Alert_Presenter_Factory
 *
 * @coversDefaultClass Yoast\WP\SEO\Services\Health_Check\Alert_Presenter_Factory
 */
class Alert_Presenter_Factory_Test extends TestCase {

	/**
	 * The Alert_Presenter_Factory instance to be tested.
	 *
	 * @var Alert_Presenter_Factory
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->instance = new Alert_Presenter_Factory();
	}

	/**
	 * Checks if the factory returns a new instance.
	 *
	 * @return void
	 * @covers ::create
	 */
	public function test_factory_returns_instance() {
		Monkey\Functions\expect( 'wp_enqueue_style' );

		$content  = 'content';
		$type     = 'info';
		$instance = $this->instance->create( $content, $type );

		$expected_type = Alert_Presenter::class;

		$this->assertInstanceOf( $expected_type, $instance );
	}
}
