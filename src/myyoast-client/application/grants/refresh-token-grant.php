<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Grants;

use SensitiveParameter;

/**
 * Grant strategy for the Refresh Token flow (RFC 6749 Section 6).
 *
 * Exchanges a refresh token for new access and refresh tokens.
 */
class Refresh_Token_Grant implements Grant_Interface {

	/**
	 * The refresh token.
	 *
	 * @var string
	 */
	private $refresh_token;

	/**
	 * Refresh_Token_Grant constructor.
	 *
	 * @param string $refresh_token The refresh token.
	 */
	public function __construct(
		// phpcs:ignore PHPCompatibility.Attributes.NewAttributes.PHPNativeAttributeFound -- No-op on PHP < 8.2; redacts parameter from stack traces on PHP 8.2+.
		#[SensitiveParameter]
		string $refresh_token
	) {
		$this->refresh_token = $refresh_token;
	}

	/**
	 * Returns the grant type identifier.
	 *
	 * @return string
	 */
	public function get_grant_type(): string {
		return 'refresh_token';
	}

	/**
	 * Returns the grant-specific parameters.
	 *
	 * @return array<string, string>
	 */
	public function get_grant_params(): array {
		return [
			'refresh_token' => $this->refresh_token,
		];
	}
}
