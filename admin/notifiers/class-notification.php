<?php

class WPSEO_Notification {
	static public function display( $title, $content, $image_url, $show_dismissal = false ) {
		$notification  = '<div class="yoast-container yoast-container__configuration-wizard">';
		$notification .= sprintf(
			'<img src="%1$s" height="%2$s" width="%3$d" />',
			$image_url,
			60,
			60
		);
		$notification .= '<div class="yoast-container__configuration-wizard--content">';
		$notification .= '<h3>' . esc_html( $title ) . '</h3>';

		$notification .= '<p>';
		$notification .= $content;
		$notification .= '</p>';

		$notification .= '</div>';
		if ( $show_dismissal ) {
			$notification .= sprintf(
				'<a href="%1$s" style="" class="button dismiss yoast-container__configuration-wizard--dismiss"><span class="screen-reader-text">%2$s</span><span class="dashicons dashicons-no-alt"></span></a>',
				esc_url( admin_url( 'admin.php?page=wpseo_dashboard&amp;dismiss_get_started=1' ) ),
				esc_html__( 'Dismiss this item.', 'wordpress-seo' )
			);
		}
		$notification .= '</div>';

		return $notification;
	}
}