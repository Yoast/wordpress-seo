<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\Free\Presentations\Generators\Schema
 */

namespace Yoast\WP\Free\Presentations\Generators\Schema;

use Yoast\WP\Free\Helpers\Schema\Image_Helper;

/**
 * Returns schema Organization data.
 *
 * @since 10.2
 */
class Organization extends Abstract_Schema_Piece {
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
			'@id'    => $this->context->site_url . $this->id_helper->organization_hash,
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
		$schema_id     = $this->context->site_url . $this->id_helper->organization_logo_hash;
		$data['logo']  = Image_Helper::generate_from_attachment_id( $schema_id, $this->context->company_logo_id, $this->context->company_name );
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
			if ( \WPSEO_Options::get( $profile, '' ) !== '' ) {
				$profiles[] = \WPSEO_Options::get( $profile );
			}
		}

		if ( \WPSEO_Options::get( 'twitter_site', '' ) !== '' ) {
			$profiles[] = 'https://twitter.com/' . \WPSEO_Options::get( 'twitter_site' );
		}

		/**
		 * Filter: 'wpseo_schema_organization_social_profiles' - Allows filtering social profiles for the
		 * represented organization.
		 *
		 * @api string[] $profiles
		 */
		$profiles = \apply_filters( 'wpseo_schema_organization_social_profiles', $profiles );

		return $profiles;
	}
}
