<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Returns schema Organization data.
 *
 * @since 10.2
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
	 * Returns the Organization Schema data.
	 *
	 * @return array $data The Organization schema.
	 */
	public function generate() {
		$data = array(
			'@type'  => 'Organization',
			'@id'    => $this->context->site_url . WPSEO_Schema_IDs::ORGANIZATION_HASH,
			'name'   => $this->context->company_name,
			'url'    => $this->context->site_url,
			'sameAs' => $this->fetch_social_profiles(),
		);
		$data = $this->add_logo( $data );

		return $data;
	}

	/**
	 * Adds a site's logo.
	 *
	 * @param array $data The Organization schema.
	 *
	 * @return array $data The Organization schema.
	 */
	private function add_logo( $data ) {
		$logo_id = WPSEO_Image_Utils::get_attachment_id_from_settings( 'company_logo' );

		if ( empty( $logo_id ) ) {
			return $data;
		}
		$schema_id     = $this->context->site_url . WPSEO_Schema_IDs::ORGANIZATION_LOGO_HASH;
		$schema_image  = new WPSEO_Schema_Image( $schema_id );
		$data['logo']  = $schema_image->generate_from_attachment_id( $logo_id, $this->context->company_name );
		$data['image'] = array( '@id' => $schema_id );

		return $data;
	}

	/**
	 * Retrieve the social profiles to display in the organization schema.
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
