<?php

namespace Yoast\WP\SEO\AI_Authorization\Domain;

/**
 * Class Code_Verifier representing a challenge code and its creation time.
 * This is used during the authorization process to verify the user requesting a token.
 *
 * @deprecated 27.5
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
	 * @return string The code.
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function get_code(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.5', 'Update Yoast SEO premium to 27.4' );

		return $this->code;
	}

	/**
	 * Get the creation time of the code.
	 *
	 * @return int The creation time of the code.
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function get_created_at(): int {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.5', 'Update Yoast SEO premium to 27.4' );

		return $this->created_at;
	}

	/**
	 * Check if the code is expired.
	 *
	 * @param int $validity_in_seconds The validity of the code in seconds.
	 *
	 * @return bool True if the code is expired, false otherwise.
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function is_expired( int $validity_in_seconds ): bool {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.5', 'Update Yoast SEO premium to 27.4' );

		return $this->created_at < ( \time() - $validity_in_seconds );
	}
}
