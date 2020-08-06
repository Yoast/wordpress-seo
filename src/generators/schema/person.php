<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Generators\Schema
 */

namespace Yoast\WP\SEO\Generators\Schema;

use WP_User;
use Yoast\WP\SEO\Config\Schema_IDs;

/**
 * Returns schema Person data.
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
	 * Determine whether we should return Person schema.
	 *
	 * @return bool
	 */
	public function is_needed() {
		// Using an author piece instead.
		if ( $this->site_represents_current_author() ) {
			return false;
		}

		return $this->context->site_represents === 'person' || $this->context->indexable->object_type === 'user';
	}

	/**
	 * Returns Person Schema data.
	 *
	 * @return bool|array Person data on success, false on failure.
	 */
	public function generate() {
		$user_id = $this->determine_user_id();
		if ( ! $user_id ) {
			return false;
		}

		return $this->build_person_data( $user_id );
	}

	/**
	 * Determines a User ID for the Person data.
	 *
	 * @return bool|int User ID or false upon return.
	 */
	protected function determine_user_id() {
		/**
		 * Filter: 'wpseo_schema_person_user_id' - Allows filtering of user ID used for person output.
		 *
		 * @api int|bool $user_id The user ID currently determined.
		 */
		$user_id = \apply_filters( 'wpseo_schema_person_user_id', $this->context->site_user_id );

		// It should to be an integer higher than 0.
		if ( \is_int( $user_id ) && $user_id > 0 ) {
			return $user_id;
		}

		return false;
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

		// We can only handle an array.
		if ( ! \is_array( $social_profiles ) ) {
			return $output;
		}

		foreach ( $social_profiles as $profile ) {
			// Skip non-string values.
			if ( ! \is_string( $profile ) ) {
				continue;
			}

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
	 * @param int $user_id The user ID to use.
	 *
	 * @return array An array of Schema Person data.
	 */
	protected function build_person_data( $user_id ) {
		$user_data = \get_userdata( $user_id );
		$data      = [
			'@type' => $this->type,
			'@id'   => $this->helpers->schema->id->get_user_schema_id( $user_id, $this->context ),
		];

		// Safety check for the `get_userdata` WP function, which could return false.
		if ( $user_data === false ) {
			return $data;
		}

		$data['name'] = $this->helpers->schema->html->smart_strip_tags( $user_data->display_name );
		$data         = $this->add_image( $data, $user_data );

		if ( ! empty( $user_data->description ) ) {
			$data['description'] = $this->helpers->schema->html->smart_strip_tags( $user_data->description );
		}

		$social_profiles = $this->get_social_profiles( $user_id );
		if ( ! empty( $social_profiles ) ) {
			$data['sameAs'] = $social_profiles;
		}

		return $data;
	}

	/**
	 * Returns an ImageObject for the persons avatar.
	 *
	 * @param array   $data      The Person schema.
	 * @param WP_User $user_data User data.
	 *
	 * @return array $data The Person schema.
	 */
	protected function add_image( $data, $user_data ) {
		$schema_id = $this->context->site_url . Schema_IDs::PERSON_LOGO_HASH;

		$data = $this->set_image_from_options( $data, $schema_id );
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
	 * @param array  $data      The Person schema.
	 * @param string $schema_id The string used in the `@id` for the schema.
	 *
	 * @return array The Person schema.
	 */
	protected function set_image_from_options( $data, $schema_id ) {
		if ( $this->context->site_represents !== 'person' ) {
			return $data;
		}
		$person_logo_id = $this->helpers->image->get_attachment_id_from_settings( 'person_logo' );

		if ( $person_logo_id ) {
			$data['image'] = $this->helpers->schema->image->generate_from_attachment_id( $schema_id, $person_logo_id, $data['name'] );
		}

		return $data;
	}

	/**
	 * Generate the person logo from gravatar.
	 *
	 * @param array   $data      The Person schema.
	 * @param WP_User $user_data User data.
	 * @param string  $schema_id The string used in the `@id` for the schema.
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

		$data['image'] = $this->helpers->schema->image->simple_image_object( $schema_id, $url, $user_data->display_name );

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

	/**
	 * Checks the site is represented by the same person as this indexable.
	 *
	 * @return bool True when the site is represented by the same person as this indexable.
	 */
	protected function site_represents_current_author() {
		// Can only be the case when the site represents a user.
		if ( $this->context->site_represents !== 'person' ) {
			return false;
		}

		// Article post from the same user as the site represents.
		if (
			$this->context->indexable->object_type === 'post'
			&& $this->helpers->schema->article->is_author_supported( $this->context->indexable->object_sub_type )
			&& $this->context->schema_article_type !== 'None'
		) {
			return $this->context->site_user_id === $this->context->indexable->author_id;
		}

		// Author archive from the same user as the site represents.
		return $this->context->indexable->object_type === 'user' && $this->context->site_user_id === $this->context->indexable->object_id;
	}
}
