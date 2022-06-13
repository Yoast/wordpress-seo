<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use Brain\Monkey;
use Mockery;
use WPSEO_Shortlinker;
use Yoast\WP\SEO\Services\Health_Check\Links_Table_Reports;
use Yoast\WP\SEO\Services\Health_Check\Report_Builder;
use Yoast\WP\SEO\Services\Health_Check\Report_Builder_Factory;
use Yoast\WP\SEO\Tests\Unit\TestCase;

// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded

/**
 * Links_Table_Reports
 *
 * @coversDefaultClass Yoast\WP\SEO\Services\Health_Check\Links_Table_Reports
 */
class Links_Table_Reports_Test extends TestCase {

	/**
	 * The Links_Table_Reports instance to be tested.
	 *
	 * @var Links_Table_Reports
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
	 * A mocked WPSEO_Shortlinker object.
	 *
	 * @var WPSEO_Shortlinker
	 */
	private $shortlinker;

	/**
	 * Set up the test fixtures.
	 */
	public function set_up() {
		parent::set_up();

		$this->reports                = Mockery::mock( Report_Builder::class );
		$this->report_builder_factory = Mockery::mock( Report_Builder_Factory::class );
		$this->shortlinker            = Mockery::mock( WPSEO_Shortlinker::class );

		$this->report_builder_factory
			->shouldReceive( 'create' )
			->once()
			->andReturn( $this->reports );

		$this->instance = new Links_Table_Reports( $this->report_builder_factory, $this->shortlinker );

		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();
	}

	/**
	 * Check if the success report is built correctly.
	 *
	 * @covers ::__construct
	 * @covers ::get_success_result
	 * @covers ::get_success_description
	 */
	public function test_creates_success_report_correctly() {
		$expected = [ 'correct' ];

		$this->shortlinker
			->shouldReceive( 'get' )
			->andReturn( 'link' );
		$this->reports
			->shouldReceive( 'set_label' )
			->with( 'The text link counter is working as expected' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_status_good' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_description' )
			->with( 'The text link counter helps you improve your site structure. <a href="link" target="_blank">Find out how the text link counter can enhance your SEO<span class="screen-reader-text">(Opens in a new browser tab)</span></a>.' )
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
	 * @covers ::get_links_table_not_accessible_result
	 * @covers ::get_links_table_not_accessible_description
	 * @covers ::get_actions
	 */
	public function test_creates_has_default_tagline_report_correctly() {
		$expected = [ 'correct' ];

		$this->shortlinker
			->shouldReceive( 'get' )
			->andReturn( 'link' );
		$this->reports
			->shouldReceive( 'set_label' )
			->with( 'The text link counter feature is not working as expected' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_status_recommended' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_description' )
			->with( 'For this feature to work, Yoast SEO needs to create a table in your database. We were unable to create this table automatically.' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_actions' )
			->with( '<a href="link" target="_blank">Find out how to solve this problem on our help center<span class="screen-reader-text">(Opens in a new browser tab)</span></a>.' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'build' )
			->andReturn( $expected );

		$actual = $this->instance->get_links_table_not_accessible_result();

		$this->assertEquals( $expected, $actual );
	}
}
