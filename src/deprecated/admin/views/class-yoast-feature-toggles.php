<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

use Yoast\WP\SEO\Helpers\Language_Helper;
use Yoast\WP\SEO\Presenters\Admin\Alert_Presenter;

/**
 * Class for managing feature toggles.
 *
 * @deprecated 20.3
 * @codeCoverageIgnore
 */
class Yoast_Feature_Toggles {

	/**
	 * Available feature toggles.
	 *
	 * @var array
	 */
	protected $toggles;

	/**
	 * Instance holder.
	 *
	 * @var self|null
	 */
	protected static $instance = null;

	/**
	 * Gets the main feature toggles manager instance used.
	 *
	 * This essentially works like a Singleton, but for its drawbacks does not restrict
	 * instantiation otherwise.
	 *
	 * @deprecated 20.3
	 * @codeCoverageIgnore
	 *
	 * @return self Main instance.
	 */
	public static function instance() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.3' );

		if ( self::$instance === null ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Gets all available feature toggles.
	 *
	 * @deprecated 20.3
	 * @codeCoverageIgnore
	 *
	 * @return array List of sorted Yoast_Feature_Toggle instances.
	 */
	public function get_all() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.3' );

		if ( $this->toggles === null ) {
			$this->toggles = $this->load_toggles();
		}

		return $this->toggles;
	}

	/**
	 * Loads the available feature toggles.
	 *
	 * Also ensures that the toggles are all Yoast_Feature_Toggle instances and sorted by their order value.
	 *
	 * @return array List of sorted Yoast_Feature_Toggle instances.
	 */
	protected function load_toggles() {
		$feature_toggles = [];

		/**
		 * Filter to add feature toggles from add-ons.
		 *
		 * @deprecated 20.3 No replacement available.
		 *
		 * @param array $feature_toggles Array with feature toggle objects where each object
		 *                               should have a `name`, `setting` and `label` property.
		 */
		$feature_toggles = apply_filters_deprecated( 'wpseo_feature_toggles', [ $feature_toggles ], 'Yoast SEO 20.3', '', 'Deprecated since 20.3' );

		$feature_toggles = array_map( [ $this, 'ensure_toggle' ], $feature_toggles );
		usort( $feature_toggles, [ $this, 'sort_toggles_callback' ] );

		return $feature_toggles;
	}

	/**
	 * Returns html for a warning that core sitemaps are enabled when yoast seo sitemaps are disabled.
	 *
	 * @return string HTML string for the warning.
	 */
	protected function sitemaps_toggle_after() {
		$out   = '<div id="yoast-seo-sitemaps-disabled-warning" style="display:none;">';
		$alert = new Alert_Presenter(
			/* translators: %1$s: expands to an opening anchor tag, %2$s: expands to a closing anchor tag */
			\sprintf( esc_html__( 'Disabling Yoast SEO\'s XML sitemaps will not disable WordPress\' core sitemaps. In some cases, this %1$s may result in SEO errors on your site%2$s. These may be reported in Google Search Console and other tools.', 'wordpress-seo' ), '<a target="_blank" href="' . WPSEO_Shortlinker::get( 'https://yoa.st/44z' ) . '">', '</a>' ),
			'warning'
		);
		$out .= $alert->present();
		$out .= '</div>';

		return $out;
	}

	/**
	 * Ensures that the passed value is a Yoast_Feature_Toggle.
	 *
	 * @param Yoast_Feature_Toggle|object|array $toggle_data Feature toggle instance, or raw object or array
	 *                                                       containing feature toggle data.
	 * @return Yoast_Feature_Toggle Feature toggle instance based on $toggle_data.
	 */
	protected function ensure_toggle( $toggle_data ) {
		if ( $toggle_data instanceof Yoast_Feature_Toggle ) {
			return $toggle_data;
		}

		if ( is_object( $toggle_data ) ) {
			$toggle_data = get_object_vars( $toggle_data );
		}

		return new Yoast_Feature_Toggle( $toggle_data );
	}

	/**
	 * Callback for sorting feature toggles by their order.
	 *
	 * {@internal Once the minimum PHP version goes up to PHP 7.0, the logic in the function
	 * can be replaced with the spaceship operator `<=>`.}
	 *
	 * @param Yoast_Feature_Toggle $feature_a Feature A.
	 * @param Yoast_Feature_Toggle $feature_b Feature B.
	 *
	 * @return int An integer less than, equal to, or greater than zero indicating respectively
	 *             that feature A is considered to be less than, equal to, or greater than feature B.
	 */
	protected function sort_toggles_callback( Yoast_Feature_Toggle $feature_a, Yoast_Feature_Toggle $feature_b ) {
		return ( $feature_a->order - $feature_b->order );
	}
}
