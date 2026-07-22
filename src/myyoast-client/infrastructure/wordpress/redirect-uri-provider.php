<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\MyYoast_Client\Infrastructure\WordPress;

use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Redirect_URI_Provider_Interface;
use Yoast\WP\SEO\MyYoast_Client\Domain\Registered_Client;
use Yoast\WP\SEO\MyYoast_Client\Domain\Resource_Indicator;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\OAuth_Callback_Integration;

/**
 * WordPress implementation of the redirect URI provider.
 *
 * The canonical redirect URI is this site's `admin-post.php` OAuth callback endpoint, exposed
 * by `OAuth_Callback_Integration::get_callback_url()`. Site owners and plugins can register
 * additional URIs and override the per-flow embed URI through filters.
 */
class Redirect_URI_Provider implements Redirect_URI_Provider_Interface {

	/**
	 * Returns the redirect URIs to register this client with.
	 *
	 * Defaults to the canonical admin callback URL, which the `wpseo_myyoast_redirect_uris` filter
	 * may extend, remove, or replace. Always returns at least one URI.
	 *
	 * @return string[] The redirect URIs to register.
	 */
	public function get_redirect_uris(): array {
		$canonical = $this->get_canonical_redirect_uri();

		/**
		 * Filters the redirect URIs registered with MyYoast for this site.
		 *
		 * Use this to register additional OAuth callback URLs for non-standard setups (reverse
		 * proxies, alternate admin URLs, ...), or to replace the default callback URL entirely. The
		 * canonical admin callback URL is passed as the default and may be removed or replaced.
		 *
		 * @param string[] $redirect_uris The redirect URIs to register. Defaults to the canonical admin callback URL.
		 */
		$filtered = \apply_filters( 'wpseo_myyoast_redirect_uris', [ $canonical ] );

		$redirect_uris = $this->unique( $this->only_valid_uris( $filtered ) );

		// At least one redirect URI is required to register; fall back to the canonical URL when the filter empties the set.
		if ( $redirect_uris === [] ) {
			return [ $canonical ];
		}

		return $redirect_uris;
	}

	/**
	 * Returns the single redirect URI to embed in an authorization request.
	 *
	 * Prefers the canonical admin callback URL when the client has it registered, otherwise the
	 * first registered redirect URI. The choice may then be overridden through the
	 * `wpseo_myyoast_authorization_redirect_uri` filter, but a filtered value that is not among the
	 * client's registered redirect URIs is ignored to keep the contract's exact-match guarantee.
	 * When the client has no registered redirect URIs, the canonical admin callback URL is returned.
	 *
	 * @param Registered_Client  $client             The registered client whose redirect_uris bound the result.
	 * @param int                $user_id            The WordPress user ID starting the flow.
	 * @param string[]           $scopes             The scopes being requested.
	 * @param Resource_Indicator $resource_indicator The RFC 8707 resource indicator the token will be bound to.
	 * @param string|null        $return_url         The URL the user returns to after authorization, or null.
	 *
	 * @return string One of $client's registered redirect URIs, or the canonical admin callback URL when it has none.
	 */
	public function get_authorization_redirect_uri(
		Registered_Client $client,
		int $user_id,
		array $scopes,
		Resource_Indicator $resource_indicator,
		?string $return_url = null
	): string {
		$registered = $this->registered_redirect_uris( $client );
		$canonical  = $this->get_canonical_redirect_uri();

		// Prefer the canonical URL when it is registered; otherwise fall back to the first
		// registered URI so the value always matches one of the registered redirect_uris. When the
		// client has no registered URIs at all, default to the canonical as a last resort.
		if ( $registered === [] || \in_array( $canonical, $registered, true ) ) {
			$chosen = $canonical;
		}
		else {
			$chosen = $registered[0];
		}

		/**
		 * Filters the redirect URI embedded in a single MyYoast authorization request.
		 *
		 * The returned value must be one of the client's registered redirect URIs; a value that
		 * is not registered is ignored to avoid an OAuth redirect_uri mismatch, and the computed
		 * default is used instead.
		 *
		 * @param string             $redirect_uri       The redirect URI to embed. Must be one of $client's registered redirect_uris.
		 * @param Registered_Client  $client             The registered client for this flow.
		 * @param int                $user_id            The WordPress user ID starting the flow.
		 * @param string[]           $scopes             The scopes being requested.
		 * @param Resource_Indicator $resource_indicator The RFC 8707 resource indicator the token will be bound to.
		 * @param string|null        $return_url         The URL the user returns to after authorization, or null.
		 */
		$filtered = \apply_filters(
			'wpseo_myyoast_authorization_redirect_uri',
			$chosen,
			$client,
			$user_id,
			$scopes,
			$resource_indicator,
			$return_url,
		);

		// Honor the filtered value only when it is actually registered, to prevent a mismatch.
		if ( \is_string( $filtered ) && \in_array( $filtered, $registered, true ) ) {
			return $filtered;
		}

		return $chosen;
	}

	/**
	 * Returns the canonical admin callback redirect URI for this site.
	 *
	 * @return string The canonical redirect URI.
	 */
	private function get_canonical_redirect_uri(): string {
		return OAuth_Callback_Integration::get_callback_url();
	}

	/**
	 * Returns the client's registered redirect URIs as a set, preserving their stored order.
	 *
	 * @param Registered_Client $client The registered client.
	 *
	 * @return string[] The registered redirect URIs; empty when the client has none stored.
	 */
	private function registered_redirect_uris( Registered_Client $client ): array {
		return $this->unique( $this->only_valid_uris( $client->get_redirect_uris() ) );
	}

	/**
	 * Filters untrusted input down to its trimmed, non-empty string values, preserving order.
	 *
	 * phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- Untrusted filter/metadata input.
	 *
	 * @param mixed $uris The candidate URIs (untrusted filter or metadata input).
	 *
	 * @return string[] The trimmed, non-empty string URIs.
	 *
	 * phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
	 */
	private function only_valid_uris( $uris ): array {
		if ( ! \is_array( $uris ) ) {
			return [];
		}

		$valid = [];
		foreach ( $uris as $uri ) {
			if ( ! \is_string( $uri ) ) {
				continue;
			}

			$trimmed = \trim( $uri );
			if ( $trimmed !== '' ) {
				$valid[] = $trimmed;
			}
		}

		return $valid;
	}

	/**
	 * Reduces a list of URIs to a set (unique values), preserving first-seen order.
	 *
	 * @param string[] $uris The URIs.
	 *
	 * @return string[] The unique URIs, reindexed.
	 */
	private function unique( array $uris ): array {
		return \array_values( \array_unique( $uris ) );
	}
}
