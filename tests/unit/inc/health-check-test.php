<?php

namespace Yoast\WP\SEO\Tests\Unit\Inc;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\Doubles\Inc\WPSEO_Health_Check_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @group health-check
 */
class Health_Check_Test extends TestCase {

	/**
	 * Class instance to use for the test.
	 *
	 * @var WPSEO_Health_Check_Double
	 */
	protected $instance;

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new WPSEO_Health_Check_Double();
	}

	/**
	 * Registers a non-async test.
	 *
	 * @covers WPSEO_Health_Check::register_test
	 */
	public function test_register_test_for_non_async_test() {

		Monkey\Functions\expect( 'add_filter' )
			->once()
			->with( 'site_status_tests', [ $this->instance, 'add_test' ] );

		$this->assertFalse( $this->instance->is_async() );
		$this->instance->register_test();
	}

	/**
	 * Registers an async test.
	 *
	 * @covers WPSEO_Health_Check::register_test
	 */
	public function test_register_test_for_async_test() {
		$this->instance->async = true;

		Monkey\Functions\expect( 'add_filter' )
			->once()
			->with( 'site_status_tests', [ $this->instance, 'add_async_test' ] );

		Monkey\Functions\expect( 'add_action' )
			->once()
			->with( 'wp_ajax_health-check-', [ $this->instance, 'get_async_test_result' ] );

		$this->assertTrue( $this->instance->is_async() );
		$this->instance->register_test();
	}

	/**
	 * Tests the add_test method
	 *
	 * @covers WPSEO_Health_Check::add_test
	 */
	public function test_add_test() {
		$this->assertEquals(
			[
				'direct' => [
					'' => [
						'test' => [ $this->instance, 'get_test_result' ],
					],
				],
			],
			$this->instance->add_test( [] )
		);
	}

	/**
	 * Tests the add_test method
	 *
	 * @covers WPSEO_Health_Check::add_async_test
	 */
	public function test_add_async_test() {
		$this->assertEquals(
			[
				'async' => [
					'' => [
						'test' => '',
					],
				],
			],
			$this->instance->add_async_test( [] )
		);
	}

	/**
	 * Tests the get_test_result method
	 *
	 * @covers WPSEO_Health_Check::get_test_result
	 */
	public function test_get_test_result() {
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$this->assertEquals(
			[
				'label'       => '',
				'status'      => '',
				'badge'       => [
					'label' => 'SEO',
					'color' => 'green',
				],
				'description' => '',
				'actions'     => '<p class="yoast-site-health__signature"><img src="packages/js/images/Yoast_SEO_Icon.svg" alt="" height="20" width="20" class="yoast-site-health__signature-icon">This was reported by the Yoast SEO plugin</p>',
				'test'        => '',
			],
			$this->instance->get_test_result()
		);
		$this->assertTrue( $this->instance->has_run );
	}

	/**
	 * Tests the get_async_test_result method.
	 *
	 * @covers WPSEO_Health_Check::get_JSON_test_result
	 */
	public function test_get_async_test_result() {
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();
		$this->instance->async = true;

		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		Monkey\Functions\expect( 'wp_send_json_success' )
			->once()
			->with(
				[
					'label'       => '',
					'status'      => '',
					'badge'       => [
						'label' => 'SEO',
						'color' => 'green',
					],
					'description' => '',
					'actions'     => '<p class="yoast-site-health__signature"><img src="packages/js/images/Yoast_SEO_Icon.svg" alt="" height="20" width="20" class="yoast-site-health__signature-icon">This was reported by the Yoast SEO plugin</p>',
					'test'        => '',
				]
			);

		$this->instance->get_async_test_result();

		$this->assertTrue( $this->instance->has_run );
	}
}
