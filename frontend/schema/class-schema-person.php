<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
* Class WPSEO_Schema_Person
*
* Outputs schema Person code.
*
* @since 10.1
*/
class WPSEO_Schema_Person implements WPSEO_WordPress_Integration {
	/**
	 * Registers hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'wpseo_json_ld', [ $this, 'person_output' ] );
	}

	/**
	 * Outputs a Person JSON+LD blob on team pages.
	 *
	 * @return void
	 */
	public function person_output() {
		if ( ! $this->do_person_output() ) {
			return;
		}

		$user_id = $this->determine_user_id();
		if ( ! $user_id ) {
			return;
		}

		$output = $this->build_person_data( $user_id );

		/**
		 * Filter: 'wpseo_schema_person_user_id' - Allows filtering of user ID used for person output.
		 *
		 * @param int|bool $user_id The user ID currently determined.
		 *
		 * @api array $output The current Schema Person output.
		 */
		$output = apply_filters( 'wpseo_schema_person_user_id', $output, $user_id );

		if ( ! empty( $output ) ) {
			echo "<script type='application/ld+json'>", wp_json_encode( $output ), '</script>', "\n";
		}
	}

	/**
	 * Returns a User ID on success, false on failure.
	 *
	 * @return bool|int
	 */
	private function determine_user_id() {
		$user_id = false;
		switch( true ) {
			case is_author():
				$user_id = get_queried_object_id();
				break;
			case is_front_page():
				$user_id = (int) WPSEO_Options::get( 'company_or_person_user_id', false );
				break;
			default:
				break;
		}

		/**
		 * Filter: 'wpseo_schema_person_user_id' - Allows filtering of user ID used for person output.
		 *
		 * @api int|bool $user_id The user ID currently determined.
		 */
		return apply_filters( 'wpseo_schema_person_user_id', $user_id );
	}

	/**
	 * Retrieve a list of social profile URLs.
	 *
	 * @param int $user_id User ID.
	 *
	 * @return array $output A list of social profiles.
	 */
	private function get_social_profiles( $user_id ) {
		$social_profiles = [ 'facebook', 'instagram', 'linkedin', 'pinterest', 'twitter' ];
		$output          = [];
		foreach ( $social_profiles as $profile ) {
			$social_url = $this->url_social_site( $profile, $user_id );
			if ( $social_url ) {
				$output[] = $social_url;
			}
		}

		return $output;
	}

	/**
	 * Determine whether we should output Person schema.
	 *
	 * @return bool
	 */
	private function do_person_output() {
		if ( is_author() || is_front_page() && WPSEO_Options::get( 'company_or_person', '' ) === 'person' ) {
			return true;
		}

		return false;
	}

	/**
	 * Builds our array of personal data for a given user ID.
	 *
	 * @param int $user_id The user ID to use.
	 *
	 * @return array An array of Schema Person data.
	 */
	private function build_person_data( $user_id ) {
		$user_data = get_userdata( $user_id );
		$output    = [
			'@context' => 'https://schema.org',
			'@type'    => 'Person',
			'@id'      => get_author_posts_url( $user_id ) . '#profile',
			'name'     => $user_data->display_name,
			'image'    => get_avatar( $user_id ),
		];

		if ( ! empty( $user_data->description ) ) {
			$output['description'] = $user_data->description;
		}

		$social_profiles = $this->get_social_profiles( $user_id );
		if ( is_array( $social_profiles ) ) {
			$output['sameAs'] = $social_profiles;
		}

		return $output;
	}

	/**
	 * Returns an author's social site URL
	 *
	 * @param string $social_site The social site to retrieve the URL for.
	 * @param mixed  $user_id     The user ID to use function outside of the loop.
	 *
	 * @return string
	 */
	private function url_social_site( $social_site, $user_id = false ) {
		$url = get_the_author_meta( $social_site, $user_id );

		if ( ! empty( $url ) ) {
			switch ( $social_site ) {
				case 'twitter':
					$url = 'https://twitter.com/' . $url;
					break;
			}
		}

		return $url;
	}
}