<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Addon_Manager;
use WPSEO_Admin_Asset_Manager;
use WPSEO_Shortlinker;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Indexables_Page_Conditional;
use Yoast\WP\SEO\Helpers\Indexables_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Presenters\Admin\Indexing_Error_Presenter;
use Yoast\WP\SEO\Routes\Indexing_Route;

/**
 * Indexables_Page_Integration class
 *
 * @deprecated 20.4
 * @codeCoverageIgnore
 */
class Indexables_Page_Integration implements Integration_Interface {

	/**
	 * The shortlinker.
	 *
	 * @var WPSEO_Shortlinker
	 */
	private $shortlinker;

	/**
	 * The admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $admin_asset_manager;

	/**
	 * The short link helper.
	 *
	 * @var Short_Link_Helper
	 */
	protected $short_link_helper;

	/**
	 * The addon manager.
	 *
	 * @var WPSEO_Addon_Manager
	 */
	protected $addon_manager;

	/**
	 * The indexables page helper.
	 *
	 * @var Indexables_Page_Helper
	 */
	private $indexables_page_helper;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The product helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * {@inheritDoc}
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 */
	public static function get_conditionals() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );
		return [
			Admin_Conditional::class,
			Indexables_Page_Conditional::class,
		];
	}

	/**
	 * Indexables_Page_Integration constructor.
	 *
	 * @param WPSEO_Admin_Asset_Manager $admin_asset_manager    The admin asset manager.
	 * @param WPSEO_Addon_Manager       $addon_manager          The addon manager.
	 * @param WPSEO_Shortlinker         $shortlinker            The shortlinker.
	 * @param Short_Link_Helper         $short_link_helper      The short link helper.
	 * @param Indexables_Page_Helper    $indexables_page_helper The indexables page helper.
	 * @param Options_Helper            $options_helper         The options helper.
	 * @param Product_Helper            $product_helper         The product helper.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $admin_asset_manager,
		WPSEO_Addon_Manager $addon_manager,
		WPSEO_Shortlinker $shortlinker,
		Short_Link_Helper $short_link_helper,
		Indexables_Page_Helper $indexables_page_helper,
		Options_Helper $options_helper,
		Product_Helper $product_helper
	) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		$this->admin_asset_manager    = $admin_asset_manager;
		$this->addon_manager          = $addon_manager;
		$this->shortlinker            = $shortlinker;
		$this->short_link_helper      = $short_link_helper;
		$this->indexables_page_helper = $indexables_page_helper;
		$this->options_helper         = $options_helper;
		$this->product_helper         = $product_helper;
	}

	/**
	 * {@inheritDoc}
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 */
	public function register_hooks() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
	}

	/**
	 * Enqueues assets for the Indexables Page.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 */
	public function enqueue_assets() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

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
			'errorMessage' => $this->render_indexing_error(),
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
				'ignoreLists'              => [
					'least_readability' => $this->options_helper->get( 'least_readability_ignore_list', [] ),
					'least_seo_score'   => $this->options_helper->get( 'least_seo_score_ignore_list', [] ),
					'most_linked'       => $this->options_helper->get( 'most_linked_ignore_list', [] ),
					'least_linked'      => $this->options_helper->get( 'least_linked_ignore_list', [] ),
				],
				'shortlinks'               => [
					'orphanedContent'         => $this->shortlinker->build_shortlink( 'https://yoa.st/indexables-orphaned-content' ),
					'cornerstoneContent'      => $this->shortlinker->build_shortlink( 'https://yoa.st/indexables-cornerstone-content' ),
					'recommendedReadingOne'   => $this->shortlinker->build_shortlink( 'https://yoa.st/indexables-recommended-reading-1' ),
					'recommendedReadingTwo'   => $this->shortlinker->build_shortlink( 'https://yoa.st/indexables-recommended-reading-2' ),
					'recommendedReadingThree' => $this->shortlinker->build_shortlink( 'https://yoa.st/indexables-recommended-reading-3' ),
					'recommendedReadingFour'  => $this->shortlinker->build_shortlink( 'https://yoa.st/indexables-recommended-reading-4' ),
					'recommendedReadingFive'  => $this->shortlinker->build_shortlink( 'https://yoa.st/indexables-recommended-reading-5' ),
					'internalLinks'           => $this->shortlinker->build_shortlink( 'https://yoa.st/indexables-internal-linking-suggestions' ),
					'getPremium'              => $this->shortlinker->build_shortlink( 'https://yoa.st/indexables-get-premium' ),
				],
			]
		);
	}

	/**
	 * Retrieves a list of the endpoints to use.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
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
	 * The error to show if optimization failed.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @return string The error to show if optimization failed.
	 */
	protected function render_indexing_error() {
		$presenter = new Indexing_Error_Presenter(
			$this->short_link_helper,
			$this->product_helper,
			$this->addon_manager
		);

		return $presenter->present();
	}
}
