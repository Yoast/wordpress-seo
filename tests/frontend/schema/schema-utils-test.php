<?php

namespace Yoast\WP\SEO\Tests\Frontend\Schema;

use Brain\Monkey;
use Mockery;
use WPSEO_Schema_Utils;
use WPSEO_Schema_Context;
use WPSEO_Schema_IDs;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 */
class Schema_Utils_Test extends TestCase {

	/**
	 * The schema context object.
	 *
	 * @var \WPSEO_Schema_Context
	 */
	private $context;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->context           = Mockery::mock( WPSEO_Schema_Context::class )->makePartial();
		$this->context->site_url = 'https://example.com/';
	}

	/**
	 * Tests that the user schema id is as expected.
	 *
	 * @covers \WPSEO_Schema_Utils::get_user_schema_id
	 */
	public function test_get_user_schema_id() {
		$user_id    = 1;
		$user_login = 'user_login';
		$user_hash  = 'user_hash';

		Monkey\Functions\expect( 'get_userdata' )
			->once()
			->with( $user_id )
			->andReturn( (object) [ 'user_login' => $user_login ] );

		Monkey\Functions\expect( 'wp_hash' )
			->once()
			->andReturn( $user_hash );

		$this->assertEquals(
			$this->context->site_url . WPSEO_Schema_IDs::PERSON_HASH . $user_hash,
			WPSEO_Schema_Utils::get_user_schema_id( $user_id, $this->context )
		);
	}
}
