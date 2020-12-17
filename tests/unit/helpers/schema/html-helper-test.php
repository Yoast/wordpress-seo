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
	 * @var HTML_Helper_Test
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
	 */
	public function test_sanitize() {
		// Test whether sanitize properly removes script tags.
		$input    = 'Test <script>alert(0)</script> bla';
		$expected = 'Test alert(0) bla';
		$this->assertEquals( $expected, $this->instance->sanitize( $input ) );

		// Test whether sanitize leaves allowed <p> tags intact.
		$input    = 'Test <p>Paragraph</p> bla';
		$expected = 'Test <p>Paragraph</p> bla';
		$this->assertEquals( $expected, $this->instance->sanitize( $input ) );
	}

	/**
	 * Test whether smart strips tags strips tags in a smart way.
	 *
	 * @covers ::smart_strip_tags
	 */
	public function test_smart_strip_tags() {
		// Test removing script tags.
		$input    = 'Test </script>bla';
		$expected = 'Test bla';
		$this->assertEquals( $expected, $this->instance->smart_strip_tags( $input ) );

		// Test removing script tags.
		$input    = 'Test </script ><script>alert(0)</script><script>';
		$expected = 'Test';
		$this->assertEquals( $expected, $this->instance->smart_strip_tags( $input ) );

		// Test replacing `<br>` tags with spaces.
		$input    = 'Test<br>word';
		$expected = 'Test word';
		$this->assertEquals( $expected, $this->instance->smart_strip_tags( $input ) );

		// Test replacing closing heading tags with spaces.
		$input    = '<h1>Heading</h1>
First words';
		$expected = 'Heading First words';
		$this->assertEquals( $expected, $this->instance->smart_strip_tags( $input ) );

		// Test replacing tags li with • and new lines with spaces.
		$input    = 'I am:
<ul>
<li>smart</li>
<li>beautiful</li>
</ul>';
		$expected = 'I am: • smart • beautiful';
		$this->assertEquals( $expected, $this->instance->smart_strip_tags( $input ) );
	}
}
