<?php

namespace Yoast\WP\SEO\Actions;

use Exception;
use Yoast\WP\SEO\Helpers\User_Helper;

/**
 * Settings_Introduction_Action class.
 *
 * @deprecated 20.7
 * @codeCoverageIgnore
 */
class Settings_Introduction_Action {

	const USER_META_KEY = '_yoast_settings_introduction';

	const DEFAULT_VALUES = [
		'wistia_embed_permission' => false,
		'show'                    => true,
	];

	/**
	 * Holds the User_Helper instance.
	 *
	 * @var User_Helper
	 */
	private $user_helper;

	/**
	 * Constructs Settings_Introduction_Action.
	 *
	 * @param User_Helper $user_helper The User_Helper.
	 *
	 * @deprecated 20.7
	 * @codeCoverageIgnore
	 */
	public function __construct( User_Helper $user_helper ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.7' );

		$this->user_helper = $user_helper;
	}

	/**
	 * Retrieves the Wistia embed permission value.
	 *
	 * @throws Exception If an invalid user ID is supplied.
	 *
	 * @deprecated 20.7
	 * @codeCoverageIgnore
	 *
	 * @return bool The value of the Wistia embed permission.
	 */
	public function get_wistia_embed_permission() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.7' );

		$user_id = $this->user_helper->get_current_user_id();
		$values  = $this->get_values_for_user( $user_id );

		return $values['wistia_embed_permission'];
	}

	/**
	 * Sets the Wistia embed permission value.
	 *
	 * @param bool $value The value.
	 *
	 * @throws Exception If an invalid user ID is supplied.
	 *
	 * @deprecated 20.7
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether the update was successful.
	 */
	public function set_wistia_embed_permission( $value ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.7' );

		$user_id = $this->user_helper->get_current_user_id();
		$values  = $this->get_values_for_user( $user_id );

		// Check if there is anything to update.
		if ( $values['wistia_embed_permission'] === $value ) {
			return true;
		}

		$values['wistia_embed_permission'] = $value;

		return $this->user_helper->update_meta( $user_id, self::USER_META_KEY, $values ) !== false;
	}

	/**
	 * Retrieves the show value.
	 *
	 * @throws Exception If an invalid user ID is supplied.
	 *
	 * @deprecated 20.7
	 * @codeCoverageIgnore
	 *
	 * @return bool The value of show.
	 */
	public function get_show() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.7' );

		$user_id = $this->user_helper->get_current_user_id();
		$values  = $this->get_values_for_user( $user_id );

		return $values['show'];
	}

	/**
	 * Sets the show value.
	 *
	 * @param bool $value The value.
	 *
	 * @throws Exception If an invalid user ID is supplied.
	 *
	 * @deprecated 20.7
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether the update was successful.
	 */
	public function set_show( $value ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.7' );

		$user_id = $this->user_helper->get_current_user_id();
		$values  = $this->get_values_for_user( $user_id );

		// Check if there is anything to update.
		if ( $values['show'] === $value ) {
			return true;
		}

		$values['show'] = $value;

		return $this->user_helper->update_meta( $user_id, self::USER_META_KEY, $values ) !== false;
	}

	/**
	 * Retrieves the (meta) values for a user.
	 *
	 * @param int $user_id User ID.
	 *
	 * @throws Exception If an invalid user ID is supplied.
	 *
	 * @return array The (meta) values.
	 */
	private function get_values_for_user( $user_id ) {
		$values = $this->user_helper->get_meta( $user_id, self::USER_META_KEY, true );
		if ( $values === false ) {
			throw new Exception( 'Invalid User ID' );
		}

		if ( \is_array( $values ) && \array_key_exists( 'wistia_embed_permission', $values ) && \array_key_exists( 'show', $values ) ) {
			return $values;
		}

		// Why could $values be invalid?
		// - When the database row does not exist yet, $values can be an empty string.
		// - Faulty data was stored?
		return self::DEFAULT_VALUES;
	}
}
