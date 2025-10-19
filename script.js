console.log("script.js successfully loaded. Time to make things interactive!");
const myName = "Ruofan Wang";
let age = 30;
let programmingLanguage = "JavaScript";
console.log('My name is ${myName}. I am ${age} years old. My favorite programming language is ${programmingLanguage}.');

const student = {
    name: "Ruofan Wang",
    major: "Computer Engineering Technology - Computing Science ",
    gradYear: 2028,
    hobbies: ["Fitness", "Traveling", "Coffee", "Music", "Photography"],
    skills: ["HTML", "CSS", "JavaScript", "Java", "C", "Git", "Bootstrap","MySQL","Spring Boot", "RESTful APIs","Microsoft Power Automate"],
    logInfo: function() {
        console.log("Student Name: " + this.name);
        console.log("Major: " + this.major);
        console.log("Graduation Year: " + this.gradYear);
        console.log("Hobbies: " + this.hobbies.join(", "));
    }
};

let clickCount = 0;
const userName = student.name.split(" ")[0];
student.logInfo();

function greetUser() {
    const greetBtn = document.getElementById("greet-btn");
    const welcomMessage = document.getElementById("welcome-message");

    const hour = new Date().getHours();
    let timeOfDay = "Hello";
    if (hour < 12) {
        timeOfDay = "Good morning";
    } else if (hour < 18) {
        timeOfDay = "Good afternoon";
    } else {
        timeOfDay = "Good evening";
    }
    const greeting = `${timeOfDay} ${userName}! Welcome to the interactive web page.`;
    welcomMessage.textContent = greeting;
    if (greetBtn) {
        greetBtn.style.display = "none";
    }
}

function updateDateTime() {
    const dateTimeDisplay = document.getElementById("date-time-display");
    const now = new Date();
    const formattedDateTime = now.toLocaleString();
    dateTimeDisplay.textContent = formattedDateTime;
}

function toggleTheme() {
    const themeBtn = document.getElementById("theme-btn");
    document.body.classList.toggle("dark-theme");
    if (document.body.classList.contains("dark-theme")) {
        themeBtn.textContent = "Switch to Light Theme";
    } else {
        themeBtn.textContent = "Switch to Dark Theme";
    }
}

function countClicks() {
    clickCount++;
    const countDisplay = document.getElementById("click-count-display");
    const countBtn = document.getElementById("click-counter-btn");

    if (countDisplay) {
        countDisplay.textContent = `Clicks: ${clickCount}`;
    }
    if(countBtn) {
        if (clickCount % 10 === 0) {
            if (countDisplay) countDisplay.style.color = 'red';
            countBtn.textContent = `WOW! ${clickCount} clicks!`;
        } else if (clickCount > 5) {
            if (countDisplay) countDisplay.style.color = 'blue';
            countBtn.textContent = `Keep going! ${clickCount} clicks!`;
        } else {
            if (countDisplay) countDisplay.style.color = 'initial';
            countBtn.textContent = "Click to Count";
        }
    }
}

function changeColor() {
    const colorBox = document.getElementById("color-box");
    if (!colorBox) {
        console.error("color-box element not found");
        return;
    }
    // pick a random color
    const hue = Math.floor(Math.random() * 360);
    const color = `hsl(${hue} 20% 40%)`;
    colorBox.style.backgroundColor = color;
}

function showHobbies() {
    const skillsList = document.getElementById("hobbies-list");
    if (!skillsList) return;
    skillsList.innerHTML = ""; // clear any existing items

    for (let i = 0; i < student.hobbies.length; i++) {
        const listItem = document.createElement("li");
        listItem.textContent = `• ${student.hobbies[i]}`;
        skillsList.appendChild(listItem);
    }
}

function showSkills() {
    const skillsList = document.getElementById("skills-list");
    if (!skillsList) return;
    skillsList.innerHTML = ""; // clear existing items

    for (let i = 0; i < student.skills.length; i++) {
        const li = document.createElement("li");
        li.textContent = `• ${student.skills[i]}`;
        skillsList.appendChild(li);
    }
}

function filterSkills(searchTerm) {
    const results = document.getElementById("search-results");
    if (!results) return;
    const q = (searchTerm || "").trim().toLowerCase();
    results.innerHTML = ""; // clear previous results

    if (!q) {
        // don't show anything when query is empty
        return;
    }

    // Use Array.filter to get all matching skills
    const matches = student.skills.filter(skill => skill.toLowerCase().includes(q));
    for (let i = 0; i < matches.length; i++) {
        const li = document.createElement("li");
        li.textContent = matches[i];
        results.appendChild(li);
    }

    if (results.children.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No results found";
        results.appendChild(li);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    showHobbies();
    showSkills();

    const greetBtn = document.getElementById("greet-btn");
    if (greetBtn) {
        greetBtn.addEventListener("click", greetUser);
    } else {
        console.error("Greet button not found!");
    }

    const themeBtn = document.getElementById("theme-btn");
    if (themeBtn) {
        if (document.body.classList.contains("dark-theme")) {
            themeBtn.textContent = "Switch to Light Theme";
        } else {
            themeBtn.textContent = "Switch to Dark Theme";
        }
        themeBtn.addEventListener("click", toggleTheme);
        themeBtn.addEventListener('mouseover', () => {
            themeBtn.style.boxShadow = '0 0 12px 4px rgba(52, 152, 219, 0.8)';
            themeBtn.style.transform = 'scale(1.05)';
        });
        themeBtn.addEventListener('mouseout', () => {
            themeBtn.style.boxShadow = 'none';
            themeBtn.style.transform = 'scale(1)';
        });
    } else {
        console.error("Theme button not found!");
    }

    const countBtn = document.getElementById("click-counter-btn");
    if (countBtn) {
        countBtn.addEventListener("click", countClicks);
    } else {
        console.error("Count button not found!");
    }

    const colorBtn = document.getElementById("change-color-btn"); 
    if (colorBtn) {
        colorBtn.addEventListener("click", changeColor);
    } else {
        console.error("Color button not found (expected id='change-color-btn')");
    }

    const skillsSearch = document.getElementById("skills-search");
    const searchBtn = document.getElementById("search-btn");

    if (skillsSearch) {
        skillsSearch.addEventListener("input", (e) => filterSkills(e.target.value));
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            const q = document.getElementById("skills-search")?.value || "";
            filterSkills(q);
        });
    }
});
