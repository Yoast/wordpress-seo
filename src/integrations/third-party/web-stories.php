<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use Google\Web_Stories as Google_Web_Stories;
use WP_Screen;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Web_Stories_Conditional;
use Yoast\WP\SEO\Integrations\Front_End_Integration;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;

/**
 * Web Stories integration.
 */
class Web_Stories implements Integration_Interface {

	/**
	 * The front end integration.
	 *
	 * @var Front_End_Integration
	 */
	protected $front_end;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Web_Stories_Conditional::class ];
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
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'web_stories_enable_metadata', '__return_false' );
		\add_action( 'web_stories_enable_schemaorg_metadata', '__return_false' );
		\add_action( 'web_stories_enable_open_graph_metadata', '__return_false' );
		\add_action( 'web_stories_enable_twitter_metadata', '__return_false' );
		\remove_action( 'web_stories_story_head', 'rel_canonical' );
		\add_action( 'web_stories_story_head', [ $this->front_end, 'call_wpseo_head' ], 9 );
		\add_filter( 'wpseo_schema_article_post_types', [ $this, 'filter_schema_article_post_types' ] );
		\add_filter( 'wpseo_schema_article_type', [ $this, 'filter_schema_article_type' ], 10, 2 );
		\add_filter( 'wpseo_metadesc', [ $this, 'filter_meta_description' ], 10, 2 );
	}

	/**
	 * Adds web story post type to list of which post types to output Article schema  for.
	 *
	 * @param string[] $post_types Array of post types.
	 * @return string[] Array of post types.
	 */
	public function filter_schema_article_post_types( $post_types ) {
		$post_types[] = Google_Web_Stories\Story_Post_Type::POST_TYPE_SLUG;
		return $post_types;
	}

	/**
	 * Filters the meta description for stories.
	 *
	 * @param string                 $description  The description sentence.
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 * @return string The description sentence.
	 */
	public function filter_meta_description( $description, $presentation ) {
		if ( $description || $presentation->model->object_sub_type !== Google_Web_Stories\Story_Post_Type::POST_TYPE_SLUG ) {
			return $description;
		}

		return \get_the_excerpt( $presentation->model->object_id );
	}

	/**
	 * Filters Article type for Web Stories.
	 *
	 * @param string|string[] $type      The Article type.
	 * @param Indexable       $indexable The indexable.
	 * @return string|string[] Article type.
	 */
	public function filter_schema_article_type( $type, $indexable ) {
		if ( $indexable->object_sub_type !== Google_Web_Stories\Story_Post_Type::POST_TYPE_SLUG ) {
			return $type;
		}

		if ( \is_string( $type ) && $type === 'None' ) {
			return 'Article';
		}

		return $type;
	}
}
