<?php

namespace Yoast\WP\SEO\Tests\Mocks;

/**
 * Represents the Abstract_Presentation mock.
 */
class Abstract_Presentation extends \Yoast\WP\SEO\Presentations\Abstract_Presentation {

	/**
	 * @inheritDoc
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
