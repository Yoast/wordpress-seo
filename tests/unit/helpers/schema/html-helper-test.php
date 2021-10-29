<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers\Schema;

use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @group helpers
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Schema\HTML_Helper
 */
class HTML_Helper_Test extends TestCase {

	/**
	 * Class instance to use for the test.
	 *
	 * @var HTML_Helper
	 */
	private $instance;

	/**
	 * Set up a new instance of the class under test before each test.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new HTML_Helper();
	}

	/**
	 * Test whether sanitize sanitizes properly.
	 *
	 * @covers ::sanitize
	 *
	 * @dataProvider data_sanitize
	 *
	 * @param mixed  $input    The input to sanitize.
	 * @param string $expected The expected return value.
	 */
	public function test_sanitize( $input, $expected ) {
		$this->assertSame( $expected, $this->instance->sanitize( $input ) );
	}

	/**
	 * Data provider.
	 *
	 * @return array
	 */
	public function data_sanitize() {
		return [
			'Text containing script tags should have the script tags stripped' => [
				'input'    => 'Test <script>alert(0)</script> bla',
				'expected' => 'Test alert(0) bla',
			],
			'Text containing allowed tag should be returned unchanged' => [
				'input'    => 'Test <p>Paragraph</p> bla',
				'expected' => 'Test <p>Paragraph</p> bla',
			],
		];
	}

	/**
	 * Test whether smart strips tags strips tags in a smart way.
	 *
	 * @covers ::smart_strip_tags
	 *
	 * @dataProvider data_smart_strip_tags
	 *
	 * @param mixed  $input    The input to sanitize.
	 * @param string $expected The expected return value.
	 */
	public function test_smart_strip_tags( $input, $expected ) {
		$this->assertSame( $expected, $this->instance->smart_strip_tags( $input ) );
	}

	/**
	 * Data provider.
	 *
	 * @return array
	 */
	public function data_smart_strip_tags() {
		return [
			'Test replacing `<br>` tag with space' => [
				'input'    => 'Test<br>word',
				'expected' => 'Test word',
			],
			'Test adding a space when replacing heading close tags' => [
				'input'    => '<h1>Heading</h1>
First words',
				'expected' => 'Heading First words',
			],
			'Test replacing tags li with • and new lines with spaces' => [
				'input'    => 'I am:
<ul>
<li>smart</li>
<li>beautiful</li>
</ul>',
				'expected' => 'I am: • smart • beautiful',
			],
			'Test removing incomplete set of script tags' => [
				'input'    => 'Test </script>bla',
				'expected' => 'Test bla',
			],
			'Test removing incomplete + complete set of script tags' => [
				'input'    => 'Test </script ><script>alert(0)</script><script>',
				'expected' => 'Test',
			],
		];
	}
}
