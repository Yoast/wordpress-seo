<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\Free\Presentations\Generators\Schema
 */

namespace Yoast\WP\Free\Presentations\Generators\Schema;

use Yoast\WP\Free\Context\Meta_Tags_Context;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Helpers\Schema\Image_Helper;

/**
 * Returns schema Organization data.
 *
 * @since 10.2
 */
class Organization extends Abstract_Schema_Piece {

	/**
	 * @var Image_Helper
	 */
	private $image_helper;
	/**
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Organization constructor.
	 *
	 * @param Image_Helper   $image_helper   The image helper.
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct(
		Image_Helper $image_helper,
		Options_Helper $options_helper
	) {
		$this->image_helper   = $image_helper;
		$this->options_helper = $options_helper;
	}

	/**
	 * Determines whether an Organization graph piece should be added.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return bool
	 */
	public function is_needed( Meta_Tags_Context $context ) {
		return $context->site_represents === 'company';
	}

	/**
	 * Returns the Organization Schema data.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return array $data The Organization schema.
	 */
	public function generate( Meta_Tags_Context $context ) {
		$schema_id = $context->site_url . $this->id_helper->organization_logo_hash;
		$data      = [
			'@type'  => 'Organization',
			'@id'    => $context->site_url . $this->id_helper->organization_hash,
			'name'   => \wp_strip_all_tags( $context->company_name ),
			'url'    => $context->site_url,
			'sameAs' => $this->fetch_social_profiles(),
			'logo'   => $this->image_helper->generate_from_attachment_id( $schema_id, $context->company_logo_id, $context->company_name ),
			'image'  => [ '@id' => $schema_id ],
		];

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
			if ( $this->options_helper->get( $profile, '' ) !== '' ) {
				$profiles[] = $this->options_helper->get( $profile );
			}
		}

		$twitter = $this->options_helper->get( 'twitter_site', '' );
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
