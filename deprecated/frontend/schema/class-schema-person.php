<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Config\Schema_IDs;
use Yoast\WP\SEO\Generators\Schema\Person;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;

/**
 * Returns schema Person data.
 *
 * @deprecated 14.0
 *
 * @since 10.2
 */
class WPSEO_Schema_Person extends Person implements WPSEO_Graph_Piece {

	/**
	 * The hash used for images.
	 *
	 * @var string
	 */
	protected $image_hash = Schema_IDs::PERSON_LOGO_HASH;

	/**
	 * WPSEO_Schema_Person constructor.
	 *
	 * @param null $context The context. No longer used but present for BC.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 */
	public function __construct( $context = null ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Person' );

		$memoizer      = YoastSEO()->classes->get( Meta_Tags_Context_Memoizer::class );
		$this->context = $memoizer->for_current_page();
		$this->helpers = YoastSEO()->helpers;
	}

	/**
	 * Determine whether we should return Person schema.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return bool
	 */
	public function is_needed() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Person::is_needed' );

		return parent::is_needed();
	}

	/**
	 * Returns Person Schema data.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return bool|array Person data on success, false on failure.
	 */
	public function generate() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Person::generate' );

		return parent::generate();
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

		return parent::determine_user_id();
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

		return parent::get_social_profiles( $user_id );
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

		return parent::build_person_data( $user_id );
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

		return parent::add_image( $data, $user_data );
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

		return parent::url_social_site( $social_site, $user_id );
	}
}
