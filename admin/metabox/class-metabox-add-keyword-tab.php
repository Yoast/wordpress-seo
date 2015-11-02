<?php

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
