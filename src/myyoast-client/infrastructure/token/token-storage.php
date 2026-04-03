<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\Token;

use Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Storage_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Token_Storage_Interface;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Encryption;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Encryption_Exception;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Issuer_Config;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Stores and retrieves encrypted site-level tokens as a WordPress option.
 *
 * Used for client_credentials tokens (site-level, no user context).
 * The option key is scoped by issuer so that switching issuers
 * isolates all stored data.
 */
class Token_Storage implements Token_Storage_Interface {

	private const OPTION_KEY_PREFIX  = 'wpseo_myyoast_site_tokens_';
	private const ENCRYPTION_CONTEXT = 'yoast-myyoast-site-tokens';

	/**
	 * The encryption service.
	 *
	 * @var Encryption
	 */
	private $encryption;

	/**
	 * The issuer configuration.
	 *
	 * @var Issuer_Config
	 */
	private $issuer_config;

	/**
	 * Token_Storage constructor.
	 *
	 * @param Encryption    $encryption    The encryption service.
	 * @param Issuer_Config $issuer_config The issuer configuration.
	 */
	public function __construct( Encryption $encryption, Issuer_Config $issuer_config ) {
		$this->encryption    = $encryption;
		$this->issuer_config = $issuer_config;
		$this->logger        = new NullLogger();
	}

	/**
	 * Stores a token set (encrypted).
	 *
	 * @param Token_Set $token_set The token set to store.
	 *
	 * @return void
	 *
	 * @throws Token_Storage_Exception If encryption fails.
	 */
	public function store( Token_Set $token_set ): void {
		try {
			// phpcs:ignore Yoast.Yoast.JsonEncodeAlternative.Found -- Encoding for encrypted storage, not user-facing output.
			$json = \wp_json_encode( $token_set->to_array() );
			if ( $json === false ) {
				throw new Token_Storage_Exception( 'Failed to JSON-encode token set for storage.' );
			}

			$encrypted = $this->encryption->encrypt( $json, self::ENCRYPTION_CONTEXT );
		}
		catch ( Encryption_Exception $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new Token_Storage_Exception( 'Failed to encrypt token set for storage: ' . $e->getMessage(), 0, $e );
		}

		\update_option( $this->get_option_key(), $encrypted, false );
	}

	/**
	 * Retrieves the stored token set.
	 *
	 * @return Token_Set|null The token set, or null if not stored or decryption fails.
	 */
	public function get(): ?Token_Set {
		$stored = \get_option( $this->get_option_key(), '' );
		if ( ! \is_string( $stored ) || $stored === '' ) {
			return null;
		}

		try {
			$decrypted = $this->encryption->decrypt( $stored, self::ENCRYPTION_CONTEXT );
			$data      = \json_decode( $decrypted, true, 512, \JSON_THROW_ON_ERROR );

			if ( ! \is_array( $data ) || empty( $data['access_token'] ) ) {
				return null;
			}

			return Token_Set::from_array( $data );
		}
		catch ( Exception $e ) {
			return null;
		}
	}

	/**
	 * Deletes the stored token set.
	 *
	 * @return void
	 */
	public function delete(): void {
		\delete_option( $this->get_option_key() );
	}

	/**
	 * Returns the issuer-scoped option key.
	 *
	 * @return string The option key.
	 */
	private function get_option_key(): string {
		return self::OPTION_KEY_PREFIX . $this->issuer_config->get_issuer_key();
	}
}
