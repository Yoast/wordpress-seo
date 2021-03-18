<?php

namespace Yoast\WP\SEO\Integrations;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Schema_Blocks_Conditional;

/**
 * Loads schema block templates into Gutenberg.
 */
class Schema_Blocks implements Integration_Interface {

	/**
	 * The registered templates.
	 *
	 * @var string[]
	 */
	protected $templates = [];

	/**
	 * Contains the asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Represents the schema blocks conditional.
	 *
	 * @var Schema_Blocks_Conditional
	 */
	protected $blocks_conditional;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [
			Schema_Blocks_Conditional::class,
		];
	}

	/**
	 * Schema_Blocks constructor.
	 *
	 * @param WPSEO_Admin_Asset_Manager $asset_manager      The asset manager.
	 * @param Schema_Blocks_Conditional $blocks_conditional The schema blocks conditional.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
		Schema_Blocks_Conditional $blocks_conditional
	) {
		$this->asset_manager      = $asset_manager;
		$this->blocks_conditional = $blocks_conditional;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'enqueue_block_editor_assets', [ $this, 'load' ] );
		\add_action( 'admin_enqueue_scripts', [ $this, 'output' ] );
	}

	/**
	 * Registers a schema template.
	 *
	 * @param string $template The template to be registered.
	 *                         If starting with a / is assumed to be an absolute path.
	 *                         If not starting with a / is assumed to be relative to WPSEO_PATH.
	 *
	 * @return void
	 */
	public function register_template( $template ) {
		if ( \substr( $template, 0, 1 ) !== '/' ) {
			$template = \WPSEO_PATH . '/' . $template;
		}

		$this->templates[] = $template;
	}

	/**
	 * Loads all schema block templates and the required JS library for them.
	 *
	 * @return void
	 */
	public function load() {
		$this->asset_manager->enqueue_script( 'schema-blocks' );
		$this->asset_manager->enqueue_style( 'schema-blocks' );
	}

	/**
	 * Outputs the set templates.
	 */
	public function output() {
		if ( ! $this->asset_manager->is_script_enqueued( 'schema-blocks' ) ) {
			return;
		}

		$templates = [];

		// When the schema blocks feature flag is enabled, use the registered templates.
		if ( $this->blocks_conditional->is_met() ) {
			$templates = $this->templates;
		}

		/**
		 * Filter: 'wpseo_load_schema_templates' - Allow adding additional schema templates.
		 *
		 * @param array $templates The templates to filter.
		 */
		$templates = \apply_filters( 'wpseo_load_schema_templates', $templates );
		if ( ! is_array( $templates ) || empty( $templates ) ) {
			return;
		}

		foreach ( $templates as $template ) {
			if ( ! \file_exists( $template ) ) {
				continue;
			}
			$type = ( \substr( $template, - 10 ) === '.block.php' ) ? 'block' : 'schema';
			echo '<script type="text/' . \esc_html( $type ) . '-template">';
			include $template;
			echo '</script>';
		}
	}
}
