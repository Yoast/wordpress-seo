<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application;

use Throwable;
use Yoast\WP\SEO\Expiring_Store\Application\Expiring_Store;
use Yoast\WP\SEO\Expiring_Store\Domain\Corrupted_Value_Exception;
use Yoast\WP\SEO\Expiring_Store\Domain\Key_Not_Found_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Request_Failed_Exception;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Callback-URL-agnostic orchestration of the OAuth authorization-code callback.
 *
 * Given the already-extracted callback parameters (user id, code, state, error)
 * it performs the use-case: discard the pending flow state on a provider error,
 * exchange the code for tokens, persist the outcome for one-shot surfacing on
 * the next page load, and report it in OAuth terms. It does no transport work —
 * no `$_GET`, no redirect — so any consumer (the admin-post endpoint, a REST
 * route, WP-CLI) can drive it and translate the returned Callback_Outcome onto
 * its own surface.
 *
 * The callback runs on a redirect away from the page the flow started on, so the
 * outcome has to survive until the next page load; it is kept per-user in the
 * same Expiring_Store the in-progress flow state uses and read back once via
 * {@see consume_outcome()}.
 */
class OAuth_Callback_Handler implements LoggerAwareInterface {
	use LoggerAwareTrait;

	private const OUTCOME_KEY = 'myyoast_oauth_callback_outcome';
	private const OUTCOME_TTL = \MINUTE_IN_SECONDS;

	/**
	 * The MyYoast client facade.
	 *
	 * @var MyYoast_Client
	 */
	private $myyoast_client;

	/**
	 * The authorization code handler.
	 *
	 * @var Authorization_Code_Handler
	 */
	private $auth_code_handler;

	/**
	 * The expiring store the outcome is kept in.
	 *
	 * @var Expiring_Store
	 */
	private $expiring_store;

	/**
	 * OAuth_Callback_Handler constructor.
	 *
	 * @param MyYoast_Client             $myyoast_client    The MyYoast client facade.
	 * @param Authorization_Code_Handler $auth_code_handler The authorization code handler.
	 * @param Expiring_Store             $expiring_store    The expiring store.
	 */
	public function __construct(
		MyYoast_Client $myyoast_client,
		Authorization_Code_Handler $auth_code_handler,
		Expiring_Store $expiring_store
	) {
		$this->myyoast_client    = $myyoast_client;
		$this->auth_code_handler = $auth_code_handler;
		$this->expiring_store    = $expiring_store;
		$this->logger            = new NullLogger();
	}

	/**
	 * Handles an OAuth authorization-code callback.
	 *
	 * The outcome is persisted for the user (except for a no-op, which is not a
	 * real callback) so a later page load can surface it once, and also returned
	 * for the caller to act on immediately.
	 *
	 * @param int    $user_id The WordPress user ID the flow belongs to.
	 * @param string $code    The authorization code from the callback (empty if absent).
	 * @param string $state   The state parameter from the callback (empty if absent).
	 * @param string $error   The provider error code from the callback (empty if none).
	 *
	 * @return Callback_Outcome The outcome of the callback.
	 */
	public function handle( int $user_id, string $code, string $state, string $error ): Callback_Outcome {
		$outcome = $this->resolve( $user_id, $code, $state, $error );

		if ( ! $outcome->is_no_op() && $user_id > 0 ) {
			$this->expiring_store->persist_for_user(
				self::OUTCOME_KEY,
				$outcome->to_array(),
				self::OUTCOME_TTL,
				$user_id,
			);
		}

		return $outcome;
	}

	/**
	 * Reads and consumes the pending callback outcome for a user.
	 *
	 * Consumed-on-read so the outcome is surfaced exactly once.
	 *
	 * @param int $user_id The WordPress user ID.
	 *
	 * @return Callback_Outcome|null The outcome, or null when none is pending.
	 */
	public function consume_outcome( int $user_id ): ?Callback_Outcome {
		if ( $user_id <= 0 ) {
			return null;
		}

		try {
			$stored = $this->expiring_store->get_for_user( self::OUTCOME_KEY, $user_id );
		} catch ( Key_Not_Found_Exception | Corrupted_Value_Exception $e ) {
			return null;
		}

		$this->expiring_store->delete_for_user( self::OUTCOME_KEY, $user_id );

		if ( ! \is_array( $stored ) ) {
			return null;
		}

		return Callback_Outcome::from_array( $stored );
	}

	/**
	 * Performs the callback orchestration and classifies the result.
	 *
	 * @param int    $user_id The WordPress user ID the flow belongs to.
	 * @param string $code    The authorization code from the callback (empty if absent).
	 * @param string $state   The state parameter from the callback (empty if absent).
	 * @param string $error   The provider error code from the callback (empty if none).
	 *
	 * @return Callback_Outcome The outcome of the callback.
	 */
	private function resolve( int $user_id, string $code, string $state, string $error ): Callback_Outcome {
		if ( $error !== '' ) {
			// The provider returned an error: drop the pending flow so it can't be resumed.
			$this->auth_code_handler->discard_flow_state( $user_id );
			return Callback_Outcome::provider_error( $error );
		}

		if ( $code === '' || $state === '' ) {
			// Stale bookmark or someone hitting the callback URL directly: not a real callback.
			return Callback_Outcome::no_op();
		}

		try {
			$this->myyoast_client->exchange_authorization_code( $user_id, $code, $state );
		} catch ( Token_Request_Failed_Exception $e ) {
			return Callback_Outcome::exchange_error( $e->get_error_code() );
		} catch ( Throwable $e ) {
			$this->logger->error(
				'Unexpected error during MyYoast OAuth callback exchange for user {user_id}: {error}',
				[
					'user_id' => $user_id,
					'error'   => $e->getMessage(),
				],
			);
			// No OAuth response was produced, so there is no native error code to surface.
			return Callback_Outcome::exchange_error( null );
		}

		return Callback_Outcome::success();
	}
}
