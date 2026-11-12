<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Post_SEO_Field_Validators;

use Mockery;
use Yoast\WP\SEO\Abilities\Infrastructure\Post_SEO_Field_Validators\Schema_Page_Type_Validator;
use Yoast\WP\SEO\Conditionals\Woo_SEO_Inactive_Conditional;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Schema_Page_Type_Validator class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Post_SEO_Field_Validators\Schema_Page_Type_Validator
 */
final class Schema_Page_Type_Validator_Test extends TestCase {

	/**
	 * The Yoast WooCommerce SEO inactive conditional mock.
	 *
	 * @var Mockery\MockInterface|Woo_SEO_Inactive_Conditional
	 */
	private $woo_seo_inactive_conditional;

	/**
	 * The instance under test.
	 *
	 * @var Schema_Page_Type_Validator
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->woo_seo_inactive_conditional = Mockery::mock( Woo_SEO_Inactive_Conditional::class );

		$this->instance = new Schema_Page_Type_Validator( $this->woo_seo_inactive_conditional );
	}

	/**
	 * Creates an indexable mock of a post of the given post type.
	 *
	 * @param string $post_type The post type.
	 *
	 * @return Mockery\MockInterface|Indexable_Mock The indexable mock.
	 */
	private function make_indexable( string $post_type ) {
		$indexable                  = Mockery::mock( Indexable_Mock::class );
		$indexable->object_sub_type = $post_type;

		return $indexable;
	}

	/**
	 * Tests that the validator validates the page type.
	 *
	 * @covers ::__construct
	 * @covers ::get_field_name
	 *
	 * @return void
	 */
	public function test_get_field_name() {
		$this->assertSame( 'schema_page_type', $this->instance->get_field_name() );
	}

	/**
	 * Tests that the page types a product keeps under Yoast WooCommerce SEO are allowed, without checking for it.
	 *
	 * @covers ::validate
	 *
	 * @dataProvider data_validate_allowed_for_products
	 *
	 * @param string|null $value The page type to save.
	 *
	 * @return void
	 */
	public function test_validate_allowed_for_products( ?string $value ) {
		$this->woo_seo_inactive_conditional->expects( 'is_met' )->never();

		$this->assertNull( $this->instance->validate( $value, $this->make_indexable( 'product' ) ) );
	}

	/**
	 * Data provider for test_validate_allowed_for_products.
	 *
	 * @return array<string, array<string, string|null>>
	 */
	public static function data_validate_allowed_for_products() {
		return [
			'ItemPage'     => [ 'value' => 'ItemPage' ],
			'Empty string' => [ 'value' => '' ],
			'Null'         => [ 'value' => null ],
		];
	}

	/**
	 * Tests that any page type is allowed for a post that is not a product, without checking for Yoast WooCommerce
	 * SEO.
	 *
	 * @covers ::validate
	 *
	 * @return void
	 */
	public function test_validate_other_post_type() {
		$this->woo_seo_inactive_conditional->expects( 'is_met' )->never();

		$this->assertNull( $this->instance->validate( 'CollectionPage', $this->make_indexable( 'post' ) ) );
	}

	/**
	 * Tests that another page type is allowed for a product when Yoast WooCommerce SEO is not active.
	 *
	 * @covers ::validate
	 *
	 * @return void
	 */
	public function test_validate_product_without_woo_seo() {
		$this->woo_seo_inactive_conditional->expects( 'is_met' )->once()->andReturnTrue();

		$this->assertNull( $this->instance->validate( 'CollectionPage', $this->make_indexable( 'product' ) ) );
	}

	/**
	 * Tests that another page type is rejected for a product when Yoast WooCommerce SEO is active.
	 *
	 * @covers ::validate
	 *
	 * @return void
	 */
	public function test_validate_product_with_woo_seo() {
		$this->woo_seo_inactive_conditional->expects( 'is_met' )->once()->andReturnFalse();

		$this->assertSame(
			'The schema_page_type setting was not saved, because Yoast WooCommerce SEO is active and sets the page type of products to ItemPage.',
			$this->instance->validate( 'CollectionPage', $this->make_indexable( 'product' ) ),
		);
	}
}
