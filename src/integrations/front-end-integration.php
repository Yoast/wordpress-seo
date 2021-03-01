<?php

namespace Yoast\WP\SEO\Integrations;

use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;
use Yoast\WP\SEO\Presenters\Debug\Marker_Close_Presenter;
use Yoast\WP\SEO\Presenters\Debug\Marker_Open_Presenter;
use Yoast\WP\SEO\Presenters\Title_Presenter;
use Yoast\WP\SEO\Surfaces\Helpers_Surface;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class Front_End_Integration.
 */
class Front_End_Integration implements Integration_Interface {

	/**
	 * The memoizer for the meta tags context.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	private $context_memoizer;

	/**
	 * The container.
	 *
	 * @var ContainerInterface
	 */
	protected $container;

	/**
	 * Represents the options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options;

	/**
	 * The helpers surface.
	 *
	 * @var Helpers_Surface
	 */
	protected $helpers;

	/**
	 * The replace vars helper.
	 *
	 * @var WPSEO_Replace_Vars
	 */
	protected $replace_vars;

	/**
	 * The presenters we loop through on each page load.
	 *
	 * @var string[]
	 */
	protected $base_presenters = [
		'Title',
		'Meta_Description',
		'Robots',
	];

	/**
	 * The presenters we loop through on each page load.
	 *
	 * @var string[]
	 */
	protected $indexing_directive_presenters = [
		'Canonical',
		'Rel_Prev',
		'Rel_Next',
	];

	/**
	 * The Open Graph specific presenters.
	 *
	 * @var string[]
	 */
	protected $open_graph_presenters = [
		'Open_Graph\Locale',
		'Open_Graph\Type',
		'Open_Graph\Title',
		'Open_Graph\Description',
		'Open_Graph\Url',
		'Open_Graph\Site_Name',
		'Open_Graph\Article_Publisher',
		'Open_Graph\Article_Author',
		'Open_Graph\Article_Published_Time',
		'Open_Graph\Article_Modified_Time',
		'Open_Graph\Image',
	];

	/**
	 * The Open Graph specific presenters that should be output on error pages.
	 *
	 * @var array
	 */
	protected $open_graph_error_presenters = [
		'Open_Graph\Locale',
		'Open_Graph\Title',
		'Open_Graph\Site_Name',
	];

	/**
	 * The Twitter card specific presenters.
	 *
	 * @var string[]
	 */
	protected $twitter_card_presenters = [
		'Twitter\Card',
		'Twitter\Title',
		'Twitter\Description',
		'Twitter\Image',
		'Twitter\Creator',
		'Twitter\Site',
	];

	/**
	 * The Slack specific presenters.
	 *
	 * @var string[]
	 */
	protected $slack_presenters = [
		'Slack\Enhanced_Data',
	];

	/**
	 * The Webmaster verification specific presenters.
	 *
	 * @var string[]
	 */
	protected $webmaster_verification_presenters = [
		'Webmaster\Baidu',
		'Webmaster\Bing',
		'Webmaster\Google',
		'Webmaster\Pinterest',
		'Webmaster\Yandex',
	];

	/**
	 * Presenters that are only needed on singular pages.
	 *
	 * @var string[]
	 */
	protected $singular_presenters = [
		'Open_Graph\Article_Author',
		'Open_Graph\Article_Publisher',
		'Open_Graph\Article_Published_Time',
		'Open_Graph\Article_Modified_Time',
		'Twitter\Creator',
		'Slack\Enhanced_Data',
	];

