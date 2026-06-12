<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Admin\Estimated_Reading_Time_Conditional;
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
	 * Setup.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Estimated_Reading_Time();
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Monkey\Filters\expectAdded( 'add_extra_wpseo_meta_fields' )
			->with( [ $this->instance, 'add_estimated_reading_time_hidden_fields' ] );

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
			[ Estimated_Reading_Time_Conditional::class ],
			Estimated_Reading_Time::get_conditionals(),
		);
	}

	/**
	 * Tests the adding of the hidden fields.
	 *
	 * @covers ::add_estimated_reading_time_hidden_fields
	 *
	 * @return void
	 */
	public function test_add_estimated_reading_time_hidden_fields() {
		$actual = $this->instance->add_estimated_reading_time_hidden_fields( [] );

		$this->assertIsArray( $actual );
		$this->assertArrayHasKey( 'general', $actual );
		$this->assertArrayHasKey( 'estimated-reading-time-minutes', $actual['general'] );
		$this->assertEquals(
			[
				'type'  => 'hidden',
				'title' => 'estimated-reading-time-minutes',
			],
			$actual['general']['estimated-reading-time-minutes'],
		);
	}

	/**
	 * Tests that a non-array input is treated as an empty array.
	 *
	 * @covers ::add_estimated_reading_time_hidden_fields
	 *
	 * @return void
	 */
	public function test_add_estimated_reading_time_hidden_fields_when_not_array() {
		$actual = $this->instance->add_estimated_reading_time_hidden_fields( 'not-an-array' );

		$this->assertIsArray( $actual );
		$this->assertArrayHasKey( 'general', $actual );
		$this->assertArrayHasKey( 'estimated-reading-time-minutes', $actual['general'] );
	}
}
