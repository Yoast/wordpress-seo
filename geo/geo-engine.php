<?php
namespace GEO\Engine;

class GEO_Engine {
    private $extractor;
    private $scorer;
    private $suggester;
    private $summarizer;

    public function __construct(Entity_Extractor $extractor, Scoring $scorer, Suggestions $suggester, Summarizer $summarizer) {
        $this->extractor = $extractor;
        $this->scorer = $scorer;
        $this->suggester = $suggester;
        $this->summarizer = $summarizer;
    }

    public function analyze($content) {
        // Run full GEO analysis
        $entities = $this->extractor->extract($content);
        $scoring_result = $this->scorer->calculate($content, $entities);

        $main_topic = !empty($entities) ? $entities[0] : 'your main topic';

        $suggestions = $this->suggester->generate($scoring_result['breakdown'], $content, $entities, $main_topic);
        $ai_answer = $this->summarizer->generate($content, $entities);

        return [
            'score' => $scoring_result['total'],
            'breakdown' => $scoring_result['breakdown'],
            'suggestions' => $suggestions,
            'ai_answer' => $ai_answer
        ];
    }
}
