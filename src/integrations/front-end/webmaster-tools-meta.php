<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

namespace Yoast\WP\SEO\Integrations\Front_End;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Renders the meta tags for the webmaster tools
 */
class Webmaster_Tools_Meta implements Integration_Interface {

	/**
	 * The list of webmaster tools services.
	 *
	 * @var array
	 */
	private static $webmaster_tools = [
		'baidu'     => [
			'option_key' => 'baiduverify',
			'tag_name'   => 'baidu-site-verification',
		],
		'bing'      => [
			'option_key' => 'msverify',
			'tag_name'   => 'msvalidate.01',
		],
		'google'    => [
			'option_key' => 'googleverify',
			'tag_name'   => 'google-site-verification',
		],
		'pinterest' => [
			'option_key' => 'pinterestverify',
			'tag_name'   => 'p:domain_verify',
		],
		'yandex'    => [
			'option_key' => 'yandexverify',
			'tag_name'   => 'yandex-verification',
		],
	];

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options;

	/**
	 * The current page helper.
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page;

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class ];
	}

	/**
	 * Sets the helpers.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param Options_Helper      $options      The options helper.
	 * @param Current_Page_Helper $current_page The current page helper.
	 */
	public function __construct( Options_Helper $options, Current_Page_Helper $current_page ) {
		$this->options      = $options;
		$this->current_page = $current_page;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_action( 'wpseo_head', [ $this, 'render_meta_tags' ], 15 );
	}

	/**
	 * Renders the meta tags for webmaster tools.
	 */
	public function render_meta_tags() {
		if ( ! $this->current_page->is_front_page() ) {
			return;
		}

		$webmaster_tools = \array_map( [ $this, 'set_tag_value' ], static::$webmaster_tools );
		$webmaster_tools = \array_filter( $webmaster_tools, [ $this, 'has_tag_value' ] );
		array_walk( $webmaster_tools, [ $this, 'render_meta_tag' ] );
	}

	/**
	 * Renders the meta tag.
	 *
	 * @param array $webmaster_tool The data for the meta tag.
	 */
	private function render_meta_tag( array $webmaster_tool ) {
		printf(
			"\t" . '<meta name="%1$s" content="%2$s" />' . PHP_EOL,
			esc_attr( $webmaster_tool['tag_name'] ),
			esc_attr( $webmaster_tool['tag_value'] )
		);
	}

	/**
	 * Sets the tag value by looking up the options.
	 *
	 * @param array $webmaster_tool The data for the meta tag.
	 *
	 * @return array The extended data with the meta value.
	 */
	private function set_tag_value( array $webmaster_tool ) {
		$webmaster_tool['tag_value'] = $this->options->get( $webmaster_tool['option_key'], '' );

		return $webmaster_tool;
	}

	/**
	 * Checks if the tag value is not empty.
	 *
	 * @param array $webmaster_tool The data to check.
	 *
	 * @return bool True when has the value is not empty.
	 */
	private function has_tag_value( array $webmaster_tool ) {
		return ! empty( $webmaster_tool['tag_value'] );
	}
}
