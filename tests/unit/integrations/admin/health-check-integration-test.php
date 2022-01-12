<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Integrations\Admin\Health_Check_Integration;
use Yoast\WP\SEO\Services\Health_Check\Runner_Interface;
use Yoast\WP\SEO\Tests\Unit\Doubles\Services\Health_Check\Health_Check_Double;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Health_Check_Integration_Test
 *
 * @coversDefaultClass Yoast\WP\SEO\Integrations\Admin\Health_Check_Integration
 */
class Health_Check_Integration_Test extends TestCase {

	/**
	 * The Health_Check_Integration instance to be tested.
	 *
	 * @var Health_Check_Integration
	 */
	protected $instance;

	/**
	 * Health check mocks.
	 *
	 * @var Health_Check_Double[]
	 */
	protected $health_check_mocks;

	/**
	 * Health check runner mocks.
	 *
	 * @var Runner_Interface[]
	 */
	protected $runner_mocks;

	/**
	 * Set up the test fixtures.
	 */
	public function set_up() {
		parent::set_up();

		$this->runner_mocks = [
			Mockery::mock( Runner_Interface::class ),
			Mockery::mock( Runner_Interface::class ),
		];

		$this->health_check_mocks = [
			Mockery::mock( Health_Check_Double::class, [ $this->runner_mocks[0] ] ),
			Mockery::mock( Health_Check_Double::class, [ $this->runner_mocks[1] ] ),
		];

		$this->instance = new Health_Check_Integration( ...$this->health_check_mocks );
	}

	/**
	 * Tear down the test fixtures. Add assertions made by Mockery.
	 *
	 * @return void
	 */
	public function tear_down() {
		$container = Mockery::getContainer();
		$this->addToAssertionCount( $container->mockery_getExpectationCount() );
		parent::tear_down();
	}

	/**
	 * Checks if the integration has the Admin_Conditional (health check should only occur in the admin panel).
	 *
	 * @covers ::get_conditionals
	 */
	public function test_returns_admin_conditional() {
		$actual   = $this->instance->get_conditionals();
		$expected = [ Admin_Conditional::class ];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Checks if the register_hooks function hooks into WordPress correctly.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks_calls_wp_apply_filters() {
		Monkey\Functions\expect( 'add_filter' )
			->with( 'site_status_tests', [ $this->instance, 'add_health_checks' ] )
			->once();

		$this->instance->register_hooks();
	}

	/**
	 * Checks if the WordPress callback generates the right array with the available health checks.
	 *
	 * @covers ::__construct
	 * @covers ::add_health_checks
	 */
	public function test_add_health_checks_generates_correct_array() {
		$input = [
			'direct' => [
				'some-test' => [],
			],
			'async' => [
				'some-other-test' => [],
			],
		];

		$expected = [
			'direct' => [
				'some-test' => [],
				'test0'     => [
					'test' => [
						$this->health_check_mocks[0],
						'run_and_get_result',
					],
				],
				'test1'     => [
					'test' => [
						$this->health_check_mocks[1],
						'run_and_get_result',
					],
				],
			],
			'async' => [
				'some-other-test' => [],
			],
		];

		$this->health_check_mocks[0]
			->shouldReceive( 'get_test_identifier' )
			->andReturn( 'test0' )
			->once();

		$this->health_check_mocks[1]
			->shouldReceive( 'get_test_identifier' )
			->andReturn( 'test1' )
			->once();

		$actual = $this->instance->add_health_checks( $input );

		$this->assertEquals( $expected, $actual );
	}
}
