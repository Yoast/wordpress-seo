<?php

class WPSEO_Post_Edit_Redirect_Url {

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
	 * Add Yoast redirect message to URL
	 *
	 * @param $url
	 *
	 * @return string
	 */
	public function add_yoast_message( $url ) {
		return add_query_arg( array( 'yoast-redirect-created' => esc_url( $this->old_url ) ), $url );
	}

}
