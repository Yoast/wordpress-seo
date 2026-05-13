<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Authentication\Application;

use WP_User;
use Yoast\WP\SEO\AI\Authentication\Domain\Auth_Method;
use Yoast\WP\SEO\AI\HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\Conditionals\MyYoast_Connection_Conditional;
use Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Builds an AI_Request_Sender configured with the right auth strategy (primary + optional fallback)
 * for each outbound AI request.
 *
 * Selection order (first match wins): wpseo_ai_auth_method filter override → feature flag check →
 * MyYoast client registered → site has any user token. The auth model is site-wide: once any admin
 * has completed the auth-code flow, every WP user on the site uses the OAuth path.
 */
class AI_Request_Sender_Factory implements LoggerAwareInterface {

	use LoggerAwareTrait;

	/**
	 * The AI request handler.
	 *
	 * @var Request_Handler
	 */
	private $request_handler;

	/**
	 * The MyYoast connection feature flag conditional.
	 *
	 * @var MyYoast_Connection_Conditional
	 */
	private $myyoast_connection_conditional;

	/**
	 * The MyYoast OAuth client.
	 *
	 * @var MyYoast_Client
	 */
	private $myyoast_client;

	/**
	 * The OAuth strategy.
	 *
	 * @var OAuth_Auth_Strategy
	 */
	private $oauth_strategy;

	/**
	 * The Token strategy.
	 *
	 * @var Token_Auth_Strategy
	 */
	private $token_strategy;

	/**
	 * Constructor.
	 *
	 * @param Request_Handler                $request_handler                The AI request handler.
	 * @param MyYoast_Connection_Conditional $myyoast_connection_conditional The MyYoast connection feature flag.
	 * @param MyYoast_Client                 $myyoast_client                 The MyYoast OAuth client.
	 * @param OAuth_Auth_Strategy            $oauth_strategy                 The OAuth strategy.
	 * @param Token_Auth_Strategy            $token_strategy                 The Token strategy.
	 */
	public function __construct(
		Request_Handler $request_handler,
		MyYoast_Connection_Conditional $myyoast_connection_conditional,
		MyYoast_Client $myyoast_client,
		OAuth_Auth_Strategy $oauth_strategy,
		Token_Auth_Strategy $token_strategy
	) {
		$this->request_handler                = $request_handler;
		$this->myyoast_connection_conditional = $myyoast_connection_conditional;
		$this->myyoast_client                 = $myyoast_client;
		$this->oauth_strategy                 = $oauth_strategy;
		$this->token_strategy                 = $token_strategy;
		$this->logger                         = new NullLogger();
	}

	/**
	 * Returns the sender configured to authenticate AI requests for the given user.
	 *
	 * @param WP_User $user The WP user.
	 *
	 * @return AI_Request_Sender The configured sender.
	 */
	public function create( WP_User $user ): AI_Request_Sender {
		if ( $this->should_use_oauth( $user ) ) {
			return new AI_Request_Sender( $this->request_handler, $this->oauth_strategy, $this->token_strategy );
		}
		return new AI_Request_Sender( $this->request_handler, $this->token_strategy );
	}

	/**
	 * Whether the OAuth strategy should be the primary for this request.
	 *
	 * @param WP_User $user The WP user.
	 *
	 * @return bool True to use OAuth (with Token fallback); false to use Token alone.
	 */
	private function should_use_oauth( WP_User $user ): bool {
		$forced = $this->get_filter_override( $user );
		if ( $forced === Auth_Method::OAUTH ) {
			$this->logger->debug( 'AI auth: wpseo_ai_auth_method filter pinned oauth.' );
			return true;
		}
		if ( $forced === Auth_Method::TOKEN ) {
			$this->logger->debug( 'AI auth: wpseo_ai_auth_method filter pinned token.' );
			return false;
		}

		if ( ! $this->myyoast_connection_conditional->is_met() ) {
			$this->logger->debug( 'AI auth: routing to token strategy (MYYOAST_CONNECTION feature flag is off).' );
			return false;
		}

		if ( ! $this->myyoast_client->is_registered() ) {
			$this->logger->debug( 'AI auth: routing to token strategy (MyYoast OAuth client not registered).' );
			return false;
		}

		if ( ! $this->myyoast_client->has_any_user_token() ) {
			$this->logger->debug( 'AI auth: routing to token strategy (no user has completed auth-code flow on this site yet).' );
			return false;
		}

		$this->logger->debug( 'AI auth: routing to oauth strategy (all gates passed).' );
		return true;
	}

	/**
	 * Returns the strategy forced by the wpseo_ai_auth_method filter, or null when not pinned.
	 *
	 * @param WP_User $user The WP user.
	 *
	 * @return string|null One of the Auth_Method constants, or null.
	 */
	private function get_filter_override( WP_User $user ): ?string {
		/**
		 * Filter: 'wpseo_ai_auth_method' - Pin a specific AI auth strategy for QA / staged rollout.
		 *
		 * Return 'oauth' to force MyYoast OAuth (runtime fallback to the Token strategy on persistent OAuth failure still applies).
		 * Return 'token' to force the legacy access_jwt flow.
		 * Return any other value (including the default null) to let the factory's normal selection logic run.
		 *
		 * @internal
		 *
		 * @param string|null $method The forced strategy, or null for default selection.
		 * @param WP_User     $user   The WP user the request is on behalf of.
		 */
		$forced = \apply_filters( 'wpseo_ai_auth_method', null, $user );

		if ( $forced === Auth_Method::OAUTH || $forced === Auth_Method::TOKEN ) {
			return $forced;
		}

		return null;
	}
}
