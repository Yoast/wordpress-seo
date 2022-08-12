<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use WPSEO_Option_Tab;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Indexables_Page_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Routes\Indexing_Route;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Indexables_Page_Integration class
 */
class Indexables_Page_Integration implements Integration_Interface {

	/**
	 * The admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $admin_asset_manager;

	/**
	 * The indexables page helper.
	 *
	 * @var Indexables_Page_Helper
	 */
	private $indexables_page_helper;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * The product helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * {@inheritDoc}
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Indexables_Page_Integration constructor.
	 *
	 * @param WPSEO_Admin_Asset_Manager $admin_asset_manager    The admin asset manager.
	 * @param Indexables_Page_Helper    $indexables_page_helper The indexables page helper.
	 * @param Product_Helper            $product_helper         The product helper.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository,
		WPSEO_Admin_Asset_Manager $admin_asset_manager,
		Indexables_Page_Helper $indexables_page_helper,
		Post_Type_Helper $post_type_helper,
		Product_Helper $product_helper,
		Options_Helper $options_helper
	) {
		$this->indexable_repository = $indexable_repository;
		$this->admin_asset_manager    = $admin_asset_manager;
		$this->indexables_page_helper = $indexables_page_helper;
		$this->post_type_helper     = $post_type_helper;
		$this->product_helper         = $product_helper;
		$this->options_helper       = $options_helper;
	}

	/**
	 * {@inheritDoc}
	 */
	public function register_hooks() {
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		\add_action( 'wpseo_settings_tabs_dashboard', [ $this, 'add_indexables_page_tab' ] );
	}

	/**
	 * Adds a dedicated tab in the General sub-page.
	 *
	 * @param WPSEO_Options_Tabs $dashboard_tabs Object representing the tabs of the General sub-page.
	 */
	public function add_indexables_page_tab( $dashboard_tabs ) {
		$dashboard_tabs->add_tab(
			new WPSEO_Option_Tab(
				'indexables-page',
				__( 'Indexables', 'wordpress-seo' ),
				[ 'save_button' => false ]
			)
		);
	}

	/**
	 * Enqueues assets for the Indexables Page.
	 */
	public function enqueue_assets() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Date is not processed or saved.
		if ( ! isset( $_GET['page'] ) || $_GET['page'] !== 'wpseo_dashboard' || \is_network_admin() ) {
			return;
		}

		$this->admin_asset_manager->enqueue_script( 'indexables-page' );
		$this->admin_asset_manager->enqueue_style( 'tailwind' );
		$this->admin_asset_manager->enqueue_style( 'monorepo' );
		$this->admin_asset_manager->enqueue_script( 'indexation' );

		$data = [
			'disabled'     => ! \YoastSEO()->helpers->indexable->should_index_indexables(),
			'amount'       => \YoastSEO()->helpers->indexing->get_filtered_unindexed_count(),
			// Forcing this to 0 to not display the initial alert notice.
			'firstTime'    => '0',
			'errorMessage' => '',
			'restApi'      => [
				'root'               => \esc_url_raw( \rest_url() ),
				'indexing_endpoints' => $this->get_endpoints(),
				'nonce'              => \wp_create_nonce( 'wp_rest' ),
			],
		];

		/**
		 * Filter: 'wpseo_indexing_data' Filter to adapt the data used in the indexing process.
		 *
		 * @param array $data The indexing data to adapt.
		 */
		$data = \apply_filters( 'wpseo_indexing_data', $data );

		$this->admin_asset_manager->localize_script( 'indexation', 'yoastIndexingData', $data );

		$this->admin_asset_manager->localize_script(
			'indexables-page',
			'wpseoIndexablesPageData',
			[
				'environment'              => \wp_get_environment_type(),
				'listSize'                 => $this->indexables_page_helper->get_indexables_list_size(),
				'isLinkSuggestionsEnabled' => $this->indexables_page_helper->get_link_suggestions_enabled(),
				'isPremium'                => $this->product_helper->is_premium(),
				'setupInfo'                => $this->get_setup_info(),
			]
		);
	}

	/**
	 * Retrieves a list of the endpoints to use.
	 *
	 * @return array The endpoints.
	 */
	protected function get_endpoints() {
		$endpoints = [
			'prepare'            => Indexing_Route::FULL_PREPARE_ROUTE,
			'terms'              => Indexing_Route::FULL_TERMS_ROUTE,
			'posts'              => Indexing_Route::FULL_POSTS_ROUTE,
			'archives'           => Indexing_Route::FULL_POST_TYPE_ARCHIVES_ROUTE,
			'general'            => Indexing_Route::FULL_GENERAL_ROUTE,
			'indexablesComplete' => Indexing_Route::FULL_INDEXABLES_COMPLETE_ROUTE,
			'post_link'          => Indexing_Route::FULL_POST_LINKS_INDEXING_ROUTE,
			'term_link'          => Indexing_Route::FULL_TERM_LINKS_INDEXING_ROUTE,
		];

		$endpoints = \apply_filters( 'wpseo_indexing_endpoints', $endpoints );

		$endpoints['complete'] = Indexing_Route::FULL_COMPLETE_ROUTE;

		return $endpoints;
	}

	/**
	 * Get public sub types that are relevant for the indexable page.
	 *
	 * @return array The subtypes.
	 */
	protected function get_sub_types() {
		$object_sub_types = \array_values( $this->post_type_helper->get_public_post_types() );

		$excluded_post_types = \apply_filters( 'wpseo_indexable_excluded_post_types', [ 'attachment' ] );
		$object_sub_types    = \array_diff( $object_sub_types, $excluded_post_types );

		$wanted_sub_types = [];
		foreach ( $object_sub_types as $sub_type ) {
			if ( $this->post_type_helper->is_indexable( $sub_type ) && $this->post_type_helper->has_metabox( $sub_type ) ) {
				$wanted_sub_types[] = $sub_type;
			}
		}
		return $wanted_sub_types;
	}

	/**
	 * Creates a query that can find public indexables.
	 *
	 * @return ORM Returns an ORM instance that can be used to execute the query.
	 */
	protected function query() {
		return $this->indexable_repository->query()
			->where_raw( '( post_status = \'publish\' OR post_status IS NULL )' )
			->where_in( 'object_type', [ 'post' ] )
			->where_in( 'object_sub_type', $this->get_sub_types() );
	}

	/**
	 * 
	 */
	protected function get_setup_info() {
		$features = [
			'isSeoScoreEnabled'    => $this->options_helper->get( 'keyword_analysis_active', true ),
			'isReadabilityEnabled' => $this->options_helper->get( 'content_analysis_active', true ),
			'isLinkCountEnabled'   => $this->options_helper->get( 'enable_text_link_counter', true ),
		];

		$posts_with_seo_score    = 0;
		$posts_with_readability  = 0;
		$posts_without_keyphrase = [];

		if ( ! $features['isSeoScoreEnabled'] && ! $features['isReadabilityEnabled'] && ! $features['isLinkCountEnabled'] ) {
			return [
				'enabledFeatures'       => $features,
				'enoughContent'         => false,
				'enoughAnalysedContent' => false,
			];
		}

		$all_posts = $this->query()->count();

		if ( $all_posts < 1 ) {
			return [
				'enabledFeatures'       => $features,
				'enoughContent'         => false,
				'enoughAnalysedContent' => false,
			];
		}

		$posts_with_seo_score = $this->query()
			->where_not_equal( 'primary_focus_keyword', 0 )
			->count();

		$posts_without_keyphrase = $this->query()
			->where_null( 'primary_focus_keyword' )
			->order_by_desc( 'incoming_link_count' )
			->find_many();

		$posts_with_readability = $this->query()
			->where_not_equal( 'readability_score', 0 )
			->count();

		$enough_analysed_content = ( max( $posts_with_seo_score, $posts_with_readability ) / $all_posts );

		return [
			'enabledFeatures'       => $features,
			'enoughContent'         => $all_posts > $this->indexables_page_helper->get_minimum_posts_threshold(),
			'enoughAnalysedContent' => $enough_analysed_content > $this->indexables_page_helper->get_minimum_analyzed_posts_threshold(),
			'postsWithoutKeyphrase' => \array_map(
				function ( $indexable ) {
					$output = $indexable;
					if ( $indexable->incoming_link_count === null ) {
						$output->incoming_link_count = 0;
					}
					return $output;
				},
				$posts_without_keyphrase
			),
		];
	}
}
