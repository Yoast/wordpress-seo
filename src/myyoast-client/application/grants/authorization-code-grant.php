<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Grants;

use SensitiveParameter;

/**
 * Grant strategy for the Authorization Code flow (RFC 6749 Section 4.1).
 *
 * Provides the authorization code, redirect URI, and PKCE code verifier
 * for the token exchange request.
 */
class Authorization_Code_Grant implements Grant_Strategy_Interface {

	/**
	 * The authorization code received from the callback.
	 *
	 * @var string
	 */
	private $code;

	/**
	 * The redirect URI used in the original authorization request.
	 *
	 * @var string
	 */
	private $redirect_uri;

	/**
	 * The PKCE code verifier for this authorization flow.
	 *
	 * @var string
	 */
	private $code_verifier;

	/**
	 * Authorization_Code_Grant constructor.
	 *
	 * @param string $code          The authorization code.
	 * @param string $redirect_uri  The redirect URI.
	 * @param string $code_verifier The PKCE code verifier.
	 */
	public function __construct(
		// phpcs:ignore PHPCompatibility.Attributes.NewAttributes.PHPNativeAttributeFound -- No-op on PHP < 8.2; redacts parameter from stack traces on PHP 8.2+.
		#[SensitiveParameter]
		string $code,
		string $redirect_uri,
		// phpcs:ignore PHPCompatibility.Attributes.NewAttributes.PHPNativeAttributeFound -- No-op on PHP < 8.2; redacts parameter from stack traces on PHP 8.2+.
		#[SensitiveParameter]
		string $code_verifier
	) {
		$this->code          = $code;
		$this->redirect_uri  = $redirect_uri;
		$this->code_verifier = $code_verifier;
	}

	/**
	 * Returns the grant type identifier.
	 *
	 * @return string
	 */
	public function get_grant_type(): string {
		return 'authorization_code';
	}

	/**
	 * Returns the grant-specific parameters.
	 *
	 * @return array<string, string>
	 */
	public function get_grant_params(): array {
		return [
			'code'          => $this->code,
			'redirect_uri'  => $this->redirect_uri,
			'code_verifier' => $this->code_verifier,
		];
	}
}
