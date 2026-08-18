<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authorization\Application\Token_Manager;

use RuntimeException;

/**
 * Class Has_Local_Tokens_Test.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI\Authorization\Application\Token_Manager::has_local_tokens
 */
final class Has_Local_Tokens_Test extends Abstract_Test {

	/**
	 * Tests that has_local_tokens returns true when an access token is stored, without consulting
	 * the refresh token repository.
	 *
	 * @return void
	 */
	public function test_has_local_tokens_with_access_token() {
		$user_id = 123;

		$this->access_token_repository
			->expects( 'get_token' )
			->with( $user_id )
			->once()
			->andReturn( 'valid_access_token' );

		$this->refresh_token_repository->shouldNotReceive( 'get_token' );

		$this->assertTrue( $this->instance->has_local_tokens( $user_id ) );
	}

	/**
	 * Tests that has_local_tokens returns true when only a refresh token is stored.
	 *
	 * @return void
	 */
	public function test_has_local_tokens_with_only_refresh_token() {
		$user_id = 123;

		$this->access_token_repository
			->expects( 'get_token' )
			->with( $user_id )
			->once()
			->andThrow( new RuntimeException( 'Unable to retrieve the access token.' ) );

		$this->refresh_token_repository
			->expects( 'get_token' )
			->with( $user_id )
			->once()
			->andReturn( 'valid_refresh_token' );

		$this->assertTrue( $this->instance->has_local_tokens( $user_id ) );
	}

	/**
	 * Tests that has_local_tokens returns false when neither JWT is stored locally.
	 *
	 * @return void
	 */
	public function test_has_local_tokens_without_tokens() {
		$user_id = 123;

		$this->access_token_repository
			->expects( 'get_token' )
			->with( $user_id )
			->once()
			->andThrow( new RuntimeException( 'Unable to retrieve the access token.' ) );

		$this->refresh_token_repository
			->expects( 'get_token' )
			->with( $user_id )
			->once()
			->andThrow( new RuntimeException( 'Unable to retrieve the refresh token.' ) );

		$this->assertFalse( $this->instance->has_local_tokens( $user_id ) );
	}
}
