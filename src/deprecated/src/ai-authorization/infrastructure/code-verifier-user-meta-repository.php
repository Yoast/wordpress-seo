<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI_Authorization\Infrastructure;

use RuntimeException;
use Yoast\WP\SEO\AI_Authorization\Domain\Code_Verifier;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
/**
 * Class Code_Verifier_Repository
 *
 * @deprecated 26.2
 * @codeCoverageIgnore
 */
class Code_Verifier_User_Meta_Repository implements Code_Verifier_User_Meta_Repository_Interface {

	private const CODE_VERIFIER_VALIDITY = 300; // 5 minutes

	/**
	 * The date helper.
	 *
	 * @var Date_Helper
	 */
	private $date_helper;

	/**
	 * The user helper.
	 *
	 * @var User_Helper
	 */
	private $user_helper;

	/**
	 * Code_Verifier_Repository constructor.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param Date_Helper $date_helper The date helper.
	 * @param User_Helper $user_helper The user helper.
	 */
	public function __construct( Date_Helper $date_helper, User_Helper $user_helper ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Authorization\Infrastructure\Code_Verifier_User_Meta_Repository::__construct' );
	}

	/**
	 * Store the verification code for a user.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param int    $user_id    The user ID.
	 * @param string $code       The code verifier.
	 * @param int    $created_at The time the code was created.
	 *
	 * @return void
	 */
	public function store_code_verifier( int $user_id, string $code, int $created_at ): void {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Authorization\Infrastructure\Code_Verifier_User_Meta_Repository::store_code_verifier' );
	}

	/**
	 * Get the verification code for a user.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param int $user_id The user ID.
	 *
	 * @throws RuntimeException If the code verifier is not found or has expired.
	 * @return Code_Verifier The verification code or null if not found.
	 */
	public function get_code_verifier( int $user_id ): ?Code_Verifier {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Authorization\Infrastructure\Code_Verifier_User_Meta_Repository::get_code_verifier' );

		return null;
	}

	/**
	 * Delete the verification code for a user.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return void
	 */
	public function delete_code_verifier( int $user_id ): void {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Authorization\Infrastructure\Code_Verifier_User_Meta_Repository::delete_code_verifier' );
	}
}
