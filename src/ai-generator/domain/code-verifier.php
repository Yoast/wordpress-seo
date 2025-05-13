<?php

namespace Yoast\WP\SEO\AI_Generator\Domain;

/**
 * Class Code_Verifier
 *
 * @package Yoast\WP\SEO\Ai_Generator\Domain
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
	 */
	public function get_code(): string {
		return $this->code;
	}

	/**
	 * Check if the code is expired.
	 *
	 * @param int $validity_in_seconds The validity of the code in seconds.
	 *
	 * @return bool True if the code is expired, false otherwise.
	 */
	public function is_expired( int $validity_in_seconds ): bool {
		return $this->created_at < ( \time() - $validity_in_seconds );
	}
}
