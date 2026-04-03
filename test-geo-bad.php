<?php
require_once 'geo/entity-extractor.php';
require_once 'geo/scoring.php';
require_once 'geo/suggestions.php';
require_once 'geo/geo-engine.php';

use GEO\Engine\Entity_Extractor;
use GEO\Engine\Scoring;
use GEO\Engine\Suggestions;
use GEO\Engine\GEO_Engine;

$html_bad = <<<HTML
<p>We wanted to talk to you today about something cool. Have you ever wondered about how machines learn? Well, sometimes they read things. I think it is important because we all use computers now, right? Anyway, let's keep going.</p>
<p>There are many things to consider. First, you have to think about the data. Data is everywhere. Then you have to think about the algorithms. Algorithms are also everywhere. This is a very long paragraph that just keeps going and going and doesn't really say much of anything useful at all but it is definitely long enough to be considered a paragraph that is too long for an AI to easily parse and summarize in a quick snippet format without doing a lot of extra work, which it might not want to do, so it might just skip this content entirely in favor of something that is more concise and to the point.</p>
HTML;

$extractor = new Entity_Extractor();
$scorer = new Scoring();
$suggester = new Suggestions();

$engine = new GEO_Engine($extractor, $scorer, $suggester);

$start = microtime(true);
$result = $engine->analyze($html_bad);
$end = microtime(true);

$time_ms = round(($end - $start) * 1000, 2);

echo "Execution time (Bad HTML): {$time_ms} ms\n\n";
echo json_encode($result, JSON_PRETTY_PRINT);
echo "\n";
