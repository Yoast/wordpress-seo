<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Integrations
 */

namespace Yoast\WP\Free\Integrations;

use WPSEO_Options;
use Yoast\WP\Free\Conditionals\Front_End_Conditional;
use Yoast\WP\Free\Conditionals\Indexables_Feature_Flag_Conditional;
use Yoast\WP\Free\Context\Meta_Tags_Context;
use Yoast\WP\Free\Helpers\Blocks_Helper;
use Yoast\WP\Free\Helpers\Current_Page_Helper;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Abstract_Indexable_Presenter;
use Yoast\WP\Free\Repositories\Indexable_Repository;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class Front_End_Integration.
 */
class Front_End_Integration implements Integration_Interface {
	/**
	 * @var Meta_Tags_Context
	 */
	private $meta_tags_context;
	/**
	 * @var Blocks_Helper
	 */
	private $blocks_helper;

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class, Indexables_Feature_Flag_Conditional::class ];
	}

	/**
	 * @var Current_Page_Helper
	 */
	protected $current_page;

	/**
	 * @var Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * @var ContainerInterface
	 */
	protected $container;

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
	];

	/**
	 * The presenters we loop through on each page load.
	 *
	 * @var array
	 */
	protected $indexing_directive_presenters = [
		'Canonical',
	];

	/**
	 * The OpenGraph specific presenters.
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
		'Open_Graph\Article_Publish_Time',
		'Open_Graph\Article_Modified_Time',
		'Open_Graph\Image',
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
		'Open_Graph\Article_Publish_Time',
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
	 * Front_End_Integration constructor.
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 * @param Current_Page_Helper  $current_page_helper  The current post helper.
	 * @param Blocks_Helper        $blocks_helper        The blocks helper.
	 * @param Meta_Tags_Context    $meta_tags_context    The meta tags context prototype.
	 * @param ContainerInterface   $service_container    The DI container.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository,
		Current_Page_Helper $current_page_helper,
		Blocks_Helper $blocks_helper,
		Meta_Tags_Context $meta_tags_context,
		ContainerInterface $service_container
	) {
		$this->indexable_repository = $indexable_repository;
		$this->current_page         = $current_page_helper;
		$this->blocks_helper        = $blocks_helper;
		$this->meta_tags_context    = $meta_tags_context;
		$this->container            = $service_container;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		add_action( 'wp_head', [ $this, 'call_wpseo_head' ], 1 );

		// @todo Walk through AMP post template and unhook all the stuff they don't need to because we do it.
		add_action( 'amp_post_template_head', [ $this, 'call_wpseo_head' ], 9 );

		add_action( 'wpseo_head', [ $this, 'present_head' ], -9999 );

		remove_action( 'wp_head', 'rel_canonical' );
		remove_action( 'wp_head', 'index_rel_link' );
		remove_action( 'wp_head', 'start_post_rel_link' );
		remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head' );
		remove_action( 'wp_head', 'noindex', 1 );
		remove_action( 'wp_head', '_wp_render_title_tag', 1 );
	}

	/**
	 * Presents the head in the front-end. Resets wp_query if it's not the main query.
	 */
	public function call_wpseo_head() {
		do_action( 'wpseo_head' );
	}

	/**
	 * Echoes all applicable presenters for a page.
	 */
	public function present_head() {
		$indexable    = $this->indexable_repository->for_current_page();
		$page_type    = $this->get_page_type();
		$context      = $this->get_context( $indexable );
		$presentation = $this->get_presentation( $indexable, $context, $page_type );
		$presenters   = $this->get_presenters( $page_type );
		echo "\n";
		foreach ( $presenters as $presenter ) {
			if ( \defined( 'WPSEO_DEBUG' ) && WPSEO_DEBUG === true ) {
				echo '<!-- ' . get_class( $presenter ) . ' -->';
			}

			$output = $presenter->present( $presentation );
			if ( ! empty( $output ) ) {
				echo "\t" . $output . "\n";
			}
		}
		echo "\n\n";
	}

	/**
	 * Gets the meta tags context given an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return Meta_Tags_Context The meta tags context.
	 */
	private function get_context( Indexable $indexable ) {
		$blocks = [];
		$post   = null;
		if ( $indexable->object_type === 'post' ) {
			$post   = \get_post( $indexable->object_id );
			$blocks = $this->blocks_helper->get_all_blocks_from_content( $post->post_content );
		}
		return $this->meta_tags_context->of( [ 'indexable' => $indexable, 'blocks' => $blocks, 'post' => $post ] );
	}

	/**
	 * Gets the presentation of an indexable for a specific page type.
	 *
	 * @param Indexable         $indexable The indexable to get a presentation of.
	 * @param Meta_Tags_Context $context   The current meta tags context.
	 * @param string            $page_type The page type.
	 *
	 * @return Indexable_Presentation The indexable presentation.
	 */
	private function get_presentation( Indexable $indexable, Meta_Tags_Context $context, $page_type ) {
		$presentation = $this->container->get( "Yoast\WP\Free\Presentations\Indexable_{$page_type}_Presentation", ContainerInterface::NULL_ON_INVALID_REFERENCE );

		if ( ! $presentation ) {
			$presentation = $this->container->get( Indexable_Presentation::class );
		}

		$context->presentation = $presentation->of( [ 'model' => $indexable, 'context' => $context ] );
		return $context->presentation;
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
		$invalid_behaviour = ContainerInterface::NULL_ON_INVALID_REFERENCE;
		if ( \defined( 'WPSEO_DEBUG' ) && WPSEO_DEBUG === true && false ) {
			$invalid_behaviour = ContainerInterface::EXCEPTION_ON_INVALID_REFERENCE;
		}

		return array_filter(
			array_map( function ( $presenter ) use ( $page_type, $invalid_behaviour ) {
				return $this->container->get( "Yoast\WP\Free\Presenters\\{$presenter}_Presenter", $invalid_behaviour );
			}, $needed_presenters )
		);
	}

	/**
	 * Returns the page type for the current request.
	 *
	 * @return string Page type.
	 */
	protected function get_page_type() {
		switch ( true ) {
			case $this->current_page->is_attachment():
				return 'Attachment';
			case $this->current_page->is_search_result():
				return 'Search_Result_Page';
			case $this->current_page->is_simple_page() || $this->current_page->is_home_static_page():
				return 'Post_Type';
			case $this->current_page->is_post_type_archive():
				return 'Post_Type_Archive';
			case $this->current_page->is_term_archive():
				return 'Term_Archive';
			case $this->current_page->is_author_archive():
				return 'Author_Archive';
			case $this->current_page->is_date_archive():
				return 'Date_Archive';
			case $this->current_page->is_home_posts_page():
				return 'Home_Page';
			case $this->current_page->is_404():
				return 'Error_Page';
		}

		return 'Fallback';
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
	 * @param string $page_type  The page type.
	 *
	 * @return Abstract_Indexable_Presenter[] The presenters.
	 */
	private function get_presenters_for_page_type( $page_type ) {
		if ( $page_type === 'Error_Page' ) {
			return array_merge( $this->base_presenters, $this->closing_presenters );
		}

		$presenters = $this->get_all_presenters();
		// Filter out the presenters only needed for singular pages on non-singular pages.
		if ( $page_type !== 'Post_Type' ) {
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
		if ( WPSEO_Options::get( 'opengraph' ) === true ) {
			$presenters = array_merge( $presenters, $this->open_graph_presenters );
		}
		if ( WPSEO_Options::get( 'twitter' ) === true ) {
			$presenters = array_merge( $presenters, $this->twitter_card_presenters );
		}
		return array_merge( $presenters, $this->closing_presenters );
	}
}
