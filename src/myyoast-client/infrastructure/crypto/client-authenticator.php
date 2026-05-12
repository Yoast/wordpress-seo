<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\Crypto;

use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Client_Authentication_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Authenticator_Interface;

/**
 * Creates signed client_assertion JWTs for private_key_jwt authentication.
 *
 * Wraps Key_Pair_Manager and JWT_Signer to provide a single method for
 * generating client assertions, hiding key pair lifecycle from the application layer.
 */
class Client_Authenticator implements Client_Authenticator_Interface {

	/**
	 * The key pair manager.
	 *
	 * @var Key_Pair_Manager
	 */
	private $key_pair_manager;

	/**
	 * The JWT signer.
	 *
	 * @var JWT_Signer
	 */
	private $jwt_signer;

	/**
	 * Client_Authenticator constructor.
	 *
	 * @param Key_Pair_Manager $key_pair_manager The key pair manager.
	 * @param JWT_Signer       $jwt_signer       The JWT signer.
	 */
	public function __construct( Key_Pair_Manager $key_pair_manager, JWT_Signer $jwt_signer ) {
		$this->key_pair_manager = $key_pair_manager;
		$this->jwt_signer       = $jwt_signer;
	}

	/**
	 * Creates a signed client_assertion JWT for the given audience.
	 *
	 * @param string $client_id The registered client_id.
	 * @param string $audience  The audience URL (typically the token endpoint).
	 *
	 * @return string The signed client_assertion JWT.
	 *
	 * @throws Client_Authentication_Exception If key retrieval or signing fails.
	 */
	public function create_client_assertion( string $client_id, string $audience ): string {
		try {
			$key_pair = $this->key_pair_manager->get_or_create_key_pair( Key_Pair_Manager::PURPOSE_REGISTRATION );

			return $this->jwt_signer->create_client_assertion( $client_id, $audience, $key_pair );
		} catch ( Encryption_Exception | JWT_Signing_Exception $e ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Internal exception message.
			throw new Client_Authentication_Exception( 'Client assertion signing failed: ' . $e->getMessage(), 0, $e );
		}
	}
}
