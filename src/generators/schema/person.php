<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Presentations\Generators\Schema
 */

namespace Yoast\WP\SEO\Presentations\Generators\Schema;

use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Schema;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;

/**
 * Returns schema Person data.
 *
 * @since 10.2
 */
class Person extends Abstract_Schema_Piece {
	/**
	 * Array of the social profiles we display for a Person.
	 *
	 * @var string[]
	 */
	private $social_profiles = [
		'facebook',
		'instagram',
		'linkedin',
		'pinterest',
		'twitter',
		'myspace',
		'youtube',
		'soundcloud',
		'tumblr',
		'wikipedia',
	];

	/**
	 * The Schema type we use for this class.
	 *
	 * @var string[]
	 */
	protected $type = [ 'Person', 'Organization' ];

	/**
	 * @var Image_Helper
	 */
	private $image;

	/**
	 * @var Schema\Image_Helper
	 */
	private $schema_image_helper;

	/**
	 * @var HTML_Helper
	 */
	private $html;

	/**
	 * Main_Image constructor.
	 *
	 * @param Image_Helper        $image        The image helper.
	 * @param Schema\Image_Helper $schema_image_helper The schema image helper.
	 * @param HTML_Helper         $html         The HTML helper.
	 */
	public function __construct(
		Image_Helper $image,
		Schema\Image_Helper $schema_image_helper,
		HTML_Helper $html
	) {
		$this->image        = $image;
		$this->schema_image_helper = $schema_image_helper;
		$this->html         = $html;
	}

	/**
	 * Determine whether we should return Person schema.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return bool
	 */
	public function is_needed( Meta_Tags_Context $context ) {
		return $context->site_represents === 'person' || $context->indexable->object_type === 'author';
	}

	/**
	 * Returns Person Schema data.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return bool|array Person data on success, false on failure.
	 */
	public function generate( Meta_Tags_Context $context ) {
		$user_id = $this->determine_user_id( $context );
		if ( ! $user_id ) {
			return false;
		}

		return $this->build_person_data( $user_id, $context );
	}

	/**
	 * Determines a User ID for the Person data.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return bool|int User ID or false upon return.
	 */
	protected function determine_user_id( Meta_Tags_Context $context ) {
		/**
		 * Filter: 'wpseo_schema_person_user_id' - Allows filtering of user ID used for person output.
		 *
		 * @api int|bool $user_id The user ID currently determined.
		 */
		return \apply_filters( 'wpseo_schema_person_user_id', $context->site_user_id );
	}

	/**
	 * Retrieve a list of social profile URLs for Person.
	 *
	 * @param int $user_id User ID.
	 *
	 * @return string[] $output A list of social profiles.
	 */
	protected function get_social_profiles( $user_id ) {
		/**
		 * Filter: 'wpseo_schema_person_social_profiles' - Allows filtering of social profiles per user.
		 *
		 * @param int $user_id The current user we're grabbing social profiles for.
		 *
		 * @api string[] $social_profiles The array of social profiles to retrieve. Each should be a user meta field
		 *                                key. As they are retrieved using the WordPress function `get_the_author_meta`.
		 */
		$social_profiles = \apply_filters( 'wpseo_schema_person_social_profiles', $this->social_profiles, $user_id );
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
	 * Builds our array of Schema Person data for a given user ID.
	 *
	 * @param int               $user_id The user ID to use.
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return array An array of Schema Person data.
	 */
	protected function build_person_data( $user_id, Meta_Tags_Context $context ) {
		$user_data = \get_userdata( $user_id );
		$data      = [
			'@type' => $this->type,
			'@id'   => $this->id_helper->get_user_schema_id( $user_id, $context ),
			'name'  => $this->html->smart_strip_tags( $user_data->display_name ),
		];

		$data = $this->add_image( $data, $user_data, $context );

		if ( ! empty( $user_data->description ) ) {
			$data['description'] = $this->html->smart_strip_tags( $user_data->description );
		}

		$social_profiles = $this->get_social_profiles( $user_id );
		if ( \is_array( $social_profiles ) ) {
			$data['sameAs'] = $social_profiles;
		}

		return $data;
	}

	/**
	 * Returns an ImageObject for the persons avatar.
	 *
	 * @param array             $data      The Person schema.
	 * @param \WP_User          $user_data User data.
	 * @param Meta_Tags_Context $context   The meta tags context.
	 *
	 * @return array $data The Person schema.
	 */
	protected function add_image( $data, $user_data, Meta_Tags_Context $context ) {
		$schema_id = $context->site_url . $this->id_helper->person_logo_hash;

		$data = $this->set_image_from_options( $data, $schema_id, $context );
		if ( ! isset( $data['image'] ) ) {
			$data = $this->set_image_from_avatar( $data, $user_data, $schema_id );
		}

		if ( \is_array( $this->type ) && \in_array( 'Organization', $this->type, true ) ) {
			$data['logo'] = [ '@id' => $schema_id ];
		}

		return $data;
	}

	/**
	 * Generate the person image from our settings.
	 *
	 * @param array             $data      The Person schema.
	 * @param string            $schema_id The string used in the `@id` for the schema.
	 * @param Meta_Tags_Context $context   The meta tags context.
	 *
	 * @return array The Person schema.
	 */
	protected function set_image_from_options( $data, $schema_id, Meta_Tags_Context $context ) {
		if ( $context->site_represents !== 'person' ) {
			return $data;
		}
		$person_logo_id = $this->image->get_attachment_id_from_settings( 'person_logo' );

		if ( $person_logo_id ) {
			$data['image'] = $this->schema_image_helper->generate_from_attachment_id( $schema_id, $person_logo_id, $data['name'] );
		}

		return $data;
	}

	/**
	 * Generate the person logo from gravatar.
	 *
	 * @param array    $data      The Person schema.
	 * @param \WP_User $user_data User data.
	 * @param string   $schema_id The string used in the `@id` for the schema.
	 *
	 * @return array The Person schema.
	 */
	protected function set_image_from_avatar( $data, $user_data, $schema_id ) {
		// If we don't have an image in our settings, fall back to an avatar, if we're allowed to.
		$show_avatars = \get_option( 'show_avatars' );
		if ( ! $show_avatars ) {
			return $data;
		}

		$url = \get_avatar_url( $user_data->user_email );
		if ( empty( $url ) ) {
			return $data;
		}

		$data['image'] = $this->schema_image_helper->simple_image_object( $schema_id, $url, $user_data->display_name );

		return $data;
	}

	/**
	 * Returns an author's social site URL.
	 *
	 * @param string $social_site The social site to retrieve the URL for.
	 * @param mixed  $user_id     The user ID to use function outside of the loop.
	 *
	 * @return string
	 */
	protected function url_social_site( $social_site, $user_id = false ) {
		$url = \get_the_author_meta( $social_site, $user_id );

		if ( ! empty( $url ) && $social_site === 'twitter' ) {
			$url = 'https://twitter.com/' . $url;
		}

		return $url;
	}
}
