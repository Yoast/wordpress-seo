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
class WPSEO_Schema_Organization extends WPSEO_JSON_LD implements WPSEO_WordPress_Integration {
	/**
	 * Registers hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'wpseo_json_ld', [ $this, 'organization' ] );
	}

	/**
	 * Outputs code to allow Google to recognize social profiles for use in the Knowledge graph.
	 *
	 * @since 1.8
	 */
	public function organization() {
		if ( WPSEO_Options::get( 'company_or_person', '' !== 'company' ) ) {
			return;
		}

		$output = $this->prepare_organization_markup();

		$this->output( $output, 'company' );
	}

	/**
	 * Prepares the organization markup.
	 */
	private function prepare_organization_markup() {
		$data = array(
			'@context' => 'https://schema.org',
			'@type'    => 'Organization',
			'@id'      => $this->get_home_url() . '#organization',
			'name'     => WPSEO_Options::get( 'company_name' ),
			'url'      => $this->get_home_url(),
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
