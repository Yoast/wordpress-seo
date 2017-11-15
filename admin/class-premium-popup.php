<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class WPSEO_Premium_popup
 */
class WPSEO_Premium_Popup {
	/**
	 * An unique identifier for the popup
	 *
	 * @var string
	 */
	private $identifier = '';

	/**
	 * The heading level of the title of the popup.
	 *
	 * @var String
	 */
	private $heading_level = '';

	/**
	 * The title of the popup
	 *
	 * @var String
	 */
	private $title = '';

	/**
	 * The content of the popup
	 *
	 * @var String
	 */
	private $content = '';

	/**
	 * The URL for where the button should link to.
	 *
	 * @var String
	 */
	private $url = '';

	/**
	 * Wpseo_Premium_Popup constructor.
	 *
	 * @param String $identifier    An unique identifier for the popup.
	 * @param String $heading_level The heading level for the title of the popup.
	 * @param String $title         The title of the popup.
	 * @param String $content       The content of the popup.
	 * @param String $url           The URL for where the button should link to.
	 */
	public function __construct( $identifier, $heading_level, $title, $content, $url ) {
		$this->identifier    = $identifier;
		$this->heading_level = $heading_level;
		$this->title         = $title;
		$this->content       = $content;
		$this->url           = $url;
	}

	/**
	 * Returns the premium popup as an HTML string.
	 *
	 * @param bool $popup Show this message as a popup show it straight away.
	 *
	 * @return string
	 */
	public function get_premium_message( $popup = true ) {
		// Don't show in Premium.
		if ( defined( 'WPSEO_PREMIUM_FILE' ) ) {
			return '';
		}

		$assets_uri = trailingslashit( plugin_dir_url( WPSEO_FILE ) );

		/* translators: %s expands to Yoast SEO Premium */
		$cta_text = sprintf( __( 'Get %s now!', 'wordpress-seo' ), 'Yoast SEO Premium' );
		$classes  = '';
		if ( $popup ) {
			$classes = ' hidden';
		}
		$micro_copy = __( '1 year free updates and upgrades included!', 'wordpress-seo' );

		$popup = <<<EO_POPUP
<div id="wpseo-{$this->identifier}-popup" class="wpseo-premium-popup wp-clearfix$classes">
	<img class="alignright wpseo-premium-popup-icon" src="{$assets_uri}images/Yoast_SEO_Icon.svg" width="150" height="150" alt="Yoast SEO"/>
	<{$this->heading_level} id="wpseo-contact-support-popup-title" class="wpseo-premium-popup-title">{$this->title}</{$this->heading_level}>
	{$this->content}
	<a id="wpseo-{$this->identifier}-popup-button" class="button button-primary" href="{$this->url}" target="_blank" rel="noreferrer noopener">{$cta_text}</a><br/>
	<small>{$micro_copy}</small>
</div>
EO_POPUP;

		return $popup;
	}
}
