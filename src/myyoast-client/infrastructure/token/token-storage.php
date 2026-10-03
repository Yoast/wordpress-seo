<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\Token;

use Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Storage_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Token_Storage_Interface;
use Yoast\WP\SEO\MyYoast_Client\Domain\Resource_Indicator;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Encryption;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Encryption_Exception;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Issuer_Config;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Stores and retrieves encrypted site-level tokens as WordPress options.
 *
 * Used for client_credentials tokens (site-level, no user context). Tokens
 * are bucketed per RFC 8707 resource indicator so a site can hold one token
 * per resource server. Each (issuer, resource bucket) pair maps to a
 * separate option row.
 *
 * Key layout:
 *   - Default bucket:  wpseo_myyoast_site_tokens_{issuer_key}
 *   - Resource bucket: wpseo_myyoast_site_tokens_{issuer_key}_{sha1_prefix}
 */
class Token_Storage implements Token_Storage_Interface, LoggerAwareInterface {
	use LoggerAwareTrait;

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
	 * Stores a token set (encrypted). The resource bucket is derived from the token's own resource indicator.
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

		\update_option( $this->get_option_key( $token_set->get_resource_indicator() ), $encrypted, false );
	}

	/**
	 * Retrieves the stored token set for a resource bucket.
	 *
	 * @param Resource_Indicator $resource_indicator The resource indicator (use Resource_Indicator::default() for the default bucket).
	 *
	 * @return Token_Set|null The token set, or null if not stored or decryption fails.
	 */
	public function get( Resource_Indicator $resource_indicator ): ?Token_Set {
		return $this->decrypt_and_decode( \get_option( $this->get_option_key( $resource_indicator ), '' ) );
	}

	/**
	 * Deletes the stored token set for a resource bucket.
	 *
	 * @param Resource_Indicator $resource_indicator The resource indicator (use Resource_Indicator::default() for the default bucket).
	 *
	 * @return void
	 */
	public function delete( Resource_Indicator $resource_indicator ): void {
		\delete_option( $this->get_option_key( $resource_indicator ) );
	}

	/**
	 * Returns every stored token set across resource buckets.
	 *
	 * @return Token_Set[] The stored token sets.
	 */
	public function get_all(): array {
		global $wpdb;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Accuracy over performance.
		$rows   = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT option_value FROM {$wpdb->options} WHERE option_name LIKE %s",
				$wpdb->esc_like( $this->get_option_key_prefix_for_current_issuer() ) . '%',
			),
			\ARRAY_A,
		);
		$tokens = [];
		foreach ( ( \is_array( $rows ) ? $rows : [] ) as $row ) {
			$token = $this->decrypt_and_decode( ( $row['option_value'] ?? '' ) );
			if ( $token !== null ) {
				$tokens[] = $token;
			}
		}

		return $tokens;
	}

	/**
	 * Deletes every stored token set across resource buckets for the current issuer.
	 *
	 * @return void
	 */
	public function delete_all(): void {
		$this->bulk_delete_by_prefix( $this->get_option_key_prefix_for_current_issuer() );
	}

	/**
	 * Deletes every stored token set across all issuers and resource buckets.
	 *
	 * @return void
	 */
	public function delete_all_issuers(): void {
		$this->bulk_delete_by_prefix( self::OPTION_KEY_PREFIX );
	}

	/**
	 * Deletes every option whose name starts with the given prefix.
	 *
	 * @param string $prefix The option-name prefix.
	 *
	 * @return void
	 */
	private function bulk_delete_by_prefix( string $prefix ): void {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Bulk cleanup.
		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
				$wpdb->esc_like( $prefix ) . '%',
			),
		);
	}

	/**
	 * Decrypts and decodes a stored option value into a Token_Set.
	 *
	 * @param string|false|null $stored The stored value.
	 *
	 * @return Token_Set|null The token set, or null on absence/failure.
	 */
	private function decrypt_and_decode( $stored ): ?Token_Set {
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
			$this->logger->error( 'Failed to decrypt stored site token: {error}', [ 'error' => $e->getMessage() ] );
			return null;
		}
	}

	/**
	 * Returns the option key prefix for the current issuer.
	 *
	 * @return string The option key prefix.
	 */
	private function get_option_key_prefix_for_current_issuer(): string {
		return self::OPTION_KEY_PREFIX . $this->issuer_config->get_issuer_key();
	}

	/**
	 * Returns the option key for a resource bucket.
	 *
	 * The default bucket has no suffix and shares its key with pre-RFC-8707
	 * installs. Explicit resource indicators get a sha1-hash suffix joined
	 * by an underscore.
	 *
	 * @param Resource_Indicator $resource_indicator The resource indicator.
	 *
	 * @return string The option key.
	 */
	private function get_option_key( Resource_Indicator $resource_indicator ): string {
		$key = $this->get_option_key_prefix_for_current_issuer();
		if ( $resource_indicator->is_default() ) {
			return $key;
		}

		return $key . '_' . \substr( \sha1( $resource_indicator->value() ), 0, 12 );
	}
}
