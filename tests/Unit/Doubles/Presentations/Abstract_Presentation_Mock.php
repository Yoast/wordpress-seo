<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Presentations;

use Yoast\WP\SEO\Presentations\Abstract_Presentation;

/**
 * Represents the Abstract_Presentation mock.
 */
class Abstract_Presentation_Mock extends Abstract_Presentation {

	/**
	 * Returns `true` if this class is a prototype.
	 *
	 * @return bool If this class is a prototype or not.
	 */
	public function is_prototype() {
		return parent::is_prototype();
	}

	/**
	 * Generator for 'some_mock_data'.
	 * This is to test the generator functionality of the abstract presentation.
	 *
	 * E.g. that, when the `some_mock_data` property is used, the
	 * `generate_some_mock_data` method is called under the hood.
	 *
	 * @return string Some mock value.
	 */
	public function generate_some_mock_data() {
		return 'some_mock_value';
	}
}
