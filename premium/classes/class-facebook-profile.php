<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * This class represents the fetching of a full name for a user who has filled in a facebook profile url. The class
 * will try to fetch the full name via the facebook following plugin (widget). If the user has chosen to disallow
 * following of his profile, there isn't returned any name - only an empty string.
 *
 * To prevent doing request all the time, the obtained name will be stored as user meta for the user.
 */
class WPSEO_Facebook_Profile {

	const USER_META_NAME = 'yoast_facebook_name';

	/**
	 * @var string URL providing us the full name belonging to the user.
	 */
	private $facebook_endpoint = 'https://www.facebook.com/plugins/follow.php?href=';

	/**
	 * @var int The given user id.
	 */
	private $user_id;

	/**
	 * Sets the AJAX action hook, to catch the AJAX request for getting the name on facebook.
	 */
	public function set_hooks() {
		add_action( 'wp_ajax_wpseo_get_facebook_name', array( $this, 'ajax_get_facebook_name' ) );
	}

	/**
	 * Sets the user id and prints the full facebook name.
	 */
	public function ajax_get_facebook_name() {
		if ( defined( 'DOING_AJAX' ) && DOING_AJAX  ) {

			check_ajax_referer( 'get_facebook_name' );

			$this->user_id = (int) filter_input( INPUT_GET, 'user_id' );

			wp_die( $this->get_name() );
		}
	}

	/**
	 * Get the name used on facebook from the user meta cache, if there isn't any set, fetch it from the facebook follow widget.
	 *
	 * @return string
	 */
	private function get_name() {
		$cached_facebook_name = $this->get_cached_name();
		if ( $cached_facebook_name ) {
			return $cached_facebook_name;
		}

		$facebook_profile = get_the_author_meta( 'facebook', $this->user_id );
		if ( $facebook_profile ) {
			$facebook_name = $this->get_name_from_facebook( $facebook_profile );

			if ( ! empty( $facebook_name ) ) {
				$this->set_cached_name( $facebook_name );
			}

			return $facebook_name;
		}

		return '';
	}

	/**
	 * Returns the stored name from the user meta.
	 *
	 * @return string
	 */
	private function get_cached_name() {
		return get_user_meta( $this->user_id, self::USER_META_NAME, true );
	}

	/**
	 * Stores the fetched facebook name to the user meta.
	 *
	 * @param string $facebook_name The name the user got on facebook.
	 */
	private function set_cached_name( $facebook_name ) {
		update_user_meta( $this->user_id, self::USER_META_NAME, $facebook_name );
	}

	/**
	 * Do request to facebook to get the HTML for the follow widget.
	 *
	 * @param string $facebook_profile The profile URL to lookup.
	 *
	 * @return string
	 */
	private function get_name_from_facebook( $facebook_profile ) {
		$response = wp_remote_get(
			$this->facebook_endpoint . $facebook_profile,
			array(
				'headers' => array( 'Accept-Language' => 'en_US' ),
			)
		);

		if ( wp_remote_retrieve_response_code( $response ) === 200 ) {
			$full_name = $this->extract_name_from_response(
				wp_remote_retrieve_body( $response )
			);

			return $full_name;
		}

		return '';
	}

	/**
	 * Try to extract the full name from the response.
	 *
	 * @param string $response_body The response HTML to lookup for the full name.
	 *
	 * @return string
	 */
	private function extract_name_from_response( $response_body ) {
		$full_name_regex = '/<div class="pluginButton pluginButtonInline pluginConnectButtonDisconnected" title="Follow(.*)&#039;s public updates">/i';

		if ( preg_match( $full_name_regex, $response_body, $matches ) ) {
			if ( ! empty( $matches[1] ) ) {
				return $matches[1];
			}
		}

		return '';
	}
}
