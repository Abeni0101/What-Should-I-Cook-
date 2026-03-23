export function initDragAndDrop(onPotUpdateCallback) {
    const draggables = document.querySelectorAll('.draggable-ingredient');
    const dropZone = document.getElementById('cooking-pot');

    draggables.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.dataset.item);
            e.target.classList.add('dragging');
        });
        
        item.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault(); 
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        const ingredientName = e.dataTransfer.getData('text/plain');
        if (ingredientName) {
            // Visual feedback
            dropZone.innerHTML = `<span>Added: ${ingredientName} 🥘</span>`;
            setTimeout(() => dropZone.innerHTML = `<span>Drop more here! 🍲</span>`, 1500);
            
            // Trigger callback to main.js
            onPotUpdateCallback(ingredientName);
        }
    });
}