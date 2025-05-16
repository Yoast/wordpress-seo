<?php

namespace Yoast\WP\SEO\AI_Generator\Infrastructure;

use RuntimeException;
use Yoast\WP\SEO\AI_Generator\Domain\Verification_Code;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
/**
 * Class Code_Verifier_Repository
 */
class Verification_Code_User_Meta_Repository {

	private const CODE_VERIFIER_VALIDITY = 300; // 5 minutes

	/**
	 * The date helper.
	 *
	 * @var Date_Helper
	 */
	private $date_helper;

	/**
	 * The user helper.
	 *
	 * @var User_Helper
	 */
	private $user_helper;

	/**
	 * Code_Verifier_Repository constructor.
	 *
	 * @param Date_Helper $date_helper The date helper.
	 * @param User_Helper $user_helper The user helper.
	 */
	public function __construct( Date_Helper $date_helper, User_Helper $user_helper ) {
		$this->date_helper = $date_helper;
		$this->user_helper = $user_helper;
	}

	/**
	 * Store the verification code for a user.
	 *
	 * @param string $code       The verification code.
	 * @param int    $user_id    The user ID.
	 * @param int    $created_at The time the code was created.
	 *
	 * @return void
	 */
	public function store_code_verifier( string $code, int $user_id, int $created_at ): void {
		$this->user_helper->update_meta(
			$user_id,
			'yoast_wpseo_ai_generator_code_verifier_for_blog_' . \get_current_blog_id(),
			[
				'code'       => $code,
				'created_at' => $created_at,
			]
		);
	}

	/**
	 * Get the verification code for a user.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return Verification_Code The verification code or null if not found.
	 *
	 *  @throws RuntimeException If the code verifier is not found or has expired.
	 */
	public function get_code_verifier( int $user_id ): ?Verification_Code {
		$data = $this->user_helper->get_meta( $user_id, 'yoast_wpseo_ai_generator_code_verifier_for_blog_' . \get_current_blog_id(), true );

		if ( ! \is_array( $data ) || ! isset( $data['code'] ) || $data['code'] === '' ) {
			throw new RuntimeException( 'Unable to retrieve the verification code.' );
		}

		if ( ! isset( $data['created_at'] ) || $data['created_at'] < ( $this->date_helper->current_time() - self::CODE_VERIFIER_VALIDITY ) ) {
			$this->delete_code_verifier( $user_id );
			throw new RuntimeException( 'Code verifier has expired.' );
		}

		return new Verification_Code( $data['code'], $data['created_at'] );
	}

	/**
	 * Delete the verification code for a user.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return void
	 */
	public function delete_code_verifier( int $user_id ): void {
		$this->user_helper->delete_meta( $user_id, 'yoast_wpseo_ai_generator_code_verifier_for_blog_' . \get_current_blog_id() );
	}
}
