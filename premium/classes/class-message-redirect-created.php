<?php

class WPSEO_Message_Redirect_Created {

	private $old_url;

	/**
	 * Constructor
	 *
	 * @param $old_url
	 */
	public function __construct( $old_url ) {
		$this->old_url = $old_url;
	}

	/**
	 * Display the message
	 */
	public function display() {

		error_log( $this->old_url, 0 );

		echo '<div class="updated"><p>' . sprintf( __( "WordPress SEO Premium created a redirect from the old post URL to the new post URL. <a href='%s'>Click here to undo this</a>.", 'wordpress-seo' ), esc_url( admin_url( 'admin.php?page=wpseo_redirects&remove_redirect=' . $this->old_url ) ) ) . '</p></div>';
	}


}