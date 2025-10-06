<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI_Authorization\Domain;

/**
 * Class Code_Verifier representing a challenge code and its creation time.
 * This is used during the authorization process to verify the user requesting a token.
 *
deprecated 26.3
 * @codeCoverageIgnore
 */
class Code_Verifier {

	/**
	 * The code.
	 *
	 * @var string
	 */
	private $code;

	/**
	 * The time the code was created.
	 *
	 * @var int
	 */
	private $created_at;

	/**
	 * Code_Verifier constructor.
	 *
	deprecated 26.3
	 * @codeCoverageIgnore
	 *
	 * @param string $code       The code.
	 * @param int    $created_at The time the code was created.
	 */
	public function __construct( string $code, int $created_at ) {

		$this->code       = $code;
		$this->created_at = $created_at;
	}

	/**
	 * Get the code.
	 *
	deprecated 26.3
	 * @codeCoverageIgnore
	 *
	 * @return string The code.
	 */
	public function get_code(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.3', 'Yoast\WP\SEO\AI\Authorization\Domain\Code_Verifier::get_code' );

		return $this->code;
	}

	/**
	 * Get the creation time of the code.
	 *
	 * @deprecated
	 * @codeCoverageIgnore
	 *
	 * @return int The creation time of the code.
	 */
	public function get_created_at(): int {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.3', 'Yoast\WP\SEO\AI\Authorization\Domain\Code_Verifier::get_created_at' );

		return $this->created_at;
	}

	/**
	 * Check if the code is expired.
	 *
	 * @deprecated
	 * @codeCoverageIgnore
	 *
	 * @param int $validity_in_seconds The validity of the code in seconds.
	 *
	 * @return bool True if the code is expired, false otherwise.
	 */
	public function is_expired( int $validity_in_seconds ): bool {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.3', 'Yoast\WP\SEO\AI\Authorization\Domain\Code_Verifier::is_expired' );

		return $this->created_at < ( \time() - $validity_in_seconds );
	}
}
