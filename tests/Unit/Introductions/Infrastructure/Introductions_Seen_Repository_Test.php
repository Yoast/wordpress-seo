<?php

namespace Yoast\WP\SEO\Tests\Unit\Introductions\Infrastructure;

use Mockery;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Introductions\Domain\Invalid_User_Id_Exception;
use Yoast\WP\SEO\Introductions\Infrastructure\Introductions_Seen_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the introductions seen repository.
 *
 * @group introductions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Introductions\Infrastructure\Introductions_Seen_Repository
 */
final class Introductions_Seen_Repository_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Introductions_Seen_Repository
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

		$this->instance = new Introductions_Seen_Repository( $this->user_helper );
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
	 * Tests the introductions retrieval.
	 *
	 * @covers ::get_all_introductions
	 *
	 * @dataProvider provide_get_all_introductions_test_data
	 *
	 * @param mixed $meta     Value `get_meta` returns.
	 * @param bool  $expected The expected value.
	 *
	 * @return void
	 *
	 * @throws Invalid_User_Id_Exception Invalid User ID.
	 */
	public function test_get_all_introductions( $meta, $expected ) {
		$user_id = 1;
		$this->user_helper->expects( 'get_meta' )
			->once()
			->with( $user_id, Introductions_Seen_Repository::USER_META_KEY, true )
			->andReturn( $meta );

		$this->assertEquals( $expected, $this->instance->get_all_introductions( $user_id ) );
	}

	/**
	 * Provides data for `test_get_all_introductions()`.
	 *
	 * @return array
	 */
	public static function provide_get_all_introductions_test_data() {
		return [
			'nothing stored'    => [
				'meta'     => '',
				'expected' => Introductions_Seen_Repository::DEFAULT_VALUE,
			],
			'introduction seen' => [
				'meta'     => [ 'foo' => true ],
				'expected' => [ 'foo' => true ],
			],
			'string'            => [
				'meta'     => 'foo',
				'expected' => Introductions_Seen_Repository::DEFAULT_VALUE,
			],
		];
	}

	/**
	 * Tests the introductions retrieval with an invalid user ID.
	 *
	 * @covers ::get_all_introductions
	 *
	 * @return void
	 *
	 * @throws Invalid_User_Id_Exception Invalid User ID.
	 */
	public function test_get_all_introductions_with_invalid_user_id() {
		$user_id = 1;
		$this->user_helper->expects( 'get_meta' )
			->once()
			->with( $user_id, Introductions_Seen_Repository::USER_META_KEY, true )
			->andReturn( false );

		$this->expectException( Invalid_User_Id_Exception::class );

		$this->instance->get_all_introductions( $user_id );
	}

	/**
	 * Tests setting the introductions calls update_meta().
	 *
	 * @covers ::set_all_introductions
	 *
	 * @return void
	 */
	public function test_set_all_introductions() {
		$user_id       = 1;
		$introductions = [ 'foo' => true ];
		$this->user_helper->expects( 'update_meta' )
			->once()
			->with( $user_id, Introductions_Seen_Repository::USER_META_KEY, $introductions )
			->andReturnTrue();

		$this->instance->set_all_introductions( $user_id, $introductions );
	}

	/**
	 * Tests the introduction is seen logic.
	 *
	 * @covers ::is_introduction_seen
	 *
	 * @dataProvider provide_is_introduction_seen_test_data
	 *
	 * @param string $introduction_id The introduction ID.
	 * @param mixed  $meta            The get_meta return value.
	 * @param bool   $expected        The expected result.
	 *
	 * @return void
	 *
	 * @throws Invalid_User_Id_Exception Invalid User ID.
	 */
	public function test_is_introduction_seen( $introduction_id, $meta, $expected ) {
		$user_id = 1;
		$this->user_helper->expects( 'get_meta' )
			->once()
			->with( $user_id, Introductions_Seen_Repository::USER_META_KEY, true )
			->andReturn( $meta );

		$this->assertSame( $expected, $this->instance->is_introduction_seen( $user_id, $introduction_id ) );
	}

	/**
	 * Provides data for `test_is_introduction_seen()`.
	 *
	 * @return array
	 */
	public static function provide_is_introduction_seen_test_data() {
		return [
			'seen'             => [
				'introduction_id' => 'foo',
				'meta'            => [ 'foo' => true ],
				'expected'        => true,
			],
			'not seen'         => [
				'introduction_id' => 'foo',
				'meta'            => [ 'foo' => false ],
				'expected'        => false,
			],
			'not present'      => [
				'introduction_id' => 'foo',
				'meta'            => [],
				'expected'        => false,
			],
			'type juggle: 1'   => [
				'introduction_id' => 'foo',
				'meta'            => [ 'foo' => 1 ],
				'expected'        => true,
			],
			'type juggle: 0'   => [
				'introduction_id' => 'foo',
				'meta'            => [ 'foo' => 0 ],
				'expected'        => false,
			],
			'type juggle: "1"' => [
				'introduction_id' => 'foo',
				'meta'            => [ 'foo' => '1' ],
				'expected'        => true,
			],
			'type juggle: "0"' => [
				'introduction_id' => 'foo',
				'meta'            => [ 'foo' => 0 ],
				'expected'        => false,
			],
		];
	}

	/**
	 * Tests setting the introduction.
	 *
	 * @covers ::set_introduction
	 *
	 * @dataProvider provide_set_introduction_test_data
	 *
	 * @param string $introduction_id The introduction ID.
	 * @param bool   $is_seen         Whether the introduction is seen.
	 * @param mixed  $meta            The get_meta return value.
	 * @param array  $expected_meta   The expected meta.
	 *
	 * @return void
	 *
	 * @throws Invalid_User_Id_Exception Invalid User ID.
	 */
	public function test_set_introduction( $introduction_id, $is_seen, $meta, $expected_meta ) {
		$user_id = 1;
		$this->user_helper->expects( 'get_meta' )
			->once()
			->with( $user_id, Introductions_Seen_Repository::USER_META_KEY, true )
			->andReturn( $meta );
		$this->user_helper->expects( 'update_meta' )
			->times( ( $meta === $expected_meta ) ? 0 : 1 )
			->with( $user_id, Introductions_Seen_Repository::USER_META_KEY, $expected_meta )
			->andReturnTrue();

		$this->instance->set_introduction( $user_id, $introduction_id, $is_seen, $meta );
	}

	/**
	 * Provides data for `test_set_introduction()`.
	 *
	 * @return array
	 */
	public static function provide_set_introduction_test_data() {
		return [
			'seen'      => [
				'introduction_id' => 'foo',
				'is_seen'         => true,
				'meta'            => [],
				'expected_meta'   => [ 'foo' => true ],
			],
			'not seen'  => [
				'introduction_id' => 'foo',
				'is_seen'         => false,
				'meta'            => [],
				'expected_meta'   => [ 'foo' => false ],
			],
			'no change' => [
				'introduction_id' => 'foo',
				'is_seen'         => true,
				'meta'            => [ 'foo' => true ],
				'expected_meta'   => [ 'foo' => true ],
			],
		];
	}
}
