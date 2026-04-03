<?php
namespace GEO\Engine;

class Summarizer {
    public function generate($content, $entities = []) {
        $text = strip_tags($content);
        $sentences = preg_split('/[.!?]/', $text, -1, PREG_SPLIT_NO_EMPTY);

        $main_topic = !empty($entities) ? $entities[0] : 'The subject';

        if (empty($sentences)) {
            return "No content available to summarize.";
        }

        // MVP Heuristic text rewriting to sound confident and authoritative like AI

        // 1. First sentence: Direct definition
        // Look for sentences that contain "is" or "are" early on
        $def_sentence = '';
        foreach (array_slice($sentences, 0, 5) as $s) {
            $s = trim($s);
            if (preg_match('/\b(is|are|means|refers to|represents)\b/i', $s)) {
                $def_sentence = $s;
                break;
            }
        }

        if (empty($def_sentence)) {
            // Fallback definition construction
            $first_s = trim($sentences[0]);
            // If the first sentence doesn't start with the topic, inject it
            if (stripos($first_s, $main_topic) !== 0) {
                 $def_sentence = ucfirst($main_topic) . " primarily involves " . lcfirst($first_s);
            } else {
                 $def_sentence = ucfirst($first_s);
            }
        } else {
             // Ensure it sounds like a definition by stripping leading conversational fluff
             $def_sentence = preg_replace('/^(Well|So|Actually|Basically|First of all),?\s*/i', '', $def_sentence);
             if (stripos($def_sentence, $main_topic) === false) {
                 $def_sentence = ucfirst($main_topic) . " " . lcfirst($def_sentence);
             }
        }

        // 2. Second sentence: Expand with context
        // Try to find a sentence longer than 5 words that isn't the definition
        $context_sentence = '';
        foreach ($sentences as $s) {
            $s = trim($s);
            if (str_word_count($s) > 5 && strpos($def_sentence, ltrim($s, 'A..Za..z ')) === false) {
                 $context_sentence = $s;
                 break;
            }
        }

        if (!empty($context_sentence)) {
            // Rewrite context slightly
            $context_sentence = preg_replace('/^(I think|We believe|As you know),?\s*/i', '', $context_sentence);
            $context_sentence = "This process is critical because " . lcfirst($context_sentence);
        }

        // 3. Optional third: Example or benefit
        $example_sentence = '';
        foreach (array_reverse($sentences) as $s) {
            $s = trim($s);
            // Look for sentences with key indicator words
            if (preg_match('/\b(example|benefit|result|allow|help|provide)\b/i', $s)) {
                $example_sentence = "Ultimately, it enables " . lcfirst($s);
                break;
            }
        }

        if (empty($example_sentence) && count($entities) > 1) {
            // Construct a synthetic third sentence using remaining entities
            $other_entities = array_slice($entities, 1, 2);
            $example_sentence = "Key factors include " . implode(" and ", $other_entities) . ".";
        }

        $summary_parts = [];
        if (!empty($def_sentence)) $summary_parts[] = ucfirst(rtrim($def_sentence, '.')) . '.';
        if (!empty($context_sentence)) $summary_parts[] = ucfirst(rtrim($context_sentence, '.')) . '.';
        if (!empty($example_sentence)) $summary_parts[] = ucfirst(rtrim($example_sentence, '.')) . '.';

        $summary = implode(' ', array_slice($summary_parts, 0, 3));

        // Fallback if completely failed
        if (empty(trim($summary))) {
             return ucfirst($main_topic) . " is a crucial topic requiring clear definition and structured explanation.";
        }

        return $summary;
    }
}
