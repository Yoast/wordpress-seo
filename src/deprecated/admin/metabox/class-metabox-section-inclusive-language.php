<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

use Yoast\WP\SEO\Presenters\Admin\Beta_Badge_Presenter;

/**
 * Generates and displays the React root element for a metabox section.
 *
 * @deprecated 19.6.1
 * @codeCoverageIgnore
 */
class WPSEO_Metabox_Section_Inclusive_Language implements WPSEO_Metabox_Section {

	/**
	 * Name of the section, used as an identifier in the HTML.
	 *
	 * @deprecated 19.6.1
	 *
	 * @var string
	 */
	public $name = 'inclusive-language';

	/**
	 * Initialize the inclusive language analysis metabox section.
	 *
	 * @deprecated 19.6.1
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO 19.6.1' );
	}

	/**
	 * Outputs the section link.
	 *
	 * @deprecated 19.6.1
	 * @codeCoverageIgnore
	 */
	public function display_link() {
		_deprecated_function( __METHOD__, '19.6.1' );
		printf(
			'<li role="presentation"><a role="tab" href="#wpseo-meta-section-%1$s" id="wpseo-meta-tab-%1$s" aria-controls="wpseo-meta-section-%1$s" class="wpseo-meta-section-link">
				<div class="wpseo-score-icon-container" id="wpseo-inclusive-language-score-icon"></div><span>%2$s</span>&nbsp;%3$s</a></li>',
			esc_attr( $this->name ),
			esc_html__( 'Inclusive language', 'wordpress-seo' ),
			new Beta_Badge_Presenter( 'inclusive-language-beta-badge' )
		);
	}

	/**
	 * Outputs the section content.
	 *
	 * @deprecated 19.6.1
	 * @codeCoverageIgnore
	 */
	public function display_content() {
		_deprecated_function( __METHOD__, '19.6.1' );
		printf(
			'<div role="tabpanel" id="wpseo-meta-section-%1$s" aria-labelledby="wpseo-meta-tab-%1$s" tabindex="0" class="wpseo-meta-section">',
			esc_attr( $this->name )
		);
		echo '<div id="wpseo-metabox-inclusive-language-root" class="wpseo-metabox-root"></div>', '</div>';
	}
}
