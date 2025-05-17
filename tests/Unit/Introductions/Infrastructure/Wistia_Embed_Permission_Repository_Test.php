<?php

namespace Yoast\WP\SEO\Tests\Unit\Introductions\Infrastructure;

use Exception;
use Mockery;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Introductions\Infrastructure\Wistia_Embed_Permission_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Wistia embed permission repository.
 *
 * @group introductions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Introductions\Infrastructure\Wistia_Embed_Permission_Repository
 */
final class Wistia_Embed_Permission_Repository_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Wistia_Embed_Permission_Repository
	 */
	private $instance;

	/**
	 * Holds the user helper.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	private $user_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->user_helper = Mockery::mock( User_Helper::class );

		$this->instance = new Wistia_Embed_Permission_Repository( $this->user_helper );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			User_Helper::class,
			$this->getPropertyValue( $this->instance, 'user_helper' )
		);
	}

	/**
	 * Tests the value retrieval.
	 *
	 * @covers ::get_value_for_user
	 *
	 * @dataProvider provide_get_value_for_user_test_data
	 *
	 * @param mixed $meta     Value `get_meta` returns.
	 * @param bool  $expected The expected value.
	 *
	 * @return void
	 *
	 * @throws Exception Invalid User ID.
	 */
	public function test_get_value_for_user( $meta, $expected ) {
		$user_id = 1;
		$this->user_helper->expects( 'get_meta' )
			->once()
			->with( $user_id, Wistia_Embed_Permission_Repository::USER_META_KEY, true )
			->andReturn( $meta );

		$this->assertSame( $expected, $this->instance->get_value_for_user( $user_id ) );
	}

	/**
	 * Provides data for the `test_get_value_for_user()` test.
	 *
	 * @return array
	 */
	public static function provide_get_value_for_user_test_data() {
		return [
			'stored string 1'    => [
				'meta'     => '1',
				'expected' => true,
			],
			'stored string 0'    => [
				'meta'     => '0',
				'expected' => false,
			],
			'random other value' => [
				'meta'     => 'foo',
				'expected' => Wistia_Embed_Permission_Repository::DEFAULT_VALUE,
			],
		];
	}

	/**
	 * Tests the value retrieval for an invalid user ID.
	 *
	 * @covers ::get_value_for_user
	 *
	 * @return void
	 *
	 * @throws Exception Invalid User ID.
	 */
	public function test_get_value_for_invalid_user_id() {
		$user_id = 1;
		$this->user_helper->expects( 'get_meta' )
			->once()
			->with( $user_id, Wistia_Embed_Permission_Repository::USER_META_KEY, true )
			->andReturn( false );

		$this->expectErrorMessage( 'Invalid User ID' );

		$this->instance->get_value_for_user( $user_id );
	}

	/**
	 * Tests the value updating.
	 *
	 * @covers ::set_value_for_user
	 *
	 * @dataProvider provide_set_value_for_user_test_data
	 *
	 * @param bool     $input_value     The input value.
	 * @param string   $value_as_string The value as a string. Testing the logic there.
	 * @param bool|int $update_return   The return value for the update_meta call.
	 * @param bool     $expected        The expected return value.
	 *
	 * @return void
	 *
	 * @throws Exception Invalid User ID.
	 */
	public function test_set_value_for_user( $input_value, $value_as_string, $update_return, $expected ) {
		$user_id = 1;
		$this->user_helper->expects( 'update_meta' )
			->once()
			->with( $user_id, Wistia_Embed_Permission_Repository::USER_META_KEY, $value_as_string )
			->andReturn( $update_return );

		$this->assertSame( $expected, $this->instance->set_value_for_user( $user_id, $input_value ) );
	}

	/**
	 * Provides data for the `test_set_value_for_user()` test.
	 *
	 * @return array
	 */
	public static function provide_set_value_for_user_test_data() {
		return [
			'true with new entry'          => [
				'input_value'     => true,
				'value_as_string' => '1',
				'update_return'   => true,
				'expected'        => true,
			],
			'false with new entry'         => [
				'input_value'     => false,
				'value_as_string' => '0',
				'update_return'   => true,
				'expected'        => true,
			],
			'true with successful update'  => [
				'input_value'     => true,
				'value_as_string' => '1',
				'update_return'   => 42,
				'expected'        => true,
			],
			'false with successful update' => [
				'input_value'     => false,
				'value_as_string' => '0',
				'update_return'   => 11,
				'expected'        => true,
			],
			'true with failure to update'  => [
				'input_value'     => true,
				'value_as_string' => '1',
				'update_return'   => false,
				'expected'        => false,
			],
			'false with failure to update' => [
				'input_value'     => false,
				'value_as_string' => '0',
				'update_return'   => false,
				'expected'        => false,
			],
			'true with update'             => [
				'input_value'     => true,
				'value_as_string' => '1',
				'update_return'   => 42,
				'expected'        => true,
			],
		];
	}
}
