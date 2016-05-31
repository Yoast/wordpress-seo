<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class WPSEO_Premium_popup
 */
class Wpseo_Premium_Popup {
	/**
	 * An unique identifier for the popup
	 *
	 * @var string
	 */
	private $identifier = '';

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
	 * Wpseo_Premium_Popup constructor.
	 *
	 * @param String $identifier An unique identifier for the popup.
	 * @param String $title      The title of the popup.
	 * @param String $content    The content of the popup.
	 */
	function __construct( $identifier, $title, $content ) {
		$this->identifier = $identifier;
		$this->title      = $title;
		$this->content    = $content;
	}

	/**
	 * Returns the premium popup as an HTML string.
	 *
	 * @return string
	 */
	public function get_premium_popup() {
		ob_start();
		if ( ! defined( 'WPSEO_PREMIUM_FILE' ) ) : ?>
			<div id="<?php echo 'wpseo-' . $this->identifier . '-popup' ?>" class="
			     wpseo-premium-popup" style="display: none;">
				<img class="alignright" style="margin: 10px;"
				     src="<?php echo trailingslashit( plugin_dir_url( WPSEO_FILE ) ); ?>images/Yoast_SEO_Icon.svg"
				     width="150" alt=""/>
				<h1 id="wpseo-contact-support-popup-title"
				    class="wpseo-premium-popup-title"><?php echo $this->title ?></h1>
				<p>
					<?php
					echo $this->content
					?>
				</p>
				/* translators: %s expands to Yoast SEO Premium */
				<a id="<?php echo 'wpseo-' . $this->identifier . '-popup-button' ?>" class="button-primary"
				   href="https://yoast.com/wordpress/plugins/seo-premium/#utm_source=wordpress-seo-metabox&amp;utm_medium=popup&amp;utm_campaign=help-center-contact-support"><?php printf( __( 'Buy %s', 'wordpress-seo' ), 'Yoast SEO Premium' ); ?></a>
			</div>
			<?php
		endif;

		return ob_get_clean();
	}
}
