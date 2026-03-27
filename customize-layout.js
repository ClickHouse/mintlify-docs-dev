(function () {
    'use strict';

    // Track if we've moved the element to avoid unnecessary operations
    let hasMoved = false;

    // Function to add Beta tag to sidebar titles
    // Configure which titles should get the Beta tag
    const betaTitles = ['MongoDB'];

    function addBetaTagsToSidebarTitles() {
        // Find all h5 elements with id="sidebar-title" (querySelector gets all)
        const sidebarTitles = document.querySelectorAll('h5#sidebar-title');

        if (sidebarTitles.length === 0) {
            console.log('No sidebar title elements found');
            return false;
        }

        let addedCount = 0;

        sidebarTitles.forEach(sidebarTitle => {
            // Get just the text content without any child elements
            let titleText = '';
            for (let node of sidebarTitle.childNodes) {
                if (node.nodeType === Node.TEXT_NODE) {
                    titleText += node.textContent;
                }
            }
            titleText = titleText.trim();

            // Check if this title should have a Beta tag
            if (!betaTitles.includes(titleText)) {
                return; // Skip this one
            }

            // Check if tag already exists
            if (sidebarTitle.querySelector('.nav-tag-pill')) {
                return; // Skip, already has tag
            }

            // Create the Beta tag pill
            const tagPillSpan = document.createElement('span');
            tagPillSpan.className = 'nav-tag-pill flex items-center w-fit';

            const tagTextSpan = document.createElement('span');
            tagTextSpan.className = 'nav-tag-pill-text px-1 py-0.5 rounded-md text-[0.65rem] leading-tight font-bold text-primary dark:text-primary-light bg-primary/10';
            tagTextSpan.setAttribute('data-nav-tag', 'Beta');
            tagTextSpan.textContent = 'Beta';

            tagPillSpan.appendChild(tagTextSpan);

            // Add a space before the tag
            sidebarTitle.appendChild(document.createTextNode(' '));
            sidebarTitle.appendChild(tagPillSpan);

            console.log('Beta tag added to sidebar title:', titleText);
            addedCount++;
        });

        return addedCount > 0;
    }

    // Try to move elements immediately
    addBetaTagsToSidebarTitles();

    // Try again on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', function() {
        addBetaTagsToSidebarTitles();
    });

    // Try again on window load (after all resources are loaded)
    window.addEventListener('load', function() {
        addBetaTagsToSidebarTitles();
    });

    // Keep watching for changes indefinitely - don't disconnect
    const observer = new MutationObserver(function(mutations) {
        // Always try to add beta tags to sidebar titles
        addBetaTagsToSidebarTitles();
    });

    // Start observing the document for changes
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();