<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Config\Schema_IDs;
use Yoast\WP\SEO\Generators\Schema\Author;

/**
 * Returns schema Person data.
 *
 * @since      10.2
 * @deprecated 14.0
 */
class WPSEO_Schema_Author extends WPSEO_Deprecated_Graph_Piece {

	/**
	 * The hash used for images.
	 *
	 * @var string
	 */
	protected $image_hash = Schema_IDs::AUTHOR_LOGO_HASH;

	/**
	 * The Schema type we use for this class.
	 *
	 * @var string[]
	 */
	protected $type = [ 'Person' ];

	/**
	 * WPSEO_Schema_Author constructor.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @param null $context The context. No longer used but present for BC.
	 */
	public function __construct( $context = null ) {
		parent::__construct( Author::class );
	}

	/**
	 * Determine whether we should return Person schema.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @return bool
	 */
	public function is_needed() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Author::is_needed' );

		if ( $this->stable->context->indexable->object_type === 'user' ) {
			return true;
		}

		// This call to `is_post_author` is why this whole block could not be replaced with a `parent::is_needed()` call.
		if ( $this->is_post_author() ) {
			// If the author is the user the site represents, no need for an extra author block.
			if ( $this->stable->is_needed() ) {
				return (int) $this->stable->context->post->post_author !== $this->stable->context->site_user_id;
			}

			return true;
		}

		return false;
	}

	/**
	 * Gets the Schema type we use for this class.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @return string[] The schema type.
	 */
	public static function get_type() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return [ 'Person' ];
	}

	/**
	 * Determine whether the current URL is worthy of Article schema.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @return bool
	 */
	protected function is_post_author() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return (
			$this->stable->context->indexable->object_type === 'post'
			&& $this->helpers->schema->article->is_article_post_type( $this->stable->context->indexable->object_sub_type )
		);
	}

	/**
	 * Determines a User ID for the Person data.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @return bool|int User ID or false upon return.
	 */
	protected function determine_user_id() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Author::determine_user_id' );

		return parent::determine_user_id();
	}
}
