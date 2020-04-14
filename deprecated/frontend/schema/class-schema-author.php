<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Config\Schema_IDs;
use Yoast\WP\SEO\Generators\Schema\Author;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;

/**
 * Returns schema Person data.
 *
 * @deprecated 14.0
 *
 * @since 10.2
 */
class WPSEO_Schema_Author extends Author implements WPSEO_Graph_Piece {

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
	 * @param null $context The context. No longer used but present for BC.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 */
	public function __construct( $context = null ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Author' );

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
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Author::is_needed' );

		if ( $this->context->indexable->object_type === 'user' ) {
			return true;
		}

		// This call to `is_post_author` is why this whole block could not be replaced with a `parent::is_needed()` call.
		if ( $this->is_post_author() ) {
			// If the author is the user the site represents, no need for an extra author block.
			if ( parent::is_needed() ) {
				return (int) $this->context->post->post_author !== $this->context->site_user_id;
			}

			return true;
		}

		return false;
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
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Author::generate' );

		return parent::generate();
	}

	/**
	 * Gets the Schema type we use for this class.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
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
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return bool
	 */
	protected function is_post_author() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return (
			$this->context->indexable->object_type === 'post' &&
			$this->helpers->schema->article->is_article_post_type( $this->context->indexable->object_sub_type )
		);
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
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Author::determine_user_id' );

		return parent::determine_user_id();
	}
}
