<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Authentication\Application;

use WP_User;
use Yoast\WP\SEO\AI\Authentication\Domain\Auth_Method;
use Yoast\WP\SEO\Conditionals\MyYoast_Connection_Conditional;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Builds an AI_Request_Sender configured with the right auth strategy (primary + optional fallback)
 * for each outbound AI request.
 *
 * Selection order (first match wins): wpseo_ai_auth_method filter override → MyYoast connection
 * feature flag. The auth model is site-wide: once any admin has completed the auth-code flow,
 * every WP user on the site uses the OAuth path.
 */
class AI_Request_Sender_Factory implements LoggerAwareInterface {

	use LoggerAwareTrait;

	/**
	 * The MyYoast connection feature flag conditional.
	 *
	 * @var MyYoast_Connection_Conditional
	 */
	private $myyoast_connection_conditional;

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
	 * @param MyYoast_Connection_Conditional $myyoast_connection_conditional The MyYoast connection feature flag.
	 * @param OAuth_Auth_Strategy            $oauth_strategy                 The OAuth strategy.
	 * @param Token_Auth_Strategy            $token_strategy                 The Token strategy.
	 */
	public function __construct(
		MyYoast_Connection_Conditional $myyoast_connection_conditional,
		OAuth_Auth_Strategy $oauth_strategy,
		Token_Auth_Strategy $token_strategy
	) {
		$this->myyoast_connection_conditional = $myyoast_connection_conditional;
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
		$forced = $this->get_filter_override( $user );
		switch ( $forced ) {
			case Auth_Method::OAUTH:
				$this->logger->debug( 'AI auth: wpseo_ai_auth_method filter pinned oauth.' );
				$sender = new AI_Request_Sender( $this->oauth_strategy );
				break;
			case Auth_Method::TOKEN:
				$this->logger->debug( 'AI auth: wpseo_ai_auth_method filter pinned token.' );
				$sender = new AI_Request_Sender( $this->token_strategy );
				break;
			default:
				if ( $this->myyoast_connection_conditional->is_met() ) {
					$this->logger->debug( 'AI auth: routing to oauth strategy (feature flag on) with a fallback to legacy token auth.' );
					$sender = new AI_Request_Sender( $this->oauth_strategy, $this->token_strategy );
				}
				else {
					$this->logger->debug( 'AI auth: routing to token strategy (MYYOAST_CONNECTION feature flag is off).' );
					$sender = new AI_Request_Sender( $this->token_strategy );
				}
				break;
		}

		// Logger_Aware_Pass only auto-wires container-registered services; the sender is hand-built
		// here so its logger must be propagated explicitly, otherwise its fallback warning is dropped.
		$sender->setLogger( $this->logger );

		return $sender;
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
		 * Return 'oauth' to force MyYoast OAuth.
		 * Return 'token' to force the legacy access_jwt flow.
		 * Return any other value (including the default null) to let the factory's normal selection logic run:
		 * If OAuth is available, it will be the primary strategy with a fallback to the legacy token flow.
		 * If OAuth is unavailable, the legacy token flow will be used exclusively.
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
