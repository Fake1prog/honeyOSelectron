document.addEventListener("DOMContentLoaded", function () {
    // Simulate a delay for the splash screen
    setTimeout(function () {
        // Get the splash screen element
        const splashScreen = document.getElementById("splash-screen");

        // Start the fade out effect
        splashScreen.style.transition = "opacity 1s ease-out";
        splashScreen.style.opacity = 0;

        // Wait for the transition to finish, then redirect
        setTimeout(function () {
            window.location.href = "index2.html";
        }, 1000); // Adjust the delay for the transition (in milliseconds) as needed
    }, 10000); // Adjust the delay for the splash screen (in milliseconds) as needed

    const newFileHexagon = document.querySelector('.hexagon-wrapper:nth-child(1) .hexagon');
    const openFileHexagon = document.querySelector('.hexagon-wrapper:nth-child(2) .hexagon');
    const saveFileHexagon = document.querySelector('.hexagon-wrapper:nth-child(3) .hexagon');
    const closeFileHexagon = document.querySelector('.hexagon-wrapper:nth-child(4) .hexagon');

    let codeEditor;
    let currentFileHandle;
    let isFileSaved = true;

    newFileHexagon.addEventListener('click', function() {
        if (!isFileSaved) {
            alert('Please save or discard changes in the current file before creating a new file.');
            return;
        }
        // Check if the code editor already exists
        const existingEditor = document.getElementById('code-editor');
        if (existingEditor) {
            // If the code editor exists, clear its contents
            existingEditor.value = '';
            existingEditor.style.backgroundColor = 'lightgray';
            currentFileHandle = null;
        } else {
            // If the code editor doesn't exist, create it
            const editorContainer = document.createElement('div');
            editorContainer.className = 'editor-container';

            codeEditor = document.createElement('textarea');
            codeEditor.id = 'code-editor';
            codeEditor.style.backgroundColor = 'lightgray';

            const closeButton = document.createElement('button');
            closeButton.id = 'close-editor';
            closeButton.textContent = 'Close';
            closeButton.addEventListener('click', function() {
                closeCodeEditor();
            });

            editorContainer.appendChild(codeEditor);
            editorContainer.appendChild(closeButton);
            document.body.appendChild(editorContainer);
        }

        // Add the event listener after creating the code editor
        codeEditor.addEventListener('input', function() {
            if (currentFileHandle) {
                codeEditor.style.backgroundColor = 'lightgray';
            }
        });
        isFileSaved = false;
    });

    openFileHexagon.addEventListener('click', async function() {
        if (!isFileSaved) {
            const confirmOpen = confirm('Are you sure you want to open a new file without saving the current file?');
            if (!confirmOpen) {
                // User clicked "Cancel", stay in the current code editor
                return;
            }
        }

        try {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [
                    {
                        description: 'Text Files',
                        accept: {
                            'text/plain': ['.txt'],
                            'text/html': ['.html', '.htm'],
                            'text/css': ['.css'],
                            'text/javascript': ['.js']
                        }
                    }
                ]
            });
            const file = await fileHandle.getFile();
            const content = await file.text();

            if (!codeEditor) {
                // If the code editor doesn't exist, create it
                const editorContainer = document.createElement('div');
                editorContainer.className = 'editor-container';

                codeEditor = document.createElement('textarea');
                codeEditor.id = 'code-editor';

                const closeButton = document.createElement('button');
                closeButton.id = 'close-editor';
                closeButton.textContent = 'Close';
                closeButton.addEventListener('click', function() {
                    closeCodeEditor();
                });

                editorContainer.appendChild(codeEditor);
                editorContainer.appendChild(closeButton);
                document.body.appendChild(editorContainer);

                // Add event listener to track changes in the code editor
                codeEditor.addEventListener('input', function() {
                    isFileSaved = false;
                    codeEditor.style.backgroundColor = 'lightgray';
                });
            }

            codeEditor.value = content;
            currentFileHandle = fileHandle;
            codeEditor.style.backgroundColor = 'white';
            isFileSaved = true;
        } catch (err) {
            console.error('Failed to open file:', err);
        }
    });

    saveFileHexagon.addEventListener('click', async function() {
        if (codeEditor) {
            const content = codeEditor.value;
            try {
                if (currentFileHandle) {
                    // Save changes to the existing file
                    const writable = await currentFileHandle.createWritable();
                    await writable.write(content);
                    await writable.close();
                    codeEditor.style.backgroundColor = 'white';
                } else {
                    // Save as a new file
                    const handle = await window.showSaveFilePicker({
                        types: [
                            {
                                description: 'Text Files',
                                accept: {
                                    'text/plain': ['.txt'],
                                    'text/html': ['.html', '.htm'],
                                    'text/css': ['.css'],
                                    'text/javascript': ['.js']
                                }
                            }
                        ]
                    });
                    const writable = await handle.createWritable();
                    await writable.write(content);
                    await writable.close();
                    currentFileHandle = handle;
                    codeEditor.style.backgroundColor = 'white';
                }
                isFileSaved = true;
            } catch (err) {
                console.error('Failed to save file:', err);
            }
        } else {
            alert('No file is currently open.');
        }
    });

    closeFileHexagon.addEventListener('click', function() {
        closeCodeEditor();
    });

    // Function to handle closing the code editor
    async function closeCodeEditor() {
        if (codeEditor) {
            if (!isFileSaved) {
                const confirmClose = confirm('Are you sure you want to exit without saving the file?');
                if (confirmClose) {
                    const editorContainer = codeEditor.parentElement;
                    editorContainer.remove();
                    codeEditor = null;
                    currentFileHandle = null;
                    isFileSaved = true;
                } else {
                    // User clicked "Cancel", stay in the code editor
                    return;
                }
            } else {
                const editorContainer = codeEditor.parentElement;
                editorContainer.remove();
                codeEditor = null;
                currentFileHandle = null;
            }
        }
    }

// Add event listener to track changes in the code editor
    codeEditor.addEventListener('input', function() {
        isFileSaved = false;
        codeEditor.style.backgroundColor = 'lightgray';
    });
});
