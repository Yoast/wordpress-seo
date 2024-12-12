<?php

namespace Yoast\WP\SEO\Commands;

use WP_CLI;
use Yoast\WP\SEO\Main;

/**
 * Command to generate indexables for all posts and terms.
 */
class Analyse_Command implements Command_Interface {

	/**
	 * Gets the namespace.
	 *
	 * @return string
	 */
	public static function get_namespace() {
		return Main::WP_CLI_NAMESPACE;
	}

	/**
	 * Analyses a post.
	 *
	 * ## OPTIONS
	 *
	 * [--post-id]
	 * : The id of the post to analyse.
	 *
	 * @when after_wp_load
	 *
	 * @param array|null $args       The arguments.
	 * @param array|null $assoc_args The associative arguments.
	 *
	 * @return void
	 */
	public function analyse( $args = null, $assoc_args = null ) {

		if ( ! isset( $assoc_args['post-id'] ) ) {
			WP_CLI::log(
				\__( 'You should specify the id of the post to analyse.', 'wordpress-seo' )
			);

			return;
		}

		$post         = \get_post( $assoc_args['post-id'] );
		$blocks       = \parse_blocks( $post->post_content );
		$post_content = $post->post_content;
		WP_CLI::log( \var_dump( $blocks ) );
	}
}
