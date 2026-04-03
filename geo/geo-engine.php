<?php
namespace GEO\Engine;

class GEO_Engine {
    private $extractor;
    private $scorer;

    public function __construct(Entity_Extractor $extractor, Scoring $scorer) {
        $this->extractor = $extractor;
        $this->scorer = $scorer;
    }

    public function analyze($content) {
        // Run full GEO analysis
        $entities = $this->extractor->extract($content);
        $score = $this->scorer->calculate($content, $entities);

        return [
            'score' => $score,
            'entities' => $entities
        ];
    }
}
