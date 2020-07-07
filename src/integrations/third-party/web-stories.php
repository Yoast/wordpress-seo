<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Integrations\Third_Party
 */

namespace Yoast\WP\SEO\Integrations\Third_Party;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Conditionals\Web_Stories_Conditional;
use Yoast\WP\SEO\Integrations\Front_End_Integration;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Web Stories integration
 */
class Web_Stories implements Integration_Interface {

	/**
	 * The front end integration.
	 *
	 * @var Front_End_Integration
	 */
	protected $front_end;

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class, Web_Stories_Conditional::class ];
	}

	/**
	 * Constructs the Web Stories integration
	 *
	 * @param Front_End_Integration $front_end The front end integration.
	 */
	public function __construct( Front_End_Integration $front_end ) {
		$this->front_end = $front_end;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_action( 'web_stories_story_head', [ $this, 'remove_web_stories_meta_output' ], 0 );
		\add_action( 'web_stories_story_head', [ $this->front_end, 'call_wpseo_head' ], 9 );
		\add_filter( 'wpseo_schema_article_post_types', [ $this, 'filter_schema_article_post_types' ] );
	}

	/**
	 * Removes Web Stories meta output.
	 *
	 * @return void
	 */
	public function remove_web_stories_meta_output() {
		$instance = \Google\Web_Stories\get_plugin_instance()->discovery;
		\remove_action( 'web_stories_story_head', [ $instance, 'print_metadata' ] );
		\remove_action( 'web_stories_story_head', [ $instance, 'print_schemaorg_metadata' ] );
		\remove_action( 'web_stories_story_head', [ $instance, 'print_open_graph_metadata' ] );
		\remove_action( 'web_stories_story_head', [ $instance, 'print_twitter_metadata' ] );
		\remove_action( 'web_stories_story_head', 'rel_canonical' );
	}

	/**
	 * Adds web story post type to list of which post types to output Article schema  for.
	 *
	 * @param string[] $post_types Array of post types.
	 * @return string[] Array of post types.
	 */
	public function filter_schema_article_post_types( $post_types ) {
		$post_types[] = \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG;
		return $post_types;
	}
}
