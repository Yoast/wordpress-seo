<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * This class generates the metabox on the edit term page.
 */
class WPSEO_Taxonomy_Metabox {

	/**
	 * The term currently being edited.
	 *
	 * @var WP_Term
	 */
	private $term;

	/**
	 * The term's taxonomy.
	 *
	 * @var string
	 */
	private $taxonomy;

	/**
	 * Whether or not the social tab is enabled for this metabox.
	 *
	 * @var bool
	 */
	private $is_social_enabled;

	/**
	 * Helper to determine whether or not the SEO analysis is enabled.
	 *
	 * @var WPSEO_Metabox_Analysis_SEO
	 */
	protected $seo_analysis;

	/**
	 * Helper to determine whether or not the readability analysis is enabled.
	 *
	 * @var WPSEO_Metabox_Analysis_Readability
	 */
	protected $readability_analysis;

	/**
	 * The constructor.
	 *
	 * @param string   $taxonomy The taxonomy.
	 * @param stdClass $term     The term.
	 */
	public function __construct( $taxonomy, $term ) {
		$this->term              = $term;
		$this->taxonomy          = $taxonomy;
		$this->is_social_enabled = WPSEO_Options::get( 'opengraph', false ) || WPSEO_Options::get( 'twitter', false );

		$this->seo_analysis         = new WPSEO_Metabox_Analysis_SEO();
		$this->readability_analysis = new WPSEO_Metabox_Analysis_Readability();
	}

	/**
	 * Shows the Yoast SEO metabox for the term.
	 */
	public function display() {
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $this->get_product_title() returns a hard-coded string.
		printf( '<div id="wpseo_meta" class="postbox yoast wpseo-taxonomy-metabox-postbox"><h2><span>%1$s</span></h2>', $this->get_product_title() );

		echo '<div class="inside">';
		echo '<div id="taxonomy_overall"></div>';

		$this->render_hidden_fields();
		$this->render_tabs();

		echo '</div>';
		echo '</div>';
	}

	/**
	 * Renders the metabox hidden fields.
	 *
	 * @return void
	 */
	protected function render_hidden_fields() {
		$fields_presenter  = new WPSEO_Taxonomy_Fields_Presenter( $this->term );
		$field_definitions = new WPSEO_Taxonomy_Fields();

		echo $fields_presenter->html( $field_definitions->get( 'content' ) );
		if ( WPSEO_Capability_Utils::current_user_can( 'wpseo_edit_advanced_metadata' ) || WPSEO_Options::get( 'disableadvanced_meta' ) === false ) {
			echo $fields_presenter->html( $field_definitions->get( 'settings' ) );
		}

		if ( $this->is_social_enabled ) {
			echo $fields_presenter->html( $field_definitions->get( 'social' ) );
		}
	}

	/**
	 * Renders the metabox tabs.
	 *
	 * @return void
	 */
	protected function render_tabs() {
		echo '<div class="wpseo-metabox-content">';
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $this->get_product_title() returns a hard-coded string.
		printf( '<div class="wpseo-metabox-menu"><ul role="tablist" class="yoast-aria-tabs" aria-label="%s">', $this->get_product_title() );

		$tabs = $this->get_tabs();

		foreach ( $tabs as $tab ) {
			$tab->display_link();
		}

		echo '</ul></div>';

		foreach ( $tabs as $tab ) {
			$tab->display_content();
		}

		echo '</div>';
	}

	/**
	 * Returns the relevant metabox sections for the current view.
	 *
	 * @return WPSEO_Metabox_Section[]
	 */
	private function get_tabs() {
		$tabs = [];

		$label = __( 'SEO', 'wordpress-seo' );
		if ( $this->seo_analysis->is_enabled() ) {
			$label = '<span class="wpseo-score-icon-container" id="wpseo-seo-score-icon"></span>' . $label;
		}

		$tabs[] = new WPSEO_Metabox_Section_React( 'content', $label );

		if ( $this->readability_analysis->is_enabled() ) {
			$tabs[] = new WPSEO_Metabox_Section_Readability();
		}

		if ( $this->is_social_enabled ) {
			$tabs[] = new WPSEO_Metabox_Section_React(
				'social',
				'<span class="dashicons dashicons-share"></span>' . __( 'Social', 'wordpress-seo' ),
				'',
				[
					'html_after' => '<div id="wpseo-section-social"></div>',
				]
			);
		}

		return $tabs;
	}

	/**
	 * Retrieves the product title.
	 *
	 * @return string The product title.
	 */
	protected function get_product_title() {
		return YoastSEO()->helpers->product->get_product_name();
	}
}
