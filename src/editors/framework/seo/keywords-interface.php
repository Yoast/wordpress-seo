<?php

namespace Yoast\WP\SEO\Editors\Framework\Seo;

interface Keywords_Interface {


	/**
	 * Counts the number of given keywords used for other posts other than the given post_id.
	 *
	 * @return array The keyword and the associated posts that use it.
	 */
	public function get_focus_keyword_usage(  ):array;

}
