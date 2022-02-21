<?php

namespace Yoast\WP\SEO\Config;

use WordProof\SDK\Config\AppConfigInterface;

class WordProofAppConfig implements AppConfigInterface
{
    public function getPartner()
    {
        return 'yoast';
    }

    public function getEnvironment()
    {
        return 'staging';
    }
}
