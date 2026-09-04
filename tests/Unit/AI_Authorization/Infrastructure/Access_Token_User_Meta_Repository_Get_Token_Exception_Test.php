<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Infrastructure;

use Generator;
use RuntimeException;

/**
 * Tests the `get_token` method of the Access_Token_User_Meta_Repository class.
 *
 * @group ai-authorization
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI_Authorization\Infrastructure\Access_Token_User_Meta_Repository
 */
final class Access_Token_User_Meta_Repository_Get_Token_Exception_Test extends Abstract_Access_Token_User_Meta_Repository_Test {

	/**
	 * Tests the `get_token` method.
	 *
	 * @covers ::get_token
	 * @dataProvider provide_get_token_exception
	 *
	 * @param mixed $return_value The return value for the transient.
	 *
	 * @return void
	 */
	public function test_get_token_exception( $return_value ) {
		$this->user_helper
			->expects( 'get_meta' )
			->with( 1, '_yoast_wpseo_ai_generator_access_jwt', true )
			->andReturn( $return_value );

		$this->expectException( RuntimeException::class );
		$this->instance->get_token( 1 );
	}

	/**
	 * The data provider for the `test_get_code_verifier_exception`.
	 *
	 * @return Generator
	 */
	public static function provide_get_token_exception(): Generator {

		yield 'number' => [
			'return_value' => 1234,
		];

		yield 'boolean true' => [
			'return_value' => true,
		];

		yield 'boolean false' => [
			'return_value' => false,
		];

		yield 'empty string' => [
			'return_value' => '',
		];

		yield 'Object' => [
			'return_value' => (object) [ 'something' => 'else' ],
		];

		yield 'empty token' => [
			'return_value' => [
				'code'       => '',
				'created_at' => 1999999999,
			],
		];
	}
}
