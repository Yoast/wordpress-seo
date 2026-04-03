<?php
/**
 * Mock API Endpoint to route requests to our real GEO Engine code
 */
require_once __DIR__ . '/geo/entity-extractor.php';
require_once __DIR__ . '/geo/scoring.php';
require_once __DIR__ . '/geo/suggestions.php';
require_once __DIR__ . '/geo/summarizer.php';
require_once __DIR__ . '/geo/geo-engine.php';

use GEO\Engine\Entity_Extractor;
use GEO\Engine\Scoring;
use GEO\Engine\Suggestions;
use GEO\Engine\Summarizer;
use GEO\Engine\GEO_Engine;

header('Content-Type: application/json');

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

$content = $input['content'] ?? '';

$extractor = new Entity_Extractor();
$scorer = new Scoring();
$suggester = new Suggestions();
$summarizer = new Summarizer();

$engine = new GEO_Engine($extractor, $scorer, $suggester, $summarizer);
$result = $engine->analyze($content);

echo json_encode($result);
