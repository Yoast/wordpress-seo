<?php

namespace Yoast\WP\SEO\Integrations;

use WPSEO_Admin_Asset_Manager;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Conditionals\Schema_Blocks_Conditional;
use Yoast\WP\SEO\Config\Schema_IDs;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;

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
	 * The meta tags context memoizer.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	protected $meta_tags_context_memoizer;

	/**
	 * The ID helper.
	 *
	 * @var ID_Helper
	 */
	protected $id_helper;

	/**
	 * The replace vars helper.
	 *
	 * @var WPSEO_Replace_Vars
	 */
	protected $replace_vars;

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
	 * @param WPSEO_Admin_Asset_Manager  $asset_manager              The asset manager.
	 * @param Meta_Tags_Context_Memoizer $meta_tags_context_memoizer The meta tags context memoizer.
	 * @param WPSEO_Replace_Vars         $replace_vars               The replace vars helper.
	 * @param ID_Helper                  $id_helper                  The ID helper.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
		Meta_Tags_Context_Memoizer $meta_tags_context_memoizer,
		WPSEO_Replace_Vars $replace_vars,
		ID_Helper $id_helper
	) {
		$this->asset_manager              = $asset_manager;
		$this->meta_tags_context_memoizer = $meta_tags_context_memoizer;
		$this->replace_vars               = $replace_vars;
		$this->id_helper                  = $id_helper;
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
		\add_action( 'wpseo_json_ld', [ $this, 'register_replace_vars' ] );
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
	 * Registers the Schema related replace vars.
	 *
	 * @return void
	 */
	public function register_replace_vars() {
		$context = $this->meta_tags_context_memoizer->for_current_page();

		$replace_vars = [
			'main_schema_id'   => $context->main_schema_id,
			'author_id'        => $this->id_helper->get_user_schema_id( $context->indexable->author_id, $context ),
			'person_id'        => $context->site_url . Schema_IDs::PERSON_HASH,
			'primary_image_id' => $context->canonical . Schema_IDs::PRIMARY_IMAGE_HASH,
			'webpage_id'       => $context->canonical . Schema_IDs::WEBPAGE_HASH,
			'website_id'       => $context->site_url . Schema_IDs::WEBSITE_HASH,
		];

		foreach ( $replace_vars as $var => $replace_function ) {
			$this->maybe_register_replacement( $var, $replace_function );
		}
	}

	/**
	 * Registers a replace var and its replace function if it has not been registered yet.
	 *
	 * @param string $variable The replace variable, in the form of '%%variable%%'.
	 * @param string $value    The value that the variable should be replaced with.
	 */
	protected function maybe_register_replacement( $variable, $value ) {
		if ( ! $this->replace_vars->has_been_registered( $variable ) ) {
			WPSEO_Replace_Vars::register_replacement(
				$variable,
				static function() use ( $value ) {
					return $value;
				}
			);
		}
	}

	/**
	 * Outputs the set templates.
	 */
	public function output() {
		if ( ! $this->asset_manager->is_script_enqueued( 'schema-blocks' ) ) {
			return;
		}

		/**
		 * Filter: 'wpseo_schema_templates' - Allow adding additional schema templates.
		 *
		 * @param array $templates The templates to filter.
		 */
		$templates = \apply_filters( 'wpseo_load_schema_templates', $this->templates );
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
