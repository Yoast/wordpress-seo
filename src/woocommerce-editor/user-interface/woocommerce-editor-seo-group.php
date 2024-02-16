<?php

namespace Yoast\WP\SEO\WooCommerce_Editor\User_Interface;

use Automattic\WooCommerce\Admin\BlockTemplates\BlockInterface;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Registers our SEO group to the WooCommerce layout templates.
 *
 * @link https://github.com/woocommerce/woocommerce/blob/trunk/docs/product-editor-development/block-template-lifecycle.md#registration
 */
class WooCommerce_Editor_SEO_Group implements Integration_Interface {

	/**
	 * No conditionals are needed because the hooks will just not be called when irrelevant.
	 * Though this could be:
	 * - when WooCommerce is active
	 * - when the ProductBlockEditor feature is active
	 */
	use No_Conditionals;

	public const GROUP_ID = 'yoast-seo';

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		/**
		 * The template area is from the SimpleProductTemplate->get_area(), which is 'product-form'.
		 * The block names are found in SimpleProductTemplate::GROUP_IDS, we are adding our block after the 'general' group.
		 *
		 * @see  \Automattic\WooCommerce\Internal\Admin\Features\ProductBlockEditor\ProductTemplates\SimpleProductTemplate
		 * @link https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/Admin/Features/ProductBlockEditor/ProductTemplates/README.md
		 */
		\add_action(
			'woocommerce_block_template_area_product-form_after_add_block_general',
			[ $this, 'add_seo_group' ]
		);
	}

	/**
	 * Adds our SEO group after the given block.
	 *
	 * @param BlockInterface $block A block.
	 *
	 * @return void
	 */
	public function add_seo_group( BlockInterface $block ) {
		$parent = $block->get_parent();
		if ( ! $parent ) {
			return;
		}

		// Only add the group to a simple product. Effectively skipping variations.
		if ( $parent->get_id() !== 'simple-product' ) {
			return;
		}

		$parent->add_group(
			[
				'id'         => self::GROUP_ID,
				'order'      => ( $block->get_order() + 5 ),
				'attributes' => [
					'title' => 'Yoast SEO',
				],
			]
		);
	}
}
