<?php

namespace Yoast\WP\SEO\Integrations\Blocks;

use Yoast\WP\SEO\Helpers\Wordpress_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Internal_Linking_Category block class.
 */
class Internal_Linking_Category implements Integration_Interface {

	/**
	 * Represents the WordPress helper.
	 *
	 * @var Wordpress_Helper
	 */
	protected $wordpress_helper;

	/**
	 * Internal_Linking_Category constructor.
	 *
	 * @param Wordpress_Helper $wordpress_helper The WordPress helper.
	 */
	public function __construct( Wordpress_Helper $wordpress_helper ) {
		$this->wordpress_helper = $wordpress_helper;
	}

	/**
	 * {@inheritDoc}
	 */
	public static function get_conditionals() {
		return [];
	}

	/**
	 * {@inheritDoc}
	 */
	public function register_hooks() {
		$wordpress_version = $this->wordpress_helper->get_wordpress_version();

		// The 'block_categories' filter has been deprecated in WordPress 5.8 and replaced by 'block_categories_all'.
		if ( \version_compare( $wordpress_version, '5.8-beta0', '<' ) ) {
			\add_filter( 'block_categories', [ $this, 'add_block_categories' ] );
		}
		else {
			\add_filter( 'block_categories_all', [ $this, 'add_block_categories' ] );
		}
	}

	/**
	 * Adds Yoast block categories.
	 *
	 * @param array $categories The categories.
	 * @return array The filtered categories.
	 */
	public function add_block_categories( $categories ) {
		$categories[] = [
			'slug'  => 'yoast-structured-data-blocks',
			'title' => \sprintf(
				/* translators: %1$s expands to Yoast. */
				\__( '%1$s Structured Data Blocks', 'wordpress-seo' ),
				'Yoast'
			),
		];
		$categories[] = [
			'slug'  => 'yoast-internal-linking-blocks',
			'title' => \sprintf(
				/* translators: %1$s expands to Yoast. */
				\__( '%1$s Internal Linking Blocks', 'wordpress-seo' ),
				'Yoast'
			),
		];

		return $categories;
	}
}
