<?php
/**
 * Author watcher to save the meta data to an Indexable.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Integrations\Presenters;

use WPSEO_Frontend;
use WPSEO_Options;
use Yoast\WP\Free\Conditionals\Indexables_Feature_Flag_Conditional;
use Yoast\WP\Free\Conditionals\Simple_Page_Conditional;
use Yoast\WP\Free\Helpers\Current_Post_Helper;
use Yoast\WP\Free\Helpers\Replacement_Variables_Helper;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Repositories\Indexable_Repository;
use Yoast\WP\Free\WordPress\Integration;

class Meta_Description_Presenter implements Integration {

	/**
	 * @var Indexable_Repository
	 */
	protected $repository;

	/**
	 * @var Replacement_Variables_Helper
	 */
	protected $replacement_variables_helper;

	/**
	 * @var Current_Post_Helper
	 */
	protected $current_post_helper;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Indexables_Feature_Flag_Conditional::class ];
	}

	/**
	 * Meta_Description_Presenter constructor.
	 *
	 * @param Indexable_Repository         $repository                   The indexables repository.
	 * @param Replacement_Variables_Helper $replacement_variables_helper The replacement variables helper.
	 */
	public function __construct(
		Indexable_Repository $repository,
		Replacement_Variables_Helper $replacement_variables_helper,
		Current_Post_Helper $current_post_helper
	) {
		$this->repository = $repository;
		$this->replacement_variables_helper = $replacement_variables_helper;
		$this->current_post_helper = $current_post_helper;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\remove_action( 'wpseo_head', [ WPSEO_Frontend::get_instance(), 'metadesc' ], WPSEO_Frontend::METADESC_PRIORITY );
		\add_action( 'wpseo_head', [ $this, 'present' ], WPSEO_Frontend::METADESC_PRIORITY );
	}

	/**
	 * Displays the meta description for post.
	 */
	public function present() {
		if ( ! $this->current_post_helper->is_simple_page() ) {
			// This presenter currently only handles simple pages so fallback on other pages.
			WPSEO_Frontend::get_instance()->metadesc();
			return;
		}

		$indexable = $this->repository->for_current_page();

		if ( ! $indexable ) {
			// Fallback in case no indexable could be found.
			WPSEO_Frontend::get_instance()->metadesc();
			return;
		}

		$meta_description = $this->generate_meta_description( $indexable );

		if ( is_string( $meta_description ) && $meta_description !== '' ) {
			echo '<meta name="description" content="', \esc_attr( \wp_strip_all_tags( \stripslashes( $meta_description ) ) ), '"/>', "\n";
			return;
		}

		if ( \current_user_can( 'wpseo_manage_options' ) ) {
			echo '<!-- ';
			printf(
				/* Translators: %1$s resolves to the SEO menu item, %2$s resolves to the Search Appearance submenu item. */
				\esc_html__( 'Admin only notice: this page does not show a meta description because it does not have one, either write it for this page specifically or go into the [%1$s - %2$s] menu and set up a template.', 'wordpress-seo' ),
				\esc_html__( 'SEO', 'wordpress-seo' ),
				\esc_html__( 'Search Appearance', 'wordpress-seo' )
			);
			echo ' -->' . "\n";
		}
	}

	/**
	 * Generates the meta description for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The meta description.
	 */
	private function generate_meta_description( Indexable $indexable ) {
		$meta_description = $indexable->description;

		if ( ! $meta_description ) {
			$meta_description = WPSEO_Options::get( 'metadesc-' . $indexable->object_sub_type );
		}

		$meta_description = $this->replacement_variables_helper->replace( $meta_description, \get_post( $indexable->object_id ) );

		/**
		 * Filter: 'wpseo_metadesc' - Allow changing the Yoast SEO meta description sentence.
		 *
		 * @api string $metadesc The description sentence.
		 */
		return apply_filters( 'wpseo_metadesc', trim( $meta_description ) );
	}
}
