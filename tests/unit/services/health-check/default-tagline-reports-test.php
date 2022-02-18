<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Services\Health_Check\Default_Tagline_Reports;
use Yoast\WP\SEO\Services\Health_Check\Report_Builder;
use Yoast\WP\SEO\Services\Health_Check\Report_Builder_Factory;
use Yoast\WP\SEO\Tests\Unit\TestCase;

// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded

/**
 * Default_Tagline_Reports
 *
 * @coversDefaultClass Yoast\WP\SEO\Services\Health_Check\Default_Tagline_Reports
 */
class Default_Tagline_Reports_Test extends TestCase {

	/**
	 * The Default_Tagline_Reports instance to be tested.
	 *
	 * @var Default_Tagline_Reports
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

		$this->instance = new Default_Tagline_Reports( $this->report_builder_factory );

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
			->with( 'You changed the default WordPress tagline' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_status_good' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_description' )
			->with( 'You are using a custom tagline or an empty one.' )
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
	 * @covers ::get_has_default_tagline_result
	 * @covers ::get_actions
	 */
	public function test_creates_has_default_tagline_report_correctly() {
		$expected = [ 'correct' ];

		Monkey\Functions\expect( 'add_query_arg' )
			->once();
		Monkey\Functions\expect( 'wp_customize_url' )
			->once();

		$this->reports
			->shouldReceive( 'set_label' )
			->with( 'You should change the default WordPress tagline' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_status_recommended' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_description' )
			->with( 'You still have the default WordPress tagline. Even an empty one is probably better.' )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'set_actions' )
			->with( Mockery::any() )
			->andReturn( $this->reports )
			->once();
		$this->reports
			->shouldReceive( 'build' )
			->andReturn( $expected );

		$actual = $this->instance->get_has_default_tagline_result();

		$this->assertEquals( $expected, $actual );
	}
}
