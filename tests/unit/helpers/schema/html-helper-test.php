<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers\Schema;

use stdClass;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Tests\Unit\Doubles\Stringable_Object_Mock;
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
	 * @covers ::is_non_empty_string_or_stringable
	 *
	 * @dataProvider data_incorrect_input_types
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
			'Empty text string' => [
				'input'    => '',
				'expected' => '',
			],
			'Text without any HTML' => [
				'input'    => 'This is just a simple text string',
				'expected' => 'This is just a simple text string',
			],
			'Text containing tags not on the allowed list should have those tags stripped' => [
				'input'    => 'Test <script>alert(0)</script> bla',
				'expected' => 'Test alert(0) bla',
			],
			'Text containing allowed tag should be returned unchanged' => [
				'input'    => 'Test <p>Paragraph</p> bla',
				'expected' => 'Test <p>Paragraph</p> bla',
			],
			'Text containing both allowed tag and disallowed tag should have the disallowed tag stripped' => [
				'input'    => 'Test <p>Paragraph</p> bla <marque>stuck in the 80s</marque>',
				'expected' => 'Test <p>Paragraph</p> bla stuck in the 80s',
			],
			'Test passing the parameter as a stringable object (plain string)' => [
				'input'    => new Stringable_Object_Mock( 'This is just a simple text string' ),
				'expected' => 'This is just a simple text string',
			],
		];
	}

	/**
	 * Test whether smart strips tags strips tags in a smart way.
	 *
	 * @covers ::smart_strip_tags
	 * @covers ::is_non_empty_string_or_stringable
	 *
	 * @dataProvider data_incorrect_input_types
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
			'Empty text string' => [
				'input'    => '',
				'expected' => '',
			],
			'Text without HTML' => [
				'input'    => 'This is just a simple text string',
				'expected' => 'This is just a simple text string',
			],
			'Multi-line text without HTML' => [
				'input'    => 'This is
just a simple
text string',
				'expected' => 'This is just a simple text string',
			],
			'String containing only whitespace' => [
				'input'    => '




   				 ',
				'expected' => '',
			],
			'Test replacing `<br>` tag with space' => [
				'input'    => 'Test<br>word',
				'expected' => 'Test word',
			],
			'Test replacing `<BR />` tag (uppercase and with self-closing slash) with space' => [
				'input'    => 'Test<BR />word',
				'expected' => 'Test word',
			],
			'Test adding a space when replacing heading close tags' => [
				'input'    => '<h1>Heading</h1>First words',
				'expected' => 'Heading First words',
			],
			'Test adding a space when replacing select close tags' => [
				'input'    => 'End of previous</Div>This safeguards the case insensitivity',
				'expected' => 'End of previous This safeguards the case insensitivity',
			],
			'Test replacing tags li with • and new lines with spaces' => [
				'input'    => 'I am:
<ul>
<li>smart</li>
<LI>beautiful</LI>
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
			'Test trimming surrounding whitespace and extraneous whitespace within string' => [
				'input'    => '   This is 	just a     simple text string   ',
				'expected' => 'This is just a simple text string',
			],
			'Test passing the parameter as a stringable object (plain string)' => [
				'input'    => new Stringable_Object_Mock( 'This is just a simple text string' ),
				'expected' => 'This is just a simple text string',
			],
		];
	}

	/**
	 * Data provider.
	 *
	 * @return array
	 */
	public function data_incorrect_input_types() {
		return [
			'null' => [
				'input'    => null,
				'expected' => '',
			],
			'boolean false' => [
				'input'    => false,
				'expected' => '',
			],
			'boolean true' => [
				'input'    => true,
				'expected' => '',
			],
			'integer' => [
				'input'    => -25,
				'expected' => '-25',
			],
			'float' => [
				'input'    => -2.5,
				'expected' => '-2.5',
			],
			'array' => [
				'input'    => [],
				'expected' => '',
			],
			'plain object' => [
				'input'    => new stdClass(),
				'expected' => '',
			],
		];
	}
}
