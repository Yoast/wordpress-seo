<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Mockery;
use RuntimeException;
use Yoast\WP\SEO\Exceptions\Locking\Lock_Timeout_Exception;
use Yoast\WP\SEO\Expiring_Store\Application\Expiring_Store;
use Yoast\WP\SEO\Helpers\Lock_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Lock_Helper.
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Lock_Helper
 */
final class Lock_Helper_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Lock_Helper
	 */
	private $instance;

	/**
	 * Holds the expiring store mock.
	 *
	 * @var Mockery\MockInterface|Expiring_Store
	 */
	private $store;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->store = Mockery::mock( Expiring_Store::class );

		$this->instance = new Lock_Helper( $this->store );
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Expiring_Store::class,
			$this->getPropertyValue( $this->instance, 'store' ),
		);
	}

	/**
	 * Tests that execute acquires the lock and runs the callback.
	 *
	 * @covers ::execute
	 * @covers ::acquire
	 *
	 * @return void
	 */
	public function test_execute_acquires_lock_and_runs_callback() {
		$this->store
			->expects( 'persist_if_absent_for_multisite' )
			->once()
			->with( 'my_lock', true, 30 )
			->andReturn( true );

		$this->store
			->expects( 'delete_for_multisite' )
			->once()
			->with( 'my_lock' );

		$called = false;

		$this->instance->execute(
			'my_lock',
			static function () use ( &$called ) {
				$called = true;
			},
		);

		$this->assertTrue( $called );
	}

	/**
	 * Tests that execute returns the callback's return value.
	 *
	 * @covers ::execute
	 * @covers ::acquire
	 *
	 * @return void
	 */
	public function test_execute_returns_callback_result() {
		$this->store
			->expects( 'persist_if_absent_for_multisite' )
			->once()
			->andReturn( true );

		$this->store
			->expects( 'delete_for_multisite' )
			->once();

		$result = $this->instance->execute(
			'my_lock',
			static function () {
				return 'result_value';
			},
		);

		$this->assertSame( 'result_value', $result );
	}

	/**
	 * Tests that execute retries when the lock is initially held by another process.
	 *
	 * @covers ::execute
	 * @covers ::acquire
	 *
	 * @return void
	 */
	public function test_execute_retries_on_contention() {
		$this->store
			->expects( 'persist_if_absent_for_multisite' )
			->times( 3 )
			->andReturn( false, false, true );

		$this->store
			->expects( 'delete_for_multisite' )
			->once()
			->with( 'my_lock' );

		$called = false;

		$this->instance->execute(
			'my_lock',
			static function () use ( &$called ) {
				$called = true;
			},
			30,
			5,
			0,
		);

		$this->assertTrue( $called );
	}

	/**
	 * Tests that execute releases the lock even when the callback throws.
	 *
	 * @covers ::execute
	 * @covers ::acquire
	 *
	 * @return void
	 */
	public function test_execute_releases_lock_on_exception() {
		$this->store
			->expects( 'persist_if_absent_for_multisite' )
			->once()
			->andReturn( true );

		$this->store
			->expects( 'delete_for_multisite' )
			->once()
			->with( 'my_lock' );

		$this->expectException( RuntimeException::class );
		$this->expectExceptionMessage( 'callback failed' );

		$this->instance->execute(
			'my_lock',
			static function () {
				throw new RuntimeException( 'callback failed' );
			},
		);
	}

	/**
	 * Tests that execute throws Lock_Timeout_Exception after max attempts.
	 *
	 * @covers ::execute
	 * @covers ::acquire
	 *
	 * @return void
	 */
	public function test_execute_throws_lock_timeout_after_max_attempts() {
		$this->store
			->expects( 'persist_if_absent_for_multisite' )
			->times( 3 )
			->andReturn( false );

		$this->store
			->expects( 'delete_for_multisite' )
			->never();

		$this->expectException( Lock_Timeout_Exception::class );
		$this->expectExceptionMessage( "Failed to acquire lock 'my_lock' after 3 attempts." );

		$this->instance->execute(
			'my_lock',
			static function () {
				return 'should not run';
			},
			30,
			3,
			0,
		);
	}
}
