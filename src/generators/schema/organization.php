<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Generators\Schema
 */

namespace Yoast\WP\SEO\Generators\Schema;

use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\Image_Helper;

/**
 * Returns schema Organization data.
 */
class Organization extends Abstract_Schema_Piece {

	/**
	 * The image helper.
	 *
	 * @var Image_Helper
	 */
	private $image;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * The HTML helper.
	 *
	 * @var HTML_Helper
	 */
	private $html;

	/**
	 * Organization constructor.
	 *
	 * @param Image_Helper   $image   The image helper.
	 * @param Options_Helper $options The options helper.
	 * @param HTML_Helper    $html    The HTML helper.
	 */
	public function __construct(
		Image_Helper $image,
		Options_Helper $options,
		HTML_Helper $html
	) {
		$this->image   = $image;
		$this->options = $options;
		$this->html    = $html;
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
		$schema_id = $context->site_url . $this->id->organization_logo_hash;
		$data      = [
			'@type'  => 'Organization',
			'@id'    => $context->site_url . $this->id->organization_hash,
			'name'   => $this->html->smart_strip_tags( $context->company_name ),
			'url'    => $context->site_url,
			'sameAs' => $this->fetch_social_profiles(),
			'logo'   => $this->image->generate_from_attachment_id( $schema_id, $context->company_logo_id, $context->company_name ),
			'image'  => [ '@id' => $schema_id ],
		];

		return $data;
	}

	/**
	 * Retrieve the social profiles to display in the organization schema.
	 *
	 * @link https://developers.google.com/webmasters/structured-data/customize/social-profiles
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
			$social_profile = $this->options->get( $profile, '' );
			if ( $social_profile !== '' ) {
				$profiles[] = $social_profile;
			}
		}

		$twitter = $this->options->get( 'twitter_site', '' );
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
