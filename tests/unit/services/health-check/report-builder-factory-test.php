<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use Yoast\WP\SEO\Services\Health_Check\Report_Builder;
use Yoast\WP\SEO\Services\Health_Check\Report_Builder_Factory;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Report_Builder_Factory_Test
 *
 * @coversDefaultClass Yoast\WP\SEO\Services\Health_Check\Report_Builder_Factory
 */
class Report_Builder_Factory_Test extends TestCase {

	/**
	 * The Default_Tagline_Report_Builder instance to be tested.
	 *
	 * @var Default_Tagline_Report_Builder
	 */
	private $instance;

	/**
	 * Set up the test fixtures.
	 */
	public function set_up() {
		parent::set_up();
		$this->instance = new Report_Builder_Factory();
	}

	/**
	 * Checks if the factory returns a Report_Builder instance.
	 *
	 * @covers ::create
	 */
	public function test_returns_report_builder() {
		$actual = $this->instance->create();

		$this->assertInstanceOf( Report_Builder::class, $actual );
	}
}
