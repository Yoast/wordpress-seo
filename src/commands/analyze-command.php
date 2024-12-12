<?php

namespace Yoast\WP\SEO\Commands;

use WP_CLI;
use WPSEO_Utils;
use Yoast\WP\SEO\Helpers\Meta_Helper;
use Yoast\WP\SEO\Main;

/**
 * Command to generate indexables for all posts and terms.
 */
class Analyse_Command implements Command_Interface {

	/**
	 * @var Meta_Helper
	 */
	private $meta;

	public function __construct( Meta_Helper $meta ) {
		$this->meta = $meta;
	}

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
	 * The id of the post to analyse.
	 *
	 *
	 *  [--save]
	 *  Save the analysis scores to the post meta.
	 *
	 * @when after_wp_load
	 *
	 * @param array|null $args       The arguments.
	 * @param array|null $assoc_args The associative arguments.
	 *
	 * @return void
	 */
	public function analyze( $args = null, $assoc_args = null ) {
		$posts = [];

		if ( isset( $assoc_args['post-id'] ) ) {
			$posts[] = \get_post( $assoc_args['post-id'] );
		}
		else {
			$posts = \get_posts( [ 'numberposts' => -1 ] );
		}
		foreach ( $posts as $post ) {
			$seo_description = $this->meta->get_value( 'metadesc', $post->ID );
			$seo_title       = $this->meta->get_value( 'title', $post->ID );
			$focus_kw        = $this->meta->get_value( 'focuskw', $post->ID );
			$post_content    = $post->post_content;

			$url  = 'http://localhost:3000/analyze';
			$body = WPSEO_Utils::format_json_encode(
				[
					'text'        => $post_content,
					'description' => $seo_description,
					'slug'        => $post->post_name,
					'permalink'   => \get_permalink( $post->ID ),
					'title'       => $seo_title,
					'textTitle'   => $post->post_title,
					'keyword'     => $focus_kw,
				]
			);

			$ch = \curl_init( $url );

			\curl_setopt( $ch, \CURLOPT_CUSTOMREQUEST, 'GET' );
			\curl_setopt( $ch, \CURLOPT_RETURNTRANSFER, true );
			\curl_setopt(
				$ch,
				\CURLOPT_HTTPHEADER,
				[
					'Content-Type: application/json',
					'Content-Length: ' . \strlen( $body ),
				]
			);
			\curl_setopt( $ch, \CURLOPT_POSTFIELDS, $body );

			$response = \curl_exec( $ch );

			if ( \curl_errno( $ch ) ) {
				WP_CLI::error( 'Failed to get a response from the analysis server: ' . \curl_error( $ch ) );
			}
			else {
				if ( isset( $assoc_args['save'] ) && $assoc_args['save'] ) {
					$unpack_response = \json_decode( $response );
					$this->meta->set_value( 'content_score', (string) $unpack_response->readabilityScore, $post->ID );
					$this->meta->set_value( 'linkdex', (string) $unpack_response->seoScore, $post->ID );
				}
				$unpack_response = \json_decode( $response );
				WP_CLI::success( 'Analyzed post ' . $post->ID . ' - SEO score: ' . ( $unpack_response->seoScore < 0 ? '0' : $unpack_response->seoScore ) . ' - Readability score: ' . $unpack_response->readabilityScore );
			}

			\curl_close( $ch );
		}
	}
}
