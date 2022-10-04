<?php

namespace Yoast\WP\SEO\Generators\Schema\Third_Party;

use Yoast\WP\SEO\Config\Schema_IDs;
use Yoast\WP\SEO\Generators\Schema\Author;


/**
 * Returns schema Author data for the CoAuthor Plus assigned user on a post.
 */
class CoAuthor extends Author {

	/**
	 * The user ID of the author we're generating data for.
	 *
	 * @var int $user_id
	 */
	private $user_id;

	/**
	 * Determine whether we should return Person schema.
	 *
	 * @return bool
	 */
	public function is_needed() {
		return true;
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

		$data = $this->build_person_data( $user_id, true );

		$data['@type'] = 'Person';
		unset( $data['logo'] );

		// If this is a post and the author archives are enabled, set the author archive url as the author url.
		if ( $this->helpers->options->get( 'disable-author' ) !== true ) {
			$data['url'] = $this->helpers->user->get_the_author_posts_url( $user_id );
		}

		return $data;
	}

	/**
	 * Generate the Person data given a user ID.
	 *
	 * @param int $user_id User ID.
	 *
	 * @return array|bool
	 */
	public function generate_from_user_id( $user_id ) {
		$this->user_id = $user_id;

		return $this->generate();
	}

	/**
	 * Generate the Person data given a user ID.
	 *
	 * @param int $user_id User ID.
	 *
	 * @return array|bool
	 */
	public function generate_from_guest_author( $guest_author ) {
		$this->user_id = $user_id;

		$data = $this->build_person_data_for_guest_author( $guest_author, true );

		$data['@type'] = 'Person';
		unset( $data['logo'] );

		// If this is a post and the author archives are enabled, set the author archive url as the author url.
		// if ( $this->helpers->options->get( 'disable-author' ) !== true ) {
		// 	$data['url'] = $this->helpers->user->get_the_author_posts_url( $user_id );
		// }

		return $data;

		//return $this->generate();
	}

	/**
	 * Determines a User ID for the Person data.
	 *
	 * @return bool|int User ID or false upon return.
	 */
	protected function determine_user_id() {
		return $this->user_id;
	}

	/**
	 * Builds our array of Schema Person data for a given user ID.
	 *
	 * @param int  $user_id  The user ID to use.
	 * @param bool $add_hash Wether or not the person's image url hash should be added to the image id.
	 *
	 * @return array An array of Schema Person data.
	 */
	protected function build_person_data_for_guest_author( $guest_author, $add_hash = false ) {
		$data      = [
			'@type' => $this->type,
			'@id'   => $this->context->site_url . Schema_IDs::PERSON_HASH . \wp_hash( $guest_author->user_login . $guest_author->ID . 'guest' ),
		];

		$data['name'] = $this->helpers->schema->html->smart_strip_tags( $guest_author->display_name );
		//$data         = $this->add_image( $data, $guest_author, $add_hash );

		if ( ! empty( $guest_author->description ) ) {
			$data['description'] = $this->helpers->schema->html->smart_strip_tags( $guest_author->description );
		}

		//$data = $this->add_same_as_urls( $data, $guest_author, $user_id );

		/**
		 * Filter: 'wpseo_schema_person_data' - Allows filtering of schema data per user.
		 *
		 * @param array $data    The schema data we have for this person.
		 * @param int   $user_id The current user we're collecting schema data for.
		 */
		//$data = \apply_filters( 'wpseo_schema_person_data', $data, $user_id );generate_from_guest_author

		return $data;
	}
}
