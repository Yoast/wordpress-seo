<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Integrations\Blocks
 */

namespace Yoast\WP\SEO\Integrations\Blocks;

use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Breadcrumbs block class
 */
abstract class Dynamic_Block implements Integration_Interface {

	/**
	 * @var string the name of the block.
	 */
	protected $block_name;

	/**
	 * @var string the editor script for the block.
	 */
	protected $script;

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [];
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_action( 'init', [ $this, 'register_block' ] );
	}

	/**
	 * Registers the block.
	 */
	public function register_block() {
		\register_block_type(
			'yoast-seo/' . $this->block_name,
			[
				'editor_script'   => $this->script,
				'render_callback' => [ $this, 'present' ],
				'attributes'      => [
					'className' => [
						'default' => '',
						'type'    => 'string',
					],
				],
			]
		);
	}

	/**
	 * Presents the block output. This is abstract because in the loop we need to be able to build the data for the
	 * presenter in the last moment.
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return string The block output.
	 */
	abstract public function present( $attributes );
}
