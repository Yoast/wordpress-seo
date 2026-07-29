<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Infrastructure\Crypto;

use stdClass;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Encryption;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Encryption_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests that the Encryption class rejects a non-string AUTH_KEY.
 *
 * AUTH_KEY can only be defined once per PHP process, so these tests live in
 * their own class with process isolation rather than in Encryption_Test, which
 * defines AUTH_KEY as a valid string.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Encryption
 *
 * @runTestsInSeparateProcesses
 * @preserveGlobalState disabled
 */
final class Encryption_Invalid_Key_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var Encryption
	 */
	private $instance;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Encryption();
	}

	/**
	 * Provides the non-string AUTH_KEY values that define() accepts.
	 *
	 * @return array<string, array<mixed>>
	 */
	public static function provide_non_string_auth_keys() {
		return [
			'null'    => [ null ],
			'false'   => [ false ],
			'true'    => [ true ],
			'integer' => [ 123 ],
			'float'   => [ 1.5 ],
			'array'   => [ [ 'key' ] ],
			'object'  => [ new stdClass() ],
		];
	}

	/**
	 * Tests that encrypting with a non-string AUTH_KEY throws instead of reaching hash_hkdf().
	 *
	 * Without the is_string() guard, a null AUTH_KEY makes hash_hkdf() raise a
	 * deprecation notice and then a ValueError, which callers do not expect to handle.
	 *
	 * @covers ::encrypt
	 * @covers ::derive_key
	 *
	 * @dataProvider provide_non_string_auth_keys
	 *
	 * @param mixed $auth_key The non-string AUTH_KEY value to define.
	 *
	 * @return void
	 */
	public function test_encrypt_with_non_string_auth_key_throws( $auth_key ) {
		// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound -- WordPress core constant.
		\define( 'AUTH_KEY', $auth_key );

		$this->expectException( Encryption_Exception::class );
		$this->expectExceptionMessage( 'AUTH_KEY is not configured. Please set a unique AUTH_KEY in wp-config.php.' );

		$this->instance->encrypt( 'secret', 'test-context' );
	}

	/**
	 * Tests that decrypting with a non-string AUTH_KEY throws instead of reaching hash_hkdf().
	 *
	 * @covers ::decrypt
	 * @covers ::derive_key
	 *
	 * @dataProvider provide_non_string_auth_keys
	 *
	 * @param mixed $auth_key The non-string AUTH_KEY value to define.
	 *
	 * @return void
	 */
	public function test_decrypt_with_non_string_auth_key_throws( $auth_key ) {
		// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound -- WordPress core constant.
		\define( 'AUTH_KEY', $auth_key );

		$this->expectException( Encryption_Exception::class );
		$this->expectExceptionMessage( 'AUTH_KEY is not configured. Please set a unique AUTH_KEY in wp-config.php.' );

		$this->instance->decrypt( 'irrelevant', 'test-context' );
	}
}
