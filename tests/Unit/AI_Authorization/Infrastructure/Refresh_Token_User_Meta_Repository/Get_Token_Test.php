<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Infrastructure\Refresh_Token_User_Meta_Repository;

use RuntimeException;

/**
 * Tests the Refresh_Token_User_Meta_Repository get_token.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI_Authorization\Infrastructure\Refresh_Token_User_Meta_Repository::get_token
 */
final class Get_Token_Test extends Abstract_Refresh_Token_User_Meta_Repository_Test {

	/**
	 * The constant for user id.
	 */
	private const USER_ID = 123;

	/**
	 * Tests the get_token method with success.
	 *
	 * @return void
	 */
	public function test_get_token_success() {
		$token = 'example_refresh_token_jwt';

		$this->user_helper
			->expects( 'get_meta' )
			->once()
			->with( self::USER_ID, '_yoast_wpseo_ai_generator_refresh_jwt', true )
			->andReturn( $token );

		$result = $this->instance->get_token( self::USER_ID );

		$this->assertSame( $token, $result );
	}

	/**
	 * Tests the get_token method when no token is found.
	 *
	 * @dataProvider data_provider_get_token_no_token
	 *
	 * @param mixed $meta_value The value returned by get_meta.
	 *
	 * @return void
	 */
	public function test_get_token_no_token( $meta_value ) {
		$this->user_helper
			->expects( 'get_meta' )
			->once()
			->with( self::USER_ID, '_yoast_wpseo_ai_generator_refresh_jwt', true )
			->andReturn( $meta_value );

		$this->expectException( RuntimeException::class );
		$this->expectExceptionMessage( 'Unable to retrieve the refresh token.' );
		$this->instance->get_token( self::USER_ID );
	}

	/**
	 * Data provider for the test test_get_token_no_token.
	 *
	 * @return array<mixed>
	 */
	public function data_provider_get_token_no_token(): array {
		return [
			'meta value is false' => [
				'meta_value' => false,
			],
			'meta value is null' => [
				'meta_value' => null,
			],
			'meta value is empty string' => [
				'meta_value' => '',
			],
			'meta value is not string' => [
				'meta_value' => 123,
			],
			'meta value is array' => [
				'meta_value' => [ 'token' => 'value' ],
			],
		];
	}
}
