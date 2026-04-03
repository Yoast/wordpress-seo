<?php
namespace GEO\Services;

class AI_Provider {
    private $api_key;

    public function __construct($api_key) {
        $this->api_key = $api_key;
    }

    public function generate_qa($content) {
        // Calls OpenAI/Claude to generate Q&A
        return [];
    }
}
