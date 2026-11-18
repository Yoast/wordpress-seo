<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Infrastructure\Crypto;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Encryption;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Encryption_Exception;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Key_Pair;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Key_Pair_Manager;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Issuer_Config;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Key_Pair_Manager class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Key_Pair_Manager
 */
final class Key_Pair_Manager_Test extends TestCase {

	/**
	 * The issuer key used in all tests.
	 *
	 * @var string
	 */
	private const ISSUER_KEY = 'a1b2c3d4';

	/**
	 * The encryption mock.
	 *
	 * @var Encryption|Mockery\MockInterface
	 */
	private $encryption;

	/**
	 * The test instance.
	 *
	 * @var Key_Pair_Manager
	 */
	private $instance;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->encryption = Mockery::mock( Encryption::class );
		$issuer_config    = Mockery::mock( Issuer_Config::class );
		$issuer_config->allows( 'get_issuer_key' )->andReturn( self::ISSUER_KEY );
		$this->instance = new Key_Pair_Manager( $this->encryption, $issuer_config );
	}

	/**
	 * Tests that get_or_create_key_pair generates a new pair when none exists.
	 *
	 * @covers ::get_or_create_key_pair
	 * @covers ::get_stored_key_pair
	 * @covers ::generate_and_store_key_pair
	 *
	 * @return void
	 */
	public function test_get_or_create_generates_new_pair_when_none_exists() {
		Functions\expect( 'get_option' )
			->with( 'wpseo_myyoast_key_pair_dpop_' . self::ISSUER_KEY, [] )
			->andReturn( [] );

		$this->encryption
			->expects( 'encrypt' )
			->once()
			->andReturnUsing(
				static function ( $data ) {
					// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode -- Test fixture.
					return \base64_encode( 'encrypted:' . $data );
				},
			);

		Functions\expect( 'update_option' )
			->once()
			->with(
				'wpseo_myyoast_key_pair_dpop_' . self::ISSUER_KEY,
				Mockery::on(
					static function ( $value ) {
						return \is_array( $value )
							&& ! empty( $value['public_key'] )
							&& ! empty( $value['private_key_encrypted'] )
							&& ! empty( $value['kid'] )
							&& ! empty( $value['created_at'] );
					},
				),
				false,
			)
			->andReturn( true );

		$result = $this->instance->get_or_create_key_pair( Key_Pair_Manager::PURPOSE_DPOP );

		$this->assertInstanceOf( Key_Pair::class, $result );
		$this->assertSame( \SODIUM_CRYPTO_SIGN_PUBLICKEYBYTES, \strlen( $result->get_public_key() ) );
		$this->assertSame( \SODIUM_CRYPTO_SIGN_SECRETKEYBYTES, \strlen( $result->get_private_key() ) );
		$this->assertNotEmpty( $result->get_kid() );
	}

	/**
	 * Tests that get_or_create_key_pair returns existing pair when stored.
	 *
	 * @covers ::get_or_create_key_pair
	 * @covers ::get_stored_key_pair
	 *
	 * @return void
	 */
	public function test_get_or_create_returns_existing_pair() {
		$keypair     = \sodium_crypto_sign_keypair();
		$public_key  = \sodium_crypto_sign_publickey( $keypair );
		$private_key = \sodium_crypto_sign_secretkey( $keypair );

		Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_myyoast_key_pair_registration_' . self::ISSUER_KEY, [] )
			->andReturn(
				[
					// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode -- Test fixture.
					'public_key'            => \base64_encode( $public_key ),
					'private_key_encrypted' => 'encrypted-private-key',
					'kid'                   => 'test-kid',
					'created_at'            => \time(),
				],
			);

		$this->encryption
			->expects( 'decrypt' )
			->with( 'encrypted-private-key', 'yoast-myyoast-key-registration' )
			->once()
			->andReturn( $private_key );

		$result = $this->instance->get_or_create_key_pair( Key_Pair_Manager::PURPOSE_REGISTRATION );

		$this->assertInstanceOf( Key_Pair::class, $result );
		$this->assertSame( $public_key, $result->get_public_key() );
		$this->assertSame( $private_key, $result->get_private_key() );
		$this->assertSame( 'test-kid', $result->get_kid() );
	}

	/**
	 * Tests that get_public_key_jwk returns correct JWK format.
	 *
	 * @covers ::get_public_key_jwk
	 * @covers ::get_or_create_key_pair
	 *
	 * @return void
	 */
	public function test_get_public_key_jwk_format() {
		$keypair    = \sodium_crypto_sign_keypair();
		$public_key = \sodium_crypto_sign_publickey( $keypair );

		$stored_data = [
			// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode -- Test fixture.
			'public_key'            => \base64_encode( $public_key ),
			'private_key_encrypted' => 'encrypted',
			'kid'                   => 'test-kid-123',
			'created_at'            => \time(),
		];

		Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_myyoast_key_pair_dpop_' . self::ISSUER_KEY, [] )
			->andReturn( $stored_data );

		$this->encryption
			->expects( 'decrypt' )
			->once()
			->andReturn( \sodium_crypto_sign_secretkey( $keypair ) );

		$key_pair = $this->instance->get_or_create_key_pair( Key_Pair_Manager::PURPOSE_DPOP );
		$jwk      = $this->instance->get_public_key_jwk( $key_pair );

		$this->assertSame( 'OKP', $jwk['kty'] );
		$this->assertSame( 'Ed25519', $jwk['crv'] );
		$this->assertSame( 'sig', $jwk['use'] );
		$this->assertSame( 'EdDSA', $jwk['alg'] );
		$this->assertArrayHasKey( 'x', $jwk );
		$this->assertArrayHasKey( 'kid', $jwk );
	}

	/**
	 * Tests that rotate_key_pair generates a new pair.
	 *
	 * @covers ::rotate_key_pair
	 * @covers ::generate_and_store_key_pair
	 *
	 * @return void
	 */
	public function test_rotate_key_pair_generates_new_pair() {
		$this->encryption
			->expects( 'encrypt' )
			->once()
			->andReturn( 'newly-encrypted' );

		Functions\expect( 'update_option' )
			->once()
			->andReturn( true );

		$result = $this->instance->rotate_key_pair( Key_Pair_Manager::PURPOSE_DPOP );

		$this->assertInstanceOf( Key_Pair::class, $result );
		$this->assertSame( \SODIUM_CRYPTO_SIGN_PUBLICKEYBYTES, \strlen( $result->get_public_key() ) );
		$this->assertNotEmpty( $result->get_kid() );
	}

	/**
	 * Tests that delete_key_pair clears the stored key pair.
	 *
	 * @covers ::delete_key_pair
	 *
	 * @return void
	 */
	public function test_delete_key_pair() {
		Functions\expect( 'delete_option' )
			->once()
			->with( 'wpseo_myyoast_key_pair_dpop_' . self::ISSUER_KEY )
			->andReturn( true );

		$this->instance->delete_key_pair( Key_Pair_Manager::PURPOSE_DPOP );
	}

	/**
	 * Tests that get_or_create_key_pair silently rotates when decryption fails.
	 *
	 * @covers ::get_or_create_key_pair
	 * @covers ::get_stored_key_pair
	 *
	 * @return void
	 */
	public function test_get_or_create_rotates_on_decryption_failure() {
		$keypair    = \sodium_crypto_sign_keypair();
		$public_key = \sodium_crypto_sign_publickey( $keypair );

		Functions\expect( 'get_option' )
			->with( 'wpseo_myyoast_key_pair_dpop_' . self::ISSUER_KEY, [] )
			->andReturn(
				[
					// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode -- Test fixture.
					'public_key'            => \base64_encode( $public_key ),
					'private_key_encrypted' => 'corrupted-data',
					'kid'                   => 'old-kid',
					'created_at'            => \time(),
				],
			);

		// Decryption fails.
		$this->encryption
			->expects( 'decrypt' )
			->once()
			->andThrow( new Encryption_Exception( 'Decryption failed' ) );

		// Should generate and store a new key pair.
		$this->encryption
			->expects( 'encrypt' )
			->once()
			->andReturn( 'new-encrypted-private' );

		Functions\expect( 'update_option' )
			->once()
			->andReturn( true );

		$result = $this->instance->get_or_create_key_pair( Key_Pair_Manager::PURPOSE_DPOP );

		$this->assertInstanceOf( Key_Pair::class, $result );
		$this->assertSame( \SODIUM_CRYPTO_SIGN_PUBLICKEYBYTES, \strlen( $result->get_public_key() ) );
	}
}
