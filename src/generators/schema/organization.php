<?php

namespace Yoast\WP\SEO\Generators\Schema;

use Yoast\WP\SEO\Config\Schema_IDs;

/**
 * Returns schema Organization data.
 */
class Organization extends Abstract_Schema_Piece {

	/**
	 * Determines whether an Organization graph piece should be added.
	 *
	 * @return bool
	 */
	public function is_needed() {
		return $this->context->site_represents === 'company';
	}

	/**
	 * Returns the Organization Schema data.
	 *
	 * @return array The Organization schema.
	 */
	public function generate() {
		$logo_schema_id = $this->context->site_url . Schema_IDs::ORGANIZATION_LOGO_HASH;

		if ( $this->context->company_logo_meta ) {
			$logo = $this->helpers->schema->image->generate_from_attachment_meta( $logo_schema_id, $this->context->company_logo_meta, $this->context->company_name );
		}
		else {
			$logo = $this->helpers->schema->image->generate_from_attachment_id( $logo_schema_id, $this->context->company_logo_id, $this->context->company_name );
		}

		return [
			'@type'  => 'Organization',
			'@id'    => $this->context->site_url . Schema_IDs::ORGANIZATION_HASH,
			'name'   => $this->helpers->schema->html->smart_strip_tags( $this->context->company_name ),
			'url'    => $this->context->site_url,
			'sameAs' => \array_values( \array_unique( $this->fetch_social_profiles() ) ),
			'logo'   => $logo,
			'image'  => [ '@id' => $logo_schema_id ],
		];
	}

	/**
	 * Retrieve the social profiles to display in the organization schema.
	 *
	 * @return array An array of social profiles.
	 */
	private function fetch_social_profiles() {
		$profiles        = [];
		$social_profiles = [
			'facebook_site',
			'instagram_url',
			'linkedin_url',
			'myspace_url',
			'youtube_url',
			'pinterest_url',
			'wikipedia_url',
		];
		foreach ( $social_profiles as $profile ) {
			$social_profile = $this->helpers->options->get( $profile, '' );
			if ( $social_profile !== '' ) {
				$profiles[] = \urldecode( $social_profile );
			}
		}

		$twitter = $this->helpers->options->get( 'twitter_site', '' );
		if ( $twitter !== '' ) {
			$profiles[] = 'https://twitter.com/' . $twitter;
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
