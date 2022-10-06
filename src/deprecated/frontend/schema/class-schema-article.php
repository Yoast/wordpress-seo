<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Generators\Schema\Article;

/**
 * Returns schema Article data.
 *
 * @since      10.2
 * @deprecated 14.0
 */
class WPSEO_Schema_Article extends WPSEO_Deprecated_Graph_Piece {

	/**
	 * The date helper.
	 *
	 * @var WPSEO_Date_Helper
	 */
	protected $date;

	/**
	 * WPSEO_Schema_Article constructor.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @param array|null $context The context. No longer used but present for BC.
	 */
	public function __construct( $context = null ) {
		parent::__construct( Article::class );

		$this->date = new WPSEO_Date_Helper();
	}

	/**
	 * Determines whether a given post type should have Article schema.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @param string|null $post_type Post type to check.
	 *
	 * @return bool True if it has article schema, false if not.
	 */
	public static function is_article_post_type( $post_type = null ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'YoastSEO()->helpers->schema->article->is_article_post_type' );

		return YoastSEO()->helpers->schema->article->is_article_post_type( $post_type );
	}
}
