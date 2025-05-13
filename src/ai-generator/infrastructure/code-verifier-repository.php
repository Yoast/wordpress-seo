<?php

namespace Yoast\WP\SEO\AI_Generator\infrastructure;

use Yoast\WP\SEO\AI_Generator\Domain\Code_Verifier;

/**
 * Class Code_Verifier_Repository
 */
class Code_Verifier_Repository {

	/**
	 * Store the code verifier for a user.
	 *
	 * @param string $code       The code verifier.
	 * @param int    $user_id    The user ID.
	 * @param int    $created_at The time the code was created.
	 *
	 * @return void
	 */
	public function store_code_verifier( string $code, int $user_id, int $created_at ): void {
		\update_user_meta(
			$user_id,
			'yoast_wpseo_ai_generator_code_verifier',
			[
				'code'       => $code,
				'created_at' => $created_at,
			]
		);
	}

	/**
	 * Get the code verifier for a user.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return Code_Verifier|null The code verifier or null if not found.
	 */
	public function get_code_verifier( int $user_id ): ?Code_Verifier {
		$data = \get_user_meta( $user_id, 'yoast_wpseo_ai_generator_code_verifier', true );

		if ( ! \is_array( $data ) || empty( $data['code'] ) || empty( $data['created_at'] ) ) {
			return null;
		}

		return new Code_Verifier( $data['code'], $data['created_at'] );
	}

	/**
	 * Delete the code verifier for a user.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return void
	 */
	public function delete_code_verifier( int $user_id ): void {
		\delete_user_meta( $user_id, 'yoast_wpseo_ai_generator_code_verifier' );
	}
}
