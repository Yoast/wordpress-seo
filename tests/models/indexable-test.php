<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Models
 */

namespace Yoast\WP\SEO\Tests\Models;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Tests\Doubles\Models\Indexable_Double;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexable_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Models\Indexable
 *
 * @group indexables
 * @group models
 */
class Indexable_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var Indexable_Double|Mockery\MockInterface
	 */
	protected $instance;

	/**
	 * Sets up the class which will be tested.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance      = new Indexable_Double();
		$this->instance->orm = Mockery::mock( ORM::class );
	}

	/**
	 * Tests the save method.
	 *
	 * @covers ::save
	 */
	public function test_save() {
		$permalink = 'https://example.com/';

		Functions\expect( 'wp_parse_url' )
			->once()
			->with( 'https://example.com/' )
			->andReturn(
				[
					'scheme' => 'https',
					'host'   => 'example.com',
				]
			);

		$this->instance->orm->expects( 'set' )
			->once()
			->with( 'permalink', $permalink );
		$this->instance->orm->expects( 'set' )
			->once()
			->with( 'permalink_hash', \strlen( $permalink ) . ':' . \md5( $permalink ) );
		// Once for going into the if-statement, then twice for the permalink_hash.
		$this->instance->orm->expects( 'get' )->times( 4 )->with( 'permalink' )->andReturn( $permalink );
		$this->instance->orm->expects( 'get' )->once()->with( 'primary_focus_keyword' )->andReturn( 'keyword' );
		$this->instance->orm->expects( 'save' )->once();

		$this->instance->save();
	}

	/**
	 * Tests that the trailing slash is enforced in the permalink.
	 *
	 * @covers ::save
	 */
	public function test_save_trailing_slash() {
		$permalink_no_slash = 'https://example.com';
		$permalink_slash    = $permalink_no_slash . '/';

		Functions\expect( 'get_option' )
			->once()
			->with( 'permalink_structure' )
			->andReturn( '/%postname%/' );

		Functions\expect( 'wp_parse_url' )
			->once()
			->with( 'https://example.com' )
			->andReturn(
				[
					'scheme' => 'https',
					'host'   => 'example.com',
				]
			);

		$this->instance->orm->expects( 'set' )->once()->with( 'permalink', $permalink_slash );
		$this->instance->orm->expects( 'set' )
			->once()
			->with( 'permalink_hash', \strlen( $permalink_no_slash ) . ':' . \md5( $permalink_no_slash ) );
		// Once for going into the if-statement, then once more for trailingslashit, then twice for the permalink_hash.
		$this->instance->orm->expects( 'get' )->times( 4 )->with( 'permalink' )->andReturn( $permalink_no_slash );
		$this->instance->orm->expects( 'get' )->once()->with( 'primary_focus_keyword' )->andReturn( 'keyword' );
		$this->instance->orm->expects( 'save' )->once();

		$this->instance->save();
	}

	/**
	 * Tests that the primary_focus_keyword is truncated when longer than 191 characters.
	 *
	 * @covers ::save
	 */
	public function test_save_primary_focus_keyword_truncated() {
		$keyword_truncated = 'This is a primary focus keyphrase that is longer than hundred and ninety one characters. This is way too long for your normal primary focus one characters. This is way too long for your norma';
		$keyword           = $keyword_truncated . 'l primary focus keyword. Because it does not fit in the database field, we truncate the value.';

		$this->instance->orm->expects( 'get' )->once()->with( 'permalink' )->andReturnFalse();
		$this->instance->orm->expects( 'get' )->twice()->with( 'primary_focus_keyword' )->andReturn( $keyword );
		$this->instance->orm->expects( 'set' )->once()->with( 'primary_focus_keyword', $keyword_truncated );
		$this->instance->orm->expects( 'save' )->once();

		$this->instance->save();
	}

	/**
	 * Tests get_extension.
	 *
	 * @covers ::get_extension
	 */
	public function test_get_extension() {
		$this->assertSame( 'expected extension', $this->instance->get_extension( 'extension' ) );
	}

	/**
	 * Tests get_extension via has_one.
	 *
	 * @covers ::get_extension
	 */
	public function test_get_extension_has_one() {
		$this->instance->mock_has_one = Mockery::mock();
		$this->instance->mock_has_one->expects( 'find_one' )->once()->andReturn( 'found one' );

		$this->assertSame( 'found one', $this->instance->get_extension( 'has_one' ) );

		// Check again to test if it is now set correctly. Not calling `has_one` again.
		$this->assertSame( 'found one', $this->instance->get_extension( 'has_one' ) );
	}
}
