<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Admin\Estimated_Reading_Time_Conditional;
use Yoast\WP\SEO\Conditionals\Admin\Post_Conditional;
use Yoast\WP\SEO\Integrations\Estimated_Reading_Time;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Test class for testing the estimated reading time integration.
 *
 * @group estimated-reading-time
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Estimated_Reading_Time
 */
final class Estimated_Reading_Time_Test extends TestCase {

	/**
	 * The class to test.
	 *
	 * @var Estimated_Reading_Time
	 */
	protected $instance;

	/**
	 * The estimated reading time conditional mock.
	 *
	 * @var Estimated_Reading_Time_Conditional|Mockery\MockInterface
	 */
	protected $estimated_reading_time_conditional;

	/**
	 * Setup.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->estimated_reading_time_conditional = Mockery::mock( Estimated_Reading_Time_Conditional::class );
		$this->instance                           = new Estimated_Reading_Time( $this->estimated_reading_time_conditional );
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Monkey\Filters\expectAdded( 'wpseo_metabox_entries_general' )
			->with( [ $this->instance, 'filter_estimated_reading_time_field_def' ], 10, 2 );

		$this->instance->register_hooks();
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Post_Conditional::class ],
			Estimated_Reading_Time::get_conditionals(),
		);
	}

	/**
	 * Tests that the field is left in place when the conditional is met.
	 *
	 * @covers ::filter_estimated_reading_time_field_def
	 *
	 * @return void
	 */
	public function test_filter_estimated_reading_time_field_def_keeps_field_when_conditional_is_met() {
		$this->estimated_reading_time_conditional->expects( 'is_met' )->andReturn( true );

		$field_defs = [
			'estimated-reading-time-minutes' => [
				'type'          => 'hidden',
				'default_value' => '',
			],
		];

		$actual = $this->instance->filter_estimated_reading_time_field_def( $field_defs, 'post' );

		$this->assertArrayHasKey( 'estimated-reading-time-minutes', $actual );
	}

	/**
	 * Tests that the field is removed when the conditional is not met.
	 *
	 * @covers ::filter_estimated_reading_time_field_def
	 *
	 * @return void
	 */
	public function test_filter_estimated_reading_time_field_def_removes_field_when_conditional_is_not_met() {
		$this->estimated_reading_time_conditional->expects( 'is_met' )->andReturn( false );

		$field_defs = [
			'estimated-reading-time-minutes' => [
				'type'  => 'hidden',
				'title' => 'estimated-reading-time-minutes',
			],
			'focuskw'                        => [ 'type' => 'hidden' ],
		];

		$actual = $this->instance->filter_estimated_reading_time_field_def( $field_defs, 'post' );

		$this->assertArrayNotHasKey( 'estimated-reading-time-minutes', $actual );
		$this->assertArrayHasKey( 'focuskw', $actual );
	}

	/**
	 * Tests that a non-array input is returned unchanged.
	 *
	 * @covers ::filter_estimated_reading_time_field_def
	 *
	 * @return void
	 */
	public function test_filter_estimated_reading_time_field_def_returns_non_array_unchanged() {
		$actual = $this->instance->filter_estimated_reading_time_field_def( 'not-an-array', 'post' );

		$this->assertEquals( 'not-an-array', $actual );
	}
}
