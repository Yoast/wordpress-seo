<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\Free\Integrations\Front_End
 */

namespace Yoast\WP\Free\Integrations\Front_End;

use Yoast\WP\Free\Conditionals\Front_End_Conditional;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Integrations\Integration_Interface;
use Yoast\WP\Free\Wrappers\WP_Query_Wrapper;

/**
 * Class Force_Rewrite_Titles
 */
class Force_Rewrite_Title implements Integration_Interface {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Toggle indicating whether output buffering has been started.
	 *
	 * @var boolean
	 */
	private $ob_started = false;

	/**
	 * The WP Query wrapper.
	 *
	 * @var WP_Query_Wrapper
	 */
	private $wp_query;

	/**
	 * Sets the helpers.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param Options_Helper   $options  Options helper.
	 * @param WP_Query_Wrapper $wp_query The wp query wrapper.
	 */
	public function __construct( Options_Helper $options, WP_Query_Wrapper $wp_query ) {
		$this->options  = $options;
		$this->wp_query = $wp_query;
	}

	/**
	 * @codeCoverageIgnore
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class ];
	}

	/**
	 * @codeCoverageIgnore
	 * @inheritDoc
	 */
	public function register_hooks() {
		// When the option is disabled.
		if ( ! $this->options->get( 'forcerewritetitle', false ) ) {
			return;
		}

		// For WordPress versions below 4.4.
		if ( \current_theme_supports( 'title-tag' ) ) {
			return;
		}

		add_action( 'template_redirect', [ $this, 'force_rewrite_output_buffer' ], 99999 );
		add_action( 'wp_footer', [ $this, 'flush_cache' ], - 1 );
	}

	/**
	 * Used in the force rewrite functionality this retrieves the output, replaces the title with the proper SEO
	 * title and then flushes the output.
	 */
	public function flush_cache() {
		if ( $this->ob_started !== true ) {
			return false;
		}

		$content = $this->get_buffered_output();

		$old_wp_query = $this->wp_query->get_query();

		\wp_reset_query();

		// When the file has the debug mark.
		if ( preg_match( '/(?\'before\'.*)<!-- This site is optimized with the Yoast SEO( Premium)? plugin .* -->/is', $content, $matches ) ) {
			$content_before = preg_replace( '/<title.*?\/title>/i', '', $matches['before'] );
			$content        = str_replace( $matches['before'], $content_before, $content );

			unset( $content_before, $matches );
		}

		if ( preg_match( '/<!-- \/ Yoast SEO( Premium)? plugin. -->(?\'after\'.*)/is', $content, $matches ) ) {
			$content_after = preg_replace( '/<title.*?\/title>/i', '', $matches['after'] );
			$content       = str_replace( $matches['after'], $content_after, $content );

			unset( $content_after, $matches );
		}

		$GLOBALS['wp_query'] = $old_wp_query;

		echo $content;

		return true;
	}

	/**
	 * Starts the output buffer so it can later be fixed by flush_cache().
	 */
	public function force_rewrite_output_buffer() {
		$this->ob_started = true;
		$this->start_output_buffering();
	}

	/**
	 * Starts the output buffering.
	 *
	 * @codeCoverageIgnore
	 */
	protected function start_output_buffering() {
		\ob_start();
	}

	/**
	 * Retrieves the buffered output.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return false|string The buffered output.
	 */
	protected function get_buffered_output() {
		return \ob_get_clean();
	}
}
