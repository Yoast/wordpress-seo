<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Helpers;

use Yoast\WP\SEO\Helpers\Short_Link_Helper;

/**
 * Class Short_Link_Helper_Double.
 */
final class Short_Link_Helper_Double extends Short_Link_Helper {

	/**
	 * Gets the additional shortlink data.
	 *
	 * @return array The shortlink data
	 */
	public function collect_additional_shortlink_data() {
		return parent::collect_additional_shortlink_data();
	}
}
