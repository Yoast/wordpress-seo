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
use Yoast\WP\Free\Helpers\Current_Page_Helper;
use Yoast\WP\Free\Presenters\Presenter_Interface;
use Yoast\WP\Free\Repositories\Indexable_Repository;
use Yoast\WP\Free\Wrappers\WP_Query_Wrapper;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class Front_End_Integration.
 */
class Front_End_Integration implements Integration_Interface {

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class, Indexables_Feature_Flag_Conditional::class ];
	}

	/**
	 * @var Current_Page_Helper
	 */
	protected $current_page_helper;

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
		'Debug_Marker_Open' => 'site_wide',
		'Canonical'         => 'indexable',
		'Title'             => 'indexable',
		'Meta_Description'  => 'indexable',
		'Robots'            => 'indexable',
	];

	/**
	 * The OpenGraph specific presenters.
	 *
	 * @var array
	 */
	protected $open_graph_presenters = [
		'Open_Graph_Locale'       => 'site_wide',
		'Open_Graph_Site_Name'    => 'site_wide',
		'Open_Graph_Url'          => 'indexable',
		'Open_Graph_Type'         => 'indexable',
		'Open_Graph_Author'       => 'indexable',
		'Open_Graph_Section'      => 'indexable',
		'Open_Graph_Publish_Time' => 'indexable',
		'Open_Graph_Title'        => 'indexable',
		'Open_Graph_Description'  => 'indexable',
		'Open_Graph_Image'        => 'indexable',
	];

	/**
	 * The Twitter card specific presenters.
	 *
	 * @var array
	 */
	protected $twitter_card_presenters = [
		'Twitter_Site'        => 'site_wide',
		'Twitter_Card'        => 'indexable',
		'Twitter_Creator'     => 'indexable',
		'Twitter_Title'       => 'indexable',
		'Twitter_Description' => 'indexable',
		'Twitter_Image'       => 'indexable',
	];

	/**
	 * The presenters we want to be last in our output.
	 *
	 * @var array
	 */
	protected $closing_presenters = [
		'Debug_Marker_Close'     => 'site_wide',
	];

	/**
	 * Front_End_Integration constructor.
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 * @param Current_Page_Helper  $current_page_helper  The current post helper.
	 * @param ContainerInterface   $service_container    The DI container.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository,
		Current_Page_Helper $current_page_helper,
		ContainerInterface $service_container
	) {
		$this->indexable_repository = $indexable_repository;
		$this->current_page_helper  = $current_page_helper;
		$this->container            = $service_container;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		add_action( 'wp_head', [ $this, 'call_wpseo_head' ], 1 );
		add_action( 'wpseo_head', [ $this, 'present_head' ], 1 );

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
		$indexable = $this->indexable_repository->for_current_page();
		echo "\n";
		foreach ( $this->get_presenters() as $presenter ) {
			echo "\t" . $presenter->present( $indexable ) . "\n";
		}
		echo "\n";
	}

	/**
	 * Returns all presenters for this page.
	 *
	 * @return Presenter_Interface[]
	 */
	public function get_presenters() {
		$needed_presenters = $this->get_needed_presenters();
		$page_type         = $this->get_page_type();
		$invalid_behaviour = ContainerInterface::NULL_ON_INVALID_REFERENCE;
		if ( \defined( 'WPSEO_DEBUG' ) && WPSEO_DEBUG === true && false ) {
			$invalid_behaviour = ContainerInterface::EXCEPTION_ON_INVALID_REFERENCE;
		}

		return array_filter(
			array_map( function ( $presenter, $type ) use ( $page_type, $invalid_behaviour ) {
				if ( $type === 'site_wide' ) {
					return $this->container->get( "Yoast\WP\Free\Presenters\Site\\{$presenter}_Presenter", $invalid_behaviour );
				}

				return $this->container->get( "Yoast\WP\Free\Presenters\\{$page_type}\\{$presenter}_Presenter", $invalid_behaviour );
			}, array_keys( $needed_presenters ), $needed_presenters )
		);
	}

	/**
	 * Returns the page type for the current request.
	 *
	 * @return string Page type.
	 */
	protected function get_page_type() {
		switch ( true ) {
			case $this->current_page_helper->is_simple_page() || $this->current_page_helper->is_home_static_page():
				return 'Post_Type';
			case $this->current_page_helper->is_post_type_archive():
				return 'Post_Type_Archive';
			case $this->current_page_helper->is_term_archive():
				return 'Term_Archive';
			case $this->current_page_helper->is_author_archive():
				return 'Author_Archive';
			case $this->current_page_helper->is_date_archive():
				return 'Date_Archive';
			case $this->current_page_helper->is_home_posts_page():
				return 'Home_Page';
			case $this->current_page_helper->is_search_result():
				return 'Search_Result';
			case $this->current_page_helper->is_error_page():
				return 'Error_Page';
		}

		return 'Fallback';
	}

	/**
	 * Generate the array of presenters we need for the current request.
	 *
	 * @return array
	 */
	private function get_needed_presenters() {
		$presenters = $this->base_presenters;
		if ( WPSEO_Options::get( 'opengraph' ) === true ) {
			$presenters = array_merge( $presenters, $this->open_graph_presenters );
		}
		if ( WPSEO_Options::get( 'twitter' ) === true ) {
			$presenters = array_merge( $presenters, $this->twitter_card_presenters );
		}
		$presenters = array_merge( $presenters, $this->closing_presenters );

		/**
		 * Filter 'wpseo_frontend_presenters' - Allow filtering presenters in or out of the request.
		 *
		 * @api array List of presenters.
		 */
		$presenters = apply_filters( 'wpseo_frontend_presenters', $presenters );

		return $presenters;
	}
}
