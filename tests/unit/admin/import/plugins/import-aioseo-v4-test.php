<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\Unit\Admin\Import\Plugins;

use Mockery;
use wpdb;
use WPSEO_Import_AIOSEO_V4;
use Yoast\WP\SEO\Tests\Unit\Doubles\Admin\Import\Plugins\WPSEO_Import_AIOSEO_V4_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests for the All-in-One SEO V4 import feature.
 *
 * @coversDefaultClass WPSEO_Import_AIOSEO_V4
 */
class WPSEO_Import_AIOSEO_V4_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var WPSEO_Import_AIOSEO_V4_Double
	 */
	private $instance;

	/**
	 * Sets up the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new WPSEO_Import_AIOSEO_V4_Double();
	}

	/**
	 * Tests the meta_key_clone_replace method.
	 *
	 * @covers ::meta_key_clone_replace
	 * @covers ::get_unique_custom_fields_or_taxonomies
	 * @covers ::replace_custom_field_or_taxonomy_replace_vars
	 * @covers ::get_meta_values_with_custom_field_or_taxonomy
	 */
	public function test_meta_key_clone_replace() {
		global $wpdb;

		$wpdb         = Mockery::mock( 'wpdb' );
		$wpdb->prefix = 'test';

		$wpdb->shouldReceive( 'query' );

		// Standard replace vars.
		$this->set_replace_vars_prepare_expectations( $wpdb );

		// Custom fields.

		$wpdb->expects( 'prepare' )
			->with(
				'SELECT meta_value FROM tmp_meta_table WHERE meta_value LIKE %s',
				'%#custom_field-%'
			);

		$wpdb->expects( 'get_col' )
			->andReturn(
				[
					'#custom_field-veldje #post_title#custom_field-gras',
					'#post_title #custom_field-groen',
					'#custom_field-veldje',
					'#custom_field-some_custom_field #separator_sa #site_title&nbsp;&nbsp;#custom_field-some_custom_field',
					'#custom_field-some_custom_field %%hello%% some stuff#site_title&nbsp;&nbsp;',
				]
			);

		$wpdb->expects( 'prepare' )
			->with(
				'UPDATE tmp_meta_table SET meta_value = REPLACE( meta_value, %s, %s )',
				'#custom_field-veldje',
				'%%cf_veldje%%'
			);

		$wpdb->expects( 'prepare' )
			->with(
				'UPDATE tmp_meta_table SET meta_value = REPLACE( meta_value, %s, %s )',
				'#custom_field-gras',
				'%%cf_gras%%'
			);

		$wpdb->expects( 'prepare' )
			->with(
				'UPDATE tmp_meta_table SET meta_value = REPLACE( meta_value, %s, %s )',
				'#custom_field-groen',
				'%%cf_groen%%'
			);

		$wpdb->expects( 'prepare' )
			->with(
				'UPDATE tmp_meta_table SET meta_value = REPLACE( meta_value, %s, %s )',
				'#custom_field-some_custom_field',
				'%%cf_some_custom_field%%'
			);

		// Custom taxonomies.

		$wpdb->expects( 'prepare' )
			->with(
				'SELECT meta_value FROM tmp_meta_table WHERE meta_value LIKE %s',
				'%#tax_name-%'
			);

		$wpdb->expects( 'get_col' )
			->andReturn(
				[
					'#post_title#tax_name-taxonomy',
					'some text | #tax_name-taxonomy',
					'#tax_name-taxonomy#tax_name-category',
				]
			);

		$wpdb->expects( 'prepare' )
			->with(
				'UPDATE tmp_meta_table SET meta_value = REPLACE( meta_value, %s, %s )',
				'#tax_name-taxonomy',
				'%%ct_taxonomy%%'
			);

		$wpdb->expects( 'prepare' )
			->with(
				'UPDATE tmp_meta_table SET meta_value = REPLACE( meta_value, %s, %s )',
				'#tax_name-category',
				'%%ct_category%%'
			);

		// The `$replace_values` argument is not used by the class, so pass an empty array.
		$this->instance->meta_key_clone_replace( [] );
	}

	/**
	 * Tests the meta_key_clone_replace method.
	 *
	 * @covers ::meta_key_clone_replace
	 * @covers ::get_unique_custom_fields_or_taxonomies
	 * @covers ::replace_custom_field_or_taxonomy_replace_vars
	 * @covers ::get_meta_values_with_custom_field_or_taxonomy
	 */
	public function test_meta_key_clone_replace_no_custom_field_replace_vars() {
		global $wpdb;

		$wpdb         = Mockery::mock( 'wpdb' );
		$wpdb->prefix = 'test';

		$wpdb->shouldReceive( 'query' );

		// Standard replace vars.

		$this->set_replace_vars_prepare_expectations( $wpdb );

		// Custom fields.

		$wpdb->expects( 'prepare' )
			->with(
				'SELECT meta_value FROM tmp_meta_table WHERE meta_value LIKE %s',
				'%#custom_field-%'
			);

		$wpdb->expects( 'get_col' )
			->andReturn( [] );

		// Custom taxonomies.

		$wpdb->expects( 'prepare' )
			->with(
				'SELECT meta_value FROM tmp_meta_table WHERE meta_value LIKE %s',
				'%#tax_name-%'
			);

		$wpdb->expects( 'get_col' )
			->andReturn( [] );

		// The `$replace_values` argument is not used by the class, so pass an empty array.
		$this->instance->meta_key_clone_replace( [] );
	}

	/**
	 * Set expectation for replacing the replace vars in the database.
	 *
	 * @param wpdb|Mockery\MockInterface $wpdb The (mocked) WordPress database object.
	 */
	private function set_replace_vars_prepare_expectations( $wpdb ) {
		$replace_vars = [
			'#author_first_name' => '%%author_first_name%%',
			'#author_last_name'  => '%%author_last_name%%',
			'#author_name'       => '%%name%%',
			'#categories'        => '%%category%%',
			'#current_date'      => '%%currentdate%%',
			'#current_day'       => '%%currentday%%',
			'#current_month'     => '%%currentmonth%%',
			'#current_year'      => '%%currentyear%%',
			'#permalink'         => '%%permalink%%',
			'#post_content'      => '%%post_content%%',
			'#post_date'         => '%%date%%',
			'#post_day'          => '%%post_day%%',
			'#post_month'        => '%%post_month%%',
			'#post_title'        => '%%title%%',
			'#post_year'         => '%%post_year%%',
			'#post_excerpt'      => '%%excerpt%%',
			'#post_excerpt_only' => '%%excerpt_only%%',
			'#separator_sa'      => '%%sep%%',
			'#site_title'        => '%%sitename%%',
			'#tagline'           => '%%sitedesc%%',
			'#taxonomy_title'    => '%%category_title%%',
		];

		foreach ( $replace_vars as $aioseo_variable => $yoast_variable ) {
			$wpdb->expects( 'prepare' )
				->with(
					'UPDATE tmp_meta_table SET meta_value = REPLACE( meta_value, %s, %s )',
					$aioseo_variable,
					$yoast_variable
				);
		}
	}
}
