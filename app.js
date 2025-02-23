class HabitTracker {
    constructor() {
        this.habits = JSON.parse(localStorage.getItem('habits')) || [];
        this.initializeEventListeners();
        this.renderHabits();
    }

    initializeEventListeners() {
        // Add habit button
        document.getElementById('addHabitBtn').addEventListener('click', () => {
            document.getElementById('habitModal').style.display = 'block';
        });

        // Cancel button in modal
        document.getElementById('cancelHabit').addEventListener('click', () => {
            document.getElementById('habitModal').style.display = 'none';
        });

        // Form submission
        document.getElementById('habitForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addHabit();
        });

        // Toggle goal input based on habit type
        document.getElementById('habitType').addEventListener('change', (e) => {
            const goalContainer = document.getElementById('goalContainer');
            goalContainer.style.display = e.target.value === 'counter' ? 'block' : 'none';
        });

        // Dark mode toggle
        document.getElementById('darkModeToggle').addEventListener('click', () => {
            document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', document.body.dataset.theme);
        });
    }

    addHabit() {
        const name = document.getElementById('habitName').value;
        const type = document.getElementById('habitType').value;
        const goal = type === 'counter' ? parseInt(document.getElementById('habitGoal').value) : null;

        const habit = {
            id: Date.now(),
            name,
            type,
            goal,
            completed: false,
            count: 0,
            streak: 0,
            lastCompleted: null
        };

        this.habits.push(habit);
        this.saveHabits();
        this.renderHabits();

        // Reset and close modal
        document.getElementById('habitForm').reset();
        document.getElementById('habitModal').style.display = 'none';
    }

    saveHabits() {
        localStorage.setItem('habits', JSON.stringify(this.habits));
    }

    renderHabits() {
        const habitsList = document.getElementById('habitsList');
        habitsList.innerHTML = '';

        this.habits.forEach(habit => {
            const habitElement = document.createElement('div');
            habitElement.className = 'habit-item';
            
            if (habit.type === 'checkbox') {
                habitElement.innerHTML = `
                    <span>${habit.name}</span>
                    <input type="checkbox" ${habit.completed ? 'checked' : ''} 
                           onchange="habitTracker.toggleHabit(${habit.id})">
                `;
            } else {
                habitElement.innerHTML = `
                    <span>${habit.name} (${habit.count}/${habit.goal})</span>
                    <div>
                        <button onclick="habitTracker.updateCounter(${habit.id}, -1)">-</button>
                        <button onclick="habitTracker.updateCounter(${habit.id}, 1)">+</button>
                    </div>
                `;
            }

            habitsList.appendChild(habitElement);
        });
    }

    toggleHabit(id) {
        const habit = this.habits.find(h => h.id === id);
        if (habit) {
            habit.completed = !habit.completed;
            this.updateStreak(habit);
            this.saveHabits();
            this.renderHabits();
        }
    }

    updateCounter(id, change) {
        const habit = this.habits.find(h => h.id === id);
        if (habit) {
            habit.count = Math.max(0, habit.count + change);
            if (habit.count >= habit.goal) {
                this.updateStreak(habit);
            }
            this.saveHabits();
            this.renderHabits();
        }
    }

    updateStreak(habit) {
        const today = new Date().toDateString();
        if (habit.lastCompleted !== today) {
            habit.streak = habit.completed || (habit.type === 'counter' && habit.count >= habit.goal) ? habit.streak + 1 : 0;
            habit.lastCompleted = today;
        }
    }
}

// Initialize the app
const habitTracker = new HabitTracker();

// Load saved theme
document.body.dataset.theme = localStorage.getItem('theme') || 'light'; 