<?php

namespace Yoast\WP\SEO\AI_Consent\Application;

use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Forbidden_Exception;

/**
 * Interface Consent_Handler_Interface
 *
 * This interface defines the methods for handling user consent.
 */
interface Consent_Handler_Interface {

	/**
	 * Handles consent revoked.
	 *
	 * By deleting the consent user metadata from the database.
	 * And then throwing a Forbidden_Exception.
	 *
	 * @param int $user_id     The user ID.
	 * @param int $status_code The status code. Defaults to 403.
	 *
	 * @return Forbidden_Exception The Forbidden_Exception.
	 */
	public function handle_consent_revoked( int $user_id, int $status_code = 403 ): Forbidden_Exception;
}
