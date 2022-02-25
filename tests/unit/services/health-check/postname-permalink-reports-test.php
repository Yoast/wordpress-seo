<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use Mockery;
use Yoast\WP\SEO\Services\Health_Check\Postname_Permalink_Reports;
use Yoast\WP\SEO\Services\Health_Check\Report_Builder;
use Yoast\WP\SEO\Services\Health_Check\Report_Builder_Factory;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Brain\Monkey;

/**
 * Postname_Permalink_Reports
 *
 * @coversDefaultClass Yoast\WP\SEO\Services\Health_Check\Postname_Permalink_Reports
 */
class Postname_Permalink_Reports_Test extends TestCase {

	/**
	 * The Postname_Permalink_Reports instance to be tested.
	 *
	 * @var Postname_Permalink_Reports
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

		$this->instance = new Postname_Permalink_Reports( $this->report_builder_factory );

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
			->with( 'Your permalink structure includes the post name' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_status_good' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_description' )
			->with( 'You do have your postname in the URL of your posts and pages.' )
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
	 * @covers ::get_has_no_postname_in_permalink_result
	 * @covers ::get_has_no_postname_in_permalink_description
	 * @covers ::get_has_no_postname_in_permalink_actions
	 */
	public function test_creates_has_no_postname_in_permalink_correctly() {
		$expected = [ 'correct' ];

		Monkey\Functions\expect( 'admin_url' )
			->andReturn( 'link' );

		$this->reports
			->shouldReceive( 'set_label' )
			->with( 'You do not have your postname in the URL of your posts and pages' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_status_recommended' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_description' )
			->with( 'It\'s highly recommended to have your postname in the URL of your posts and pages. Consider setting your permalink structure to <strong>/%postname%/</strong>.' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_actions' )
			->with( 'You can fix this on the <a href="link">Permalink settings page</a>.' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'build' )
			->andReturn( $expected );

		$actual = $this->instance->get_has_no_postname_in_permalink_result();

		$this->assertEquals( $expected, $actual );
	}
}
