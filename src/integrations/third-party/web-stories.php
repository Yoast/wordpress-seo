<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use Google\Web_Stories as Google_Web_Stories;
use WP_Screen;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Web_Stories_Conditional;
use Yoast\WP\SEO\Integrations\Front_End_Integration;
use Yoast\WP\SEO\Integrations\Integration_Interface;

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
	 * @inheritDoc
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
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_action( 'web_stories_story_head', [ $this, 'remove_web_stories_meta_output' ], 0 );
		\add_action( 'web_stories_story_head', [ $this->front_end, 'call_wpseo_head' ], 9 );
		\add_filter( 'wpseo_schema_article_post_types', [ $this, 'filter_schema_article_post_types' ] );
		\add_action( 'admin_enqueue_scripts', [ $this, 'dequeue_admin_assets' ] );
	}

	/**
	 * Removes Web Stories meta output.
	 *
	 * @return void
	 */
	public function remove_web_stories_meta_output() {
		$instance = Google_Web_Stories\get_plugin_instance()->discovery;
		\remove_action( 'web_stories_story_head', [ $instance, 'print_metadata' ] );
		\remove_action( 'web_stories_story_head', [ $instance, 'print_schemaorg_metadata' ] );
		\remove_action( 'web_stories_story_head', [ $instance, 'print_open_graph_metadata' ] );
		\remove_action( 'web_stories_story_head', [ $instance, 'print_twitter_metadata' ] );
		\remove_action( 'web_stories_story_head', 'rel_canonical' );
	}

	/**
	 * Removes assets for the stories editor & dashboard as they are completely custom.
	 *
	 * @return void
	 */
	public function dequeue_admin_assets() {
		$screen = \get_current_screen();

		if ( $screen instanceof WP_Screen
			&& Google_Web_Stories\Story_Post_Type::POST_TYPE_SLUG === $screen->post_type
			&& $screen->base !== 'edit'
		) {
			\wp_dequeue_script( WPSEO_Admin_Asset_Manager::PREFIX . 'post-edit' );
			\wp_dequeue_script( WPSEO_Admin_Asset_Manager::PREFIX . 'post-edit-classic' );
			\wp_dequeue_script( WPSEO_Admin_Asset_Manager::PREFIX . 'edit-page-script' );
			\wp_dequeue_script( WPSEO_Admin_Asset_Manager::PREFIX . 'quick-edit-handler' );

			\wp_dequeue_style( WPSEO_Admin_Asset_Manager::PREFIX . 'metabox-css' );
			\wp_dequeue_style( WPSEO_Admin_Asset_Manager::PREFIX . 'scoring' );
			\wp_dequeue_style( WPSEO_Admin_Asset_Manager::PREFIX . 'select2' );
			\wp_dequeue_style( WPSEO_Admin_Asset_Manager::PREFIX . 'monorepo' );
			\wp_dequeue_style( WPSEO_Admin_Asset_Manager::PREFIX . 'admin-css' );
			\wp_dequeue_style( WPSEO_Admin_Asset_Manager::PREFIX . 'featured-image' );
			\wp_dequeue_style( WPSEO_Admin_Asset_Manager::PREFIX . 'dismissible' );
			\wp_dequeue_style( WPSEO_Admin_Asset_Manager::PREFIX . 'edit-page' );
		}
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
}
