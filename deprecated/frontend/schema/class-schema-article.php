<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Generators\Schema\Article;
use Yoast\WP\SEO\Helpers\Schema\Article_Helper;
use Yoast\WP\SEO\Memoizer\Meta_Tags_Context_Memoizer;

/**
 * Returns schema Article data.
 *
 * @deprecated xx.x
 *
 * @since 10.2
 */
class WPSEO_Schema_Article implements WPSEO_Graph_Piece {

	/**
	 * WPSEO_Schema_Article constructor.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\Article::__construct' );
	}

	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @return bool
	 */
	public function is_needed() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\Article::is_needed' );

		$yoast = YoastSEO();
		/**
		 * Holds a memoizer for the meta tag context.
		 *
		 * @var Meta_Tags_Context_Memoizer
		 */
		$memoizer = $yoast->classes->get( Meta_Tags_Context_Memoizer::class );
		$context  = $memoizer->for_current_page();
		/**
		 * Holds the article schema.
		 *
		 * @var Article
		 */
		$piece = $yoast->classes->get( Article::class );

		return $piece->is_needed( $context );
	}

	/**
	 * Returns Article data.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @return array $data Article data.
	 */
	public function generate() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Generators\Schema\Article::generate' );

		$yoast = YoastSEO();
		/**
		 * Holds a memoizer for the meta tag context.
		 *
		 * @var Meta_Tags_Context_Memoizer
		 */
		$memoizer = $yoast->classes->get( Meta_Tags_Context_Memoizer::class );
		$context  = $memoizer->for_current_page();
		/**
		 * Holds the article schema.
		 *
		 * @var Article
		 */
		$piece = $yoast->classes->get( Article::class );

		return $piece->generate( $context );
	}

	/**
	 * Determines whether a given post type should have Article schema.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @param string $post_type Post type to check.
	 *
	 * @return bool True if it has article schema, false if not.
	 */
	public static function is_article_post_type( $post_type = null ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Helpers\Schema\Article_Helper::is_article_post_type' );

		/**
		 * Holds the article schema helper.
		 *
		 * @var Article_Helper
		 */
		$article = YoastSEO()->classes->get( Article_Helper::class );

		return $article->is_article_post_type( $post_type );
	}
}
