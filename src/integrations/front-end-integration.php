<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Integrations
 */

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Memoizer\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;
use Yoast\WP\SEO\Presenters\Title_Presenter;
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
	 * The title presenter.
	 *
	 * @var Title_Presenter
	 */
	protected $title_presenter;

	/**
	 * The presenters we loop through on each page load.
	 *
	 * @var array
	 */
	protected $base_presenters = [
		'Debug\Marker_Open',
		'Title',
		'Meta_Description',
		'Robots',
		'Googlebot',
	];

	/**
	 * The presenters we loop through on each page load.
	 *
	 * @var array
	 */
	protected $indexing_directive_presenters = [
		'Canonical',
		'Rel_Prev',
		'Rel_Next',
	];

	/**
	 * The Open Graph specific presenters.
	 *
	 * @var array
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
		'Open_Graph\FB_App_ID',
	];

	/**
	 * The Twitter card specific presenters.
	 *
	 * @var array
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
	 * Presenters that are only needed on singular pages.
	 *
	 * @var array
	 */
	protected $singular_presenters = [
		'Open_Graph\Article_Author',
		'Open_Graph\Article_Publisher',
		'Open_Graph\Article_Published_Time',
		'Open_Graph\Article_Modified_Time',
		'Twitter\Creator',
	];

	/**
	 * The presenters we want to be last in our output.
	 *
	 * @var array
	 */
	protected $closing_presenters = [
		'Schema',
		'Debug\Marker_Close',
	];

	/**
	 * @inheritDoc
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
	 * @param Title_Presenter            $title_presenter   The title presenter.
	 *
	 * @codeCoverageIgnore It sets dependencies.
	 */
	public function __construct(
		Meta_Tags_Context_Memoizer $context_memoizer,
		ContainerInterface $service_container,
		Options_Helper $options,
		Title_Presenter $title_presenter
	) {
		$this->container        = $service_container;
		$this->context_memoizer = $context_memoizer;
		$this->options          = $options;
		$this->title_presenter  = $title_presenter;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		add_action( 'wp_head', [ $this, 'call_wpseo_head' ], 1 );
		// Filter the title for compatibility with other plugins and themes.
		add_filter( 'wp_title', [ $this, 'filter_title' ], 15 );

		// @todo Walk through AMP post template and unhook all the stuff they don't need to because we do it.
		add_action( 'amp_post_template_head', [ $this, 'call_wpseo_head' ], 9 );

		add_action( 'wpseo_head', [ $this, 'present_head' ], -9999 );

		remove_action( 'wp_head', 'rel_canonical' );
		remove_action( 'wp_head', 'index_rel_link' );
		remove_action( 'wp_head', 'start_post_rel_link' );
		remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head' );
		remove_action( 'wp_head', 'noindex', 1 );
		remove_action( 'wp_head', '_wp_render_title_tag', 1 );
		remove_action( 'wp_head', 'gutenberg_render_title_tag', 1 );

		if ( ! get_theme_support( 'title-tag' ) ) {
			// Remove the title presenter if the theme is hardcoded to output a title tag so we don't have two title tags.
			$this->base_presenters = array_diff( $this->base_presenters, [ 'Title' ] );
		}
	}

	/**
	 * Filters the title, mainly used for compatibility reasons.
	 */
	public function filter_title() {
		$context = $this->context_memoizer->for_current_page();
		return \esc_html( $this->title_presenter->present( $context->presentation, false ) );
	}

	/**
	 * Presents the head in the front-end. Resets wp_query if it's not the main query.
	 *
	 * @codeCoverageIgnore It just calls a WordPress function.
	 */
	public function call_wpseo_head() {
		global $wp_query;

		$old_wp_query = $wp_query;
		wp_reset_query();

		do_action( 'wpseo_head' );

		$GLOBALS['wp_query'] = $old_wp_query;
	}

	/**
	 * Echoes all applicable presenters for a page.
	 */
	public function present_head() {
		$context    = $this->context_memoizer->for_current_page();
		$presenters = $this->get_presenters( $context->page_type );
		echo PHP_EOL;
		foreach ( $presenters as $presenter ) {
			$output = $presenter->present( $context->presentation );
			if ( ! empty( $output ) ) {
				echo "\t" . $output . PHP_EOL;
			}
		}
		echo PHP_EOL . PHP_EOL;
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
		$invalid_behaviour = $this->invalid_behaviour();

		return array_filter(
			array_map( function( $presenter ) use ( $page_type, $invalid_behaviour ) {
				return $this->container->get( "Yoast\WP\SEO\Presenters\\{$presenter}_Presenter", $invalid_behaviour );
			}, $needed_presenters )
		);
	}

	/**
	 * Generate the array of presenters we need for the current request.
	 *
	 * @param string $page_type The page type we're retrieving presenters for.
	 *
	 * @return Abstract_Indexable_Presenter[] The presenters.
	 */
	private function get_needed_presenters( $page_type ) {
		$presenters = $this->get_presenters_for_page_type( $page_type );

		/**
		 * Filter 'wpseo_frontend_presenters' - Allow filtering presenters in or out of the request.
		 *
		 * @api array List of presenters.
		 */
		$presenters = apply_filters( 'wpseo_frontend_presenters', $presenters );

		return $presenters;
	}

	/**
	 * Filters the presenters based on the page type.
	 *
	 * @param string $page_type The page type.
	 *
	 * @return Abstract_Indexable_Presenter[] The presenters.
	 */
	private function get_presenters_for_page_type( $page_type ) {
		if ( $page_type === 'Error_Page' ) {
			return array_merge( $this->base_presenters, $this->closing_presenters );
		}

		$presenters = $this->get_all_presenters();
		// Filter out the presenters only needed for singular pages on non-singular pages.
		if ( ! in_array( $page_type, [ 'Post_Type', 'Static_Home_Page' ], true ) ) {
			$presenters = array_diff( $presenters, $this->singular_presenters );
		}

		return $presenters;
	}

	/**
	 * Returns a list of all available presenters based on settings.
	 *
	 * @return Abstract_Indexable_Presenter[] The presenters.
	 */
	private function get_all_presenters() {
		$presenters = array_merge( $this->base_presenters, $this->indexing_directive_presenters );
		if ( $this->options->get( 'opengraph' ) === true ) {
			$presenters = array_merge( $presenters, $this->open_graph_presenters );
		}
		if ( $this->options->get( 'twitter' ) === true && apply_filters( 'wpseo_output_twitter_card', true ) !== false ) {
			$presenters = array_merge( $presenters, $this->twitter_card_presenters );
		}

		return array_merge( $presenters, $this->closing_presenters );
	}

	/**
	 * The behavior when the service does not exist.
	 *
	 * @codeCoverageIgnore This wraps functionality from the Symfony containerinterface.
	 *
	 * @return boolean Value from the container interface.
	 */
	private function invalid_behaviour() {
		$invalid_behaviour = ContainerInterface::NULL_ON_INVALID_REFERENCE;
		if ( \defined( 'WPSEO_DEBUG' ) && WPSEO_DEBUG === true && false ) {
			$invalid_behaviour = ContainerInterface::EXCEPTION_ON_INVALID_REFERENCE;
		}

		return $invalid_behaviour;
	}
}
