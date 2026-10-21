/* ==========================================================
   MELODY OGBONNA - PORTFOLIO & STUDENT MANAGEMENT PLATFORM
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // 2. Academic Planner - Visitor View Mode & Owner Key Protection
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskDueDate = document.getElementById('taskDueDate');
    const taskCategory = document.getElementById('taskCategory');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const adminToggleBtn = document.getElementById('adminToggleBtn');
    const adminModal = document.getElementById('adminModal');
    const adminPassInput = document.getElementById('adminPassInput');
    const submitPassBtn = document.getElementById('submitPassBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modeBadge = document.getElementById('modeBadge');

    let isAdmin = sessionStorage.getItem('melody_admin_active') === 'true';

    let tasks = JSON.parse(localStorage.getItem('melody_academic_planner_v6')) || [
        { id: 1, text: 'Review COS 106 Web Technologies & Python notes', date: '2026-10-25', category: 'Current Studies', completed: false },
        { id: 2, text: 'Prepare cybersecurity lab assignment documentation', date: '2026-10-28', category: 'Current Studies', completed: true },
        { id: 3, text: 'Learn advanced Python API integration for future projects', date: '2026-11-10', category: 'Future Goals', completed: false }
    ];

    function saveAndRenderTasks() {
        localStorage.setItem('melody_academic_planner_v6', JSON.stringify(tasks));
        renderTasks();
    }

    function renderTasks() {
        if (!taskList) return;
        taskList.innerHTML = '';
        
        if (modeBadge) {
            if (isAdmin) {
                modeBadge.className = 'admin-badge';
                modeBadge.innerHTML = '<i class="fas fa-user-shield"></i> Owner Access (Modify Enabled)';
                if (adminToggleBtn) adminToggleBtn.textContent = 'Lock / Visitor View';
            } else {
                modeBadge.className = 'visitor-badge';
                modeBadge.innerHTML = '<i class="fas fa-eye"></i> Visitor View Mode (Read Only)';
                if (adminToggleBtn) adminToggleBtn.textContent = 'Owner Login';
            }
        }

        if (tasks.length === 0) {
            taskList.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 1rem;">No tasks or goals added yet.</p>';
            if (taskCount) taskCount.textContent = '0 tasks remaining';
            return;
        }

        let remainingCount = 0;

        tasks.forEach((task, index) => {
            if (!task.completed) remainingCount++;

            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            let dateDisplay = task.date ? `<span style="font-size:0.85rem; color:var(--text-light); margin-left:0.5rem;"><i class="far fa-calendar-alt"></i> ${task.date}</span>` : '';
            
            let actionButtons = '';
            if (isAdmin) {
                actionButtons = `
                    <div class="task-actions">
                        <button class="complete-btn" onclick="toggleTask(${index})" title="Toggle Completion">
                            <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                        </button>
                        <button class="delete-btn" onclick="deleteTask(${index})" title="Delete Task">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
            } else {
                actionButtons = `
                    <div style="font-size: 0.8rem; color: var(--text-light); font-style: italic;">
                        ${task.completed ? '<span style="color:var(--success); font-weight:600;"><i class="fas fa-check-circle"></i> Completed</span>' : '<span>In Progress</span>'}
                    </div>
                `;
            }

            li.innerHTML = `
                <div>
                    <strong>[${escapeHtml(task.category)}]</strong> ${escapeHtml(task.text)} ${dateDisplay}
                </div>
                ${actionButtons}
            `;
            taskList.appendChild(li);
        });

        if (taskCount) {
            taskCount.textContent = `${remainingCount} task${remainingCount === 1 ? '' : 's'} remaining`;
        }
    }

    window.toggleTask = function(index) {
        if (!isAdmin) {
            alert('Visitor Mode: Only the portfolio owner can tick or modify tasks.');
            return;
        }
        tasks[index].completed = !tasks[index].completed;
        saveAndRenderTasks();
    };

    window.deleteTask = function(index) {
        if (!isAdmin) {
            alert('Visitor Mode: Deleting tasks is restricted to the portfolio owner.');
            return;
        }
        tasks.splice(index, 1);
        saveAndRenderTasks();
    };

    if (taskForm) {
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!isAdmin) {
                alert('Visitor Mode: Adding new tasks is restricted to Melody Ogbonna. Please log in as owner.');
                return;
            }
            const text = taskInput.value.trim();
            const dueDate = taskDueDate ? taskDueDate.value : '';
            const category = taskCategory ? taskCategory.value : 'Current Studies';

            if (text === '') return;

            tasks.push({
                id: Date.now(),
                text: text,
                date: dueDate,
                category: category,
                completed: false
            });

            taskInput.value = '';
            if (taskDueDate) taskDueDate.value = '';
            saveAndRenderTasks();
        });
    }

    if (adminToggleBtn) {
        adminToggleBtn.addEventListener('click', () => {
            if (isAdmin) {
                isAdmin = false;
                sessionStorage.setItem('melody_admin_active', 'false');
                renderTasks();
            } else {
                if (adminModal) adminModal.style.display = 'flex';
            }
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (adminModal) adminModal.style.display = 'none';
        });
    }

    if (submitPassBtn) {
        submitPassBtn.addEventListener('click', () => {
            const pass = adminPassInput.value.trim();
            if (pass === 'melody2026') {
                isAdmin = true;
                sessionStorage.setItem('melody_admin_active', 'true');
                if (adminModal) adminModal.style.display = 'none';
                adminPassInput.value = '';
                renderTasks();
            } else {
                alert('Incorrect passcode.');
            }
        });
    }

    renderTasks();

    // 3. Project Works Gallery Upload Room
    const uploadInput = document.getElementById('projectUploadInput');
    const uploadTitle = document.getElementById('projectTitleInput');
    const uploadBtn = document.getElementById('uploadWorkBtn');
    const galleryGrid = document.getElementById('projectGalleryGrid');

    let projectWorks = JSON.parse(localStorage.getItem('melody_project_works_v6')) || [
        { title: 'Cybersecurity Portfolio Layout Concept', src: 'assets/images/profile.jpg' }
    ];

    function renderProjectGallery() {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = '';
        projectWorks.forEach((work) => {
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

    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            const file = uploadInput ? uploadInput.files[0] : null;
            const title = uploadTitle && uploadTitle.value.trim() ? uploadTitle.value.trim() : 'Project Design Work';

            if (!file) {
                alert('Please click "Choose File" and select an image before clicking upload.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                projectWorks.push({ title: title, src: e.target.result });
                localStorage.setItem('melody_project_works_v6', JSON.stringify(projectWorks));
                renderProjectGallery();
                if (uploadTitle) uploadTitle.value = '';
                if (uploadInput) uploadInput.value = '';
                alert('Success! Project work has been added to your live gallery.');
            };
            reader.readAsDataURL(file);
        });
    }

    renderProjectGallery();

    // 4. Contact Form Validation
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

            if (nameInput.value.trim() === '') {
                setError(nameInput, 'Name cannot be empty.');
                isValid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value.trim() === '') {
                setError(emailInput, 'Email address cannot be empty.');
                isValid = false;
            } else if (!emailRegex.test(emailInput.value.trim())) {
                setError(emailInput, 'Please enter a valid email address.');
                isValid = false;
            }

            const phoneVal = phoneInput.value.trim();
            const digitsRegex = /^\d+$/;
            if (phoneVal === '') {
                setError(phoneInput, 'Phone number cannot be empty.');
                isValid = false;
            } else if (!digitsRegex.test(phoneVal)) {
                setError(phoneInput, 'Phone number must contain only digits (0-9).');
                isValid = false;
            }

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
