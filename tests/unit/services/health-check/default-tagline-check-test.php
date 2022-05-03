<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use Mockery;
use Yoast\WP\SEO\Services\Health_Check\Default_Tagline_Check;
use Yoast\WP\SEO\Services\Health_Check\Default_Tagline_Reports;
use Yoast\WP\SEO\Services\Health_Check\Default_Tagline_Runner;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Default_Tagline_Test
 *
 * @group health-check
 *
 * @coversDefaultClass Yoast\WP\SEO\Services\Health_Check\Default_Tagline_Check
 */
class Default_Tagline_Check_Test extends TestCase {

	/**
	 * The Default_Tagline_Check instance to be tested.
	 *
	 * @var Default_Tagline_Check
	 */
	private $instance;

	/**
	 * A mock of the Default_Tagline_Runner dependency.
	 *
	 * @var Default_Tagline_Runner
	 */
	private $runner_mock;

	/**
	 * A mock of the Default_Tagline_Report_Builder dependency.
	 *
	 * @var Default_Tagline_Reports
	 */
	private $reports_mock;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->runner_mock  = Mockery::mock( Default_Tagline_Runner::class );
		$this->reports_mock = Mockery::mock( Default_Tagline_Reports::class );
		$this->reports_mock
			->shouldReceive( 'set_test_identifier' )
			->once();
		$this->instance = new Default_Tagline_Check( $this->runner_mock, $this->reports_mock );
	}

	/**
	 * Checks if the label is a non-empty string.
	 *
	 * @covers ::get_test_label
	 */
	public function test_label_returns_string() {
		$actual = $this->instance->get_test_label();
		$this->assertNotEmpty( $actual );
	}

	/**
	 * Checks if the correct result is returned when the health check passes.
	 *
	 * @covers ::get_result
	 * @covers ::__construct
	 */
	public function test_returns_successful_result() {
		$expected = [ 'correct' ];
		$this->runner_mock
			->shouldReceive( 'run' )
			->once();
		$this->runner_mock
			->shouldReceive( 'is_successful' )
			->once()
			->andReturn( true );
		$this->reports_mock
			->shouldReceive( 'get_success_result' )
			->once()
			->andReturn( $expected );

		$actual = $this->instance->run_and_get_result();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Checks if the correct result is returned when the health check fails.
	 *
	 * @covers ::get_result
	 * @covers ::__construct
	 */
	public function test_returns_failed_result() {
		$expected = [ 'correct' ];
		$this->runner_mock
			->shouldReceive( 'run' )
			->once();
		$this->runner_mock
			->shouldReceive( 'is_successful' )
			->once()
			->andReturn( false );
		$this->reports_mock
			->shouldReceive( 'get_has_default_tagline_result' )
			->once()
			->andReturn( $expected );

		$actual = $this->instance->run_and_get_result();

		$this->assertEquals( $expected, $actual );
	}
}
