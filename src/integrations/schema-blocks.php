<?php

namespace Yoast\WP\SEO\Integrations;

use WPSEO_Admin_Asset_Manager;
use WPSEO_Admin_Asset_Yoast_Components_L10n;
use Yoast\WP\SEO\Conditionals\Schema_Blocks_Conditional;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;

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
	 * Represents the short link helper.
	 *
	 * @var Short_Link_Helper
	 */
	protected $short_link_helper;

	/**
	 * Returns the conditionals based on which this loadable should be active.
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
	 * @param Short_Link_Helper         $short_link_helper  The short link helper.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
		Schema_Blocks_Conditional $blocks_conditional,
		Short_Link_Helper $short_link_helper
	) {
		$this->asset_manager      = $asset_manager;
		$this->blocks_conditional = $blocks_conditional;
		$this->short_link_helper  = $short_link_helper;
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
		\add_action( 'enqueue_block_editor_assets', [ $this, 'load_translations' ] );
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

		$this->asset_manager->localize_script(
			'schema-blocks',
			'yoastSchemaBlocks',
			[
				'requiredLink'    => $this->short_link_helper->build( 'https://yoa.st/required-fields' ),
				'recommendedLink' => $this->short_link_helper->build( 'https://yoa.st/recommended-fields' ),
			]
		);
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
		if ( ! \is_array( $templates ) || empty( $templates ) ) {
			return;
		}

		foreach ( $templates as $template ) {
			if ( ! \file_exists( $template ) ) {
				continue;
			}
			// `.schema` and other suffixes become Schema (root) templates.
			$type = ( \substr( $template, -10 ) === '.block.php' ) ? 'block' : 'schema';
			echo '<script type="text/' . \esc_html( $type ) . '-template">';
			include $template;
			echo '</script>';
		}
	}

	/**
	 * Loads the translations and localizes the schema-blocks script file.
	 */
	public function load_translations() {
		$yoast_components_l10n = new WPSEO_Admin_Asset_Yoast_Components_L10n();
		$yoast_components_l10n->localize_script( 'schema-blocks' );
	}
}
