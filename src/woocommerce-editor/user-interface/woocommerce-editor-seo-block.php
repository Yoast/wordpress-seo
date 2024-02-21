<?php

namespace Yoast\WP\SEO\WooCommerce_Editor\User_Interface;

use Automattic\WooCommerce\Admin\BlockTemplates\BlockInterface;
use Automattic\WooCommerce\Admin\Features\ProductBlockEditor\BlockRegistry;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\WooCommerce_Editor\Framework\WooCommerce_Product_Block_Editor_Conditional;

/**
 * Registers our SEO block to WooCommerce.
 * And adds it to the SEO group in the WooCommerce Product Block Editor.
 *
 * @link https://github.com/woocommerce/woocommerce/blob/trunk/docs/product-editor-development/block-template-lifecycle.md#registration
 */
class WooCommerce_Editor_SEO_Block implements Integration_Interface {

	/**
	 * Only continue with this integration when WooCommerce is active and the product block editor feature is available.
	 *
	 * @return string[]
	 */
	public static function get_conditionals() {
		return [ WooCommerce_Conditional::class, WooCommerce_Product_Block_Editor_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'admin_init', [ $this, 'register_block' ] );

		/**
		 * Adds this SEO block to the SEO group.
		 *
		 * @see \Yoast\WP\SEO\WooCommerce_Editor\User_Interface\WooCommerce_Editor_SEO_Group
		 */
		\add_action(
			'woocommerce_block_template_area_product-form_after_add_block_' . WooCommerce_Editor_SEO_Group::GROUP_ID,
			[ $this, 'add_seo_block' ]
		);
	}

	/**
	 * Registers the blocks using the metadata loaded from the `block.json` file.
	 * Behind the scenes, it also registers all assets so they can be enqueued through the block editor in the
	 * corresponding context.
	 *
	 * @see https://developer.wordpress.org/reference/functions/register_block_type/
	 *
	 * @return void
	 */
	public function register_block() {
		if ( ! \class_exists( '\Automattic\WooCommerce\Admin\Features\ProductBlockEditor\BlockRegistry' ) ) {
			return;
		}

		BlockRegistry::get_instance()
			->register_block_type_from_metadata( \WPSEO_PATH . 'blocks/woocommerce-editor/blocks/seo/block.json' );
	}

	/**
	 * Adds our SEO block after the given block.
	 *
	 * @param BlockInterface $block A block.
	 *
	 * @return void
	 */
	public function add_seo_block( BlockInterface $block ) {
		$block->add_block(
			[
				'id'        => 'yoast-seo-woocommerce-editor-seo',
				'blockName' => 'yoast-seo/woocommerce-editor-seo',
				'order'     => 10,
			]
		);
	}
}
