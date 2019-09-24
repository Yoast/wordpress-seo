<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Integrations
 */

namespace Yoast\WP\Free\Integrations;

use Yoast\WP\Free\Conditionals\Front_End_Conditional;
use Yoast\WP\Free\Conditionals\Indexables_Feature_Flag_Conditional;
use Yoast\WP\Free\Helpers\Current_Post_Helper;
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
	 * @var Current_Post_Helper
	 */
	protected $current_post_helper;

	/**
	 * @var Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * @var WP_Query_Wrapper
	 */
	protected $wp_query_wrapper;

	/**
	 * @var ContainerInterface
	 */
	protected $container;

	/**
	 * The presenters we loop through on each page load.
	 *
	 * @var array
	 */
	protected $presenters = [
		'Debug_Marker_Open'      => 'site_wide',
		'Canonical'              => 'indexable',
		'Title'                  => 'indexable',
		'Meta_Description'       => 'indexable',
		'Robots'                 => 'indexable',
		'Open_Graph_Locale'      => 'site_wide',
		'Open_Graph_Site_Name'   => 'site_wide',
		'Open_Graph_Url'         => 'indexable',
		'Open_Graph_Type'        => 'indexable',
		'Open_Graph_Author'      => 'indexable',
		'Open_Graph_Title'       => 'indexable',
		'Open_Graph_Description' => 'indexable',
		'Open_Graph_Image'       => 'indexable',
		'Twitter_Site'           => 'site_wide',
		'Twitter_Card'           => 'indexable',
		'Twitter_Creator'        => 'indexable',
		'Twitter_Title'          => 'indexable',
		'Twitter_Description'    => 'indexable',
		'Twitter_Image'          => 'indexable',
		'Debug_Marker_Close'     => 'site_wide',
	];

	/**
	 * Front_End_Integration constructor.
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 * @param Current_Post_Helper  $current_post_helper  The current post helper.
	 * @param WP_Query_Wrapper     $wp_query_wrapper     The WP Query wrapper.
	 * @param ContainerInterface   $service_container    The DI container.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository,
		Current_Post_Helper $current_post_helper,
		WP_Query_Wrapper $wp_query_wrapper,
		ContainerInterface $service_container
	) {
		$this->indexable_repository = $indexable_repository;
		$this->current_post_helper  = $current_post_helper;
		$this->wp_query_wrapper     = $wp_query_wrapper;
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
			}, array_keys( $this->presenters ), $this->presenters )
		);
	}

	/**
	 * Returns the page type for the current request.
	 *
	 * @return string Page type.
	 */
	protected function get_page_type() {
		$wp_query = $this->wp_query_wrapper->get_main_query();

		switch ( true ) {
			case $this->current_post_helper->is_simple_page():
				return 'Post_Type';
			case $wp_query->is_post_type_archive:
				return 'Post_Type_Archive';
			case $wp_query->is_tax || $wp_query->is_tag || $wp_query->is_category:
				return 'Term_Archive';
			case $wp_query->is_author:
				return 'Author_Archive';
			case $wp_query->is_date:
				return 'Date_Archive';
			case $this->current_post_helper->is_home_posts_page() || $this->current_post_helper->is_home_static_page():
				return 'Home_Page';
			case $wp_query->is_search:
				return 'Search_Result';
			case $wp_query->is_404:
				return 'Error_Page';
		}

		return 'Fallback';
	}
}
