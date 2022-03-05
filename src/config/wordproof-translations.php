<?php

namespace Yoast\WP\SEO\Config;

use WordProof\SDK\Translations\TranslationsInterface;

class WordProofTranslations implements TranslationsInterface
{
	public function getNoBalanceNotice()
	{
		/* translators: %s expands to WordProof. */
		return sprintf(__('You are out of timestamps. Please upgrade your account by opening the %s settings.', 'wordpress-seo'), 'WordProof');
	}

	public function getTimestampSuccessNotice()
	{
		/* translators: %s expands to WordProof. */
		return sprintf(__('%s has successfully timestamped this page.', 'wordpress-seo'), 'WordProof');
	}

	public function getTimestampFailedNotice()
	{
		/* translators: %s expands to WordProof. */
		return sprintf(__('%1$s failed to timestamp this page. Please check if you\'re correctly authenticated with %1$s and try to save this page again.', 'wordpress-seo'), 'WordProof');
	}

	public function getWebhookFailedNotice()
	{
		/* translators: %s expands to WordProof. */
		return sprintf(__('The timestamp is not retrieved by your site. Please try again or contact %1$s support.', 'wordpress-seo'), 'WordProof');
	}

	public function getNotAuthenticatedNotice()
	{
		/* translators: %s expands to WordProof. */
		return sprintf(__('The timestamp is not created because you need to authenticate with %s first.', 'wordpress-seo'), 'WordProof');
	}
}
