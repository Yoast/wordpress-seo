<?php

namespace Yoast\WP\SEO\AI_Generator\Infrastructure;

use RuntimeException;
use Yoast\WP\SEO\Helpers\User_Helper;

/**
 * Class Refresh_Token_Repository
 * Handles the storage and retrieval of refresh tokens for users.
 */
class Refresh_Token_User_Meta_Repository implements Token_User_Meta_Repository_Interface {

	private const META_KEY = '_yoast_wpseo_ai_generator_refresh_jwt';

	/**
	 * The user helper.
	 *
	 * @var User_Helper
	 */
	private $user_helper;

	/**
	 * Refresh_Token_Repository constructor.
	 *
	 * @param User_Helper $user_helper The user helper.
	 */
	public function __construct( User_Helper $user_helper ) {
		$this->user_helper = $user_helper;
	}

	/**
	 * Get the token for a user.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return string The token data.
	 *
	 * @throws RuntimeException If the token is not found or invalid.
	 */
	public function get_token( int $user_id ): string {
		$access_jwt = $this->user_helper->get_meta( $user_id, self::META_KEY, true );
		if ( ! \is_string( $access_jwt ) || $access_jwt === '' ) {
			throw new RuntimeException( 'Unable to retrieve the access token.' );
		}

		return $access_jwt;
	}

	/**
	 * Store the token for a user.
	 *
	 * @param int    $user_id    The user ID.
	 * @param string $value      The token value.
	 * @param int    $expiration The expiration time.
	 *
	 * @return void
	 */
	public function store_token( int $user_id, string $value, int $expiration ): void {
		\update_user_meta(
			$user_id,
			self::META_KEY,
			[
				'value'      => $value,
				'expiration' => $expiration,
			]
		); }

	/**
	 * Delete the token for a user.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return void
	 */
	public function delete_token( int $user_id ): void {
		\delete_user_meta( $user_id, self::META_KEY ); }
}
