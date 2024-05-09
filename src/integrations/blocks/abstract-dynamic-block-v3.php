<?php

namespace Yoast\WP\SEO\Integrations\Blocks;

use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Dynamic_Block class.
 */
abstract class Dynamic_Block_V3 implements Integration_Interface {

	/**
	 * The name of the block.
	 *
	 * @var string
	 */
	protected $block_name;

	/**
	 * The editor script for the block.
	 *
	 * @var string
	 */
	protected $script;

	/**
	 * The base path for the block.
	 *
	 * @var string
	 */
	protected $base_path;

	/**
	 *  Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array<string>
	 */
	public static function get_conditionals() {
		return [];
	}

	/**
	 * Initializes the integration.
	 *
	 * Integrations hooking on `init` need to have a priority of 11 or higher to
	 * ensure that they run, as priority 10 is used by the loader to load the integrations.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'init', [ $this, 'register_block' ], 11 );
	}

	/**
	 * Registers the block.
	 *
	 * @return void
	 */
	public function register_block() {
		\register_block_type(
			$this->base_path . $this->block_name . '/block.json',
			[
				'editor_script'   => $this->script,
				'render_callback' => [ $this, 'present' ],
			]
		);
	}

	/**
	 * Presents the block output. This is abstract because in the loop we need to be able to build the data for the
	 * presenter in the last moment.
	 *
	 * @param array<string, bool|string|int|array> $attributes The block attributes.
	 *
	 * @return string The block output.
	 */
	abstract public function present( $attributes );
}