	/**
	 * The presenters we want to be last in our output.
	 *
	 * @var string[]
	 */
	protected $closing_presenters = [
		'Schema',
	];

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array The conditionals.
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class ];
	}

	/**
	 * Front_End_Integration constructor.
	 *
	 * @param Meta_Tags_Context_Memoizer $context_memoizer  The meta tags context memoizer.
	 * @param ContainerInterface         $service_container The DI container.
	 * @param Options_Helper             $options           The options helper.
	 * @param Helpers_Surface            $helpers           The helpers surface.
	 * @param WPSEO_Replace_Vars         $replace_vars      The replace vars helper.
	 *
	 * @codeCoverageIgnore It sets dependencies.
	 */
	public function __construct(
		Meta_Tags_Context_Memoizer $context_memoizer,
		ContainerInterface $service_container,
		Options_Helper $options,
		Helpers_Surface $helpers,
		WPSEO_Replace_Vars $replace_vars
	) {
		$this->container        = $service_container;
		$this->context_memoizer = $context_memoizer;
		$this->options          = $options;
		$this->helpers          = $helpers;
		$this->replace_vars     = $replace_vars;
	}

	/**
	 * Registers the appropriate hooks to show the SEO metadata on the frontend.
	 *
	 * Removes some actions to remove metadata that WordPress shows on the frontend,
	 * to avoid duplicate and/or mismatched metadata.
	 */
	public function register_hooks() {
		\add_action( 'wp_head', [ $this, 'call_wpseo_head' ], 1 );
		// Filter the title for compatibility with other plugins and themes.
		\add_filter( 'wp_title', [ $this, 'filter_title' ], 15 );

		// Removes our robots presenter from the list when wp_robots is handling this.
		\add_filter( 'wpseo_frontend_presenter_classes', [ $this, 'filter_robots_presenter' ] );

		\add_action( 'wpseo_head', [ $this, 'present_head' ], -9999 );

		\remove_action( 'wp_head', 'rel_canonical' );
		\remove_action( 'wp_head', 'index_rel_link' );
		\remove_action( 'wp_head', 'start_post_rel_link' );
		\remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head' );
		\remove_action( 'wp_head', 'noindex', 1 );
		\remove_action( 'wp_head', '_wp_render_title_tag', 1 );
		\remove_action( 'wp_head', 'gutenberg_render_title_tag', 1 );
	}

	/**
	 * Filters the title, mainly used for compatibility reasons.
	 */
	public function filter_title() {
		$context = $this->context_memoizer->for_current_page();

		$title_presenter = new Title_Presenter();

		/** This filter is documented in src/integrations/front-end-integration.php */
		$title_presenter->presentation = \apply_filters( 'wpseo_frontend_presentation', $context->presentation, $context );
		$title_presenter->replace_vars = $this->replace_vars;
		$title_presenter->helpers      = $this->helpers;

		return \esc_html( $title_presenter->get() );
	}

	/**
	 * Filters our robots presenter, but only when wp_robots is attached to the wp_head action.
	 *
	 * @param array $presenters The presenters for current page.
	 *
	 * @return array The filtered presenters.
	 */
	public function filter_robots_presenter( $presenters ) {
		if ( ! function_exists( 'wp_robots' ) ) {
			return $presenters;
		}

		if ( ! \has_action( 'wp_head', 'wp_robots' ) ) {
			return $presenters;
		}

		return \array_diff( $presenters, [ 'Yoast\\WP\\SEO\\Presenters\\Robots_Presenter' ] );
	}

	/**
	 * Presents the head in the front-end. Resets wp_query if it's not the main query.
	 *
	 * @codeCoverageIgnore It just calls a WordPress function.
	 */
	public function call_wpseo_head() {
		global $wp_query;

		$old_wp_query = $wp_query;
		// phpcs:ignore WordPress.WP.DiscouragedFunctions.wp_reset_query_wp_reset_query -- Reason: The recommended function, wp_reset_postdata, doesn't reset wp_query.
		\wp_reset_query();

		\do_action( 'wpseo_head' );

		$GLOBALS['wp_query'] = $old_wp_query;
	}

	/**
	 * Echoes all applicable presenters for a page.
	 */
	public function present_head() {
		$context    = $this->context_memoizer->for_current_page();
		$presenters = $this->get_presenters( $context->page_type );

		/**
		 * Filter 'wpseo_frontend_presentation' - Allow filtering the presentation used to output our meta values.
		 *
		 * @api Indexable_Presention The indexable presentation.
		 */
		$presentation = \apply_filters( 'wpseo_frontend_presentation', $context->presentation, $context );

		echo \PHP_EOL;
		foreach ( $presenters as $presenter ) {
			$presenter->presentation = $presentation;
			$presenter->helpers      = $this->helpers;
			$presenter->replace_vars = $this->replace_vars;

			$output = $presenter->present();
			if ( ! empty( $output ) ) {
				echo "\t" . $output . \PHP_EOL;
			}
		}
		echo \PHP_EOL . \PHP_EOL;
	}

	/**
	 * Returns all presenters for this page.
	 *
	 * @param string $page_type The page type.
	 *
	 * @return Abstract_Indexable_Presenter[] The presenters.
	 */
	public function get_presenters( $page_type ) {
		$needed_presenters = $this->get_needed_presenters( $page_type );

		$callback   = function( $presenter ) {
			if ( ! \class_exists( $presenter ) ) {
				return null;
			}
			return new $presenter();
		};
		$presenters = \array_filter( \array_map( $callback, $needed_presenters ) );

		/**
		 * Filter 'wpseo_frontend_presenters' - Allow filtering the presenter instances in or out of the request.
		 *
		 * @api Abstract_Indexable_Presenter[] List of presenter instances.
		 */
		$presenter_instances = \apply_filters( 'wpseo_frontend_presenters', $presenters );

		if ( ! \is_array( $presenter_instances ) ) {
			$presenter_instances = $presenters;
		}

		$is_presenter_callback = function ( $presenter_instance ) {
			return $presenter_instance instanceof Abstract_Indexable_Presenter;
		};
		$presenter_instances   = \array_filter( $presenter_instances, $is_presenter_callback );

		return \array_merge(
			[ new Marker_Open_Presenter() ],
			$presenter_instances,
			[ new Marker_Close_Presenter() ]
		);
	}

	/**
	 * Generate the array of presenters we need for the current request.
	 *
	 * @param string $page_type The page type we're retrieving presenters for.
	 *
	 * @return string[] The presenters.
	 */
	private function get_needed_presenters( $page_type ) {
		$presenters = $this->get_presenters_for_page_type( $page_type );

		if ( ! \get_theme_support( 'title-tag' ) && ! $this->options->get( 'forcerewritetitle', false ) ) {
			// Remove the title presenter if the theme is hardcoded to output a title tag so we don't have two title tags.
			$presenters = \array_diff( $presenters, [ 'Title' ] );
		}

		$callback   = function ( $presenter ) {
			return "Yoast\WP\SEO\Presenters\\{$presenter}_Presenter";
		};
		$presenters = \array_map( $callback, $presenters );

		/**
		 * Filter 'wpseo_frontend_presenter_classes' - Allow filtering presenters in or out of the request.
		 *
		 * @api array List of presenters.
		 */
		$presenters = \apply_filters( 'wpseo_frontend_presenter_classes', $presenters );

		return $presenters;
	}

	/**
	 * Filters the presenters based on the page type.
	 *
	 * @param string $page_type The page type.
	 *
	 * @return string[] The presenters.
	 */
	private function get_presenters_for_page_type( $page_type ) {
		if ( $page_type === 'Error_Page' ) {
			$presenters = $this->base_presenters;
			if ( $this->options->get( 'opengraph' ) === true ) {
				$presenters = \array_merge( $presenters, $this->open_graph_error_presenters );
			}
			return \array_merge( $presenters, $this->closing_presenters );
		}

		$presenters = $this->get_all_presenters();
		if ( \in_array( $page_type, [ 'Static_Home_Page', 'Home_Page' ], true ) ) {
			$presenters = \array_merge( $presenters, $this->webmaster_verification_presenters );
		}

		// Filter out the presenters only needed for singular pages on non-singular pages.
		if ( ! \in_array( $page_type, [ 'Post_Type', 'Static_Home_Page' ], true ) ) {
			$presenters = \array_diff( $presenters, $this->singular_presenters );
		}

		return $presenters;
	}

	/**
	 * Returns a list of all available presenters based on settings.
	 *
	 * @return string[] The presenters.
	 */
	private function get_all_presenters() {
		$presenters = \array_merge( $this->base_presenters, $this->indexing_directive_presenters );
		if ( $this->options->get( 'opengraph' ) === true ) {
			$presenters = \array_merge( $presenters, $this->open_graph_presenters );
		}
		if ( $this->options->get( 'twitter' ) === true && \apply_filters( 'wpseo_output_twitter_card', true ) !== false ) {
			$presenters = \array_merge( $presenters, $this->twitter_card_presenters );
		}
		if ( $this->options->get( 'enable_enhanced_slack_sharing' ) === true && \apply_filters( 'wpseo_output_enhanced_slack_data', true ) !== false ) {
			$presenters = \array_merge( $presenters, $this->slack_presenters );
		}

		return \array_merge( $presenters, $this->closing_presenters );
	}
}
