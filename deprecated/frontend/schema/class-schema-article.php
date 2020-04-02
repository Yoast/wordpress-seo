<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Generators\Schema\Article;
use Yoast\WP\SEO\Memoizer\Meta_Tags_Context_Memoizer;

/**
 * Returns schema Article data.
 *
 * @deprecated 14.0
 *
 * @since 10.2
 */
class WPSEO_Schema_Article implements WPSEO_Graph_Piece {

	/**
	 * Holds a memoizer for the meta tag context.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	private $memoizer;

	/**
	 * WPSEO_Schema_Article constructor.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Article' );
		$this->memoizer = YoastSEO()->classes->get( Meta_Tags_Context_Memoizer::class );
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
		$article = new Article();
		$article->context = $this->memoizer->for_current_page();
		$article->helpers = YoastSEO()->helpers;

		return $article->is_needed();
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
		$article = new Article();
		$article->context = $this->memoizer->for_current_page();
		$article->helpers = YoastSEO()->helpers;

		return $article->generate();
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
