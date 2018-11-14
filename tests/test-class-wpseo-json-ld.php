<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Class WPSEO_JSON_LD_Test
 */
class WPSEO_JSON_LD_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_JSON_LD
	 */
	private static $class_instance;

	/**
	 * Instantiate our class
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();
		self::$class_instance = new WPSEO_JSON_LD();
	}

	/**
	 * Tear down after each test.
	 */
	public function tearDown() {
		parent::tearDown();

		self::$class_instance = new WPSEO_JSON_LD();
	}

	/**
	 * @covers WPSEO_JSON_LD::website
	 */
	public function test_website() {
		$this->go_to_home();

		$home_url   = WPSEO_Utils::home_url();
		$search_url = $home_url . '?s={search_term_string}';

		$json       = self::$class_instance->format_data( array(
			'@context'        => 'https://schema.org',
			'@type'           => 'WebSite',
			'@id'             => $home_url . '#website',
			'url'             => $home_url,
			'name'            => get_bloginfo( 'name' ),
			'potentialAction' => array(
				'@type'       => 'SearchAction',
				'target'      => $search_url,
				'query-input' => 'required name=search_term_string',
			),
		) );

		$expected = '<script type=\'application/ld+json\'>' . $json . '</script>' . "\n";

		$this->expectOutput( $expected, self::$class_instance->website() );
	}

	/**
	 * @covers WPSEO_JSON_LD::organization_or_person
	 *
	 * Test having person markup and one social profile
	 */
	public function test_person() {
		$name      = 'Joost de Valk';
		$instagram = 'http://instagram.com/yoast';
		WPSEO_Options::set( 'company_or_person', 'person' );
		WPSEO_Options::set( 'person_name', $name );
		WPSEO_Options::set( 'instagram_url', $instagram );

		$this->go_to_home();

		$home_url = WPSEO_Utils::home_url();

		$json = self::$class_instance->format_data( array(
			'@context' => 'https://schema.org',
			'@type'    => 'Person',
			'url'      => $home_url,
			'sameAs'   => array( $instagram ),
			'@id'      => '#person',
			'name'     => $name,
		) );

		$expected = '<script type=\'application/ld+json\'>' . $json . '</script>' . "\n";
		self::$class_instance->organization_or_person();

		$this->expectOutput( $expected );
	}

	/**
	 * Tests having bad input.
	 *
	 * @covers WPSEO_JSON_LD::organization_or_person()
	 */
	public function test_bad_input() {
		$name     = 'Joost "Yoast":"de Valk"';
		$home_url = WPSEO_Utils::home_url();

		WPSEO_Options::set( 'company_or_person', 'person' );
		WPSEO_Options::set( 'person_name', $name );
		WPSEO_Options::set( 'instagram_url', 'http://instagram.com:8080/{}yoast' );

		$json = self::$class_instance->format_data( array(
			'@context' => 'https://schema.org',
			'@type'    => 'Person',
			'url'      => $home_url,
			'sameAs'   => array( 'http://instagram.com:8080/yoast' ),
			// The {} will be stripped out by saving the option.
			'@id'      => '#person',
			'name'     => $name,
		) );

		$expected = '<script type=\'application/ld+json\'>' . $json . '</script>' . "\n";

		self::$class_instance->organization_or_person();
		$this->expectOutput( $expected );
	}

	/**
	 * @covers WPSEO_JSON_LD::organization_or_person
	 *
	 * Test having organization markup and two social profiles
	 */
	public function test_organization() {
		$name      = 'Yoast';
		$facebook  = 'https://www.facebook.com/Yoast';
		$instagram = 'http://instagram.com/yoast';
		WPSEO_Options::set( 'company_or_person', 'company' );
		WPSEO_Options::set( 'company_name', $name );
		WPSEO_Options::set( 'facebook_site', $facebook );
		WPSEO_Options::set( 'instagram_url', $instagram );

		$this->go_to_home();

		$home_url = WPSEO_Utils::home_url();

		$json = self::$class_instance->format_data( array(
			'@context' => 'https://schema.org',
			'@type'    => 'Organization',
			'url'      => $home_url,
			'sameAs'   => array( $facebook, $instagram ),
			'@id'      => $home_url . '#organization',
			'name'     => $name,
			'logo'     => '',
		) );

		$expected = '<script type=\'application/ld+json\'>' . $json . '</script>' . "\n";

		$this->expectOutput( $expected, self::$class_instance->organization_or_person() );
	}
}
