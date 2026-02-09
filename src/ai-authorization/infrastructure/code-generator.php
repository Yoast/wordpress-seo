<?php

namespace Yoast\WP\SEO\AI_Authorization\Infrastructure;

use Yoast\WP\SEO\AI_Authorization\Application\Code_Generator_Interface;

/**
 * Class Code_Generator.
 */
class Code_Generator implements Code_Generator_Interface {

	/**
	 * Generates a unique code using the user's email and random data.
	 *
	 * @param string $user_email The user's email.
	 * @param int    $length     The length of the returned value.
	 *
	 * @return string The generated unique code.
	 */
	public function generate( string $user_email, int $length = 10 ): string {
		$data = $user_email . \wp_generate_password( $length, false );
		return \hash( 'sha256', $data );
	}
}
