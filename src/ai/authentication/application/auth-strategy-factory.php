<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Authentication\Application;

use WP_User;
use Yoast\WP\SEO\AI\Authentication\Domain\Auth_Method;
use Yoast\WP\SEO\Conditionals\MyYoast_Connection_Conditional;
use Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client;

/**
 * Selects an Auth_Strategy_Interface for each outbound AI request.
 *
 * Selection order (first match wins): wpseo_ai_auth_method filter override → feature flag check →
 * MyYoast client registered → site-wide connection established. The auth model is site-wide: once
 * any admin has completed the auth-code flow, every WP user on the site uses the OAuth strategy.
 */
class Auth_Strategy_Factory {

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
	 * @param MyYoast_Connection_Conditional $myyoast_connection_conditional The MyYoast connection feature flag.
	 * @param MyYoast_Client                 $myyoast_client                 The MyYoast OAuth client.
	 * @param OAuth_Auth_Strategy            $oauth_strategy                 The OAuth strategy.
	 * @param Token_Auth_Strategy            $token_strategy                 The Token strategy.
	 */
	public function __construct(
		MyYoast_Connection_Conditional $myyoast_connection_conditional,
		MyYoast_Client $myyoast_client,
		OAuth_Auth_Strategy $oauth_strategy,
		Token_Auth_Strategy $token_strategy
	) {
		$this->myyoast_connection_conditional = $myyoast_connection_conditional;
		$this->myyoast_client                 = $myyoast_client;
		$this->oauth_strategy                 = $oauth_strategy;
		$this->token_strategy                 = $token_strategy;
	}

	/**
	 * Returns the strategy that should authenticate the AI request for the given user.
	 *
	 * @param WP_User $user The WP user.
	 *
	 * @return Auth_Strategy_Interface The selected strategy.
	 */
	public function create( WP_User $user ): Auth_Strategy_Interface {
		$forced = $this->get_filter_override( $user );
		if ( $forced === Auth_Method::OAUTH ) {
			return $this->oauth_strategy;
		}
		if ( $forced === Auth_Method::TOKEN ) {
			return $this->token_strategy;
		}

		if ( ! $this->myyoast_connection_conditional->is_met() ) {
			return $this->token_strategy;
		}

		if ( ! $this->myyoast_client->is_registered() ) {
			return $this->token_strategy;
		}

		if ( ! $this->myyoast_client->is_site_connected() ) {
			return $this->token_strategy;
		}

		return $this->oauth_strategy;
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
