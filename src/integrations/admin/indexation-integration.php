<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Integrations\Admin
 */

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Dashboard_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Presenters\Admin\Indexation_List_Item_Presenter;
use Yoast\WP\SEO\Presenters\Admin\Indexation_Modal_Presenter;
use Yoast\WP\SEO\Routes\Indexable_Indexation_Route;

/**
 * Indexation_Integration class
 */
class Indexation_Integration implements Integration_Interface {

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class, Yoast_Dashboard_Conditional::class ];
	}

	/**
	 * The post indexation action.
	 *
	 * @var Indexable_Post_Indexation_Action
	 */
	protected $post_indexation;

	/**
	 * The total amount of unindexed objects.
	 *
	 * @var int
	 */
	private $total_unindexed;

	/**
	 * Indexation_Integration constructor.
	 *
	 * @param Indexable_Post_Indexation_Action $post_indexation The post indexation action.
	 */
	public function __construct( Indexable_Post_Indexation_Action $post_indexation ) {
		$this->post_indexation = $post_indexation;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ], 10 );
		\add_action( 'admin_footer', [ $this, 'render_indexation_modal' ], 20 );
		\add_action( 'wpseo_tools_overview_list_items', [ $this, 'render_indexation_list_item' ], 10 );
	}

	/**
	 * Enqueues the required scripts.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_script( 'indexation' );

		$data = [
			'amount'  => $this->get_total_unindexed(),
			'restApi' => [
				'root'      => \esc_url_raw( rest_url() ),
				'endpoints' => [
					'posts' => Indexable_Indexation_Route::FULL_POSTS_ROUTE,
				],
				'nonce'     => \wp_create_nonce( 'wp_rest' ),
			],
			'message' => [
				'indexingCompleted' => '<span class="wpseo-checkmark-ok-icon"></span>' . \esc_html__( 'Good job! All your site\'s content has been indexed.', 'wordpress-seo' ),
			],
			'l10n'    => [
				'calculationInProgress' => __( 'Calculation in progress...', 'wordpress-seo' ),
				'calculationCompleted'  => __( 'Calculation completed.', 'wordpress-seo' ),
			],
		];

		\wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'indexation', 'yoastIndexationData', $data );
	}

	/**
	 * Renders the indexation list item.
	 *
	 * @return void
	 */
	public function render_indexation_list_item() {
		echo new Indexation_List_Item_Presenter( $this->get_total_unindexed() );
	}

	/**
	 * Renders the indexation modal.
	 *
	 * @return void
	 */
	public function render_indexation_modal() {
		\add_thickbox();

		echo new Indexation_Modal_Presenter( $this->get_total_unindexed() );
	}

	/**
	 * Returns the total number of unindexed objects.
	 *
	 * @return int
	 */
	protected function get_total_unindexed() {
		if ( \is_null( $this->total_unindexed ) ) {
			$this->total_unindexed = $this->post_indexation->get_total_unindexed();
		}
		return $this->total_unindexed;
	}
}
