<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Class WPSEO_Schema_Organization
 *
 * Outputs schema Organization code.
 *
 * @since 10.1
 */
class WPSEO_Schema_Organization implements WPSEO_Graph_Piece {
	/**
	 * Determines whether an Organization graph piece should be added.
	 *
	 * @return bool
	 */
	public function is_needed() {
		if ( WPSEO_Options::get( 'company_or_person', '' )  !== 'company' ) {
			return false;
		}

		return true;
	}

	/**
	 * Prepares the organization markup.
	 *
	 * @return array $data The Organization schema.
	 */
	public function add_to_graph() {
		$data = array(
			'@type'    => 'Organization',
			'@id'      => WPSEO_Utils::home_url() . '#organization',
			'name'     => WPSEO_Options::get( 'company_name' ),
			'url'      => WPSEO_Utils::home_url(),
			'sameAs'   => $this->fetch_social_profiles(),
		);
		if ( ! empty( WPSEO_Options::get( 'company_logo', '' ) ) ) {
			$data['logo'] = WPSEO_Options::get( 'company_logo', '' );
		}

		return $data;
	}

	/**
	 * Retrieve the social profiles to display in the organization output.
	 *
	 * @since 1.8
	 *
	 * @link  https://developers.google.com/webmasters/structured-data/customize/social-profiles
	 *
	 * @return array $profiles An array of social profiles.
	 */
	private function fetch_social_profiles() {
		$profiles        = array();
		$social_profiles = array(
			'facebook_site',
			'instagram_url',
			'linkedin_url',
			'plus-publisher',
			'myspace_url',
			'youtube_url',
			'pinterest_url',
			'wikipedia_url',
		);
		foreach ( $social_profiles as $profile ) {
			if ( WPSEO_Options::get( $profile, '' ) !== '' ) {
				$profiles[] = WPSEO_Options::get( $profile );
			}
		}

		if ( WPSEO_Options::get( 'twitter_site', '' ) !== '' ) {
			$profiles[] = 'https://twitter.com/' . WPSEO_Options::get( 'twitter_site' );
		}

		return $profiles;
	}
}