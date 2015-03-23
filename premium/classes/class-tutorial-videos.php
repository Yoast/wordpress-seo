<?php

/**
 * @package Premium\Videos
 */
class WPSEO_Tutorial_Videos {

	/**
	 * Function that outputs the redirect page
	 */
	public static function display() {
		// Licensing part
		$license_manager = new Yoast_Plugin_License_Manager( new WPSEO_Product_Premium() );

		// Setup constant name
		$license_manager->set_license_constant_name( 'WPSEO_LICENSE' );

		// Admin header
		Yoast_Form::get_instance()->admin_header( false );

		if ( $license_manager->license_is_valid() ) {
			?>
			<div class="wpseo_content_cell">
				<iframe src="//fast.wistia.net/embed/playlists/5t35e24abt?media_0_0%5BautoPlay%5D=false&amp;media_0_0%5BcontrolsVisibleOnLoad%5D=false&amp;theme=bento&amp;version=v1&amp;videoOptions%5BautoPlay%5D=true&amp;videoOptions%5BvideoHeight%5D=450&amp;videoOptions%5BvideoWidth%5D=800&amp;videoOptions%5BvolumeControl%5D=true" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_playlist" name="wistia_playlist" allowfullscreen mozallowfullscreen webkitallowfullscreen oallowfullscreen msallowfullscreen width="1107" height="450"></iframe>
				<br class="clear">
			</div>
			<br class="clear">
		<?php
		} else {
			echo '<div class="wpseo-warning">';
			echo '<h2>' . __( 'WordPress SEO Premium is inactive.', 'wordpress-seo-premium' ) . '</h2>';
			if ( current_user_can( 'manage_options' ) ) {
				echo '<p>' . __( 'Please activate WordPress SEO Premium to be able to see the videos.', 'wordpress-seo-premium' ) . '</p></div>';
			} else {
				echo '<p>' . __( 'Please ask your site administrator to activate WordPress SEO Premium to be able to see the videos.', 'wordpress-seo-premium' ) . '</p></div>';
			}

		}
		// Admin footer
		Yoast_Form::get_instance()->admin_footer( false );
	}

}