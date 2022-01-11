<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use Brain\Monkey;
use Yoast\WP\SEO\Services\Health_Check\Report_Builder;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Report_Builder_Test
 *
 * @coversDefaultClass Yoast\WP\SEO\Services\Health_Check\Report_Builder
 */
class Report_Builder_Test extends TestCase {

	/**
	 * The Report_Builder instance to be tested.
	 *
	 * @var Report_Builder
	 */
	protected $instance;

	/**
	 * Set up the test fixtures.
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Report_Builder();

		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();
	}

	/**
	 * Checks if the report contains a set label.
	 *
	 * @covers ::set_label
	 * @covers ::build
	 */
	public function test_sets_label_correctly() {
		$this->stub_plugin_dir_url();

		$expected = 'someTestString';
		$report   = $this->instance
			->set_label( $expected )
			->build();

		$actual = $report['label'];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Checks if the report contains a set test identifier.
	 *
	 * @covers ::set_test_identifier
	 * @covers ::build
	 */
	public function test_sets_test_identifier_correctly() {
		$this->stub_plugin_dir_url();

		$expected = 'someTestString';
		$report   = $this->instance
			->set_test_identifier( $expected )
			->build();

		$actual = $report['test'];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Checks if the report contains a 'good' status and a blue-colored badge.
	 *
	 * @covers ::set_status_good
	 * @covers ::get_badge
	 * @covers ::get_badge_color
	 * @covers ::build
	 */
	public function test_sets_status_good() {
		$this->stub_plugin_dir_url();

		$expected_status      = 'good';
		$expected_badge_color = 'blue';
		$report               = $this->instance
			->set_status_good()
			->build();

		$actual_status      = $report['status'];
		$actual_badge_color = $report['badge']['color'];

		$this->assertEquals( $expected_status, $actual_status );
		$this->assertEquals( $expected_badge_color, $actual_badge_color );
	}

	/**
	 * Checks if the report contains a 'recommended' status and a red-colored badge.
	 *
	 * @covers ::set_status_recommended
	 * @covers ::get_badge
	 * @covers ::get_badge_color
	 * @covers ::build
	 */
	public function test_sets_status_recommended() {
		$this->stub_plugin_dir_url();

		$expected_status      = 'recommended';
		$expected_badge_color = 'red';
		$report               = $this->instance
			->set_status_recommended()
			->build();

		$actual_status      = $report['status'];
		$actual_badge_color = $report['badge']['color'];

		$this->assertEquals( $expected_status, $actual_status );
		$this->assertEquals( $expected_badge_color, $actual_badge_color );
	}

	/**
	 * Checks if the report contains a 'critical' status and a red-colored badge.
	 *
	 * @covers ::set_status_critical
	 * @covers ::get_badge
	 * @covers ::get_badge_color
	 * @covers ::build
	 */
	public function test_sets_status_critical() {
		$this->stub_plugin_dir_url();

		$expected_status      = 'critical';
		$expected_badge_color = 'red';
		$report               = $this->instance
			->set_status_critical()
			->build();

		$actual_status      = $report['status'];
		$actual_badge_color = $report['badge']['color'];

		$this->assertEquals( $expected_status, $actual_status );
		$this->assertEquals( $expected_badge_color, $actual_badge_color );
	}

	/**
	 * Checks if the report contains a set description.
	 *
	 * @covers ::set_description
	 * @covers ::build
	 */
	public function test_sets_description_correctly() {
		$this->stub_plugin_dir_url();

		$expected = 'someString';
		$report   = $this->instance
			->set_description( $expected )
			->build();

		$actual = $report['description'];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Checks if the report contains the set actions.
	 *
	 * @covers ::set_actions
	 * @covers ::get_actions_with_signature
	 * @covers ::get_signature
	 * @covers ::build
	 */
	public function test_sets_actions_correctly() {
		$this->stub_plugin_dir_url();

		$expected = 'someString';
		$report   = $this->instance
			->set_actions( $expected )
			->build();

		$actual = $report['actions'];

		$this->assertContains( $expected, $actual );
	}

	/**
	 * Checks if the report contains a default badge.
	 *
	 * @covers ::get_badge
	 * @covers ::get_badge_label
	 * @covers ::get_badge_color
	 * @covers ::build
	 */
	public function test_always_has_badge() {
		$this->stub_plugin_dir_url();

		$expected_badge_label = 'SEO';
		$expected_badge_color = 'blue';
		$report               = $this->instance
			->build();

		$actual_badge_label = $report['badge']['label'];
		$actual_badge_color = $report['badge']['color'];

		$this->assertEquals( $expected_badge_label, $actual_badge_label );
		$this->assertEquals( $expected_badge_color, $actual_badge_color );
	}

	/**
	 * Stub the plugin_dir_url() function. The signature generation depends on it.
	 *
	 * @return void
	 */
	private function stub_plugin_dir_url() {
		Monkey\Functions\expect( 'plugin_dir_url' )
			->once()
			->andReturn( '/' );
	}
}
