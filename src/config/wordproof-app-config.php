<?php

namespace Yoast\WP\SEO\Config;

use WordProof\SDK\Config\DefaultAppConfig;

class WordProofAppConfig extends DefaultAppConfig
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
