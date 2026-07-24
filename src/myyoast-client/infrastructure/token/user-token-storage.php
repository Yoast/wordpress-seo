<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\Token;

use Exception;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Storage_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\User_Token_Storage_Interface;
use Yoast\WP\SEO\MyYoast_Client\Domain\Resource_Indicator;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Encryption;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Encryption_Exception;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Issuer_Config;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Stores and retrieves encrypted user-level tokens in wp_usermeta.
 *
 * Used for authorization code flow tokens (user-specific). Tokens are
 * bucketed per RFC 8707 resource indicator so a user can hold one token per
 * resource server. Each (issuer, user, resource bucket) maps to a separate
 * usermeta row.
 *
 * Key layout:
 *   - Default bucket:  _wpseo_myyoast_user_tokens_{issuer_key}
 *   - Resource bucket: _wpseo_myyoast_user_tokens_{issuer_key}_{sha1_prefix}
 */
class User_Token_Storage implements User_Token_Storage_Interface, LoggerAwareInterface {
	use LoggerAwareTrait;

	private const META_KEY_PREFIX    = '_wpseo_myyoast_user_tokens_';
	private const ENCRYPTION_CONTEXT = 'yoast-myyoast-user-tokens';

	/**
	 * The user helper.
	 *
	 * @var User_Helper
	 */
	private $user_helper;

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
	 * User_Token_Storage constructor.
	 *
	 * @param User_Helper   $user_helper   The user helper.
	 * @param Encryption    $encryption    The encryption service.
	 * @param Issuer_Config $issuer_config The issuer configuration.
	 */
	public function __construct( User_Helper $user_helper, Encryption $encryption, Issuer_Config $issuer_config ) {
		$this->user_helper   = $user_helper;
		$this->encryption    = $encryption;
		$this->issuer_config = $issuer_config;
		$this->logger        = new NullLogger();
	}

	/**
	 * Stores a token set for a user (encrypted). The resource bucket is derived from the token's own resource indicator.
	 *
	 * @param int       $user_id   The user ID.
	 * @param Token_Set $token_set The token set to store.
	 *
	 * @return void
	 *
	 * @throws Token_Storage_Exception If encryption fails.
	 */
	public function store( int $user_id, Token_Set $token_set ): void {
		try {
			// phpcs:ignore Yoast.Yoast.JsonEncodeAlternative.Found -- Encoding for encrypted storage, not user-facing output.
			$json = \wp_json_encode( $token_set->to_array() );
			if ( $json === false ) {
				throw new Token_Storage_Exception( 'Failed to JSON-encode token set for storage.' );
			}

			$encrypted = $this->encryption->encrypt( $json, self::ENCRYPTION_CONTEXT );
		} catch ( Encryption_Exception $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new Token_Storage_Exception( 'Failed to encrypt token set for storage: ' . $e->getMessage(), 0, $e );
		}

		$this->user_helper->update_meta( $user_id, $this->get_meta_key( $token_set->get_resource_indicator() ), $encrypted );
	}

	/**
	 * Retrieves the stored token set for a user and resource bucket.
	 *
	 * @param int                $user_id            The user ID.
	 * @param Resource_Indicator $resource_indicator The resource indicator (use Resource_Indicator::default() for the default bucket).
	 *
	 * @return Token_Set|null The token set, or null if not stored or decryption fails.
	 */
	public function get( int $user_id, Resource_Indicator $resource_indicator ): ?Token_Set {
		return $this->decrypt_and_decode( $user_id, $this->user_helper->get_meta( $user_id, $this->get_meta_key( $resource_indicator ), true ) );
	}

	/**
	 * Deletes the stored token set for a user and resource bucket.
	 *
	 * @param int                $user_id            The user ID.
	 * @param Resource_Indicator $resource_indicator The resource indicator (use Resource_Indicator::default() for the default bucket).
	 *
	 * @return void
	 */
	public function delete( int $user_id, Resource_Indicator $resource_indicator ): void {
		$this->user_helper->delete_meta( $user_id, $this->get_meta_key( $resource_indicator ) );
	}

	/**
	 * Returns every stored token set across resource buckets for a user.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return Token_Set[] The stored token sets.
	 */
	public function get_all( int $user_id ): array {
		$tokens   = [];
		$all_meta = $this->user_helper->get_meta( $user_id );
		if ( ! \is_array( $all_meta ) ) {
			return $tokens;
		}
		$prefix = $this->get_meta_key_prefix_for_current_issuer();
		foreach ( $all_meta as $key => $values ) {
			if ( \strpos( (string) $key, $prefix ) !== 0 ) {
				continue;
			}
			$stored = \is_array( $values ) ? ( $values[0] ?? '' ) : $values;
			$token  = $this->decrypt_and_decode( $user_id, $stored );
			if ( $token !== null ) {
				$tokens[] = $token;
			}
		}

		return $tokens;
	}

	/**
	 * Deletes every stored user token set across all users and resource buckets for the current issuer.
	 *
	 * @return void
	 */
	public function delete_all(): void {
		$this->bulk_delete_by_prefix( $this->get_meta_key_prefix_for_current_issuer() );
	}

	/**
	 * Deletes every stored user token set across all users, issuers, and resource buckets.
	 *
	 * @return void
	 */
	public function delete_all_issuers(): void {
		$this->bulk_delete_by_prefix( self::META_KEY_PREFIX );
	}

	/**
	 * Deletes every usermeta row whose meta_key starts with the given prefix.
	 *
	 * @param string $prefix The meta_key prefix.
	 *
	 * @return void
	 */
	private function bulk_delete_by_prefix( string $prefix ): void {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Bulk cleanup.
		$wpdb->query(
			$wpdb->prepare(
				// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- Bulk cleanup.
				"DELETE FROM {$wpdb->usermeta} WHERE meta_key LIKE %s",
				$wpdb->esc_like( $prefix ) . '%',
			),
		);
	}

	/**
	 * Decrypts and decodes a stored meta value into a Token_Set.
	 *
	 * @param int               $user_id The user ID (for logging context).
	 * @param string|false|null $stored  The stored value.
	 *
	 * @return Token_Set|null The token set, or null on absence/failure.
	 */
	private function decrypt_and_decode( int $user_id, $stored ): ?Token_Set {
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
		} catch ( Exception $e ) {
			$this->logger->error(
				'Failed to decrypt stored user token for user {user_id}: {error}',
				[
					'user_id' => $user_id,
					'error'   => $e->getMessage(),
				],
			);

			return null;
		}
	}

	/**
	 * Returns the meta key prefix for the current issuer.
	 *
	 * @return string The meta key prefix.
	 */
	private function get_meta_key_prefix_for_current_issuer(): string {
		return self::META_KEY_PREFIX . $this->issuer_config->get_issuer_key();
	}

	/**
	 * Returns the meta key for a resource bucket.
	 *
	 * The default bucket has no suffix and shares its key with pre-RFC-8707
	 * installs. Explicit resource indicators get a sha1-hash suffix joined
	 * by an underscore.
	 *
	 * @param Resource_Indicator $resource_indicator The resource indicator.
	 *
	 * @return string The meta key.
	 */
	private function get_meta_key( Resource_Indicator $resource_indicator ): string {
		$key = $this->get_meta_key_prefix_for_current_issuer();
		if ( $resource_indicator->is_default() ) {
			return $key;
		}

		return $key . '_' . \substr( \sha1( $resource_indicator->value() ), 0, 12 );
	}
}
