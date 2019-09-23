<?php
/**
 * Presenter of the meta description for post type singles.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters\Post_Type;

use WPSEO_Frontend;
use WPSEO_Options;
use WPSEO_Replace_Vars;
use Yoast\WP\Free\Conditionals\Indexables_Feature_Flag_Conditional;
use Yoast\WP\Free\Helpers\Current_Post_Helper;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presenters\Presenter_Interface;

class Meta_Description_Presenter implements Presenter_Interface {

	/**
	 * @var \WPSEO_Replace_Vars
	 */
	protected $replacement_variables_helper;

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
	 * @param \WPSEO_Replace_Vars  $replacement_variables_helper The replacement variables helper.
	 */
	public function __construct(
		WPSEO_Replace_Vars $replacement_variables_helper
	) {
		$this->replacement_variables_helper = $replacement_variables_helper;
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
	public function present( Indexable $indexable ) {
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
	protected function generate_meta_description( Indexable $indexable ) {
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
