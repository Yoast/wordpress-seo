<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Config\Schema_IDs;
use Yoast\WP\SEO\Generators\Schema\Person;

/**
 * Returns schema Person data.
 *
 * @deprecated 14.0
 *
 * @since 10.2
 */
class WPSEO_Schema_Person extends WPSEO_Deprecated_Graph_Piece {

	/**
	 * The hash used for images.
	 *
	 * @var string
	 */
	protected $image_hash = Schema_IDs::PERSON_LOGO_HASH;

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
	 * WPSEO_Schema_Person constructor.
	 *
	 * @param null $context The context. No longer used but present for BC.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 */
	public function __construct( $context = null ) {
		parent::__construct( Person::class );
	}

	/**
	 * Determines a User ID for the Person data.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return bool|int User ID or false upon return.
	 */
	protected function determine_user_id() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Person::determine_user_id' );

		return $this->stable->determine_user_id();
	}

	/**
	 * Retrieve a list of social profile URLs for Person.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param int $user_id User ID.
	 *
	 * @return string[] $output A list of social profiles.
	 */
	protected function get_social_profiles( $user_id ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Person::get_social_profiles' );

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
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param int $user_id The user ID to use.
	 *
	 * @return array An array of Schema Person data.
	 */
	protected function build_person_data( $user_id ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Person::build_person_data' );

		return $this->stable->build_person_data( $user_id );
	}

	/**
	 * Returns an ImageObject for the persons avatar.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param array    $data      The Person schema.
	 * @param \WP_User $user_data User data.
	 *
	 * @return array $data The Person schema.
	 */
	protected function add_image( $data, $user_data ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Person::add_image' );

		return $this->stable->add_image( $data, $user_data );
	}

	/**
	 * Returns an author's social site URL.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param string $social_site The social site to retrieve the URL for.
	 * @param mixed  $user_id     The user ID to use function outside of the loop.
	 *
	 * @return string
	 */
	protected function url_social_site( $social_site, $user_id = false ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Person::url_social_site' );

		$url = \get_the_author_meta( $social_site, $user_id );

		if ( ! empty( $url ) && $social_site === 'twitter' ) {
			$url = 'https://twitter.com/' . $url;
		}

		return $url;
	}
}
