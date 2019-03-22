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
	 * A value object with context variables.
	 *
	 * @var WPSEO_Schema_Context
	 */
	private $context;

	/**
	 * WPSEO_Schema_Breadcrumb constructor.
	 *
	 * @param WPSEO_Schema_Context $context A value object with context variables.
	 */
	public function __construct( WPSEO_Schema_Context $context ) {
		$this->context = $context;
	}

	/**
	 * Determines whether an Organization graph piece should be added.
	 *
	 * @return bool
	 */
	public function is_needed() {
		return ( $this->context->site_represents === 'company' );
	}

	/**
	 * Prepares the organization markup.
	 *
	 * @return array $data The Organization schema.
	 */
	public function generate() {
		$data = array(
			'@type'  => 'Organization',
			'@id'    => $this->context->site_url . '#organization',
			'name'   => $this->context->company_name,
			'url'    => $this->context->site_url,
			'sameAs' => $this->fetch_social_profiles(),
		);
		$data = $this->add_logo( $data );

		return $data;
	}

	/**
	 * Outputs code to allow recognition of page's position in the site hierarchy
	 *
	 * @param array $data The Organization schema.
	 *
	 * @return array $data The Organization schema.
	 */
	private function add_logo( $data ) {
		$logo = WPSEO_Options::get( 'company_logo', '' );
		if ( empty( $logo ) ) {
			return $data;
		}
		$data['logo'] = array(
			'@type'   => 'ImageObject',
			'@id'     => $this->context->site_url . '#logo',
			'url'     => $logo,
			'caption' => $this->context->company_name,
		);

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
