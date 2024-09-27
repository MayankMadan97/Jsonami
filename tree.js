const jsonData = {
    "name": "Root",
    "children": [
        {
            "name": "Child 1",
            "children": [
                {
                    "name": "Grandchild 1",
                    "children": [
                        { "name": "Great Grandchild 1" },
                        { "name": "Great Grandchild 2" }
                    ]
                },
                { "name": "Grandchild 2" }
            ]
        },
        {
            "name": "Child 2",
            "children": [
                { "name": "Grandchild 3" },
                { "name": "Grandchild 4" }
            ]
        },
        {
            "name": "Child 3",
            "children": [
                {
                    "name": "Grandchild 5",
                    "children": [
                        { "name": "Great Grandchild 3" }
                    ]
                }
            ]
        }
    ]
};

// Function to create an indented list from JSON data
function createList(data) {
    const ul = document.createElement('ul');
    data.forEach(item => {
        const li = document.createElement('li');

        // Create a span for displaying the name
        const span = document.createElement('span');
        span.innerHTML = item.name;
        span.setAttribute('class', 'item-text');
        span.addEventListener('click', () => editItem(span));

        // Create an input for editing the name
        const input = document.createElement('input');
        input.type = 'text';
        input.value = item.name;
        input.setAttribute('class', 'editable');
        input.addEventListener('blur', () => updateItem(input, span));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                updateItem(input, span);
            }
        });

        li.appendChild(span);
        li.appendChild(input);
        li.setAttribute('draggable', 'true');

        // Add drag-and-drop event listeners
        li.addEventListener('dragstart', dragStart);
        li.addEventListener('dragover', dragOver);
        li.addEventListener('drop', drop);
        li.addEventListener('dragend', dragEnd);

        // Check for children and create a nested list if they exist
        if (item.children) {
            li.appendChild(createList(item.children));
            li.classList.add('nested'); // Add class for styling nested items
        }

        ul.appendChild(li);
    });
    return ul;
}

// Function to populate the list
function populateList() {
    const itemList = document.getElementById('itemList');
    itemList.appendChild(createList([jsonData])); // Start with the root
}

// Function to start editing an item
function editItem(span) {
    const li = span.parentNode;
    const input = li.querySelector('.editable');
    span.style.display = 'none'; // Hide the span
    input.style.display = 'block'; // Show the input
    input.focus(); // Focus on the input field
}

// Function to update the item with new value
function updateItem(input, span) {
    const newValue = input.value.trim();
    if (newValue) {
        span.innerHTML = newValue; // Update the span with new value
    }
    input.style.display = 'none'; // Hide the input
    span.style.display = 'block'; // Show the updated span
}

// Drag-and-drop functions
function dragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.innerHTML);
    e.target.classList.add('dragging');
}

function dragOver(e) {
    e.preventDefault(); // Prevent default to allow drop
    e.dataTransfer.dropEffect = 'move';
}

function drop(e) {
    e.preventDefault();
    const draggedItem = document.querySelector('.dragging');
    const targetItem = e.target.closest('li');

    if (targetItem && targetItem !== draggedItem) {
        const list = targetItem.parentNode;
        list.insertBefore(draggedItem, targetItem.nextSibling);
    }
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
}

// Populate the list on page load
populateList();