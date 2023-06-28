<?php

namespace Yoast\WP\SEO\Tests\Unit\Indexables\Application;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Indexables\Application\Cron_Verification_Gate;
use Yoast\WP\SEO\Indexables\Application\Verification_Cron_Schedule_Handler;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * The Verification_Cron_Schedule_Handler_Test class.
 *
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Indexables\Application\Verification_Cron_Schedule_Handler
 */
class Verification_Cron_Schedule_Handler_Test extends TestCase {

	/**
	 * The instance.
	 *
	 * @var Verification_Cron_Schedule_Handler
	 */
	private $instance;

	/**
	 * The cron verification gate.
	 *
	 * @var \Mockery\MockInterface|Cron_Verification_Gate
	 */
	private $cron_verification_gate;

	/**
	 * The setup function.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->cron_verification_gate = Mockery::mock( Cron_Verification_Gate::class );

		$this->instance = new Verification_Cron_Schedule_Handler( $this->cron_verification_gate );
	}

	/**
	 * Tests the schedule_indexable_verification method.
	 *
	 * @covers ::schedule_indexable_verification
	 *
	 * @dataProvider schedule_indexable_verification_provider
	 *
	 * @param bool $should_verify If the indexable verification is enabled.
	 * @param bool $post_scheduled If the cron is scheduled.
	 * @param bool $timestamp_scheduled If the cron is scheduled.
	 * @param int  $time_wp_schedule_event How many times this functions should be called.
	 *
	 * @return void
	 */
	public function test_schedule_indexable_verification(
		$should_verify,
		$post_scheduled,
		$timestamp_scheduled,
		$time_wp_schedule_event
	) {
		$this->cron_verification_gate->expects( 'should_verify_on_cron' )->twice()->andReturn( $should_verify );
		if ( $should_verify ) {
			Monkey\Functions\expect( 'wp_next_scheduled' )
				->once()
				->with( Verification_Cron_Schedule_Handler::INDEXABLE_VERIFY_POST_INDEXABLES_NAME )
				->andReturn( $post_scheduled );

			Monkey\Functions\expect( 'wp_next_scheduled' )
				->once()
				->with( Verification_Cron_Schedule_Handler::INDEXABLE_VERIFY_NON_TIMESTAMPED_INDEXABLES_NAME )
				->andReturn( $timestamp_scheduled );
		}

		Monkey\Functions\expect( 'wp_schedule_event' )
			->times( $time_wp_schedule_event );

		$this->instance->schedule_indexable_verification();
	}

	/**
	 * Data provider for `test_schedule_indexable_verification`
	 *
	 * @return \Generator
	 */
	public function schedule_indexable_verification_provider() {
		yield 'Both crons already scheduled.' => [
			'should_verify'            => true,
			'post_cron_scheduled'      => true,
			'timestamp_cron_scheduled' => true,
			'time_wp_schedule_event'   => 0,
		];
		yield 'Verification turned off.' => [
			'should_verify'            => false,
			'post_cron_scheduled'      => false,
			'timestamp_cron_scheduled' => false,
			'time_wp_schedule_event'   => 0,
		];
		yield 'Post not scheduled timestamp is.' => [
			'should_verify'            => true,
			'post_cron_scheduled'      => false,
			'timestamp_cron_scheduled' => true,
			'time_wp_schedule_event'   => 1,
		];

		yield 'Timestamp not scheduled post is.' => [
			'should_verify'            => true,
			'post_cron_scheduled'      => true,
			'timestamp_cron_scheduled' => false,
			'time_wp_schedule_event'   => 1,
		];

		yield 'Nothing is scheduled yet.' => [
			'should_verify'            => true,
			'post_cron_scheduled'      => true,
			'timestamp_cron_scheduled' => false,
			'time_wp_schedule_event'   => 1,
		];
	}
}
