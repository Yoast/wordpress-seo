<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Actions\Indexation\Post_Link_Indexing_Action;
use Yoast\WP\SEO\Actions\Indexation\Term_Link_Indexing_Action;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Admin_And_Dashboard_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Presenters\Admin\Link_Count_Indexing_List_Item_Presenter;
use Yoast\WP\SEO\Presenters\Admin\Link_Count_Indexing_Modal_Presenter;
use Yoast\WP\SEO\Routes\Link_Indexing_Route;

/**
 * Link_Count_Tools_Integration class.
 */
class Link_Count_Tools_Integration implements Integration_Interface {

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [
			Admin_Conditional::class,
			Yoast_Admin_And_Dashboard_Conditional::class,
			Migrations_Conditional::class,
		];
	}

	/**
	 * The post link indexing action.
	 *
	 * @var Post_Link_Indexing_Action
	 */
	protected $post_link_indexing_action;

	/**
	 * The term link indexing action.
	 *
	 * @var Term_Link_Indexing_Action
	 */
	protected $term_link_indexing_action;

	/**
	 * Represents the admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * The total amount of unindexed objects.
	 *
	 * @var int
	 */
	private $total_unindexed;

	/**
	 * Constructor.
	 *
	 * @param Post_Link_Indexing_Action $post_link_indexing_action The post link indexing action.
	 * @param Term_Link_Indexing_Action $term_link_indexing_action The term link indexing action.
	 * @param WPSEO_Admin_Asset_Manager $asset_manager             The asset manager.
	 */
	public function __construct(
		Post_Link_Indexing_Action $post_link_indexing_action,
		Term_Link_Indexing_Action $term_link_indexing_action,
		WPSEO_Admin_Asset_Manager $asset_manager
	) {
		$this->post_link_indexing_action = $post_link_indexing_action;
		$this->term_link_indexing_action = $term_link_indexing_action;
		$this->asset_manager             = $asset_manager;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ], 10 );
		\add_action( 'wpseo_tools_overview_list_items', [ $this, 'render_tools_overview_item' ], 10 );
	}

	/**
	 * Enqueues all required assets.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		if ( $this->get_total_unindexed() === 0 ) {
			return;
		}

		\add_action( 'admin_footer', [ $this, 'render_modal' ], 20 );

		$this->asset_manager->enqueue_script( 'indexation' );
		$this->asset_manager->enqueue_style( 'admin-css' );

		$data = [
			'amount'  => $this->get_total_unindexed(),
			'ids'     => [
				'modal'    => 'yoast-link-indexing-modal',
				'count'    => '#yoast-link-indexing-current-count',
				'progress' => '#yoast-link-indexing-progress-bar',
				'message'  => '#yoast-link-indexing',
			],
			'restApi' => [
				'root'      => \esc_url_raw( \rest_url() ),
				'endpoints' => [
					'posts' => Link_Indexing_Route::FULL_POSTS_ROUTE,
					'terms' => Link_Indexing_Route::FULL_TERMS_ROUTE,
				],
				'nonce'     => \wp_create_nonce( 'wp_rest' ),
			],
			'message' => [
				'indexingCompleted' => '<span class="yoast-check">' . \esc_html__( 'Good job! All the links in your texts have been counted.', 'wordpress-seo' ) . '</span>',
				'indexingFailed'    => \__( 'Something went wrong while optimizing the SEO data of your site. Please try again later.', 'wordpress-seo' ),
			],
			'l10n'    => [
				'calculationInProgress' => \__( 'Calculation in progress...', 'wordpress-seo' ),
				'calculationCompleted'  => \__( 'Calculation completed.', 'wordpress-seo' ),
				'calculationFailed'     => \__( 'Calculation failed, please try again later.', 'wordpress-seo' ),
			],
		];

		\wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'indexation', 'yoastLinkIndexingData', $data );
	}

	/**
	 * Renders the tools list item.
	 *
	 * @return void
	 */
	public function render_tools_overview_item() {
		if ( \current_user_can( 'manage_options' ) ) {
			echo new Link_Count_Indexing_List_Item_Presenter( $this->get_total_unindexed() );
		}
	}

	/**
	 * Renders the link count indexing modal.
	 *
	 * @return void
	 */
	public function render_modal() {
		if ( \current_user_can( 'manage_options' ) ) {
			echo new Link_Count_Indexing_Modal_Presenter( $this->get_total_unindexed() );
		}
	}

	/**
	 * Returns the total number of unindexed objects.
	 *
	 * @return int
	 */
	protected function get_total_unindexed() {
		if ( \is_null( $this->total_unindexed ) ) {
			$this->total_unindexed  = $this->post_link_indexing_action->get_total_unindexed();
			$this->total_unindexed += $this->term_link_indexing_action->get_total_unindexed();
		}

		return $this->total_unindexed;
	}
}
