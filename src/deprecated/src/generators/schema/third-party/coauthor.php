<?php

namespace Yoast\WP\SEO\Generators\Schema\Third_Party;

use Yoast\WP\SEO\Generators\Schema\Author;

/**
 * Returns schema Author data for the CoAuthor Plus assigned user on a post.
 *
 * @deprecated 19.12
 * @codeCoverageIgnore
 */
class CoAuthor extends Author {

	/**
	 * The user ID of the author we're generating data for.
	 *
	 * @var int
	 */
	private $user_id;

	/**
	 * Determine whether we should return Person schema.
	 *
	 * @deprecated 19.12
	 * @codeCoverageIgnore
	 *
	 * @return bool
	 */
	public function is_needed() {
		\_deprecated_function( __METHOD__, 'WPSEO 19.12' );
		return true;
	}

	/**
	 * Returns Person Schema data.
	 *
	 * @deprecated 19.12
	 * @codeCoverageIgnore
	 *
	 * @return bool|array Person data on success, false on failure.
	 */
	public function generate() {
		\_deprecated_function( __METHOD__, 'WPSEO 19.12' );
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
	 * @deprecated 19.12
	 * @codeCoverageIgnore
	 *
	 * @param int $user_id User ID.
	 *
	 * @return array|bool
	 */
	public function generate_from_user_id( $user_id ) {
		\_deprecated_function( __METHOD__, 'WPSEO 19.12' );
		$this->user_id = $user_id;

		return $this->generate();
	}

	/**
	 * Determines a User ID for the Person data.
	 *
	 * @return bool|int User ID or false upon return.
	 */
	protected function determine_user_id() {
		return $this->user_id;
	}
}
