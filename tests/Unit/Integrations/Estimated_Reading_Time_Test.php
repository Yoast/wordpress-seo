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
	protected $conditional;

	/**
	 * The field definitions.
	 *
	 * @var array<string, array<string, string|int|string[]>>
	 */
	protected $field_defs;

	/**
	 * Setup.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->conditional = Mockery::mock( Estimated_Reading_Time_Conditional::class );
		$this->instance    = new Estimated_Reading_Time( $this->conditional );
		$this->field_defs  = [
			'estimated-reading-time-minutes' => [
				'type'  => 'hidden',
				'title' => 'estimated-reading-time-minutes',
			],
			'other-field' => [
				'type' => 'hidden',
			],
		];
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
			->with( [ $this->instance, 'remove_estimated_reading_time_hidden_fields' ] );

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
	 * Tests the unchanged hidden fields when the conditional is met.
	 *
	 * @covers ::remove_estimated_reading_time_hidden_fields
	 *
	 * @return void
	 */
	public function test_remove_estimated_reading_time_hidden_fields_when_conditional_is_met() {
		$this->conditional->expects( 'is_met' )->once()->andReturn( true );

		$actual = $this->instance->remove_estimated_reading_time_hidden_fields( $this->field_defs );

		$this->assertIsArray( $actual );
		$this->assertArrayHasKey( 'estimated-reading-time-minutes', $actual );
		$this->assertEquals(
			[
				'type'  => 'hidden',
				'title' => 'estimated-reading-time-minutes',
			],
			$actual['estimated-reading-time-minutes'],
		);
	}

	/**
	 * Tests the removal of the hidden field when the conditional is not met.
	 *
	 * @covers ::remove_estimated_reading_time_hidden_fields
	 *
	 * @return void
	 */
	public function test_remove_estimated_reading_time_hidden_fields_when_conditional_is_not_met() {
		$this->conditional->expects( 'is_met' )->once()->andReturn( false );

		$actual = $this->instance->remove_estimated_reading_time_hidden_fields( $this->field_defs );

		$this->assertIsArray( $actual );
		$this->assertArrayNotHasKey( 'estimated-reading-time-minutes', $actual );
		$this->assertArrayHasKey( 'other-field', $actual );
	}

	/**
	 * Tests only modifying when the fields value is an array.
	 *
	 * @covers ::remove_estimated_reading_time_hidden_fields
	 *
	 * @return void
	 */
	public function test_add_estimated_reading_time_hidden_fields_only_when_array() {
		$actual = $this->instance->remove_estimated_reading_time_hidden_fields( 'not-an-array' );

		$this->assertSame( 'not-an-array', $actual );
	}
}
