<?php

namespace Yoast\WP\SEO\Tests\Unit\Expiring_Store\Application;

use Brain\Monkey;
use InvalidArgumentException;
use Mockery;
use Yoast\WP\SEO\Expiring_Store\Application\Expiring_Store;
use Yoast\WP\SEO\Expiring_Store\Application\Ports\Expiring_Store_Repository_Interface;
use Yoast\WP\SEO\Expiring_Store\Domain\Corrupted_Value_Exception;
use Yoast\WP\SEO\Expiring_Store\Domain\Key_Not_Found_Exception;
use Yoast\WP\SEO\Expiring_Store\Domain\No_Current_User_Exception;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Expiring_Store application service.
 *
 * @group expiring-store
 *
 * @coversDefaultClass \Yoast\WP\SEO\Expiring_Store\Application\Expiring_Store
 */
final class Expiring_Store_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Expiring_Store
	 */
	private $instance;

	/**
	 * Holds the repository mock.
	 *
	 * @var Mockery\MockInterface|Expiring_Store_Repository_Interface
	 */
	private $repository;

	/**
	 * Holds the date helper mock.
	 *
	 * @var Mockery\MockInterface|Date_Helper
	 */
	private $date_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->repository  = Mockery::mock( Expiring_Store_Repository_Interface::class );
		$this->date_helper = Mockery::mock( Date_Helper::class );

		$this->instance = new Expiring_Store(
			$this->repository,
			$this->date_helper,
		);
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
			Expiring_Store_Repository_Interface::class,
			$this->getPropertyValue( $this->instance, 'repository' ),
		);
		$this->assertInstanceOf(
			Date_Helper::class,
			$this->getPropertyValue( $this->instance, 'date_helper' ),
		);
	}

	/**
	 * Tests persist with blog scope.
	 *
	 * @covers ::persist
	 * @covers ::do_persist
	 * @covers ::json_encode_value
	 * @covers ::prefix_for_blog
	 *
	 * @return void
	 */
	public function test_persist() {
		Monkey\Functions\expect( 'get_current_blog_id' )
			->once()
			->andReturn( 1 );

		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( 1_000_000 );

		$this->repository
			->expects( 'upsert' )
			->once()
			->with( 'blog_1:my_key', '"my_value"', \gmdate( 'Y-m-d H:i:s', 1_000_300 ) );

		$this->instance->persist( 'my_key', 'my_value', 300 );
	}

	/**
	 * Tests persist with an array value.
	 *
	 * @covers ::persist
	 * @covers ::do_persist
	 * @covers ::json_encode_value
	 *
	 * @return void
	 */
	public function test_persist_array_value() {
		Monkey\Functions\expect( 'get_current_blog_id' )
			->once()
			->andReturn( 1 );

		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( 1_000_000 );

		$this->repository
			->expects( 'upsert' )
			->once()
			->with( 'blog_1:my_key', '{"foo":"bar"}', \gmdate( 'Y-m-d H:i:s', 1_000_060 ) );

		$this->instance->persist( 'my_key', [ 'foo' => 'bar' ], 60 );
	}

	/**
	 * Tests persist_for_user falls back to the current user.
	 *
	 * @covers ::persist_for_user
	 * @covers ::do_persist
	 * @covers ::prefix_for_user
	 *
	 * @return void
	 */
	public function test_persist_for_user_defaults_to_current_user() {
		Monkey\Functions\expect( 'get_current_user_id' )
			->once()
			->andReturn( 42 );

		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( 1_000_000 );

		$this->repository
			->expects( 'upsert' )
			->once()
			->with( 'user_42:token', '"abc"', \gmdate( 'Y-m-d H:i:s', 1_000_300 ) );

		$this->instance->persist_for_user( 'token', 'abc', 300 );
	}

	/**
	 * Tests persist_for_user with an explicit user ID.
	 *
	 * @covers ::persist_for_user
	 * @covers ::do_persist
	 * @covers ::prefix_for_user
	 *
	 * @return void
	 */
	public function test_persist_for_user_with_explicit_user_id() {
		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( 1_000_000 );

		$this->repository
			->expects( 'upsert' )
			->once()
			->with( 'user_99:token', '"abc"', \gmdate( 'Y-m-d H:i:s', 1_000_300 ) );

		$this->instance->persist_for_user( 'token', 'abc', 300, 99 );
	}

	/**
	 * Tests persist_for_user throws when no user ID is given and no user is logged in.
	 *
	 * @covers ::persist_for_user
	 * @covers ::prefix_for_user
	 *
	 * @return void
	 */
	public function test_persist_for_user_throws_without_user() {
		Monkey\Functions\expect( 'get_current_user_id' )
			->once()
			->andReturn( 0 );

		$this->expectException( No_Current_User_Exception::class );

		$this->instance->persist_for_user( 'token', 'abc', 300 );
	}

	/**
	 * Tests persist_for_multisite.
	 *
	 * @covers ::persist_for_multisite
	 * @covers ::do_persist
	 *
	 * @return void
	 */
	public function test_persist_for_multisite() {
		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( 1_000_000 );

		$this->repository
			->expects( 'upsert' )
			->once()
			->with( 'global_lock', 'true', \gmdate( 'Y-m-d H:i:s', 1_000_030 ) );

		$this->instance->persist_for_multisite( 'global_lock', true, 30 );
	}

	/**
	 * Tests persist throws on non-JSON-encodable value.
	 *
	 * @covers ::persist
	 * @covers ::do_persist
	 * @covers ::json_encode_value
	 *
	 * @return void
	 */
	public function test_persist_throws_on_invalid_json() {
		Monkey\Functions\expect( 'get_current_blog_id' )
			->once()
			->andReturn( 1 );

		$this->expectException( InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Expiring_Store: value must be JSON-encodable.' );

		// NAN is not JSON-encodable.
		$this->instance->persist( 'key', \NAN, 60 );
	}

	/**
	 * Tests get with blog scope.
	 *
	 * @covers ::get
	 * @covers ::do_get
	 * @covers ::prefix_for_blog
	 * @covers ::current_datetime
	 *
	 * @return void
	 */
	public function test_get() {
		Monkey\Functions\expect( 'get_current_blog_id' )
			->once()
			->andReturn( 1 );

		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( 1_000_000 );

		$this->repository
			->expects( 'find' )
			->once()
			->with( 'blog_1:my_key', \gmdate( 'Y-m-d H:i:s', 1_000_000 ) )
			->andReturn( '{"foo":"bar"}' );

		$result = $this->instance->get( 'my_key' );

		$this->assertSame( [ 'foo' => 'bar' ], $result );
	}

	/**
	 * Tests get throws when key is not found.
	 *
	 * @covers ::get
	 * @covers ::do_get
	 *
	 * @return void
	 */
	public function test_get_throws_when_not_found() {
		Monkey\Functions\expect( 'get_current_blog_id' )
			->once()
			->andReturn( 1 );

		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( 1_000_000 );

		$this->repository
			->expects( 'find' )
			->once()
			->andReturn( null );

		$this->expectException( Key_Not_Found_Exception::class );

		$this->instance->get( 'missing_key' );
	}

	/**
	 * Tests get throws when stored value is corrupted JSON.
	 *
	 * @covers ::get
	 * @covers ::do_get
	 *
	 * @return void
	 */
	public function test_get_throws_on_corrupted_value() {
		Monkey\Functions\expect( 'get_current_blog_id' )
			->once()
			->andReturn( 1 );

		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( 1_000_000 );

		$this->repository
			->expects( 'find' )
			->once()
			->with( 'blog_1:my_key', \gmdate( 'Y-m-d H:i:s', 1_000_000 ) )
			->andReturn( '{invalid json' );

		$this->expectException( Corrupted_Value_Exception::class );

		$this->instance->get( 'my_key' );
	}

	/**
	 * Tests get_for_user falls back to the current user.
	 *
	 * @covers ::get_for_user
	 * @covers ::do_get
	 * @covers ::prefix_for_user
	 *
	 * @return void
	 */
	public function test_get_for_user_defaults_to_current_user() {
		Monkey\Functions\expect( 'get_current_user_id' )
			->once()
			->andReturn( 42 );

		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( 1_000_000 );

		$this->repository
			->expects( 'find' )
			->once()
			->with( 'user_42:token', \gmdate( 'Y-m-d H:i:s', 1_000_000 ) )
			->andReturn( '"abc"' );

		$result = $this->instance->get_for_user( 'token' );

		$this->assertSame( 'abc', $result );
	}

	/**
	 * Tests get_for_user with an explicit user ID.
	 *
	 * @covers ::get_for_user
	 * @covers ::do_get
	 * @covers ::prefix_for_user
	 *
	 * @return void
	 */
	public function test_get_for_user_with_explicit_user_id() {
		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( 1_000_000 );

		$this->repository
			->expects( 'find' )
			->once()
			->with( 'user_99:token', \gmdate( 'Y-m-d H:i:s', 1_000_000 ) )
			->andReturn( '"abc"' );

		$result = $this->instance->get_for_user( 'token', 99 );

		$this->assertSame( 'abc', $result );
	}

	/**
	 * Tests get_for_user throws when no user ID is given and no user is logged in.
	 *
	 * @covers ::get_for_user
	 * @covers ::prefix_for_user
	 *
	 * @return void
	 */
	public function test_get_for_user_throws_without_user() {
		Monkey\Functions\expect( 'get_current_user_id' )
			->once()
			->andReturn( 0 );

		$this->expectException( No_Current_User_Exception::class );

		$this->instance->get_for_user( 'token' );
	}

	/**
	 * Tests get_for_multisite.
	 *
	 * @covers ::get_for_multisite
	 * @covers ::do_get
	 *
	 * @return void
	 */
	public function test_get_for_multisite() {
		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( 1_000_000 );

		$this->repository
			->expects( 'find' )
			->once()
			->with( 'global_lock', \gmdate( 'Y-m-d H:i:s', 1_000_000 ) )
			->andReturn( 'true' );

		$result = $this->instance->get_for_multisite( 'global_lock' );

		$this->assertTrue( $result );
	}

	/**
	 * Tests delete with blog scope.
	 *
	 * @covers ::delete
	 * @covers ::prefix_for_blog
	 *
	 * @return void
	 */
	public function test_delete() {
		Monkey\Functions\expect( 'get_current_blog_id' )
			->once()
			->andReturn( 1 );

		$this->repository
			->expects( 'delete' )
			->once()
			->with( 'blog_1:my_key' );

		$this->instance->delete( 'my_key' );
	}

	/**
	 * Tests delete_for_user falls back to the current user.
	 *
	 * @covers ::delete_for_user
	 * @covers ::prefix_for_user
	 *
	 * @return void
	 */
	public function test_delete_for_user_defaults_to_current_user() {
		Monkey\Functions\expect( 'get_current_user_id' )
			->once()
			->andReturn( 42 );

		$this->repository
			->expects( 'delete' )
			->once()
			->with( 'user_42:token' );

		$this->instance->delete_for_user( 'token' );
	}

	/**
	 * Tests delete_for_user with an explicit user ID.
	 *
	 * @covers ::delete_for_user
	 * @covers ::prefix_for_user
	 *
	 * @return void
	 */
	public function test_delete_for_user_with_explicit_user_id() {
		$this->repository
			->expects( 'delete' )
			->once()
			->with( 'user_99:token' );

		$this->instance->delete_for_user( 'token', 99 );
	}

	/**
	 * Tests delete_for_user throws when no user ID is given and no user is logged in.
	 *
	 * @covers ::delete_for_user
	 * @covers ::prefix_for_user
	 *
	 * @return void
	 */
	public function test_delete_for_user_throws_without_user() {
		Monkey\Functions\expect( 'get_current_user_id' )
			->once()
			->andReturn( 0 );

		$this->expectException( No_Current_User_Exception::class );

		$this->instance->delete_for_user( 'token' );
	}

	/**
	 * Tests delete_for_multisite.
	 *
	 * @covers ::delete_for_multisite
	 *
	 * @return void
	 */
	public function test_delete_for_multisite() {
		$this->repository
			->expects( 'delete' )
			->once()
			->with( 'global_lock' );

		$this->instance->delete_for_multisite( 'global_lock' );
	}

	/**
	 * Tests persist_if_absent with blog scope.
	 *
	 * @covers ::persist_if_absent
	 * @covers ::do_persist_if_absent
	 * @covers ::json_encode_value
	 * @covers ::prefix_for_blog
	 *
	 * @return void
	 */
	public function test_persist_if_absent() {
		Monkey\Functions\expect( 'get_current_blog_id' )
			->once()
			->andReturn( 1 );

		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( 1_000_000 );

		$this->repository
			->expects( 'insert_if_absent' )
			->once()
			->with( 'blog_1:my_key', '"my_value"', \gmdate( 'Y-m-d H:i:s', 1_000_300 ), \gmdate( 'Y-m-d H:i:s', 1_000_000 ) )
			->andReturn( true );

		$result = $this->instance->persist_if_absent( 'my_key', 'my_value', 300 );

		$this->assertTrue( $result );
	}

	/**
	 * Tests persist_if_absent returns false when key already exists.
	 *
	 * @covers ::persist_if_absent
	 * @covers ::do_persist_if_absent
	 *
	 * @return void
	 */
	public function test_persist_if_absent_returns_false_when_key_exists() {
		Monkey\Functions\expect( 'get_current_blog_id' )
			->once()
			->andReturn( 1 );

		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( 1_000_000 );

		$this->repository
			->expects( 'insert_if_absent' )
			->once()
			->andReturn( false );

		$result = $this->instance->persist_if_absent( 'my_key', 'my_value', 300 );

		$this->assertFalse( $result );
	}

	/**
	 * Tests persist_if_absent_for_user falls back to the current user.
	 *
	 * @covers ::persist_if_absent_for_user
	 * @covers ::do_persist_if_absent
	 * @covers ::prefix_for_user
	 *
	 * @return void
	 */
	public function test_persist_if_absent_for_user_defaults_to_current_user() {
		Monkey\Functions\expect( 'get_current_user_id' )
			->once()
			->andReturn( 42 );

		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( 1_000_000 );

		$this->repository
			->expects( 'insert_if_absent' )
			->once()
			->with( 'user_42:token', '"abc"', \gmdate( 'Y-m-d H:i:s', 1_000_300 ), \gmdate( 'Y-m-d H:i:s', 1_000_000 ) )
			->andReturn( true );

		$result = $this->instance->persist_if_absent_for_user( 'token', 'abc', 300 );

		$this->assertTrue( $result );
	}

	/**
	 * Tests persist_if_absent_for_user with an explicit user ID.
	 *
	 * @covers ::persist_if_absent_for_user
	 * @covers ::do_persist_if_absent
	 * @covers ::prefix_for_user
	 *
	 * @return void
	 */
	public function test_persist_if_absent_for_user_with_explicit_user_id() {
		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( 1_000_000 );

		$this->repository
			->expects( 'insert_if_absent' )
			->once()
			->with( 'user_99:token', '"abc"', \gmdate( 'Y-m-d H:i:s', 1_000_300 ), \gmdate( 'Y-m-d H:i:s', 1_000_000 ) )
			->andReturn( true );

		$result = $this->instance->persist_if_absent_for_user( 'token', 'abc', 300, 99 );

		$this->assertTrue( $result );
	}

	/**
	 * Tests persist_if_absent_for_user throws when no user ID is given and no user is logged in.
	 *
	 * @covers ::persist_if_absent_for_user
	 * @covers ::prefix_for_user
	 *
	 * @return void
	 */
	public function test_persist_if_absent_for_user_throws_without_user() {
		Monkey\Functions\expect( 'get_current_user_id' )
			->once()
			->andReturn( 0 );

		$this->expectException( No_Current_User_Exception::class );

		$this->instance->persist_if_absent_for_user( 'token', 'abc', 300 );
	}

	/**
	 * Tests persist_if_absent_for_multisite.
	 *
	 * @covers ::persist_if_absent_for_multisite
	 * @covers ::do_persist_if_absent
	 *
	 * @return void
	 */
	public function test_persist_if_absent_for_multisite() {
		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( 1_000_000 );

		$this->repository
			->expects( 'insert_if_absent' )
			->once()
			->with( 'global_lock', 'true', \gmdate( 'Y-m-d H:i:s', 1_000_030 ), \gmdate( 'Y-m-d H:i:s', 1_000_000 ) )
			->andReturn( true );

		$result = $this->instance->persist_if_absent_for_multisite( 'global_lock', true, 30 );

		$this->assertTrue( $result );
	}

	/**
	 * Tests persist_if_absent throws on non-JSON-encodable value.
	 *
	 * @covers ::persist_if_absent
	 * @covers ::do_persist_if_absent
	 * @covers ::json_encode_value
	 *
	 * @return void
	 */
	public function test_persist_if_absent_throws_on_invalid_json() {
		Monkey\Functions\expect( 'get_current_blog_id' )
			->once()
			->andReturn( 1 );

		$this->expectException( InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Expiring_Store: value must be JSON-encodable.' );

		// NAN is not JSON-encodable.
		$this->instance->persist_if_absent( 'key', \NAN, 60 );
	}

	/**
	 * Tests has with blog scope when key exists.
	 *
	 * @covers ::has
	 * @covers ::do_has
	 * @covers ::prefix_for_blog
	 *
	 * @return void
	 */
	public function test_has_returns_true_when_key_exists() {
		Monkey\Functions\expect( 'get_current_blog_id' )
			->once()
			->andReturn( 1 );

		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( 1_000_000 );

		$this->repository
			->expects( 'find' )
			->once()
			->with( 'blog_1:my_key', \gmdate( 'Y-m-d H:i:s', 1_000_000 ) )
			->andReturn( '"some_value"' );

		$this->assertTrue( $this->instance->has( 'my_key' ) );
	}

	/**
	 * Tests has with blog scope when key does not exist.
	 *
	 * @covers ::has
	 * @covers ::do_has
	 *
	 * @return void
	 */
	public function test_has_returns_false_when_key_missing() {
		Monkey\Functions\expect( 'get_current_blog_id' )
			->once()
			->andReturn( 1 );

		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( 1_000_000 );

		$this->repository
			->expects( 'find' )
			->once()
			->andReturn( null );

		$this->assertFalse( $this->instance->has( 'my_key' ) );
	}

	/**
	 * Tests has_for_user with an explicit user ID.
	 *
	 * @covers ::has_for_user
	 * @covers ::do_has
	 * @covers ::prefix_for_user
	 *
	 * @return void
	 */
	public function test_has_for_user() {
		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( 1_000_000 );

		$this->repository
			->expects( 'find' )
			->once()
			->with( 'user_42:token', \gmdate( 'Y-m-d H:i:s', 1_000_000 ) )
			->andReturn( '"abc"' );

		$this->assertTrue( $this->instance->has_for_user( 'token', 42 ) );
	}

	/**
	 * Tests has_for_user returns false when key does not exist.
	 *
	 * @covers ::has_for_user
	 * @covers ::do_has
	 *
	 * @return void
	 */
	public function test_has_for_user_returns_false_when_missing() {
		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( 1_000_000 );

		$this->repository
			->expects( 'find' )
			->once()
			->with( 'user_42:token', \gmdate( 'Y-m-d H:i:s', 1_000_000 ) )
			->andReturn( null );

		$this->assertFalse( $this->instance->has_for_user( 'token', 42 ) );
	}

	/**
	 * Tests has_for_multisite.
	 *
	 * @covers ::has_for_multisite
	 * @covers ::do_has
	 *
	 * @return void
	 */
	public function test_has_for_multisite() {
		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( 1_000_000 );

		$this->repository
			->expects( 'find' )
			->once()
			->with( 'global_lock', \gmdate( 'Y-m-d H:i:s', 1_000_000 ) )
			->andReturn( 'true' );

		$this->assertTrue( $this->instance->has_for_multisite( 'global_lock' ) );
	}

	/**
	 * Tests has_for_multisite returns false when key does not exist.
	 *
	 * @covers ::has_for_multisite
	 * @covers ::do_has
	 *
	 * @return void
	 */
	public function test_has_for_multisite_returns_false_when_missing() {
		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( 1_000_000 );

		$this->repository
			->expects( 'find' )
			->once()
			->with( 'global_lock', \gmdate( 'Y-m-d H:i:s', 1_000_000 ) )
			->andReturn( null );

		$this->assertFalse( $this->instance->has_for_multisite( 'global_lock' ) );
	}

	/**
	 * Tests cleanup_expired.
	 *
	 * @covers ::cleanup_expired
	 * @covers ::current_datetime
	 *
	 * @return void
	 */
	public function test_cleanup_expired() {
		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( 1_000_000 );

		$this->repository
			->expects( 'delete_expired' )
			->once()
			->with( \gmdate( 'Y-m-d H:i:s', 1_000_000 ) )
			->andReturn( 5 );

		$result = $this->instance->cleanup_expired();

		$this->assertSame( 5, $result );
	}
}
