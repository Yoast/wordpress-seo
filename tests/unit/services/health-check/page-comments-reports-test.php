<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Services\Health_Check\Page_Comments_Reports;
use Yoast\WP\SEO\Services\Health_Check\Report_Builder;
use Yoast\WP\SEO\Services\Health_Check\Report_Builder_Factory;
use Yoast\WP\SEO\Tests\Unit\TestCase;

// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded

/**
 * Page_Comments_Reports
 *
 * @coversDefaultClass Yoast\WP\SEO\Services\Health_Check\Page_Comments_Reports
 */
class Page_Comments_Reports_Test extends TestCase {

	/**
	 * The Page_Comments_Reports instance to be tested.
	 *
	 * @var Page_Comments_Reports
	 */
	private $instance;

	/**
	 * The mocked Report_Builder.
	 *
	 * @var Report_Builder
	 */
	private $reports;

	/**
	 * The mocked Report_Builder_Factory that returns the Report_Builder mock.
	 *
	 * @var Report_Builder_Factory
	 */
	private $report_builder_factory;

	/**
	 * Set up the test fixtures.
	 */
	public function set_up() {
		parent::set_up();

		$this->reports                = Mockery::mock( Report_Builder::class );
		$this->report_builder_factory = Mockery::mock( Report_Builder_Factory::class );

		$this->report_builder_factory
			->shouldReceive( 'create' )
			->once()
			->andReturn( $this->reports );

		$this->instance = new Page_Comments_Reports( $this->report_builder_factory );

		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();
	}

	/**
	 * Checks if the Report_Builder is called when setting a test identifier.
	 *
	 * @covers ::__construct
	 * @covers ::set_test_identifier
	 */
	public function test_sets_identifier_correctly() {
		$expected = 'correct';

		$this->reports
			->shouldReceive( 'set_test_identifier' )
			->with( $expected )
			->once();

		$this->instance->set_test_identifier( $expected );
	}

	/**
	 * Check if the success report is built correctly.
	 *
	 * @covers ::__construct
	 * @covers ::get_success_result
	 */
	public function test_creates_success_report_correctly() {
		$expected = [ 'correct' ];

		$this->reports
			->shouldReceive( 'set_label' )
			->with( 'Comments are displayed on a single page' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_status_good' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_description' )
			->with( 'Comments on your posts are displayed on a single page. This is just like we\'d suggest it. You\'re doing well!' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'build' )
			->andReturn( $expected );

		$actual = $this->instance->get_success_result();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Check if the failure report is built correctly.
	 *
	 * @covers ::__construct
	 * @covers ::get_has_comments_on_multiple_pages_result
	 * @covers ::get_has_comments_on_multiple_pages_actions
	 */
	public function test_creates_has_has_comments_on_multiple_pages() {
		$expected = [ 'correct' ];

		Monkey\Functions\expect( 'admin_url' )
			->andReturn( 'link' );

		$this->reports
			->shouldReceive( 'set_label' )
			->with( 'Comments break into multiple pages' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_status_recommended' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_description' )
			->with( 'Comments on your posts break into multiple pages. As this is not needed in 999 out of 1000 cases, we recommend you disable it. To fix this, uncheck "Break comments into pages..." on the Discussion Settings page.' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_actions' )
			->with( '<a href="link">Go to the Discussion Settings page</a>' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'build' )
			->andReturn( $expected );

		$actual = $this->instance->get_has_comments_on_multiple_pages_result();

		$this->assertEquals( $expected, $actual );
	}
}
