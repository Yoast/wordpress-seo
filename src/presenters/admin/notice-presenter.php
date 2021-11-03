<?php

namespace Yoast\WP\SEO\Presenters\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Represents the presenter class for Yoast-styled WordPress admin notices.
 */
class Notice_Presenter extends Abstract_Presenter {

	/**
	 * The title of the admin notice.
	 *
	 * @var string
	 */
	private $title;

	/**
	 * The content of the admin notice.
	 *
	 * @var string
	 */
	private $content;

	/**
	 * An instance of the WPSEO_Admin_Asset_Manager class.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Notice_Presenter constructor.
	 *
	 * @param string $title   Title of the Notice.
	 * @param string $content Content of the Notice.
	 */
	public function __construct( $title, $content ) {
		$this->title   = $title;
		$this->content = $content;

		if ( ! $this->asset_manager ) {
			$this->asset_manager = new WPSEO_Admin_Asset_Manager();
		}

		$this->asset_manager->enqueue_style( 'notifications' );
	}

	/**
	 * Presents the Notice.
	 *
	 * @return string The styled Notice.
	 */
	public function present() {
		// WordPress admin notice.
		$out  = '<div class="notice notice-yoast">';
		$out .= '<div class="notice-yoast__container">';

		// Header.
		$out .= '<div class="notice-yoast__header">';
		$out .= '<span class="yoast-icon"></span>';
		$out .= \sprintf(
			'<h1 class="notice-yoast__header-heading">%s</h1>',
			\esc_html( $this->title )
		);
		$out .= '</div>';

		// Content.
		$out .= '<div class="notice-yoast__content">';
		$out .= '<p>' . $this->content . '</p>';
		$out .= '<img src="' . \esc_url( plugin_dir_url( WPSEO_FILE ) . 'images/Assistent_Time_bubble_500x570.png' ) . '" alt="" />';
		$out .= '</div>';

		$out .= '</div>';
		$out .= '</div>';

		return $out;
	}
}
