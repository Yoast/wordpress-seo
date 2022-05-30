<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * Class used to encrypt/decrypt strings with the WordPress settings.
 *
 * This class is heavily inspired by the Data_Encryption class in the google-site-kit plugin.
 */
final class Encryption_Helper {

	/**
	 * Key to use for encryption.
	 *
	 * @var string
	 */
	private $key;

	/**
	 * Salt to use for encryption.
	 *
	 * @var string
	 */
	private $salt;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->key  = $this->get_default_key();
		$this->salt = $this->get_default_salt();
	}

	/**
	 * Encrypts a value.
	 *
	 * If a user-based key is set, that key is used. Otherwise the default key is used.
	 *
	 * @param string $value Value to encrypt.
	 * @return string|bool Encrypted value, or false on failure.
	 */
	public function encrypt( $value ) {
		if ( ! extension_loaded( 'openssl' ) ) {
			return $value;
		}

		$method = 'aes-256-ctr';
		$ivlen  = \openssl_cipher_iv_length( $method );
		$iv     = \openssl_random_pseudo_bytes( $ivlen );

		$raw_value = \openssl_encrypt( $value . $this->salt, $method, $this->key, 0, $iv );
		if ( ! $raw_value ) {
			return false;
		}

		return \base64_encode( $iv . $raw_value );
	}

	/**
	 * Decrypts a value.
	 *
	 * If a user-based key is set, that key is used. Otherwise the default key is used.
	 *
	 * @param string $raw_value Value to decrypt.
	 * @return string|bool Decrypted value, or false on failure.
	 */
	public function decrypt( $raw_value ) {
		if ( ! \extension_loaded( 'openssl' ) ) {
			return $raw_value;
		}

		$raw_value = \base64_decode( $raw_value, true );

		$method = 'aes-256-ctr';
		$ivlen  = \openssl_cipher_iv_length( $method );
		$iv     = \substr( $raw_value, 0, $ivlen );

		$raw_value = \substr( $raw_value, $ivlen );

		$value = \openssl_decrypt( $raw_value, $method, $this->key, 0, $iv );
		if ( ! $value || substr( $value, - \strlen( $this->salt ) ) !== $this->salt ) {
			return false;
		}

		return \substr( $value, 0, - \strlen( $this->salt ) );
	}

	/**
	 * Gets the default encryption key to use.
	 *
	 * @return string Default (not user-based) encryption key.
	 */
	public function get_default_key() {
		if ( defined( 'YOASTSEO_ENCRYPTION_KEY' ) && YOASTSEO_ENCRYPTION_KEY !== '' ) {
			return YOASTSEO_ENCRYPTION_KEY;
		}

		if ( defined( 'LOGGED_IN_KEY' ) && LOGGED_IN_KEY !== '' ) {
			return LOGGED_IN_KEY;
		}

		// If this is reached, you're either not on a live site or have a serious security issue.
		return 'no-secret-key-set';
	}

	/**
	 * Gets the default encryption salt to use.
	 *
	 * @return string Encryption salt.
	 */
	public function get_default_salt() {
		if ( defined( 'YOASTSEO_ENCRYPTION_SALT' ) && YOASTSEO_ENCRYPTION_SALT !== '' ) {
			return YOASTSEO_ENCRYPTION_SALT;
		}

		if ( defined( 'LOGGED_IN_SALT' ) && LOGGED_IN_SALT !== '' ) {
			return LOGGED_IN_SALT;
		}

		// If this is reached, you're either not on a live site or have a serious security issue.
		return 'no-secret-salt-set';
	}
}
