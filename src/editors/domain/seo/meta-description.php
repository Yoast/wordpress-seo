<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Editors\Domain\Seo;

/**
 * This class describes the meta description SEO data.
 */
class Meta_Description implements Seo_Plugin_Data_Interface {

	/**
	 * The formatted meta description date.
	 *
	 * @var string $meta_description_date
	 */
	private $meta_description_date;

	/**
	 * The meta description template.
	 *
	 * @var string $meta_description_template
	 */
	private $meta_description_template;

	/**
	 * The constructor.
	 *
	 * @param string $meta_description_date     The meta description date.
	 * @param string $meta_description_template The meta description template.
	 */
	public function __construct( string $meta_description_date, string $meta_description_template ) {
		$this->meta_description_date     = $meta_description_date;
		$this->meta_description_template = $meta_description_template;
	}

	/**
	 * Returns the data as an array format.
	 *
	 * @return array<string>
	 */
	public function to_array(): array {
		return [
			'meta_description_template' => $this->meta_description_template,
			'meta_description_date'     => $this->meta_description_date,
		];
	}

	/**
	 * Returns the data as an array format meant for legacy use.
	 *
	 * @return array<string>
	 */
	public function to_legacy_array(): array {
		return [
			'metadesc_template'   => $this->meta_description_template,
			'metaDescriptionDate' => $this->meta_description_date,
		];
	}
}
