<?php

namespace Yoast\WP\SEO\Editors\Framework\Seo\Posts;

use WP_Post;

abstract class Abstract_Post_Seo_Data_Provider {

	/**
	 * Holds the WordPress Post.
	 *
	 * @var WP_Post
	 */
	protected $post;

	/**
	 * @param WP_Post $post The post.
	 */
	public function __construct( WP_Post  $post ) {
		$this->post = $post;
	}

}
