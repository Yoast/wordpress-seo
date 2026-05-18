<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Infrastructure\Token;

use Brain\Monkey\Functions;
use Mockery;
use RuntimeException;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Encryption;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Issuer_Config;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Token\Token_Storage;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Token_Storage class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Infrastructure\Token\Token_Storage
 */
final class Token_Storage_Test extends TestCase {

	/**
	 * The issuer key used in all tests.
	 *
	 * @var string
	 */
	private const ISSUER_KEY = 'a1b2c3d4';

	/**
	 * The expected option key.
	 *
	 * @var string
	 */
	private const OPTION_KEY = 'wpseo_myyoast_site_tokens_' . self::ISSUER_KEY;

	/**
	 * The encryption mock.
	 *
	 * @var Encryption|Mockery\MockInterface
	 */
	private $encryption;

	/**
	 * The test instance.
	 *
	 * @var Token_Storage
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
		$this->instance = new Token_Storage( $this->encryption, $issuer_config );
	}

	/**
	 * Tests storing and retrieving a token set.
	 *
	 * @covers ::store
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_store_and_get() {
		$token_set = new Token_Set( 'access-token', ( \time() + 900 ), 'DPoP' );

		$this->encryption
			->expects( 'encrypt' )
			->once()
			->andReturn( 'encrypted-data' );

		Functions\expect( 'update_option' )
			->once()
			->with( self::OPTION_KEY, 'encrypted-data', false )
			->andReturn( true );

		$this->instance->store( $token_set );

		// Now test get.
		Functions\expect( 'get_option' )
			->once()
			->with( self::OPTION_KEY, '' )
			->andReturn( 'encrypted-data' );

		$this->encryption
			->expects( 'decrypt' )
			->with( 'encrypted-data', 'yoast-myyoast-site-tokens' )
			->once()
			->andReturn( \wp_json_encode( $token_set->to_array() ) );

		$result = $this->instance->get();

		$this->assertNotNull( $result );
		$this->assertSame( 'access-token', $result->get_access_token() );
	}

	/**
	 * Tests that get returns null when no token is stored.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_returns_null_when_empty() {
		Functions\expect( 'get_option' )
			->once()
			->with( self::OPTION_KEY, '' )
			->andReturn( '' );

		$this->assertNull( $this->instance->get() );
	}

	/**
	 * Tests that get returns null when decryption fails.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_returns_null_on_decryption_failure() {
		Functions\expect( 'get_option' )
			->once()
			->with( self::OPTION_KEY, '' )
			->andReturn( 'corrupted-data' );

		$this->encryption
			->expects( 'decrypt' )
			->andThrow( new RuntimeException( 'Decryption failed' ) );

		$this->assertNull( $this->instance->get() );
	}

	/**
	 * Tests that delete clears the stored token.
	 *
	 * @covers ::delete
	 *
	 * @return void
	 */
	public function test_delete() {
		Functions\expect( 'delete_option' )
			->once()
			->with( self::OPTION_KEY )
			->andReturn( true );

		$this->instance->delete();
	}
}
