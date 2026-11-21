<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Infrastructure\Token;

use Mockery;
use RuntimeException;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\MyYoast_Client\Domain\Resource_Indicator;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Encryption;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Issuer_Config;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Token\User_Token_Storage;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the User_Token_Storage class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Infrastructure\Token\User_Token_Storage
 */
final class User_Token_Storage_Test extends TestCase {

	/**
	 * The issuer key suffix used in all tests.
	 *
	 * @var string
	 */
	private const ISSUER_KEY = 'a1b2c3d4';

	/**
	 * The meta key for the default resource bucket.
	 *
	 * This shares the key with pre-RFC-8707 installs by design so existing
	 * tokens keep working without a data migration.
	 *
	 * @var string
	 */
	private const META_KEY_DEFAULT = '_wpseo_myyoast_user_tokens_' . self::ISSUER_KEY;

	/**
	 * The user helper mock.
	 *
	 * @var User_Helper|Mockery\MockInterface
	 */
	private $user_helper;

	/**
	 * The encryption mock.
	 *
	 * @var Encryption|Mockery\MockInterface
	 */
	private $encryption;

	/**
	 * The test instance.
	 *
	 * @var User_Token_Storage
	 */
	private $instance;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->user_helper = Mockery::mock( User_Helper::class );
		$this->encryption  = Mockery::mock( Encryption::class );
		$issuer_config     = Mockery::mock( Issuer_Config::class );
		$issuer_config->allows( 'get_issuer_key' )->andReturn( self::ISSUER_KEY );
		$this->instance = new User_Token_Storage( $this->user_helper, $this->encryption, $issuer_config );
	}

	/**
	 * Tests storing a token for a user in the default bucket.
	 *
	 * @covers ::store
	 *
	 * @return void
	 */
	public function test_store_default_bucket() {
		$token_set = new Token_Set( 'access-token', ( \time() + 900 ), 'DPoP', 'refresh-token' );

		$this->encryption
			->expects( 'encrypt' )
			->once()
			->andReturn( 'encrypted-data' );

		$this->user_helper
			->expects( 'update_meta' )
			->with( 42, self::META_KEY_DEFAULT, 'encrypted-data' )
			->once();

		$this->instance->store( 42, $token_set );
	}

	/**
	 * Tests storing a token for a user in a per-resource bucket.
	 *
	 * @covers ::store
	 *
	 * @return void
	 */
	public function test_store_per_resource_bucket() {
		$indicator    = new Resource_Indicator( 'https://ai.yoa.st' );
		$bucket_key   = \substr( \sha1( $indicator->value() ), 0, 12 );
		$expected_key = self::META_KEY_DEFAULT . '_' . $bucket_key;
		$token_set    = new Token_Set( 'access-token', ( \time() + 900 ), 'DPoP', 'refresh-token', null, null, 0, $indicator );

		$this->encryption->expects( 'encrypt' )->once()->andReturn( 'encrypted-data' );
		$this->user_helper
			->expects( 'update_meta' )
			->with( 42, $expected_key, 'encrypted-data' )
			->once();

		$this->instance->store( 42, $token_set );
	}

	/**
	 * Tests retrieving a token for a user from the default bucket.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_default_bucket() {
		$token_data = [
			'access_token'       => 'access-123',
			'expires_at'         => ( \time() + 900 ),
			'token_type'         => 'DPoP',
			'refresh_token'      => 'refresh-456',
			'id_token'           => null,
			'scope'              => 'openid',
			'error_count'        => 0,
			'resource_indicator' => null,
		];

		$this->user_helper
			->expects( 'get_meta' )
			->with( 42, self::META_KEY_DEFAULT, true )
			->once()
			->andReturn( 'encrypted-data' );

		$this->encryption
			->expects( 'decrypt' )
			->with( 'encrypted-data', 'yoast-myyoast-user-tokens' )
			->once()
			->andReturn( \wp_json_encode( $token_data ) );

		$result = $this->instance->get( 42, Resource_Indicator::default() );

		$this->assertNotNull( $result );
		$this->assertSame( 'access-123', $result->get_access_token() );
		$this->assertSame( 'refresh-456', $result->get_refresh_token() );
		$this->assertTrue( $result->get_resource_indicator()->is_default() );
	}

	/**
	 * Tests that get returns null when no token is stored.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_returns_null_when_empty() {
		$this->user_helper
			->expects( 'get_meta' )
			->with( 42, self::META_KEY_DEFAULT, true )
			->andReturn( '' );

		$this->assertNull( $this->instance->get( 42, Resource_Indicator::default() ) );
	}

	/**
	 * Tests that get returns null on decryption failure.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_returns_null_on_decryption_failure() {
		$this->user_helper
			->expects( 'get_meta' )
			->with( 42, self::META_KEY_DEFAULT, true )
			->andReturn( 'corrupted' );

		$this->encryption
			->expects( 'decrypt' )
			->andThrow( new RuntimeException( 'fail' ) );

		$this->assertNull( $this->instance->get( 42, Resource_Indicator::default() ) );
	}

	/**
	 * Tests deleting a user's default-bucket token.
	 *
	 * @covers ::delete
	 *
	 * @return void
	 */
	public function test_delete_default_bucket() {
		$this->user_helper
			->expects( 'delete_meta' )
			->with( 42, self::META_KEY_DEFAULT )
			->once();

		$this->instance->delete( 42, Resource_Indicator::default() );
	}

	/**
	 * Tests deleting a user's per-resource bucket uses the suffixed key.
	 *
	 * @covers ::delete
	 *
	 * @return void
	 */
	public function test_delete_per_resource_bucket() {
		$indicator    = new Resource_Indicator( 'https://ai.yoa.st' );
		$bucket_key   = \substr( \sha1( $indicator->value() ), 0, 12 );
		$expected_key = self::META_KEY_DEFAULT . '_' . $bucket_key;

		$this->user_helper
			->expects( 'delete_meta' )
			->with( 42, $expected_key )
			->once();

		$this->instance->delete( 42, $indicator );
	}

	/**
	 * Tests that delete_all is scoped to the current issuer.
	 *
	 * @covers ::delete_all
	 *
	 * @return void
	 */
	public function test_delete_all_scoped_to_current_issuer() {
		global $wpdb;

		$wpdb           = Mockery::mock( 'wpdb' );
		$wpdb->usermeta = 'wp_usermeta';
		$wpdb->expects( 'esc_like' )->with( self::META_KEY_DEFAULT )->andReturn( self::META_KEY_DEFAULT );
		$wpdb->expects( 'prepare' )->with(
			'DELETE FROM wp_usermeta WHERE meta_key LIKE %s',
			self::META_KEY_DEFAULT . '%',
		)->andReturn( 'PREPARED' );
		$wpdb->expects( 'query' )->with( 'PREPARED' )->andReturn( 0 );

		$this->instance->delete_all();
	}

	/**
	 * Tests that delete_all_issuers ignores the issuer key.
	 *
	 * @covers ::delete_all_issuers
	 *
	 * @return void
	 */
	public function test_delete_all_issuers_purges_every_issuer() {
		global $wpdb;

		$bare_prefix    = '_wpseo_myyoast_user_tokens_';
		$wpdb           = Mockery::mock( 'wpdb' );
		$wpdb->usermeta = 'wp_usermeta';
		$wpdb->expects( 'esc_like' )->with( $bare_prefix )->andReturn( $bare_prefix );
		$wpdb->expects( 'prepare' )->with(
			'DELETE FROM wp_usermeta WHERE meta_key LIKE %s',
			$bare_prefix . '%',
		)->andReturn( 'PREPARED' );
		$wpdb->expects( 'query' )->with( 'PREPARED' )->andReturn( 0 );

		$this->instance->delete_all_issuers();
	}
}
