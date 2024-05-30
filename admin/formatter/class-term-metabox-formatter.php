<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Formatter
 */

use Yoast\WP\SEO\Editors\Application\Seo\Term_Seo_Information_Repository;

/**
 * This class provides data for the term metabox by return its values for localization.
 */
class WPSEO_Term_Metabox_Formatter implements WPSEO_Metabox_Formatter_Interface {

	/**
	 * The term the metabox formatter is for.
	 *
	 * @var WP_Term|stdClass
	 */
	private $term;

	/**
	 * The term's taxonomy.
	 *
	 * @var stdClass
	 */
	private $taxonomy;

	/**
	 * Whether we must return social templates values.
	 *
	 * @var bool
	 */
	private $use_social_templates = false;

	/**
	 * Array with the WPSEO_Titles options.
	 *
	 * @var array
	 */
	protected $options;

	/**
	 * WPSEO_Taxonomy_Scraper constructor.
	 *
	 * @param stdClass         $taxonomy Taxonomy.
	 * @param WP_Term|stdClass $term     Term.
	 */
	public function __construct( $taxonomy, $term ) {
		$this->taxonomy = $taxonomy;
		$this->term     = $term;

		$this->use_social_templates = $this->use_social_templates();
	}

	/**
	 * Determines whether the social templates should be used.
	 *
	 * @return bool Whether the social templates should be used.
	 */
	public function use_social_templates() {
		return WPSEO_Options::get( 'opengraph', false ) === true;
	}

	/**
	 * Returns the translated values.
	 *
	 * @return array
	 */
	public function get_values() {
		$values = [];

		// Todo: a column needs to be added on the termpages to add a filter for the keyword, so this can be used in the focus keyphrase doubles.
		if ( is_object( $this->term ) && property_exists( $this->term, 'taxonomy' ) ) {
			$values = [
				'search_url'                  => $this->search_url(),
				'post_edit_url'               => $this->edit_url(),
				'base_url'                    => $this->base_url_for_js(),
				'taxonomy'                    => $this->term->taxonomy,
				'semrushIntegrationActive'    => 0,
				'wincherIntegrationActive'    => 0,
				'isInsightsEnabled'           => $this->is_insights_enabled(),
			];

			$repo = YoastSEO()->classes->get( Term_Seo_Information_Repository::class );
			$repo->set_term( $this->term );
			$values = ( $repo->get_seo_data() + $values );
		}

		return $values;
	}

	/**
	 * Returns the url to search for keyword for the taxonomy.
	 *
	 * @return string
	 */
	private function search_url() {
		return admin_url( 'edit-tags.php?taxonomy=' . $this->term->taxonomy . '&seo_kw_filter={keyword}' );
	}

	/**
	 * Returns the url to edit the taxonomy.
	 *
	 * @return string
	 */
	private function edit_url() {
		return admin_url( 'term.php?action=edit&taxonomy=' . $this->term->taxonomy . '&tag_ID={id}' );
	}

	/**
	 * Returns a base URL for use in the JS, takes permalink structure into account.
	 *
	 * @return string
	 */
	private function base_url_for_js() {

		$base_url = home_url( '/', null );
		if ( ! WPSEO_Options::get( 'stripcategorybase', false ) ) {
			if ( $this->taxonomy->rewrite ) {
				$base_url = trailingslashit( $base_url . $this->taxonomy->rewrite['slug'] );
			}
		}

		return $base_url;
	}

	/**
	 * Determines whether the insights feature is enabled for this taxonomy.
	 *
	 * @return bool
	 */
	protected function is_insights_enabled() {
		return WPSEO_Options::get( 'enable_metabox_insights', false );
	}
}
