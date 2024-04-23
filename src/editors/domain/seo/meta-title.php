<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Editors\Domain\Seo;

/**
 * This class describes the meta title SEO data.
 */
class Meta_Title implements Seo_Plugin_Data_Interface {

	/**
	 * The meta title template.
	 *
	 * @var string $meta_title_template
	 */
	private $meta_title_template;

	/**
	 * The meta title template without the fallback.
	 *
	 * @var string $meta_title_template_no_fallback
	 */
	private $meta_title_template_no_fallback;

	/**
	 * The constructor.
	 *
	 * @param string $meta_title_template             The meta title template.
	 * @param string $meta_title_template_no_fallback The meta title template without the fallback.
	 */
	public function __construct( string $meta_title_template, string $meta_title_template_no_fallback ) {
		$this->meta_title_template             = $meta_title_template;
		$this->meta_title_template_no_fallback = $meta_title_template_no_fallback;
	}

	/**
	 * Returns the data as an array format.
	 *
	 * @return array<string>
	 */
	public function to_array(): array {
		return [
			'title_template'             => $this->meta_title_template,
			'title_template_no_fallback' => $this->meta_title_template_no_fallback,
		];
	}

	/**
	 * Returns the data as an array format meant for legacy use.
	 *
	 * @return array<string>
	 */
	public function to_legacy_array(): array {
		return [
			'title_template'             => $this->meta_title_template,
			'title_template_no_fallback' => $this->meta_title_template_no_fallback,
		];
	}
}
