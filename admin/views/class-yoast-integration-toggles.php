<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Class for managing integration toggles.
 */
class Yoast_Integration_Toggles {

	/**
	 * Available integration toggles.
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
	 * Gets the main integration toggles manager instance used.
	 *
	 * This essentially works like a Singleton, but for its drawbacks does not restrict
	 * instantiation otherwise.
	 *
	 * @return self Main instance.
	 */
	public static function instance() {
		if ( self::$instance === null ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Gets all available integration toggles.
	 *
	 * @return array List of sorted Yoast_Feature_Toggle instances.
	 */
	public function get_all() {
		if ( $this->toggles === null ) {
			$this->toggles = $this->load_toggles();
		}

		return $this->toggles;
	}

	/**
	 * Loads the available integration toggles.
	 *
	 * Also ensures that the toggles are all Yoast_Feature_Toggle instances and sorted by their order value.
	 *
	 * @return array List of sorted Yoast_Feature_Toggle instances.
	 */
	protected function load_toggles() {
		$integration_toggles = [
			(object) [
				/* translators: %s: 'SEMrush' */
				'name'            => sprintf( __( '%s integration', 'wordpress-seo' ), 'SEMrush' ),
				'setting'         => 'semrush_integration_active',
				'label'           => sprintf(
					/* translators: %s: 'SEMrush' */
					__( 'The %s integration offers suggestions and insights for keywords related to the entered focus keyphrase.', 'wordpress-seo' ),
					'SEMrush'
				),
				'order'           => 10,
			],
			(object) [
				/* translators: %s: Ryte */
				'name'            => sprintf( __( '%s integration', 'wordpress-seo' ), 'Ryte' ),
				'setting'         => 'ryte_indexability',
				'label'           => sprintf(
				/* translators: 1: Ryte, 2: Yoast SEO */
					__( '%1$s will check weekly if your site is still indexable by search engines and %2$s will notify you when this is not the case.', 'wordpress-seo' ),
					'Ryte',
					'Yoast SEO'
				),
				/* translators: %s: Ryte */
				'read_more_label' => sprintf( __( 'Read more about how %s works.', 'wordpress-seo' ), 'Ryte ' ),
				'read_more_url'   => 'https://yoa.st/2an',
				'order'           => 20,
			],
		];

		/**
		 * Filter to add integration toggles from add-ons.
		 *
		 * @param array $integration_toggles Array with integration toggle objects where each object
		 *                                   should have a `name`, `setting` and `label` property.
		 */
		$integration_toggles = apply_filters( 'wpseo_integration_toggles', $integration_toggles );

		$integration_toggles = array_map( [ $this, 'ensure_toggle' ], $integration_toggles );
		usort( $integration_toggles, [ $this, 'sort_toggles_callback' ] );

		return $integration_toggles;
	}

	/**
	 * Ensures that the passed value is a Yoast_Feature_Toggle.
	 *
	 * @param Yoast_Feature_Toggle|object|array $toggle_data Feature toggle instance, or raw object or array
	 *                                                       containing integration toggle data.
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
	 * Callback for sorting integration toggles by their order.
	 *
	 * @param Yoast_Feature_Toggle $feature_a Feature A.
	 * @param Yoast_Feature_Toggle $feature_b Feature B.
	 *
	 * @return bool Whether order for feature A is bigger than for feature B.
	 */
	protected function sort_toggles_callback( Yoast_Feature_Toggle $feature_a, Yoast_Feature_Toggle $feature_b ) {
		return ( $feature_a->order > $feature_b->order );
	}
}
