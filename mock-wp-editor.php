<?php
/**
 * Mock WP page to render our standalone UI
 */
require_once __DIR__ . '/admin/ui/editor-panel.php';
?>
<!DOCTYPE html>
<html>
<head>
    <title>GEO Editor Mock UI</title>
    <style>
        body { font-family: sans-serif; padding: 20px; background: #f0f0f1; }
        .editor-mock { display: flex; gap: 20px; }
        .editor-content { flex: 1; background: #fff; padding: 20px; border: 1px solid #ddd; }
        .editor-sidebar { width: 300px; }
        textarea { width: 100%; height: 300px; margin-bottom: 10px; padding: 10px; }
    </style>
</head>
<body>

    <div class="editor-mock">
        <div class="editor-content">
            <h2>Mock WordPress Editor</h2>
            <textarea id="mock-editor-content">
<h2>What is Generative Engine Optimization?</h2>
<p>Generative Engine Optimization (GEO) is the process of optimizing content to rank highly in AI-generated answers and summaries provided by engines like Google SGE, ChatGPT, or Claude. It involves clear structure and facts.</p>
<h3>Core Concepts</h3>
<ul>
    <li>Entity density</li>
    <li>Direct answers</li>
    <li>Structured data</li>
</ul>
<p>In New York and San Francisco, GEO is becoming the new standard. Many agencies are pivoting from traditional SEO to GEO.</p>
            </textarea>
            <button id="mock-update-btn">Trigger Update</button>
        </div>

        <div class="editor-sidebar">
            <?php
            // Render the base panel
            $panel = new \GEO\Admin\UI\Editor_Panel();
            $panel->render();
            ?>
        </div>
    </div>

    <script>
        // Mock WordPress Data store and setup
        window.wp = {
            data: {
                listeners: [],
                subscribe: function(callback) {
                    this.listeners.push(callback);
                },
                select: function() {
                    return {
                        isSavingPost: () => false,
                        isAutosavingPost: () => false,
                        getEditedPostContent: () => document.getElementById('mock-editor-content').value
                    };
                },
                triggerUpdate: function() {
                    this.listeners.forEach(cb => cb());
                }
            }
        };

        // Mock Rest API Server via PHP built-in server script
        window.geoData = {
            apiUrl: '/mock-api.php',
            nonce: 'mock-nonce'
        };

        document.getElementById('mock-update-btn').addEventListener('click', () => {
            window.wp.data.triggerUpdate();
        });

    </script>
    <script src="admin/ui/geo-editor.js"></script>

</body>
</html>
