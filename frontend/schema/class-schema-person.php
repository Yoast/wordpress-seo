<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Returns schema Person data.
 *
 * @since 10.2
 */
class WPSEO_Schema_Person implements WPSEO_Graph_Piece {
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
		$this->context   = $context;
	}

	/**
	 * Determine whether we should return Person schema.
	 *
	 * @return bool
	 */
	public function is_needed() {
		if ( $this->context->site_represents === 'person' || is_author() ) {
			return true;
		}

		return false;
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

		$data = $this->build_person_data( $user_id );

		return $data;
	}

	/**
	 * Determines a User ID for the Person data.
	 *
	 * @return bool|int User ID or false upon return.
	 */
	protected function determine_user_id() {
		$user_id = $this->context->site_user_id;

		/**
		 * Filter: 'wpseo_schema_person_user_id' - Allows filtering of user ID used for person output.
		 *
		 * @api int|bool $user_id The user ID currently determined.
		 */
		return apply_filters( 'wpseo_schema_person_user_id', $user_id );
	}

	/**
	 * Retrieve a list of social profile URLs for Person.
	 *
	 * @param int $user_id User ID.
	 *
	 * @return array $output A list of social profiles.
	 */
	protected function get_social_profiles( $user_id ) {
		$social_profiles = array(
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
		);
		$output          = array();
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
	 * @param int $user_id The user ID to use.
	 *
	 * @return array An array of Schema Person data.
	 */
	protected function build_person_data( $user_id ) {
		$user_data = get_userdata( $user_id );
		$data      = array(
			'@type' => 'Person',
			'@id'   => $this->determine_schema_id( $user_id ),
			'name'  => $user_data->display_name,
		);

		$data = $this->add_image( $data, $user_data );

		if ( ! empty( $user_data->description ) ) {
			$data['description'] = $user_data->description;
		}

		$social_profiles = $this->get_social_profiles( $user_id );
		if ( is_array( $social_profiles ) ) {
			$data['sameAs'] = $social_profiles;
		}

		return $data;
	}

	/**
	 * Returns an ImageObject for the persons avatar.
	 *
	 * @param array    $data      The Person schema.
	 * @param \WP_User $user_data User data.
	 *
	 * @return array $data The Person schema.
	 */
	protected function add_image( $data, $user_data ) {
		if ( ! get_avatar_url( $user_data->user_email ) ) {
			return $data;
		}

		$data['image'] = array(
			'@type'   => 'ImageObject',
			'@id'     => $this->context->site_url . WPSEO_Schema_IDs::PERSON_LOGO_HASH,
			'url'     => get_avatar_url( $user_data->user_email ),
			'caption' => $user_data->display_name,
		);

		return $data;
	}

	/**
	 * Returns the string to use in Schema's `@id`.
	 *
	 * @param int $user_id The user ID if we're on a user page.
	 *
	 * @return string The `@id` string value.
	 */
	protected function determine_schema_id( $user_id ) {
		switch ( true ) {
			case ( $this->context->site_represents === 'company' ):
				$url = get_author_posts_url( $user_id );
				break;
			default:
				$url = $this->context->site_url;
				break;
		}

		return $url . WPSEO_Schema_IDs::PERSON_HASH;
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
		$url = get_the_author_meta( $social_site, $user_id );

		if ( ! empty( $url ) ) {
			switch ( $social_site ) {
				case 'twitter':
					$url = 'https://twitter.com/' . $url;
					break;
			}
		}

		return $url;
	}
}
