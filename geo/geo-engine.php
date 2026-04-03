<?php
namespace GEO\Engine;

class GEO_Engine {
    private $extractor;
    private $scorer;
    private $suggester;

    public function __construct(Entity_Extractor $extractor, Scoring $scorer, Suggestions $suggester) {
        $this->extractor = $extractor;
        $this->scorer = $scorer;
        $this->suggester = $suggester;
    }

    public function analyze($content) {
        // Run full GEO analysis
        $entities = $this->extractor->extract($content);
        $scoring_result = $this->scorer->calculate($content, $entities);
        $suggestions = $this->suggester->generate($scoring_result['breakdown']);

        return [
            'score' => $scoring_result['total'],
            'breakdown' => $scoring_result['breakdown'],
            'suggestions' => $suggestions
        ];
    }
}
