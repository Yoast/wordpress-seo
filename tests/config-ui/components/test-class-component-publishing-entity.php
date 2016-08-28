<?php
/**
 * @package WPSEO\UnitTests
 */

/**
 * Class WPSEO_Config_Component_Publishing_Entity_Mock
 */
class WPSEO_Config_Component_Publishing_Entity_Mock extends WPSEO_Config_Component_Publishing_Entity {
	/**
	 * Expose mappings
	 *
	 * @return array
	 */
	public function get_mappings() {
		return $this->mapping;
	}
}

/**
 * Class WPSEO_Config_Component_Publishing_Entity_Test
 */
class WPSEO_Config_Component_Publishing_Entity_Test extends WPSEO_UnitTestCase {
	/** @var WPSEO_Config_Component_Publishing_Entity_Mock */
	protected $component;

	/**
	 * Set up
	 */
	public function setUp() {
		parent::setUp();

		$this->component = new WPSEO_Config_Component_Publishing_Entity_Mock();
	}

	/**
	 * @covers WPSEO_Config_Component_Publishing_Entity::get_identifier()
	 */
	public function test_get_identifier() {
		$this->assertEquals( 'PublishingEntity', $this->component->get_identifier() );
	}

	/**
	 * @covers WPSEO_Config_Component_Publishing_Entity::get_field()
	 */
	public function test_get_field() {
		$this->assertEquals( 'WPSEO_Config_Field_Publishing_Entity', get_class( $this->component->get_field() ) );
	}

	/**
	 * @covers WPSEO_Config_Component_Publishing_Entity::get_data()
	 */
	public function test_get_data() {
		$yoast_option                      = WPSEO_Options::get_option( 'wpseo' );
		$yoast_option['company_or_person'] = 'person';
		$yoast_option['company_name']      = 'hier';

		update_option( 'wpseo', $yoast_option );

		$expected = array(
			'publishingEntityType'        => 'person',
			'publishingEntityPersonName'  => '',
			'publishingEntityCompanyName' => 'hier',
			'publishingEntityCompanyLogo' => '',
		);

		$result = $this->component->get_data();

		$this->assertEquals( $expected, $result );
	}

	/**
	 * @covers WPSEO_Config_Component_Publishing_Entity::set_data()
	 */
	public function test_set_data() {

		$input = array(
			'publishingEntityType'        => 'person',
			'publishingEntityPersonName'  => 'my_name',
			'publishingEntityCompanyName' => '',
			'publishingEntityCompanyLogo' => '',
		);

		$expected = array(
			'publishingEntityType'        => true,
			'publishingEntityPersonName'  => true,
			'publishingEntityCompanyName' => true,
			'publishingEntityCompanyLogo' => true,
		);

		$result = $this->component->set_data( $input );

		$this->assertEquals( $expected, $result );
	}

	/**
	 * @covers WPSEO_Config_Component_Publishing_Entity::set_data()
	 */
	public function test_set_data_no_changes() {

		$values = array(
			'company_or_person' => 'company',
			'person_name'       => '',
			'company_name'      => 'c',
			'company_logo'      => 'http://d',
		);

		$input = WPSEO_Options::get_option( 'wpseo' );

		$input = array_merge(
			$input,
			$values
		);

		update_option( 'wpseo', $input );

		$data = array(
			'publishingEntityType'        => 'company',
			'publishingEntityPersonName'  => '',
			'publishingEntityCompanyName' => 'c',
			'publishingEntityCompanyLogo' => 'http://d',
		);

		$expected = array(
			'publishingEntityType'        => true,
			'publishingEntityPersonName'  => true,
			'publishingEntityCompanyName' => true,
			'publishingEntityCompanyLogo' => true,
		);

		$result = $this->component->set_data( $data );

		$this->assertEquals( $expected, $result );
	}
}