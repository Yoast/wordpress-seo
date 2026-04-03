/**
 * GEO Editor Integration
 * Lightweight Vanilla JS UI for real-time GEO scoring in Gutenberg and Classic Editor
 */

document.addEventListener('DOMContentLoaded', () => {
    let timeoutId;
    let lastContent = '';
    let cachedResult = null;

    const panelContainer = document.getElementById('geo-editor-panel');
    if (!panelContainer) return;

    // Build UI layout safely without innerHTML for dynamic user content
    panelContainer.innerHTML = `
        <div class="geo-panel-inner" style="padding: 15px; border: 1px solid #ddd; background: #fff;">
            <h2 style="margin-top: 0;">GEO Engine Optimization</h2>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
                <div style="font-size: 24px; font-weight: bold;">
                    Score: <span id="geo-score-value">--</span>/100
                </div>
                <span id="geo-loading-indicator" style="display: none; color: #888;">Analyzing...</span>
            </div>

            <div style="margin-bottom: 15px;">
                <h4 style="margin-bottom: 5px;">Suggestions</h4>
                <ul id="geo-suggestions-list" style="margin: 0; padding-left: 20px; color: #d63638;">
                    <li>Waiting for content...</li>
                </ul>
            </div>

            <div style="margin-bottom: 15px; background: #f0f0f1; padding: 10px; border-radius: 4px;">
                <h4 style="margin-top: 0; margin-bottom: 5px;">AI Answer Preview</h4>
                <p id="geo-ai-preview" style="margin: 0; font-style: italic; color: #3c434a;">Waiting for content...</p>
            </div>

            <button id="geo-optimize-btn" class="button button-primary">Optimize for AI</button>
        </div>
    `;

    const scoreValue = document.getElementById('geo-score-value');
    const loadingIndicator = document.getElementById('geo-loading-indicator');
    const suggestionsList = document.getElementById('geo-suggestions-list');
    const aiPreview = document.getElementById('geo-ai-preview');
    const optimizeBtn = document.getElementById('geo-optimize-btn');

    // Button simulation
    optimizeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        optimizeBtn.innerText = "Optimizing...";
        optimizeBtn.disabled = true;

        setTimeout(() => {
            alert("AI Optimization simulated! Content would be rewritten here.");
            optimizeBtn.innerText = "Optimize for AI";
            optimizeBtn.disabled = false;
        }, 1000);
    });

    // Debounced content analysis
    const analyzeContent = (content) => {
        if (content === lastContent && cachedResult) {
            updateUI(cachedResult);
            return;
        }

        lastContent = content;
        loadingIndicator.style.display = 'inline';

        fetch(geoData.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': geoData.nonce
            },
            body: JSON.stringify({
                content: content,
                post_id: parseInt(geoData.postId, 10)
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.code && data.message) {
                // Handle WP_Error response
                throw new Error(data.message);
            }
            cachedResult = data;
            updateUI(data);
        })
        .catch(err => {
            console.error('GEO Engine Error:', err);
            suggestionsList.innerHTML = '<li>Error loading analysis. Check console for details.</li>';
        })
        .finally(() => {
            loadingIndicator.style.display = 'none';
        });
    };

    const updateUI = (data) => {
        // Update Score
        scoreValue.innerText = data.score;
        scoreValue.style.color = data.score >= 80 ? '#00a32a' : (data.score >= 50 ? '#dba617' : '#d63638');

        // Update Suggestions (Top 3 max) safely
        suggestionsList.innerHTML = '';
        if (data.suggestions && data.suggestions.length > 0) {
            const top3 = data.suggestions.slice(0, 3);
            top3.forEach(s => {
                const li = document.createElement('li');
                li.innerText = s; // Use innerText to prevent XSS
                suggestionsList.appendChild(li);
            });
            suggestionsList.style.color = '#d63638';
        } else {
            suggestionsList.innerHTML = '<li>Looking good! No suggestions right now.</li>';
            suggestionsList.style.color = '#00a32a';
        }

        // Update AI Answer
        if (data.ai_answer) {
            aiPreview.innerText = data.ai_answer; // Use innerText to prevent XSS
        } else {
            aiPreview.innerText = 'Not enough content to generate preview.';
        }
    };

    const triggerDebouncedAnalysis = (content) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            analyzeContent(content);
        }, 2000); // 2 second debounce
    };

    // --- Editor Compatibility Hooks ---

    if (typeof wp !== 'undefined' && wp.data && wp.data.select('core/editor')) {
        // Gutenberg Integration
        wp.data.subscribe(() => {
            const editor = wp.data.select('core/editor');
            const isSavingPost = editor.isSavingPost();
            const isAutosavingPost = editor.isAutosavingPost();

            // Skip analysis while saving
            if (isSavingPost || isAutosavingPost) return;

            triggerDebouncedAnalysis(editor.getEditedPostContent());
        });

        // Initial analysis
        setTimeout(() => {
            triggerDebouncedAnalysis(wp.data.select('core/editor').getEditedPostContent());
        }, 1000);

    } else {
        // Classic Editor Integration Fallback

        // Try TinyMCE first
        if (typeof tinymce !== 'undefined') {
            tinymce.on('AddEditor', function(e) {
                e.editor.on('change keyup', function() {
                    triggerDebouncedAnalysis(e.editor.getContent());
                });
            });

            setTimeout(() => {
                const activeEditor = tinymce.activeEditor;
                if (activeEditor && !activeEditor.isHidden()) {
                    triggerDebouncedAnalysis(activeEditor.getContent());
                }
            }, 1000);
        }

        // Fallback to raw textarea (Text mode)
        const contentTextArea = document.getElementById('content');
        if (contentTextArea) {
            contentTextArea.addEventListener('input', (e) => {
                triggerDebouncedAnalysis(e.target.value);
            });

            // Initial analysis if no tinymce
            if (typeof tinymce === 'undefined' || (tinymce.activeEditor && tinymce.activeEditor.isHidden())) {
                setTimeout(() => {
                    triggerDebouncedAnalysis(contentTextArea.value);
                }, 1000);
            }
        }
    }
});
