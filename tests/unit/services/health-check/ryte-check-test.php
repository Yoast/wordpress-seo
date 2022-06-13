<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use Mockery;
use Yoast\WP\SEO\Services\Health_Check\Ryte_Check;
use Yoast\WP\SEO\Services\Health_Check\Ryte_Reports;
use Yoast\WP\SEO\Services\Health_Check\Ryte_Runner;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Ryte_Check
 *
 * @coversDefaultClass Yoast\WP\SEO\Services\Health_Check\Ryte_Check
 */
class Ryte_Check_Test extends TestCase {

	/**
	 * The Ryte_Check instance to be tested.
	 *
	 * @var Ryte_Check
	 */
	private $instance;

	/**
	 * A mock for Ryte_Runner.
	 *
	 * @var Ryte_Runner
	 */
	private $runner_mock;

	/**
	 * A mock for Ryte_Reports.
	 *
	 * @var Ryte_Reports
	 */
	private $reports_mock;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->runner_mock  = Mockery::mock( Ryte_Runner::class );
		$this->reports_mock = Mockery::mock( Ryte_Reports::class );
		$this->reports_mock->shouldReceive( 'set_test_identifier' )->once();

		$this->instance = new Ryte_Check( $this->runner_mock, $this->reports_mock );
	}

	/**
	 * Checks if the health check returns the correct label.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::get_test_label
	 */
	public function test_get_label() {
		$expected_label = 'Ryte';
		$actual_label   = $this->instance->get_test_label();

		$this->assertEquals( $expected_label, $actual_label );
	}

	/**
	 * Checks if the health check returns an empty report if the health check shouldn't run.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::run_and_get_result
	 * @covers ::get_result
	 */
	public function test_shouldnt_run_returns_empty_report() {
		$expected_report = [];

		$this->runner_mock
			->shouldReceive( 'run' )
			->once();
		$this->runner_mock
			->shouldReceive( 'should_run' )
			->once()
			->andReturns( false );

		$actual_report = $this->instance->run_and_get_result();

		$this->assertEquals( $expected_report, $actual_report );
	}

	/**
	 * Checks if the health check returns a report with an error message if the health check got an error response from Ryte.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::run_and_get_result
	 * @covers ::get_result
	 */
	public function test_returns_error_response_report() {
		$expected_error_response = [ 'error' ];
		$expected_report         = [ 'correct' ];

		$this->runner_mock
			->shouldReceive( 'run' )
			->once();
		$this->runner_mock
			->shouldReceive( 'should_run' )
			->once()
			->andReturns( true );
		$this->runner_mock
			->shouldReceive( 'got_response_error' )
			->once()
			->andReturns( true );
		$this->runner_mock
			->shouldReceive( 'get_error_response' )
			->once()
			->andReturns( $expected_error_response );
		$this->reports_mock
			->shouldReceive( 'get_response_error_result' )
			->once()
			->with( $expected_error_response )
			->andReturn( $expected_report );

		$actual_report = $this->instance->run_and_get_result();

		$this->assertEquals( $expected_report, $actual_report );
	}

	/**
	 * Checks if the health check returns a report with an error message if the health check got an error response from Ryte without content.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::run_and_get_result
	 * @covers ::get_result
	 */
	public function test_returns_error_response_report_unknown() {
		$expected_report = [ 'correct' ];

		$this->runner_mock
			->shouldReceive( 'run' )
			->once();
		$this->runner_mock
			->shouldReceive( 'should_run' )
			->once()
			->andReturns( true );
		$this->runner_mock
			->shouldReceive( 'got_response_error' )
			->once()
			->andReturns( true );
		$this->runner_mock
			->shouldReceive( 'get_error_response' )
			->once()
			->andReturns( null );
		$this->reports_mock
			->shouldReceive( 'get_unknown_indexability_result' )
			->once()
			->andReturn( $expected_report );

		$actual_report = $this->instance->run_and_get_result();

		$this->assertEquals( $expected_report, $actual_report );
	}

	/**
	 * Checks if the health check returns the correct report for when the health check couldn't determine the indexability of the site.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::run_and_get_result
	 * @covers ::get_result
	 */
	public function test_returns_unknown_indexability_report() {
		$expected_report = [ 'correct' ];

		$this->runner_mock
			->shouldReceive( 'run' )
			->once();
		$this->runner_mock
			->shouldReceive( 'should_run' )
			->once()
			->andReturns( true );
		$this->runner_mock
			->shouldReceive( 'got_response_error' )
			->once()
			->andReturns( false );
		$this->runner_mock
			->shouldReceive( 'has_unknown_indexability' )
			->once()
			->andReturns( true );
		$this->reports_mock
			->shouldReceive( 'get_unknown_indexability_result' )
			->once()
			->andReturns( $expected_report );

		$actual_report = $this->instance->run_and_get_result();

		$this->assertEquals( $expected_report, $actual_report );
	}

	/**
	 * Checks if the health check returns the correct report for when Ryte reports that the site is not indexable.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::run_and_get_result
	 * @covers ::get_result
	 */
	public function test_get_not_indexable_result() {
		$expected_report = [ 'correct' ];
		$this->runner_mock
			->shouldReceive( 'run' )
			->once();
		$this->runner_mock
			->shouldReceive( 'should_run' )
			->once()
			->andReturns( true );
		$this->runner_mock
			->shouldReceive( 'got_response_error' )
			->once()
			->andReturns( false );
		$this->runner_mock
			->shouldReceive( 'has_unknown_indexability' )
			->once()
			->andReturns( false );
		$this->runner_mock
			->shouldReceive( 'is_successful' )
			->once()
			->andReturns( false );
		$this->reports_mock
			->shouldReceive( 'get_not_indexable_result' )
			->once()
			->andReturns( $expected_report );

		$actual_report = $this->instance->run_and_get_result();

		$this->assertEquals( $expected_report, $actual_report );
	}

	/**
	 * Checks if the health check returns the correct report for when Ryte reports that the site is indexable.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::run_and_get_result
	 * @covers ::get_result
	 */
	public function test_get_success_result() {
		$expected_report = [ 'correct' ];
		$this->runner_mock
			->shouldReceive( 'run' )
			->once();
		$this->runner_mock
			->shouldReceive( 'should_run' )
			->once()
			->andReturns( true );
		$this->runner_mock
			->shouldReceive( 'got_response_error' )
			->once()
			->andReturns( false );
		$this->runner_mock
			->shouldReceive( 'has_unknown_indexability' )
			->once()
			->andReturns( false );
		$this->runner_mock
			->shouldReceive( 'is_successful' )
			->once()
			->andReturns( true );
		$this->reports_mock
			->shouldReceive( 'get_success_result' )
			->once()
			->andReturns( $expected_report );

		$actual_report = $this->instance->run_and_get_result();

		$this->assertEquals( $expected_report, $actual_report );
	}
}
