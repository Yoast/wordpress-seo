<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * This class represents the fetching of a full name for a user who has filled in a Facebook profile url. The class
 * will try to fetch the full name via the Facebook following plugin (widget). If the user has chosen to disallow
 * following of his profile, there isn't returned any name - only an empty string.
 *
 * To prevent doing request all the time, the obtained name will be stored as user meta for the user.
 */
class WPSEO_Facebook_Profile {

	const TRANSIENT_NAME = 'yoast_facebook_profiles';

	/**
	 * @var string URL providing us the full name belonging to the user.
	 */
	private $facebook_endpoint = 'https://www.facebook.com/plugins/follow.php?href=';

	/**
	 * Sets the AJAX action hook, to catch the AJAX request for getting the name on Facebook.
	 */
	public function set_hooks() {
		add_action( 'wp_ajax_wpseo_get_facebook_name', array( $this, 'ajax_get_facebook_name' ) );
	}

	/**
	 * Sets the user id and prints the full Facebook name.
	 */
	public function ajax_get_facebook_name() {
		if ( defined( 'DOING_AJAX' ) && DOING_AJAX  ) {
			check_ajax_referer( 'get_facebook_name' );

			$user_id          = (int) filter_input( INPUT_GET, 'user_id' );
			$facebook_profile = $this->get_facebook_profile( $user_id );

			// Only try to get the name when the user has a profile set.
			if ( $facebook_profile !== '' ) {
				wp_die( $this->get_name( $facebook_profile ) );
			}

			wp_die();
		}
	}

	/**
	 * Get the Facebook profile url from the user profile. If field is not set or empty, just return empty string
	 *
	 * @param int $user_id The user to get the Facebook profile field for.
	 *
	 * @return string
	 */
	private function get_facebook_profile( $user_id ) {
		$facebook_profile = get_the_author_meta( 'facebook', $user_id );

		if ( ! empty( $facebook_profile ) ) {
			return $facebook_profile;
		}

		return '';
	}

	/**
	 * Get the name used on Facebook from the transient cache, if the name isn't fetched already get it from the Facebook
	 * follow widget.
	 *
	 * @param string $facebook_profile The profile to get.
	 *
	 * @return string
	 */
	private function get_name( $facebook_profile ) {
		$cached_facebook_name = $this->get_cached_name( $facebook_profile );
		if ( $cached_facebook_name !== false ) {
			return $cached_facebook_name;
		}

		$facebook_name = $this->get_name_from_facebook( $facebook_profile );

		$this->set_cached_name( $facebook_profile, $facebook_name );

		return $facebook_name;
	}

	/**
	 * Returns the stored name from the user meta.
	 *
	 * @param string $facebook_profile The Facebook profile to look for.
	 *
	 * @return string|boolean
	 */
	private function get_cached_name( $facebook_profile ) {
		$facebook_profiles = get_transient( self::TRANSIENT_NAME );
		if ( is_array( $facebook_profiles ) && array_key_exists( $facebook_profile, $facebook_profiles ) ) {
			return $facebook_profiles[ $facebook_profile ];
		}

		return false;
	}

	/**
	 * Stores the fetched Facebook name to the user meta.
	 *
	 * @param string $facebook_profile The Facebook profile belonging to the name.
	 * @param string $facebook_name    The name the user got on Facebook.
	 */
	private function set_cached_name( $facebook_profile, $facebook_name ) {
		$facebook_profiles = get_transient( self::TRANSIENT_NAME );

		$facebook_profiles[ $facebook_profile ] = $facebook_name;

		set_transient( self::TRANSIENT_NAME, $facebook_profiles, DAY_IN_SECONDS );
	}

	/**
	 * Do request to Facebook to get the HTML for the follow widget.
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
