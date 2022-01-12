<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Services\Health_Check\Default_Tagline_Report_Builder;
use Yoast\WP\SEO\Services\Health_Check\Report_Builder;
use Yoast\WP\SEO\Tests\Unit\TestCase;

// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded

/**
 * Default_Tagline_Report_Builder_Test
 *
 * @coversDefaultClass Yoast\WP\SEO\Services\Health_Check\Default_Tagline_Report_Builder
 */
class Default_Tagline_Report_Builder_Test extends TestCase {

	/**
	 * The Default_Tagline_Report_Builder instance to be tested.
	 *
	 * @var Default_Tagline_Report_Builder
	 */
	private $instance;

	/**
	 * The mocked Report_Builder.
	 *
	 * @var Report_Builder
	 */
	private $report_builder;

	/**
	 * Set up the test fixtures.
	 */
	public function set_up() {
		parent::set_up();

		$this->report_builder = Mockery::mock( Report_Builder::class );
		$this->instance       = new Default_Tagline_Report_Builder( $this->report_builder );

		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();
	}

	/**
	 * Checks if the Report_Builder is called when setting a test identifier.
	 *
	 * @covers ::set_test_identifier
	 */
	public function test_sets_identifier_correctly() {
		$expected = 'correct';

		$this->report_builder
			->shouldReceive( 'set_test_identifier' )
			->with( $expected )
			->once();

		$this->instance->set_test_identifier( $expected );
	}

	/**
	 * Check if the success report is built correctly.
	 *
	 * @covers ::get_success_result
	 */
	public function test_creates_success_report_correctly() {
		$expected = [ 'correct' ];

		$this->report_builder
			->shouldReceive( 'set_label' )
			->with( 'You changed the default WordPress tagline' )
			->andReturn( $this->report_builder )
			->once();
		$this->report_builder
			->shouldReceive( 'set_status_good' )
			->andReturn( $this->report_builder )
			->once();
		$this->report_builder
			->shouldReceive( 'set_description' )
			->with( 'You are using a custom tagline or an empty one.' )
			->andReturn( $this->report_builder )
			->once();
		$this->report_builder
			->shouldReceive( 'build' )
			->andReturn( $expected );

		$actual = $this->instance->get_success_result();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Check if the failure report is built correctly.
	 *
	 * @covers ::get_has_default_tagline_result
	 * @covers ::get_actions
	 */
	public function test_creates_has_default_tagline_report_correctly() {
		$expected = [ 'correct' ];

		Monkey\Functions\expect( 'add_query_arg' )
			->once();
		Monkey\Functions\expect( 'wp_customize_url' )
			->once();

		$this->report_builder
			->shouldReceive( 'set_label' )
			->with( 'You should change the default WordPress tagline' )
			->andReturn( $this->report_builder )
			->once();
		$this->report_builder
			->shouldReceive( 'set_status_recommended' )
			->andReturn( $this->report_builder )
			->once();
		$this->report_builder
			->shouldReceive( 'set_description' )
			->with( 'You still have the default WordPress tagline. Even an empty one is probably better.' )
			->andReturn( $this->report_builder )
			->once();
		$this->report_builder
			->shouldReceive( 'set_actions' )
			->with( Mockery::any() )
			->andReturn( $this->report_builder )
			->once();
		$this->report_builder
			->shouldReceive( 'build' )
			->andReturn( $expected );

		$actual = $this->instance->get_has_default_tagline_result();

		$this->assertEquals( $expected, $actual );
	}
}
