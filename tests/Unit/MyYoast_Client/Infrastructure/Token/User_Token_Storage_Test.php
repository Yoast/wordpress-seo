<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Infrastructure\Token;

use Mockery;
use RuntimeException;
use Yoast\WP\SEO\Helpers\User_Helper;
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
	 * Tests storing a token for a user.
	 *
	 * @covers ::store
	 *
	 * @return void
	 */
	public function test_store() {
		$token_set = new Token_Set( 'access-token', ( \time() + 900 ), 'DPoP', 'refresh-token' );

		$this->encryption
			->expects( 'encrypt' )
			->once()
			->andReturn( 'encrypted-data' );

		$this->user_helper
			->expects( 'update_meta' )
			->with( 42, '_wpseo_myyoast_user_tokens_' . self::ISSUER_KEY, 'encrypted-data' )
			->once();

		$this->instance->store( 42, $token_set );
	}

	/**
	 * Tests retrieving a token for a user.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get() {
		$token_data = [
			'access_token'  => 'access-123',
			'expires_at'    => ( \time() + 900 ),
			'token_type'    => 'DPoP',
			'refresh_token' => 'refresh-456',
			'id_token'      => null,
			'scope'         => 'openid',
			'error_count'   => 0,
		];

		$this->user_helper
			->expects( 'get_meta' )
			->with( 42, '_wpseo_myyoast_user_tokens_' . self::ISSUER_KEY, true )
			->once()
			->andReturn( 'encrypted-data' );

		$this->encryption
			->expects( 'decrypt' )
			->with( 'encrypted-data', 'yoast-myyoast-user-tokens' )
			->once()
			->andReturn( \wp_json_encode( $token_data ) );

		$result = $this->instance->get( 42 );

		$this->assertNotNull( $result );
		$this->assertSame( 'access-123', $result->get_access_token() );
		$this->assertSame( 'refresh-456', $result->get_refresh_token() );
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
			->andReturn( '' );

		$this->assertNull( $this->instance->get( 42 ) );
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
			->andReturn( 'corrupted' );

		$this->encryption
			->expects( 'decrypt' )
			->andThrow( new RuntimeException( 'fail' ) );

		$this->assertNull( $this->instance->get( 42 ) );
	}

	/**
	 * Tests deleting a user's tokens.
	 *
	 * @covers ::delete
	 *
	 * @return void
	 */
	public function test_delete() {
		$this->user_helper
			->expects( 'delete_meta' )
			->with( 42, '_wpseo_myyoast_user_tokens_' . self::ISSUER_KEY )
			->once();

		$this->instance->delete( 42 );
	}
}
