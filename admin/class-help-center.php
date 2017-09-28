<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class WPSEO_Help_Center
 */
class WPSEO_Help_Center {
	/**
	 * @var String $group_name
	 */
	private $group_name;

	/**
	 * @var WPSEO_Option_Tab $tab
	 */
	private $tabs;

	/**
	 * WPSEO_Help_Center constructor.
	 *
	 * @param String             $group_name The name of the group of the tab the helpcenter is on.
	 * @param WPSEO_Option_Tab[] $tabs       Currently displayed tabs.
	 */
	public function __construct( $group_name, $tabs ) {
		$this->group_name = $group_name;
		$this->tabs       = $tabs;
	}

	/**
	 * Outputs the help center.
	 */
	public function output_help_center() {
        ?>
            <div id="yoast-help-center">Loading help center.</div>
		<?php
	}

	/**
	 * Pass text variables to js for the help center JS module.
	 *
	 * %s is replaced with <code>%s</code> and replaced again in the javascript with the actual variable.
	 *
	 * @return  array Translated text strings for the help center.
	 */
	public static function get_translated_texts() {
		return array(
			/* translators: %s: '%%term_title%%' variable used in titles and meta's template that's not compatible with the given template */
			'variable_warning' => sprintf( __( 'Warning: the variable %s cannot be used in this template. See the help center for more info.', 'wordpress-seo' ), '<code>%s</code>' ),
			'contentLocale' => get_locale(),
			'userLocale'    => WPSEO_Utils::get_user_locale(),
			/* translators: %d: number of knowledge base search results found. */
			'kb_found_results' => __( 'Number of search results: %d', 'wordpress-seo' ),
			'kb_no_results' => __( 'No results found.', 'wordpress-seo' ),
			'kb_heading' => __( 'Search the Yoast knowledge base', 'wordpress-seo' ),
			'kb_search_button_text' => __( 'Search', 'wordpress-seo' ),
			'kb_search_results_heading' => __( 'Search results', 'wordpress-seo' ),
			'kb_error_message' => __( 'Something went wrong. Please try again later.', 'wordpress-seo' ),
			'kb_loading_placeholder' => __( 'Loading...', 'wordpress-seo' ),
			'kb_search' => __( 'search', 'wordpress-seo' ),
			'kb_back' => __( 'Back', 'wordpress-seo' ),
			'kb_back_label' => __( 'Back to search results' , 'wordpress-seo' ),
			'kb_open' => __( 'Open', 'wordpress-seo' ),
			'kb_open_label' => __( 'Open the knowledge base article in a new window or read it in the iframe below' , 'wordpress-seo' ),
			'kb_iframe_title' => __( 'Knowledge base article', 'wordpress-seo' ),
		);
	}
}
