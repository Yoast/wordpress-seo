<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use Mockery;
use Yoast\WP\SEO\Services\Health_Check\Report_Builder;
use Yoast\WP\SEO\Services\Health_Check\Report_Builder_Factory;
use Yoast\WP\SEO\Services\Health_Check\Reports_Trait;
use Yoast\WP\SEO\Tests\Unit\Doubles\Services\Health_Check\Reports_Trait_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Reports_Trait
 *
 * @coversDefaultClass Yoast\WP\SEO\Tests\Unit\Doubles\Services\Health_Check\Reports_Trait_Double
 */
class Reports_Trait_Test extends TestCase {

	/**
	 * The Reports_Trait_Double instance to be tested.
	 *
	 * @var Reports_Trait_Double
	 */
	private $instance;

	/**
	 * A mocked Report_Builder;
	 *
	 * @var Report_Builder
	 */
	private $report_builder;

	/**
	 * A mocked Report_Builder_Factory.
	 *
	 * @var Report_Builder_Factory
	 */
	private $report_builder_factory;

	/**
	 * Set up the test fixtures.
	 */
	public function set_up() {
		parent::set_up();

		$this->report_builder         = Mockery::mock( Report_Builder::class );
		$this->report_builder_factory = Mockery::mock( Report_Builder_Factory::class );
		$this->instance               = new Reports_Trait_Double( $this->report_builder_factory );
	}

	/**
	 * Check if the test identifier is set correctly.
	 *
	 * @covers ::__construct
	 * @covers ::set_test_identifier
	 * @covers ::get_test_identifier
	 */
	public function test_sets_identifier() {
		$expected = 'identifier';

		$this->instance->set_test_identifier( $expected );

		$actual = $this->instance->get_test_identifier();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Check if the Report_Builder_Factory is called with the right identifier string.
	 *
	 * @covers ::__construct
	 * @covers ::set_test_identifier
	 * @covers ::get_report_builder
	 * @covers ::get_report_builder_public
	 */
	public function test_sets_identifier_on_report_builder() {
		$expected = 'identifier';

		$this->report_builder_factory
			->shouldReceive( 'create' )
			->with( $expected )
			->andReturn( $this->report_builder );

		$this->instance->set_test_identifier( $expected );
		$this->instance->get_report_builder_public();
	}
}
