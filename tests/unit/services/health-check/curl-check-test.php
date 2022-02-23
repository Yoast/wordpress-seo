<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use Yoast\WP\SEO\Services\Health_Check\Curl_Check;
use Yoast\WP\SEO\Services\Health_Check\Curl_Reports;
use Yoast\WP\SEO\Services\Health_Check\Curl_Runner;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Mockery;

/**
 * Curl_Check
 *
 * @coversDefaultClass Yoast\WP\SEO\Services\Health_Check\Curl_Check
 */
class Curl_Check_Test extends TestCase {

	/**
	 * The Curl_Check instance to be tested.
	 *
	 * @var Curl_Check
	 */
	private $instance;

	/**
	 * A mock of the Curl_Runner dependency.
	 *
	 * @var Curl_Runner
	 */
	private $runner_mock;

	/**
	 * A mock of the Curl_Reports dependency.
	 *
	 * @var Curl_Reports
	 */
	private $reports_mock;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->runner_mock  = Mockery::mock( Curl_Runner::class );
		$this->reports_mock = Mockery::mock( Curl_Reports::class );
		$this->reports_mock->shouldReceive( 'set_test_identifier' )->once();

		// Incorrectly detects direct calls to cURL.
		// phpcs:ignore
		$this->instance = new Curl_Check( $this->runner_mock, $this->reports_mock );
	}

	/**
	 * Checks if the health check returns the correct label.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::get_test_label
	 */
	public function test_returns_correct_label() {
		$expected_label = 'cURL';
		$actual_label   = $this->instance->get_test_label();

		$this->assertEquals( $actual_label, $expected_label );
	}

	/**
	 * Checks if the health check returns the correct report when the health check's runner was successful.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::run_and_get_result
	 * @covers ::get_result
	 * @covers ::set_runner
	 */
	public function test_returns_success_report() {
		$expected_result = [ 'correct' ];

		$this->runner_mock->shouldReceive( 'run' )->once();
		$this->runner_mock->shouldReceive( 'is_successful' )->once()->andReturn( true );
		$this->reports_mock->shouldReceive( 'get_success_result' )->once()->andReturn( $expected_result );

		$actual_result = $this->instance->run_and_get_result();

		$this->assertEquals( $actual_result, $expected_result );
	}

	/**
	 * Checks if the health check returns an empty report when the health check's runner didn't find any premium plugins.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::run_and_get_result
	 * @covers ::get_result
	 * @covers ::set_runner
	 */
	public function test_returns_no_result() {
		$expected_result = [];

		$this->runner_mock->shouldReceive( 'run' )->once();
		$this->runner_mock->shouldReceive( 'is_successful' )->once()->andReturn( false );
		$this->runner_mock->shouldReceive( 'has_premium_plugins_installed' )->once()->andReturn( false );

		$actual_result = $this->instance->run_and_get_result();

		$this->assertEquals( $actual_result, $expected_result );
	}

	/**
	 * Checks if the health check returns the correct report when the health check's runner didn't find a recent cURL verison.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::run_and_get_result
	 * @covers ::get_result
	 * @covers ::set_runner
	 */
	public function test_returns_no_recent_curl_version_installed_result() {
		$expected_result = [ 'correct' ];

		$this->runner_mock->shouldReceive( 'run' )->once();
		$this->runner_mock->shouldReceive( 'is_successful' )->once()->andReturn( false );
		$this->runner_mock->shouldReceive( 'has_premium_plugins_installed' )->once()->andReturn( true );
		$this->runner_mock->shouldReceive( 'has_recent_curl_version_installed' )->once()->andReturn( false );
		$this->reports_mock->shouldReceive( 'get_no_recent_curl_version_installed_result' )->once()->andReturn( $expected_result );

		$actual_result = $this->instance->run_and_get_result();

		$this->assertEquals( $actual_result, $expected_result );
	}

	/**
	 * Checks if the health check returns the correct report when the health check's runner couldn't reach the MyYoast API.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::run_and_get_result
	 * @covers ::get_result
	 * @covers ::set_runner
	 */
	public function test_returns_my_yoast_api_not_reachable_result() {

		$expected_result = [ 'correct' ];

		$this->runner_mock->shouldReceive( 'run' )->once();
		$this->runner_mock->shouldReceive( 'is_successful' )->once()->andReturn( false );
		$this->runner_mock->shouldReceive( 'has_premium_plugins_installed' )->once()->andReturn( true );
		$this->runner_mock->shouldReceive( 'has_recent_curl_version_installed' )->once()->andReturn( true );
		$this->runner_mock->shouldReceive( 'can_reach_my_yoast_api' )->once()->andReturn( false );
		$this->reports_mock->shouldReceive( 'get_my_yoast_api_not_reachable_result' )->once()->andReturn( $expected_result );

		$actual_result = $this->instance->run_and_get_result();

		$this->assertEquals( $actual_result, $expected_result );
	}

	/**
	 * Checks if the health check returns an empty report when there aren't any conditions left to check.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::run_and_get_result
	 * @covers ::get_result
	 * @covers ::set_runner
	 */
	public function test_returns_nothing_after_all_cases() {
		$expected_result = [];

		$this->runner_mock->shouldReceive( 'run' )->once();
		$this->runner_mock->shouldReceive( 'is_successful' )->once()->andReturn( false );
		$this->runner_mock->shouldReceive( 'has_premium_plugins_installed' )->once()->andReturn( true );
		$this->runner_mock->shouldReceive( 'has_recent_curl_version_installed' )->once()->andReturn( true );
		$this->runner_mock->shouldReceive( 'can_reach_my_yoast_api' )->once()->andReturn( true );

		$actual_result = $this->instance->run_and_get_result();

		$this->assertEquals( $actual_result, $expected_result );
	}
}
