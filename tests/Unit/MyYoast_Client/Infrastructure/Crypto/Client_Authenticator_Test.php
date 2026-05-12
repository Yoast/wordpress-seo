<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Infrastructure\Crypto;

use Mockery;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Client_Authentication_Exception;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Client_Authenticator;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Encryption_Exception;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\JWT_Signer;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Key_Pair;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Key_Pair_Manager;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Client_Authenticator class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Client_Authenticator
 */
final class Client_Authenticator_Test extends TestCase {

	/**
	 * The key pair manager mock.
	 *
	 * @var Key_Pair_Manager|Mockery\MockInterface
	 */
	private $key_pair_manager;

	/**
	 * The JWT signer mock.
	 *
	 * @var JWT_Signer|Mockery\MockInterface
	 */
	private $jwt_signer;

	/**
	 * The test instance.
	 *
	 * @var Client_Authenticator
	 */
	private $instance;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->key_pair_manager = Mockery::mock( Key_Pair_Manager::class );
		$this->jwt_signer       = Mockery::mock( JWT_Signer::class );
		$this->instance         = new Client_Authenticator( $this->key_pair_manager, $this->jwt_signer );
	}

	/**
	 * Tests that create_client_assertion delegates to key_pair_manager and jwt_signer.
	 *
	 * @covers ::create_client_assertion
	 *
	 * @return void
	 */
	public function test_create_client_assertion_success() {
		$key_pair = Mockery::mock( Key_Pair::class );

		$this->key_pair_manager
			->expects( 'get_or_create_key_pair' )
			->with( Key_Pair_Manager::PURPOSE_REGISTRATION )
			->once()
			->andReturn( $key_pair );

		$this->jwt_signer
			->expects( 'create_client_assertion' )
			->with( 'client-123', 'https://my.yoast.com/api/oauth/token', $key_pair )
			->once()
			->andReturn( 'signed-jwt-assertion' );

		$result = $this->instance->create_client_assertion( 'client-123', 'https://my.yoast.com/api/oauth/token' );

		$this->assertSame( 'signed-jwt-assertion', $result );
	}

	/**
	 * Tests that Encryption_Exception from key_pair_manager is wrapped in Client_Authentication_Exception.
	 *
	 * @covers ::create_client_assertion
	 *
	 * @return void
	 */
	public function test_create_client_assertion_wraps_key_pair_exception() {
		$this->key_pair_manager
			->expects( 'get_or_create_key_pair' )
			->with( Key_Pair_Manager::PURPOSE_REGISTRATION )
			->andThrow( new Encryption_Exception( 'Key decryption failed' ) );

		$this->expectException( Client_Authentication_Exception::class );
		$this->expectExceptionMessage( 'Client assertion signing failed: Key decryption failed' );

		$this->instance->create_client_assertion( 'client-123', 'https://my.yoast.com/api/oauth/token' );
	}

	/**
	 * Tests that Encryption_Exception from jwt_signer is wrapped in Client_Authentication_Exception.
	 *
	 * @covers ::create_client_assertion
	 *
	 * @return void
	 */
	public function test_create_client_assertion_wraps_signing_exception() {
		$key_pair = Mockery::mock( Key_Pair::class );

		$this->key_pair_manager
			->expects( 'get_or_create_key_pair' )
			->andReturn( $key_pair );

		$this->jwt_signer
			->expects( 'create_client_assertion' )
			->andThrow( new Encryption_Exception( 'Signing failed' ) );

		$this->expectException( Client_Authentication_Exception::class );
		$this->expectExceptionMessage( 'Client assertion signing failed: Signing failed' );

		$this->instance->create_client_assertion( 'client-123', 'https://my.yoast.com/api/oauth/token' );
	}
}
