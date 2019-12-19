<?php
/**
 * Surface for the indexables.
 *
 * @package Yoast\YoastSEO\Surfaces
 */

namespace Yoast\WP\Free\Surfaces;

use Yoast\WP\Free\Memoizer\Meta_Tags_Context_Memoizer;

class Current_Page_Surface {

    /**
     * @var Meta_Tags_Context_Memoizer;
     */
    private $meta_tags_context_memoizer;

    

    /**
     * Current_Page_Surface constructor.
     *
     * @param Meta_Tags_Context_Memoizer $meta_tags_context_memoizer The meta tags context memoizer.
     */
    public function __construct( Meta_Tags_Context_Memoizer $meta_tags_context_memoizer ) {
        $this->meta_tags_context_memoizer = $meta_tags_context_memoizer;
    }

    /**
     * get_title
     *
     * @return void
     */
    public function get_title() {
        $meta_tags_context = $this->meta_tags_context_memoizer->for_current_page();

        return $meta_tags_context->title;
    }

    /**
     * get_description
     *
     * @return void
     */
    public function get_description() {
        $meta_tags_context = $this->meta_tags_context_memoizer->for_current_page();

        return $meta_tags_context->description;
    }

    /**
     * get_canonical
     *
     * @return void
     */
    public function get_canonical() {
        $meta_tags_context = $this->meta_tags_context_memoizer->for_current_page();

        return $meta_tags_context->canonical;
    }

    /**
     * get_robots
     *
     * @return void
     */
    public function get_robots() {
        $meta_tags_context = $this->meta_tags_context_memoizer->for_current_page();

        return $meta_tags_context->presentation->robots;
    }
}
