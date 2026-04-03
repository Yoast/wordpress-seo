<?php
namespace GEO\Engine;

class Summarizer {
    public function generate($content, $entities = []) {
        $text = strip_tags($content);
        $sentences = preg_split('/[.!?]/', $text, -1, PREG_SPLIT_NO_EMPTY);

        $main_topic = !empty($entities) ? $entities[0] : 'This topic';

        if (empty($sentences)) {
            return "No content available to summarize.";
        }

        // Simple MVP summarization: grab the first 2 meaningful sentences
        $summary_sentences = [];
        foreach ($sentences as $s) {
            $s = trim($s);
            if (strlen($s) > 20) {
                $summary_sentences[] = $s;
            }
            if (count($summary_sentences) >= 2) {
                break;
            }
        }

        if (empty($summary_sentences)) {
             return "No content available to summarize.";
        }

        $summary = implode('. ', $summary_sentences) . '.';

        // If the summary doesn't mention the main topic, try to prepend it contextually
        if (stripos($summary, $main_topic) === false && $main_topic !== 'This topic') {
            return "Regarding $main_topic: " . $summary;
        }

        return $summary;
    }
}
