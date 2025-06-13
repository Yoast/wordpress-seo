<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Llms_Txt\Application\File;

use WPSEO_Shortlinker;
use Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Populate_File_Command_Handler;
use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Class File_Failure_Notification_Presenter.
 */
class File_Failure_Notification_Presenter extends Abstract_Presenter {

	/**
	 * Returns the notification as an HTML string.
	 *
	 * @return string The notification in an HTML string representation.
	 */
	public function present() {
		$notification_text  = '<p>';
		$notification_text .= $this->get_message();
		$notification_text .= '</p>';

		return $notification_text;
	}

	/**
	 * Returns the message to show.
	 *
	 * @return string The message.
	 */
	protected function get_message() {
		$reason = \get_option( Populate_File_Command_Handler::GENERATION_FAILURE_OPTION, false );
		switch ( $reason ) {
			case 'not_managed_by_yoast_seo':
				$message = \sprintf(
				/* translators: 1: Link start tag to the WordPress Reading Settings page, 2: Link closing tag. */
					\esc_html__( 'It looks like there is an llms.txt file already that wasn\'t created by Yoast, or the llms.txt file created by Yoast has been edited manually. We don\'t want to overwrite this file\'s content, so if you want to let Yoast keep auto-generating the llms.txt file, you can %1$smanually delete the existing one%2$s. Otherwise, consider disabling the Yoast feature.', 'wordpress-seo' ),
					'<a href="' . \esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/llms-txt-file-deletion' ) ) . '">',
					'</a>'
				);
				break;
			case 'filesystem_permissions':
				$message =
					\__( 'You have activated the Yoast llms.txt feature, but we couldn\'t generate an llms.txt file. It looks like there aren\'t sufficient permissions on the web server\'s filesystem.', 'wordpress-seo' );
				break;
			default:
				$message = \__( 'You have activated the Yoast llms.txt feature, but we couldn\'t generate an llms.txt file, for unknown reasons.', 'wordpress-seo' );
				break;
		}

		return \sprintf(
			'<strong>%1$s</strong> %2$s',
			\esc_html__( 'Your llms.txt file couldn\'t be auto-generated', 'wordpress-seo' ),
			$message
		);
	}
}
