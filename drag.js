export function initDragAndDrop(onDropCallback) {
    const draggables = document.querySelectorAll('.draggable-ingredient');
    const dropZone = document.getElementById('cooking-pot');

    // --- Desktop API ---
    draggables.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.dataset.item);
            e.target.classList.add('dragging');
        });
        item.addEventListener('dragend', (e) => e.target.classList.remove('dragging'));
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault(); 
        dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        triggerDrop(e.dataTransfer.getData('text/plain'));
    });

    // --- Mobile Touch API Fix ---
    let draggedItem = null;
    let clone = null;

    draggables.forEach(item => {
        item.addEventListener('touchstart', (e) => {
            draggedItem = e.target.dataset.item;
            clone = item.cloneNode(true);
            clone.style.position = 'absolute';
            clone.style.opacity = '0.7';
            clone.style.zIndex = '1000';
            document.body.appendChild(clone);
            
            const touch = e.touches[0];
            moveClone(touch.pageX, touch.pageY);
        }, {passive: false});

        item.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevents screen scroll
            const touch = e.touches[0];
            moveClone(touch.pageX, touch.pageY);
            
            // Highlight dropzone if over
            const elementUnder = document.elementFromPoint(touch.clientX, touch.clientY);
            if (elementUnder && (elementUnder.id === 'cooking-pot' || elementUnder.closest('#cooking-pot'))) {
                dropZone.classList.add('drag-over');
            } else {
                dropZone.classList.remove('drag-over');
            }
        }, {passive: false});

        item.addEventListener('touchend', (e) => {
            if (clone) clone.remove();
            dropZone.classList.remove('drag-over');
            
            const touch = e.changedTouches[0];
            const elementUnder = document.elementFromPoint(touch.clientX, touch.clientY);
            
            if (elementUnder && (elementUnder.id === 'cooking-pot' || elementUnder.closest('#cooking-pot'))) {
                triggerDrop(draggedItem);
            }
            draggedItem = null;
        });
    });

    function moveClone(x, y) {
        if (clone) {
            clone.style.left = `${x - 40}px`;
            clone.style.top = `${y - 20}px`;
        }
    }

    function triggerDrop(ingredientName) {
        if (!ingredientName) return;
        dropZone.innerHTML = `<span>Added: ${ingredientName} 🥘</span>`;
        setTimeout(() => dropZone.innerHTML = `<span>Drop more here! 🍲</span>`, 1500);
        onDropCallback(ingredientName);
    }
}