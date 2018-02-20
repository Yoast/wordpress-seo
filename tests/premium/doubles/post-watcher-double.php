<?php

class WPSEO_Post_Watcher_Double extends WPSEO_Post_Watcher {
	/**
	 * @inheritdoc
	 */
	public function set_hooks() {
		parent::set_hooks();
	}

	/**
	 * @inheritdoc
	 */
	public function remove_colliding_redirect( $post, $post_before ) {
		parent::remove_colliding_redirect( $post, $post_before );
	}
}
