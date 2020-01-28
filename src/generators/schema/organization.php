<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Presentations\Generators\Schema
 */

namespace Yoast\WP\SEO\Presentations\Generators\Schema;

use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Schema\Image_Helper;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;

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
	 * @var HTML_Helper
	 */
	private $html_helper;

	/**
	 * Organization constructor.
	 *
	 * @param Image_Helper   $image_helper   The image helper.
	 * @param Options_Helper $options_helper The options helper.
	 * @param HTML_Helper    $html_helper    The HTML helper.
	 */
	public function __construct(
		Image_Helper $image_helper,
		Options_Helper $options_helper,
		HTML_Helper $html_helper
	) {
		$this->image_helper   = $image_helper;
		$this->options_helper = $options_helper;
		$this->html_helper    = $html_helper;
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
			'name'   => $this->html_helper->smart_strip_tags( $context->company_name ),
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
	 * @link  https://developers.google.com/webmasters/structured-data/customize/social-profiles
	 *
	 * @since 1.8
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
