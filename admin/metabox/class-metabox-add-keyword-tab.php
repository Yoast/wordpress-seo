<?php
/**
 * @package WPSEO\Admin\Metabox
 */

/**
 * Tab to add a keyword to analyze
 */
class Metabox_Add_Keyword_Tab implements WPSEO_Metabox_Tab {

	/**
	 * Returns a button because a link is inappropriate here
	 *
	 * @return string
	 */
	public function link() {
		ob_start();
		?>
			<li class="wpseo-tab-add-keyword">
				<button type="button" class="wpseo-add-keyword">
					<span aria-hidden="true">+</span>
					<span class="screen-reader-text"><?php _e( 'Add keyword', 'wordpress-seo' ); ?></span>
				</button>
			</li>

			<?php if ( ! defined( 'WPSEO_PREMIUM_FILE' ) ) : ?>
				<div id="wpseo-add-keyword-popup" style="display: none;">
					<img class="alignright" style="margin: 10px;" src="<?php echo trailingslashit( plugin_dir_url( WPSEO_FILE ) ); ?>images/Yoast_SEO_Icon.svg" width="150" alt="Yoast SEO"/>
					<h3><?php printf( __( 'Multiple focus keywords is a %s feature', 'wordpress-seo' ), 'Yoast SEO Premium' ); ?></h3>
					<p>
						<?php
							echo sprintf(
								/* Translators: %1$s: expands to 'Yoast SEO Premium', %2$s: links to Yoast SEO Premium plugin page. */
								__( 'To be able to add and analyze multiple keywords for a post or page you need %1$s. You can buy the plugin, including one year of support, updates and upgrades, on %2$s.', 'wordpress-seo' ),
								'<a href="https://yoast.com/wordpress/plugins/seo-premium/#utm_source=wordpress-seo-metabox&utm_medium=popup&utm_campaign=multiple-keywords">Yoast SEO Premium</a>',
								'yoast.com'
							);
						?>
					</p>
					<a class="button-primary" href="https://yoast.com/wordpress/plugins/seo-premium/#utm_source=wordpress-seo-metabox&amp;utm_medium=popup&amp;utm_campaign=multiple-keywords"><?php printf( __( 'Buy %s &raquo;', 'wordpress-seo' ), 'Yoast SEO Premium' ); ?></a>
					<div class="clear"></div>
				</div>
			<?php endif; ?>
		<?php

		return ob_get_clean();
	}

	/**
	 * Returns an empty string because this tab has no content
	 *
	 * @return string
	 */
	public function content() {
		return '';
	}
}
