<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\Token;

use Exception;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Storage_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\User_Token_Storage_Interface;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Encryption;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto\Encryption_Exception;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\OIDC\Issuer_Config;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Stores and retrieves encrypted user-level tokens in wp_usermeta.
 *
 * Used for authorization code flow tokens (user-specific).
 */
class User_Token_Storage implements User_Token_Storage_Interface {

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
	 * Returns the issuer-scoped user meta key.
	 *
	 * @return string The meta key.
	 */
	private function get_meta_key(): string {
		return self::META_KEY_PREFIX . $this->issuer_config->get_issuer_key();
	}

	/**
	 * Stores a token set for a user (encrypted).
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
		}
		catch ( Encryption_Exception $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new Token_Storage_Exception( 'Failed to encrypt token set for storage: ' . $e->getMessage(), 0, $e );
		}

		$this->user_helper->update_meta( $user_id, $this->get_meta_key(), $encrypted );
	}

	/**
	 * Retrieves the stored token set for a user.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return Token_Set|null The token set, or null if not stored or decryption fails.
	 */
	public function get( int $user_id ): ?Token_Set {
		$stored = $this->user_helper->get_meta( $user_id, $this->get_meta_key(), true );
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
	 * Deletes the stored token set for a user.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return void
	 */
	public function delete( int $user_id ): void {
		$this->user_helper->delete_meta( $user_id, $this->get_meta_key() );
	}

	/**
	 * Deletes all stored user token sets across all issuers.
	 * This is used for cleanup on uninstall, as we cannot know which users had tokens stored.
	 * Uses a LIKE match on the meta key prefix to ensure tokens from all issuers are removed.
	 *
	 * @return void
	 */
	public function delete_all(): void {
		global $wpdb;

		if ( isset( $wpdb ) ) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Bulk cleanup on uninstall.
			$wpdb->query(
				$wpdb->prepare(
					// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- Bulk cleanup on uninstall.
					"DELETE FROM {$wpdb->usermeta} WHERE meta_key LIKE %s",
					$wpdb->esc_like( self::META_KEY_PREFIX ) . '%',
				),
			);
		}
	}
}
