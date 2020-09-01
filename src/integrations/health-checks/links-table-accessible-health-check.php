<?php

namespace Yoast\WP\SEO\Integrations\Health_Checks;

use WPSEO_Admin_Utils;
use WPSEO_Shortlinker;
use Yoast\WP\SEO\Config\Migration_Status;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Represents the health check when the links table is not accessible.
 */
class Links_Table_Accessible_Health_Check extends Abstract_Health_Check {

	/**
	 * The name of the test.
	 *
	 * @var string
	 */
	protected $test = 'yoast-health-check-links-table-not-accessible';

	/**
	 * The migration status object.
	 *
	 * @var Migration_Status
	 */
	protected $migration_status;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Constructor.
	 *
	 * @param Migration_Status $migration_status The migration status object.
	 * @param Options_Helper   $options_helper   The options helper.
	 */
	public function __construct(
		Migration_Status $migration_status,
		Options_Helper $options_helper
	) {
		$this->migration_status = $migration_status;
		$this->options_helper   = $options_helper;
	}

	/**
	 * Runs the test.
	 */
	public function run() {
		if ( ! $this->is_text_link_counter_enabled() ) {
			return;
		}

		if ( $this->migration_status->is_version( 'free', WPSEO_VERSION ) ) {
			$this->label          = \esc_html__( 'The text link counter is working as expected', 'wordpress-seo' );
			$this->status         = self::STATUS_GOOD;
			$this->badge['color'] = 'blue';
			$this->description    = \sprintf(
				/* translators: 1: Link to the Yoast SEO blog, 2: Link closing tag. */
				\esc_html__( 'The text link counter helps you improve your site structure. %1$sFind out how the text link counter can enhance your SEO%2$s.', 'wordpress-seo' ),
				'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/3zw' ) . '" target="_blank">',
				WPSEO_Admin_Utils::get_new_tab_message() . '</a>'
			);

			return;
		}

		$this->label          = \esc_html__( 'The text link counter feature is not working as expected', 'wordpress-seo' );
		$this->status         = self::STATUS_RECOMMENDED;
		$this->badge['color'] = 'red';

		$this->description = \sprintf(
			/* translators: 1: Yoast SEO. */
			\esc_html__( 'For this feature to work, %1$s needs to create a table in your database. We were unable to create this table automatically.', 'wordpress-seo' ),
			'Yoast SEO'
		);

		$this->actions = \sprintf(
			/* translators: 1: Link to the Yoast knowledge base, 2: Link closing tag. */
			\esc_html__( '%1$sFind out how to solve this problem on our knowledge base%2$s.', 'wordpress-seo' ),
			'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/3zv' ) . '" target="_blank">',
			WPSEO_Admin_Utils::get_new_tab_message() . '</a>'
		);
	}

	/**
	 * Checks whether the text link counter feature is enabled.
	 *
	 * @return bool Whether the text link counter feature is enabled.
	 */
	protected function is_text_link_counter_enabled() {
		return $this->options_helper->get( 'enable_text_link_counter' );
	}
}
