<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authorization\Infrastructure\Refresh_Token_User_Meta_Repository;

use RuntimeException;

/**
 * Tests the Refresh_Token_User_Meta_Repository get_token.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI\Authorization\Infrastructure\Refresh_Token_User_Meta_Repository::get_token
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
	 * @param mixed $meta The value returned by get_meta.
	 *
	 * @return void
	 */
	public function test_get_token_no_token( $meta ) {
		$this->user_helper
			->expects( 'get_meta' )
			->once()
			->with( self::USER_ID, '_yoast_wpseo_ai_generator_refresh_jwt', true )
			->andReturn( $meta );

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
				'meta' => false,
			],
			'meta value is null' => [
				'meta' => null,
			],
			'meta value is empty string' => [
				'meta' => '',
			],
			'meta value is not string' => [
				'meta' => 123,
			],
			'meta value is array' => [
				'meta' => [ 'token' => 'value' ],
			],
		];
	}
}
