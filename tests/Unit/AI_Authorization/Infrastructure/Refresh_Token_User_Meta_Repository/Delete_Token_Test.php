<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Infrastructure\Refresh_Token_User_Meta_Repository;

/**
 * Tests the Refresh_Token_User_Meta_Repository delete_token.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI_Authorization\Infrastructure\Refresh_Token_User_Meta_Repository::delete_token
 */
final class Delete_Token_Test extends Abstract_Refresh_Token_User_Meta_Repository_Test {

	/**
	 * Tests the delete_token method.
	 *
	 * @return void
	 */
	public function test_delete_token() {
		$user_id = 789;

		$this->user_helper
			->expects( 'delete_meta' )
			->once()
			->with( $user_id, '_yoast_wpseo_ai_generator_refresh_jwt' )
			->andReturn( true );

		$this->instance->delete_token( $user_id );
	}
}
