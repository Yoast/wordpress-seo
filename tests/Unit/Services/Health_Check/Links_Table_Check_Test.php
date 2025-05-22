<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use Mockery;
use Yoast\WP\SEO\Conditionals\Should_Index_Links_Conditional;
use Yoast\WP\SEO\Services\Health_Check\Links_Table_Check;
use Yoast\WP\SEO\Services\Health_Check\Links_Table_Reports;
use Yoast\WP\SEO\Services\Health_Check\Links_Table_Runner;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Links_Table_Test
 *
 * @group health-check
 *
 * @coversDefaultClass Yoast\WP\SEO\Services\Health_Check\Links_Table_Check
 */
final class Links_Table_Check_Test extends TestCase {

	/**
	 * The Links_Table_Check instance to be tested.
	 *
	 * @var Links_Table_Check
	 */
	private $instance;

	/**
	 * A mock of the Links_Table_Runner dependency.
	 *
	 * @var Links_Table_Runner
	 */
	private $runner_mock;

	/**
	 * A mock of the Links_Table_Report_Builder dependency.
	 *
	 * @var Links_Table_Reports
	 */
	private $reports_mock;

	/**
	 * A mock of the Should_Index_Links_Conditional dependency.
	 *
	 * @var Should_Index_Links_Conditional
	 */
	private $should_index_links_conditional_mock;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->runner_mock                         = Mockery::mock( Links_Table_Runner::class );
		$this->reports_mock                        = Mockery::mock( Links_Table_Reports::class );
		$this->should_index_links_conditional_mock = Mockery::mock( Should_Index_Links_Conditional::class );
		$this->reports_mock
			->shouldReceive( 'set_test_identifier' )
			->once();
		$this->instance = new Links_Table_Check( $this->runner_mock, $this->reports_mock, $this->should_index_links_conditional_mock );
	}

	/**
	 * Checks if the correct result is returned when the health check passes.
	 *
	 * @covers ::get_result
	 * @covers ::__construct
	 *
	 * @return void
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
	 *
	 * @return void
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
			->shouldReceive( 'get_links_table_not_accessible_result' )
			->once()
			->andReturn( $expected );

		$actual = $this->instance->run_and_get_result();

		$this->assertEquals( $expected, $actual );
	}
}
