/* ==========================================================
   MELODY OGBONNA - PORTFOLIO & STUDENT MANAGEMENT PLATFORM
   JavaScript Logic & Form Validation
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // 2. Interactive Academic & Business Planner
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskCategory = document.getElementById('taskCategory');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');

    let tasks = JSON.parse(localStorage.getItem('melody_tasks_v2')) || [
        { id: 1, text: 'Submit COS 106 Lab Term Project to Miva Portal', category: 'Academic', completed: false },
        { id: 2, text: 'Complete Python Exercise 1.5.2 Dictionary assignment', category: 'Academic', completed: true },
        { id: 3, text: 'Upload new Faiga Masani luxury menswear designs', category: 'Fashion/Business', completed: false }
    ];

    function saveAndRenderTasks() {
        localStorage.setItem('melody_tasks_v2', JSON.stringify(tasks));
        renderTasks();
    }

    function renderTasks() {
        if (!taskList) return;
        taskList.innerHTML = '';
        
        if (tasks.length === 0) {
            taskList.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 1rem;">No active tasks. Add one above!</p>';
            if (taskCount) taskCount.textContent = '0 tasks remaining';
            return;
        }

        let remainingCount = 0;

        tasks.forEach((task, index) => {
            if (!task.completed) remainingCount++;

            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <div>
                    <strong>[${task.category}]</strong> ${escapeHtml(task.text)}
                </div>
                <div class="task-actions">
                    <button class="complete-btn" onclick="toggleTask(${index})" title="Toggle Completion">
                        <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteTask(${index})" title="Delete Task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            taskList.appendChild(li);
        });

        if (taskCount) {
            taskCount.textContent = `${remainingCount} task${remainingCount === 1 ? '' : 's'} remaining`;
        }
    }

    window.toggleTask = function(index) {
        tasks[index].completed = !tasks[index].completed;
        saveAndRenderTasks();
    };

    window.deleteTask = function(index) {
        tasks.splice(index, 1);
        saveAndRenderTasks();
    };

    if (taskForm) {
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = taskInput.value.trim();
            const category = taskCategory.value;

            if (text === '') return;

            tasks.push({
                id: Date.now(),
                text: text,
                category: category,
                completed: false
            });

            taskInput.value = '';
            saveAndRenderTasks();
        });
    }

    renderTasks();

    // 3. Dynamic Fashion & Project Upload Room (Upload Works Feature)
    const uploadInput = document.getElementById('fashionUploadInput');
    const uploadTitle = document.getElementById('fashionTitleInput');
    const uploadBtn = document.getElementById('uploadWorkBtn');
    const galleryGrid = document.getElementById('fashionGalleryGrid');

    let fashionWorks = JSON.parse(localStorage.getItem('melody_fashion_works')) || [
        { title: 'Faiga Masani Menswear Suit Concept', src: 'assets/images/profile.jpg' }
    ];

    function renderFashionGallery() {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = '';
        fashionWorks.forEach((work, index) => {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.innerHTML = `
                <img src="${work.src}" alt="${escapeHtml(work.title)}">
                <div class="info">
                    <strong>${escapeHtml(work.title)}</strong>
                </div>
            `;
            galleryGrid.appendChild(div);
        });
    }

    if (uploadBtn && uploadInput && uploadTitle) {
        uploadBtn.addEventListener('click', () => {
            const file = uploadInput.files[0];
            const title = uploadTitle.value.trim() || 'Faiga Masani Work';

            if (!file) {
                alert('Please select an image file to upload.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                fashionWorks.push({ title: title, src: e.target.result });
                localStorage.setItem('melody_fashion_works', JSON.stringify(fashionWorks));
                renderFashionGallery();
                uploadTitle.value = '';
                uploadInput.value = '';
                alert('Project work uploaded successfully to your gallery!');
            };
            reader.readAsDataURL(file);
        });
    }

    renderFashionGallery();

    // 4. Contact Form Strict JavaScript Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const messageInput = document.getElementById('message');
        const successBanner = document.getElementById('successBanner');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            clearError(nameInput);
            clearError(emailInput);
            clearError(phoneInput);
            clearError(messageInput);
            if (successBanner) successBanner.style.display = 'none';

            // Validate Name (No field empty)
            if (nameInput.value.trim() === '') {
                setError(nameInput, 'Name cannot be empty.');
                isValid = false;
            }

            // Validate Email (Valid format)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value.trim() === '') {
                setError(emailInput, 'Email address cannot be empty.');
                isValid = false;
            } else if (!emailRegex.test(emailInput.value.trim())) {
                setError(emailInput, 'Please enter a valid email address.');
                isValid = false;
            }

            // Validate Phone (Digits only)
            const phoneVal = phoneInput.value.trim();
            const digitsRegex = /^\d+$/;
            if (phoneVal === '') {
                setError(phoneInput, 'Phone number cannot be empty.');
                isValid = false;
            } else if (!digitsRegex.test(phoneVal)) {
                setError(phoneInput, 'Phone number must contain only digits (0-9).');
                isValid = false;
            }

            // Validate Message
            if (messageInput.value.trim() === '') {
                setError(messageInput, 'Message cannot be empty.');
                isValid = false;
            }

            if (isValid) {
                if (successBanner) {
                    successBanner.textContent = 'Thank you! Your message has been sent successfully to Melody Ogbonna.';
                    successBanner.style.display = 'block';
                }
                contactForm.reset();
            }
        });
    }

    function setError(input, message) {
        const formGroup = input.parentElement;
        formGroup.classList.add('error');
        const errorDiv = formGroup.querySelector('.error-message');
        if (errorDiv) errorDiv.textContent = message;
    }

    function clearError(input) {
        const formGroup = input.parentElement;
        formGroup.classList.remove('error');
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
});
