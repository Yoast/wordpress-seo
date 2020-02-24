<?php
namespace Yoast\WP\SEO\Tests\Mocks;

class Abstract_Presentation extends \Yoast\WP\SEO\Presentations\Abstract_Presentation {
	/**
	 * @inheritDoc
	 */
	public function is_prototype() {
		return parent::is_prototype();
	}

	public function generate_some_mock_data() {
		return 'some_mock_value';
	}
}
