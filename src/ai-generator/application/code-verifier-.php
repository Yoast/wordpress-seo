<?php

namespace Yoast\WP\SEO\AI_Generator\application;

use RuntimeException;
use Yoast\WP\SEO\AI_Generator\Domain\Verification_Code;
use Yoast\WP\SEO\AI_Generator\Infrastructure\Verification_Code_User_Meta_Repository;

/**
 * Class Code_Verifier_Service
 * Handles the generation and validation of code verifiers for users.
 */
class Code_Verifier_Service {
	private const VALIDITY_IN_SECONDS = 300; // 5 minutes

	/**
	 * The code verifier repository.
	 *
	 * @var Verification_Code_User_Meta_Repository
	 */
	private $code_verifier_repository;

	/**
	 * Code_Verifier_Service constructor.
	 *
	 * @param Verification_Code_User_Meta_Repository $code_verifier_repository The code verifier repository.
	 */
	public function __construct( Verification_Code_User_Meta_Repository $code_verifier_repository ) {
		$this->code_verifier_repository = $code_verifier_repository;
	}

	/**
	 * Generate a code verifier for a user.
	 *
	 * @param int    $user_id    The user ID.
	 * @param string $user_email The user email.
	 *
	 * @return Verification_Code The generated code verifier.
	 */
	public function generate( int $user_id, string $user_email ): Verification_Code {
		$random_string = \substr( \str_shuffle( '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' ), 1, 10 );
		$code          = \hash( 'sha256', $user_email . $random_string );
		$created_at    = \time();

		$this->code_verifier_repository->store_code_verifier( $user_id, $code, $created_at );

		return new Verification_Code( $code, $created_at );
	}

	/**
	 * Validate the code verifier for a user.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return string The code verifier.
	 *
	 * @throws RuntimeException If the code verifier is expired or invalid.
	 */
	public function validate( int $user_id ): string {
		$code_verifier = $this->code_verifier_repository->get_code_verifier( $user_id );

		if ( $code_verifier === null || $code_verifier->is_expired( self::VALIDITY_IN_SECONDS ) ) {
			$this->code_verifier_repository->delete_code_verifier( $user_id );
			throw new RuntimeException( 'Code verifier has expired or is invalid.' );
		}

		return $code_verifier->get_code();
	}
}
