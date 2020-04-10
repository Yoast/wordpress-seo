<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Generators\Schema\Article;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;

/**
 * Returns schema Article data.
 *
 * @deprecated 14.0
 *
 * @since 10.2
 */
class WPSEO_Schema_Article extends Article implements WPSEO_Graph_Piece {

	/**
	 * The date helper.
	 *
	 * @var WPSEO_Date_Helper
	 */
	protected $date;

	/**
	 * WPSEO_Schema_Article constructor.
	 *
	 * @param array $context The context. No longer used but present for BC.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 */
	public function __construct( $context = null ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Article' );

		$memoizer      = YoastSEO()->classes->get( Meta_Tags_Context_Memoizer::class );
		$this->context = $memoizer->for_current_page();
		$this->helpers = YoastSEO()->helpers;
		$this->date    = new WPSEO_Date_Helper();
	}

	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return bool
	 */
	public function is_needed() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Article::is_needed' );

		return parent::is_needed();
	}

	/**
	 * Returns Article data.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return array $data Article data.
	 */
	public function generate() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Article::generate' );

		return parent::generate();
	}

	/**
	 * Determines whether a given post type should have Article schema.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param string $post_type Post type to check.
	 *
	 * @return bool True if it has article schema, false if not.
	 */
	public static function is_article_post_type( $post_type = null ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'YoastSEO()->helpers->schema->article->is_article_post_type' );

		return YoastSEO()->helpers->schema->article->is_article_post_type( $post_type );
	}
}
