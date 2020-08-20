<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Generators\Schema
 */

namespace Yoast\WP\SEO\Generators\Schema;

use Yoast\WP\SEO\Config\Schema_IDs;

/**
 * Returns schema Person data.
 */
class Author extends Person {

	/**
	 * Determine whether we should return Person schema.
	 *
	 * @return bool
	 */
	public function is_needed() {
		if ( $this->context->indexable->object_type === 'user' ) {
			return true;
		}

		if (
			$this->context->indexable->object_type === 'post'
			&& $this->helpers->schema->article->is_author_supported( $this->context->indexable->object_sub_type )
			&& $this->context->schema_article_type !== 'None'
		) {
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

		if ( $this->site_represents_current_author() === false ) {
			$data['@type'] = [ 'Person' ];
			unset( $data['logo'] );
		}

		// If this is an author page, the Person object is the main object, so we set it as such here.
		if ( $this->context->indexable->object_type === 'user' ) {
			$data['mainEntityOfPage'] = [
				'@id' => $this->context->canonical . Schema_IDs::WEBPAGE_HASH,
			];
		}

		return $data;
	}

	/**
	 * Determines a User ID for the Person data.
	 *
	 * @return bool|int User ID or false upon return.
	 */
	protected function determine_user_id() {
		$user_id = 0;

		if ( $this->context->indexable->object_type === 'post' ) {
			$user_id = (int) $this->context->post->post_author;
		}

		if ( $this->context->indexable->object_type === 'user' ) {
			$user_id = $this->context->indexable->object_id;
		}

		/**
		 * Filter: 'wpseo_schema_person_user_id' - Allows filtering of user ID used for person output.
		 *
		 * @api int|bool $user_id The user ID currently determined.
		 */
		$user_id = \apply_filters( 'wpseo_schema_person_user_id', $user_id );

		if ( \is_int( $user_id ) && $user_id > 0 ) {
			return $user_id;
		}

		return false;
	}

	/**
	 * An author should not have an image from options, this only applies to persons.
	 *
	 * @param array  $data      The Person schema.
	 * @param string $schema_id The string used in the `@id` for the schema.
	 *
	 * @return array The Person schema.
	 */
	protected function set_image_from_options( $data, $schema_id ) {
		if ( $this->site_represents_current_author() ) {
			return parent::set_image_from_options( $data, $schema_id );
		}

		return $data;
	}
}
