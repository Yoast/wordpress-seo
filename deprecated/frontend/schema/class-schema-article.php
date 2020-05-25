<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Generators\Schema\Article;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Surfaces\Helpers_Surface;

/**
 * Returns schema Article data.
 *
 * @deprecated 14.0
 *
 * @since 10.2
 */
class WPSEO_Schema_Article implements WPSEO_Graph_Piece {

	/**
	 * The meta tags context.
	 *
	 * @var Meta_Tags_Context
	 */
	private $context;

	/**
	 * The helpers surface
	 *
	 * @var Helpers_Surface
	 */
	public $helpers;


	/**
	 * The date helper.
	 *
	 * @var WPSEO_Date_Helper
	 */
	protected $date;


	/**
	 * The stable article class.
	 *
	 * @var Article
	 */
	protected $stable;

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

		$memoizer      			= YoastSEO()->classes->get( Meta_Tags_Context_Memoizer::class );

		// We cannot extend the stable class because a property was made public on it that was previously private.
		// So instead, we instantiate a stable article and delegate to it.
		$this->stable  			= new Article();
		$this->context 			= $memoizer->for_current_page();
		$this->stable->context 	= $this->context;
		$this->helpers 			= YoastSEO()->helpers;
		$this->stable->helpers 	= $this->helpers;
		$this->date    			= new WPSEO_Date_Helper();
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

		return $this->stable->is_needed();
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

		return $this->stable->generate();
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
