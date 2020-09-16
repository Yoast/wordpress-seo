<?php
/**
 * Schema template loader.
 *
 * @package Yoast\WP\SEO\Integrations
 */

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Conditionals\Schema_Blocks_Feature_Flag_Conditional;

/**
 * Loads schema block templates into Gutenberg.
 */
class Schema_Blocks implements Integration_Interface {

    /**
     * @inheritDoc
     */
    public static function get_conditionals() {
        return [
            Schema_Blocks_Feature_Flag_Conditional::class
        ];
    }

    /**
     * The registered templates.
     *
     * @var string[]
     */
    protected $templates = [];

    /**
     * @inheritDoc
     */
    public function register_hooks() {
        \add_action( 'enqueue_block_editor_assets', [ $this, 'load' ] );
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
        if ( substr( $template, 0, 1 ) !== '/' ) {
            $template = WPSEO_PATH . '/' . $template;
        }

        $this->templates[] = $template;
    }

    /**
     * Loads all schema block templates and the required JS library for them.
     *
     * @return void
     */
    public function load() {
        foreach( $this->templates as $template ) {
            if ( ! file_exists( $template ) ) {
                continue;
            }
            $type = substr( $template, -10 ) === '.block.php' ? 'block' : 'schema';
            echo '<script type="text/' . $type . '-template">';
            include $template;
            echo '</script>';
        }

        $asset_manager = new \WPSEO_Admin_Asset_Manager();
        $asset_manager->enqueue_script( 'schema-blocks' );
        $asset_manager->enqueue_style( 'schema-blocks' );
    }
}
