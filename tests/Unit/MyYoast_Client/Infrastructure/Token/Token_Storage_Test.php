<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Infrastructure\Token;

use Brain\Monkey\Functions;
use Mockery;
use RuntimeException;
use Yoast\WP\SEO\MyYoast_Client\Domain\Resource_Indicator;
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
	 * The option key for the default resource bucket.
	 *
	 * This shares the key with pre-RFC-8707 installs by design so existing
	 * tokens keep working without a data migration.
	 *
	 * @var string
	 */
	private const OPTION_KEY_DEFAULT = 'wpseo_myyoast_site_tokens_' . self::ISSUER_KEY;

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
	 * Tests storing and retrieving a token set in the default resource bucket.
	 *
	 * @covers ::store
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_store_and_get_default_bucket() {
		$token_set = new Token_Set( 'access-token', ( \time() + 900 ), 'DPoP' );

		$this->encryption
			->expects( 'encrypt' )
			->once()
			->andReturn( 'encrypted-data' );

		Functions\expect( 'update_option' )
			->once()
			->with( self::OPTION_KEY_DEFAULT, 'encrypted-data', false )
			->andReturn( true );

		$this->instance->store( $token_set );

		Functions\expect( 'get_option' )
			->once()
			->with( self::OPTION_KEY_DEFAULT, '' )
			->andReturn( 'encrypted-data' );

		$this->encryption
			->expects( 'decrypt' )
			->with( 'encrypted-data', 'yoast-myyoast-site-tokens' )
			->once()
			->andReturn( \wp_json_encode( $token_set->to_array() ) );

		$result = $this->instance->get( Resource_Indicator::default() );

		$this->assertNotNull( $result );
		$this->assertSame( 'access-token', $result->get_access_token() );
	}

	/**
	 * Tests that a per-resource bucket uses a hashed key suffix.
	 *
	 * @covers ::store
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_store_and_get_per_resource_bucket() {
		$indicator    = new Resource_Indicator( 'https://ai.yoa.st' );
		$bucket_key   = \substr( \sha1( $indicator->value() ), 0, 12 );
		$expected_key = self::OPTION_KEY_DEFAULT . '_' . $bucket_key;
		$token_set    = new Token_Set( 'access-token', ( \time() + 900 ), 'DPoP', null, null, null, 0, $indicator );

		$this->encryption->expects( 'encrypt' )->once()->andReturn( 'encrypted-data' );
		Functions\expect( 'update_option' )
			->once()
			->with( $expected_key, 'encrypted-data', false )
			->andReturn( true );

		$this->instance->store( $token_set );

		Functions\expect( 'get_option' )
			->once()
			->with( $expected_key, '' )
			->andReturn( 'encrypted-data' );
		$this->encryption->expects( 'decrypt' )->once()->andReturn( \wp_json_encode( $token_set->to_array() ) );

		$result = $this->instance->get( $indicator );

		$this->assertNotNull( $result );
		$this->assertSame( 'https://ai.yoa.st', $result->get_resource_indicator()->value() );
	}

	/**
	 * Tests that get returns null when no token is stored in the default bucket.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_returns_null_when_empty() {
		Functions\expect( 'get_option' )
			->once()
			->with( self::OPTION_KEY_DEFAULT, '' )
			->andReturn( '' );

		$this->assertNull( $this->instance->get( Resource_Indicator::default() ) );
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
			->with( self::OPTION_KEY_DEFAULT, '' )
			->andReturn( 'corrupted-data' );

		$this->encryption
			->expects( 'decrypt' )
			->andThrow( new RuntimeException( 'Decryption failed' ) );

		$this->assertNull( $this->instance->get( Resource_Indicator::default() ) );
	}

	/**
	 * Tests that delete clears the default bucket.
	 *
	 * @covers ::delete
	 *
	 * @return void
	 */
	public function test_delete_default_bucket() {
		Functions\expect( 'delete_option' )
			->once()
			->with( self::OPTION_KEY_DEFAULT )
			->andReturn( true );

		$this->instance->delete( Resource_Indicator::default() );
	}

	/**
	 * Tests deleting a per-resource bucket uses the suffixed key.
	 *
	 * @covers ::delete
	 *
	 * @return void
	 */
	public function test_delete_per_resource_bucket() {
		$indicator    = new Resource_Indicator( 'https://ai.yoa.st' );
		$bucket_key   = \substr( \sha1( $indicator->value() ), 0, 12 );
		$expected_key = self::OPTION_KEY_DEFAULT . '_' . $bucket_key;

		Functions\expect( 'delete_option' )
			->once()
			->with( $expected_key )
			->andReturn( true );

		$this->instance->delete( $indicator );
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

		$wpdb          = Mockery::mock( 'wpdb' );
		$wpdb->options = 'wp_options';
		$wpdb->expects( 'esc_like' )->with( self::OPTION_KEY_DEFAULT )->andReturn( self::OPTION_KEY_DEFAULT );
		$wpdb->expects( 'prepare' )->with(
			'DELETE FROM wp_options WHERE option_name LIKE %s',
			self::OPTION_KEY_DEFAULT . '%',
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

		$bare_prefix   = 'wpseo_myyoast_site_tokens_';
		$wpdb          = Mockery::mock( 'wpdb' );
		$wpdb->options = 'wp_options';
		$wpdb->expects( 'esc_like' )->with( $bare_prefix )->andReturn( $bare_prefix );
		$wpdb->expects( 'prepare' )->with(
			'DELETE FROM wp_options WHERE option_name LIKE %s',
			$bare_prefix . '%',
		)->andReturn( 'PREPARED' );
		$wpdb->expects( 'query' )->with( 'PREPARED' )->andReturn( 0 );

		$this->instance->delete_all_issuers();
	}
}
