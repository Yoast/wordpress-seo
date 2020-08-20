<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers\Schema;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @group helpers
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Schema\ID_Helper
 */
class ID_Helper_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Mockery\Mock|ID_Helper
	 */
	private $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = Mockery::mock( ID_Helper::class )->makePartial();
	}

	/**
	 * Tests retrieval of the user schema, the happy path.
	 *
	 * @covers ::get_user_schema_id
	 */
	public function test_get_user_schema_id() {
		$user             = Mockery::mock( 'WP_User' );
		$user->user_login = 'dingdong';

		$context           = Mockery::mock();
		$context->site_url = 'https://example.org/';

		Monkey\Functions\expect( 'get_userdata' )
			->once()
			->with( 1337 )
			->andReturn( $user );

		Monkey\Functions\expect( 'wp_hash' )
			->once()
			->with( 'dingdong1337' )
			->andReturn( '1234567890' );

		$this->assertEquals(
			'https://example.org/#/schema/person/1234567890',
			$this->instance->get_user_schema_id( 1337, $context )
		);
	}

	/**
	 * Tests retrieval of the user schema where the user is not found.
	 *
	 * @covers ::get_user_schema_id
	 */
	public function test_get_user_schema_id_no_user_found() {
		$context           = Mockery::mock();
		$context->site_url = 'https://example.org/';

		Monkey\Functions\expect( 'get_userdata' )
			->once()
			->with( 1337 )
			->andReturn( false );

		$this->assertEquals(
			'',
			$this->instance->get_user_schema_id( 1337, $context )
		);
	}
}
