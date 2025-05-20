<?php

namespace Yoast\WP\SEO\AI_Authorization\Application;

use RuntimeException;
use Yoast\WP\SEO\AI_Authorization\Domain\Verification_Code;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Verification_Code_User_Meta_Repository;
use Yoast\WP\SEO\Helpers\Date_Helper;
/**
 * Class Code_Verifier_Service
 * Handles the generation and validation of verification codes for users.
 */
class Code_Verifier {
	private const VALIDITY_IN_SECONDS = 300; // 5 minutes

	/**
	 * The date helper.
	 *
	 * @var Date_Helper
	 */
	private $date_helper;

	/**
	 * The verification code repository.
	 *
	 * @var Verification_Code_User_Meta_Repository
	 */
	private $verification_code_repository;

	/**
	 * Code_Verifier_Service constructor.
	 *
	 * @param Date_Helper                            $date_helper                  The date helper.
	 * @param Verification_Code_User_Meta_Repository $verification_code_repository The verification code repository.
	 */
	public function __construct( Date_Helper $date_helper, Verification_Code_User_Meta_Repository $verification_code_repository ) {
		$this->date_helper                  = $date_helper;
		$this->verification_code_repository = $verification_code_repository;
	}

	/**
	 * Generate a verification code for a user.
	 *
	 * @param int    $user_id    The user ID.
	 * @param string $user_email The user email.
	 *
	 * @return Verification_Code The generated verification code.
	 */
	public function generate( int $user_id, string $user_email ): Verification_Code {
		$random_string = \substr( \str_shuffle( '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' ), 1, 10 );
		$code          = \hash( 'sha256', $user_email . $random_string );
		$created_at    = $this->date_helper->current_time();

		return new Verification_Code( $code, $created_at );
	}

	/**
	 * Validate the verification code for a user.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return string The verification code.
	 *
	 * @throws RuntimeException If the verification code is expired or invalid.
	 */
	public function validate( int $user_id ): string {
		$verification_code = $this->verification_code_repository->get_verification_code( $user_id );

		if ( $verification_code === null || $verification_code->is_expired( self::VALIDITY_IN_SECONDS ) ) {
			$this->verification_code_repository->delete_verification_code( $user_id );
			throw new RuntimeException( 'Verification code has expired or is invalid.' );
		}

		return $verification_code->get_code();
	}
}
