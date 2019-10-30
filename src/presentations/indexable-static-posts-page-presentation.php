<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\Free\Presentations;

/**
 * Class Indexable_Static_Posts_Page_Presentation
 */
class Indexable_Static_Posts_Page_Presentation extends Indexable_Post_Type_Presentation {
	use Archive_Adjacent;
}
