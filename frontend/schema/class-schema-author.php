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
 *
 * @property WPSEO_Schema_Context $context A value object with context variables.
 */
class WPSEO_Schema_Author extends WPSEO_Schema_Person implements WPSEO_Graph_Piece {
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
		parent::__construct( $context );
		$this->context   = $context;
		$this->logo_hash = WPSEO_Schema_IDs::AUTHOR_LOGO_HASH;
	}

	/**
	 * Determine whether we should return Person schema.
	 *
	 * @return bool
	 */
	public function is_needed() {
		if ( is_author() ) {
			return true;
		}

		if ( $this->is_post_author() ) {
			$post = get_post( $this->context->id );
			// If the author is the user the site represents, no need for an extra author block.
			if ( (int) $post->post_author === $this->context->site_user_id ) {
				return false;
			}

			return true;
		}

		return false;
	}


	/**
	 * Builds our array of Schema Person data for a given user ID.
	 *
	 * @param int $user_id The user ID to use.
	 *
	 * @return array An array of Schema Person data.
	 */
	protected function build_person_data( $user_id ) {
		$data = parent::build_person_data( $user_id );

		// If this is an author page, the Person object is the main object, so we set it as such here.
		if ( is_author() ) {
			$data['mainEntityOfPage'] = array(
				'@id' => $this->context->canonical . WPSEO_Schema_IDs::WEBPAGE_HASH,
			);
		}

		return $data;
	}

	/**
	 * Determine whether the current URL is worthy of Article schema.
	 *
	 * @return bool
	 */
	protected function is_post_author() {
		/**
		 * Filter: 'wpseo_schema_article_post_type' - Allow changing for which post types we output Article schema.
		 *
		 * @api array $post_types The post types for which we output Article.
		 */
		$post_types = apply_filters( 'wpseo_schema_article_post_type', array( 'post' ) );
		if ( is_singular( $post_types ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Determines a User ID for the Person data.
	 *
	 * @return bool|int User ID or false upon return.
	 */
	protected function determine_user_id() {
		switch ( true ) {
			case is_author():
				$user_id = get_queried_object_id();
				break;
			default:
				$post = get_post( $this->context->id );
				$user_id = (int) $post->post_author;
				break;
		}

		/**
		 * Filter: 'wpseo_schema_person_user_id' - Allows filtering of user ID used for person output.
		 *
		 * @api int|bool $user_id The user ID currently determined.
		 */
		return apply_filters( 'wpseo_schema_person_user_id', $user_id );
	}

	/**
	 * Returns the string to use in Schema's `@id`.
	 *
	 * @param int $user_id The user ID if we're on a user page.
	 *
	 * @return string The `@id` string value.
	 */
	protected function determine_schema_id( $user_id ) {
		return get_author_posts_url( $user_id ) . WPSEO_Schema_IDs::AUTHOR_HASH;
	}
}
