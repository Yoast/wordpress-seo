<?php
namespace GEO\Models;

class Analysis_Result {
    public $score;
    public $suggestions;
    public $entities;

    public function __construct($score, $suggestions, $entities) {
        $this->score = $score;
        $this->suggestions = $suggestions;
        $this->entities = $entities;
    }
}
