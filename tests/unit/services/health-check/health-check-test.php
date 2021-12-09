<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use Mockery;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Services\Health_Check\Health_Check;
use Yoast\WP\SEO\Services\Health_Check\Runner_Interface;
use Yoast\WP\SEO\Tests\Unit\Doubles\Services\Health_Check\Health_Check_Double;

/**
 * Health_Check_Test
 *
 * @group health-check
 *
 * @coversDefaultClass Yoast\WP\SEO\Services\Health_Check\Health_Check
 */
class Health_Check_Test extends TestCase {

	/**
	 * A partially mocked test double of Health_Check.
	 *
	 * @var Health_Check
	 */
	protected $instance;

	/**
	 * A mocked Runner_Interface.
	 *
	 * @var Runner_Interface
	 */
	protected $runner;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->runner   = Mockery::mock( Runner_Interface::class );
		$this->instance = Mockery::mock( Health_Check_Double::class, [ $this->runner ] )
			->makePartial()
			->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Checks if the health check runner is called when calling run_and_get_result().
	 *
	 * @covers ::run_and_get_result
	 * @covers ::set_runner
	 */
	public function test_calls_run() {
		$this->runner
			->shouldReceive( 'run' )
			->once();
		$this->instance
			->run_and_get_result();

		Mockery::close();
	}

	/**
	 * Checks if run_and_get_result() returns the results from the health check implementation.
	 *
	 * @covers ::run_and_get_result
	 * @covers ::set_runner
	 */
	public function test_returns_result_from_implementation() {
		$expected = [ 'return value' ];
		$this->runner
			->shouldReceive( 'run' );
		$this->instance
			->shouldReceive( 'get_result' )
			->once()
			->andReturn( $expected );

		$actual = $this->instance->run_and_get_result();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Checks if get_test_label() generates a lowercase string with the 'yoast-' prefix and its whitespace replaced by dashes.
	 *
	 * @covers ::get_test_identifier
	 */
	public function test_outputs_valid_test_identifier() {
		$input    = 'Some hEalTh Check labeL';
		$expected = 'yoast-some-health-check-label';
		$this->instance
			->shouldReceive( 'get_test_label' )
			->once()
			->andReturn( $input );

		$actual = $this->instance->get_test_identifier();

		$this->assertEquals( $expected, $actual );
	}
}
