<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Infrastructure\Refresh_Token_User_Meta_Repository;

/**
 * Tests the Refresh_Token_User_Meta_Repository store_token.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI_Authorization\Infrastructure\Refresh_Token_User_Meta_Repository::store_token
 */
final class Store_Token_Test extends Abstract_Refresh_Token_User_Meta_Repository_Test {

	/**
	 * Tests the store_token method.
	 *
	 * @return void
	 */
	public function test_store_token() {
		$user_id = 456;
		$token   = 'example_refresh_token_jwt_value';

		$this->user_helper->expects( 'update_meta' )
			->once()
			->with(
				$user_id,
				'_yoast_wpseo_ai_generator_refresh_jwt',
				$token
			);

		$this->instance->store_token( $user_id, $token );
	}
}
