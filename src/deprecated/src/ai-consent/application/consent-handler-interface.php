<?php

namespace Yoast\WP\SEO\AI_Consent\Application;

/**
 * Interface Consent_Handler_Interface
 *
 * This interface defines the methods for handling user consent.
 *
 * @deprecated 27.7
 * @codeCoverageIgnore
 */
interface Consent_Handler_Interface {

	/**
	 * Handles consent revoked by deleting the consent user metadata from the database.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return void
	 */
	public function revoke_consent( int $user_id );

	/**
	 * Handles consent granted by adding the consent user metadata to the database.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return void
	 */
	public function grant_consent( int $user_id );
}
