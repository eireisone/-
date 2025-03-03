// Configuration for both systems
const config = {
    oldSystem: {
        semesterCourses: {
            1: 7, // First semester has 7 courses
            2: 7, // Second semester has 7 courses
            3: 6, // Third semester has 6 courses
            4: 6, // Fourth semester has 6 courses
            5: 6, // Fifth semester has 6 courses
            6: 6  // Sixth semester has 6 courses
        },
        // Mapping of courses that lock other courses when failed
        courseLockMap: {
            // Format: [semester, courseNumber]: [semester, courseNumber]
            // First year to second year
            "1-1": "3-15",
            "1-2": "3-16",
            "1-3": "3-17",
            "1-4": "3-18",
            "1-5": "3-19",
            "1-6": "3-20",
            // First year to second year (no mapping for 1-7)
            "2-8": "4-21",
            "2-9": "4-22",
            "2-10": "4-23",
            "2-11": "4-24",
            "2-12": "4-25",
            "2-13": "4-26",
            // Second year to third year (no mapping for 2-14)
            "3-15": "5-27",
            "3-16": "5-28",
            "3-17": "5-29",
            "3-18": "5-30",
            "3-19": "5-31",
            "3-20": "5-32",
            "4-21": "6-33",
            "4-22": "6-34",
            "4-23": "6-35",
            "4-24": "6-36",
            // Special case for thesis
            "4-25": "6-37",
            "4-26": "6-38"
        }
    },
    newSystem: {
        semesterCourses: {
            1: 7, // All semesters have 7 courses in the new system
            2: 7,
            3: 7,
            4: 7,
            5: 7,
            6: 7
        },
        // Similar mapping for the new system
        courseLockMap: {
            // Will be filled with similar logic but adjusted for 7 courses per semester
            // First year to second year
            "1-1": "3-15",
            "1-2": "3-16",
            "1-3": "3-17",
            "1-4": "3-18",
            "1-5": "3-19",
            "1-6": "3-20",
            "1-7": "3-21",
            // First year to second year
            "2-8": "4-22",
            "2-9": "4-23",
            "2-10": "4-24",
            "2-11": "4-25",
            "2-12": "4-26",
            "2-13": "4-27",
            "2-14": "4-28",
            // Second year to third year
            "3-15": "5-29",
            "3-16": "5-30",
            "3-17": "5-31",
            "3-18": "5-32",
            "3-19": "5-33",
            "3-20": "5-34",
            "3-21": "5-35",
            "4-22": "6-36",
            "4-23": "6-37",
            "4-24": "6-38",
            "4-25": "6-39",
            "4-26": "6-40",
            "4-27": "6-41",
            "4-28": "6-42"
        }
    }
};

// Current active system
let activeSystem = 'oldSystem';

// Store all grades
const grades = {
    oldSystem: {},
    newSystem: {}
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set up system toggle
    document.getElementById('oldSystem').addEventListener('click', function() {
        setActiveSystem('oldSystem');
    });
    
    document.getElementById('newSystem').addEventListener('click', function() {
        setActiveSystem('newSystem');
    });
    
    // Initialize with old system
    setActiveSystem('oldSystem');
});

// Set active system and update UI
function setActiveSystem(system) {
    activeSystem = system;
    
    // Update toggle buttons
    document.getElementById('oldSystem').classList.toggle('active', system === 'oldSystem');
    document.getElementById('newSystem').classList.toggle('active', system === 'newSystem');
    
    // Clear all grade containers
    for (let i = 1; i <= 6; i++) {
        document.getElementById(`semester${i}Grades`).innerHTML = '';
    }
    
    // Generate grade inputs for the selected system
    generateGradeInputs();
    
    // Update calculations if we have grades
    if (Object.keys(grades[activeSystem]).length > 0) {
        calculateAll();
    }
}

// Generate grade inputs for all semesters
function generateGradeInputs() {
    const systemConfig = config[activeSystem];
    
    for (let semester = 1; semester <= 6; semester++) {
        const container = document.getElementById(`semester${semester}Grades`);
        const courseCount = systemConfig.semesterCourses[semester];
        
        for (let course = 1; course <= courseCount; course++) {
            const courseId = calculateCourseId(semester, course);
            const courseElement = document.createElement('div');
            courseElement.className = 'grade-input';
            
            // Special handling for dual-part courses in new system
            if (activeSystem === 'newSystem' && course === 6) {
                // Create a dual-part course container
                const dualPartContainer = document.createElement('div');
                dualPartContainer.className = 'dual-part-course';
                
                const heading = document.createElement('h4');
                heading.textContent = `المادة ${courseId} (مكونة من جزئين)`;
                dualPartContainer.appendChild(heading);
                
                const inputsContainer = document.createElement('div');
                inputsContainer.className = 'dual-part-inputs';
                
                // Part 1
                const part1 = document.createElement('div');
                part1.className = 'grade-input';
                part1.innerHTML = `
                    <label>الجزء الأول:</label>
                    <input type="number" min="0" max="20" step="0.01" id="grade-${semester}-${course}-1" 
                           value="${getGradeValue(semester, course, 1)}" 
                           oninput="updateGrade(${semester}, ${course}, 1, this.value)">
                `;
                
                // Part 2
                const part2 = document.createElement('div');
                part2.className = 'grade-input';
                part2.innerHTML = `
                    <label>الجزء الثاني:</label>
                    <input type="number" min="0" max="20" step="0.01" id="grade-${semester}-${course}-2" 
                           value="${getGradeValue(semester, course, 2)}" 
                           oninput="updateGrade(${semester}, ${course}, 2, this.value)">
                `;
                
                inputsContainer.appendChild(part1);
                inputsContainer.appendChild(part2);
                dualPartContainer.appendChild(inputsContainer);
                
                container.appendChild(dualPartContainer);
            } else {
                courseElement.innerHTML = `
                    <label>المادة ${courseId}:</label>
                    <input type="number" min="0" max="20" step="0.01" id="grade-${semester}-${course}" 
                           value="${getGradeValue(semester, course)}" 
                           oninput="updateGrade(${semester}, ${course}, null, this.value)">
                `;
                container.appendChild(courseElement);
            }
        }
    }
}

// Calculate course ID based on semester and course number
function calculateCourseId(semester, course) {
    let baseId = 0;
    
    for (let s = 1; s < semester; s++) {
        baseId += config[activeSystem].semesterCourses[s];
    }
    
    return baseId + course;
}

// Get grade value from storage
function getGradeValue(semester, course, part = null) {
    const key = part !== null ? `${semester}-${course}-${part}` : `${semester}-${course}`;
    return grades[activeSystem][key] || '';
}

// Update grade when input changes
function updateGrade(semester, course, part, value) {
    const key = part !== null ? `${semester}-${course}-${part}` : `${semester}-${course}`;
    
    if (value === '') {
        delete grades[activeSystem][key];
    } else {
        grades[activeSystem][key] = parseFloat(value);
    }
    
    // If this is a dual-part course, calculate the average
    if (part !== null) {
        const otherPart = part === 1 ? 2 : 1;
        const otherKey = `${semester}-${course}-${otherPart}`;
        
        if (grades[activeSystem][key] !== undefined && grades[activeSystem][otherKey] !== undefined) {
            const average = (grades[activeSystem][key] + grades[activeSystem][otherKey]) / 2;
            grades[activeSystem][`${semester}-${course}`] = average;
        } else {
            delete grades[activeSystem][`${semester}-${course}`];
        }
    }
    
    // Highlight the changed element
    const element = document.getElementById(`grade-${semester}-${course}${part !== null ? `-${part}` : ''}`);
    element.classList.remove('highlight');
    void element.offsetWidth; // Trigger reflow
    element.classList.add('highlight');
    
    // Recalculate everything
    calculateAll();
}

// Calculate all statistics
function calculateAll() {
    // Calculate semester averages
    for (let semester = 1; semester <= 6; semester++) {
        calculateSemesterAverage(semester);
    }
    
    // Calculate year averages
    calculateYearAverage(1, 2); // Year 1
    calculateYearAverage(3, 4); // Year 2
    calculateYearAverage(5, 6); // Year 3
    
    // Calculate DEUG average (first 4 semesters)
    calculateDEUGAverage();
    
    // Calculate license average (all 6 semesters)
    calculateLicenseAverage();
    
    // Determine locked and additional units
    calculateLockedUnits();
    
    // Update progress percentage
    updateProgressPercentage();
}

// Calculate semester average
function calculateSemesterAverage(semester) {
    const courseCount = config[activeSystem].semesterCourses[semester];
    let totalGrade = 0;
    let validCourses = 0;
    let allCoursesHaveGrades = true;
    let hasCourseBelowFive = false;
    
    for (let course = 1; course <= courseCount; course++) {
        const key = `${semester}-${course}`;
        
        if (grades[activeSystem][key] !== undefined) {
            totalGrade += grades[activeSystem][key];
            validCourses++;
            
            if (grades[activeSystem][key] < 5) {
                hasCourseBelowFive = true;
            }
        } else {
            allCoursesHaveGrades = false;
        }
    }
    
    const average = validCourses > 0 ? totalGrade / validCourses : 0;
    const averageElement = document.getElementById(`semester${semester}Average`);
    const statusElement = document.getElementById(`semester${semester}Status`);
    
    averageElement.textContent = average.toFixed(2);
    
    // Update status
    if (!allCoursesHaveGrades) {
        statusElement.textContent = 'غير مكتمل';
        statusElement.className = 'status neutral';
    } else if (hasCourseBelowFive) {
        statusElement.textContent = 'راسب';
        statusElement.className = 'status danger';
    } else if (average >= 10) {
        statusElement.textContent = 'ناجح';
        statusElement.className = 'status success';
    } else {
        statusElement.textContent = 'غير ناجح';
        statusElement.className = 'status warning';
    }
}

// Calculate year average (two semesters)
function calculateYearAverage(semester1, semester2) {
    const avg1 = parseFloat(document.getElementById(`semester${semester1}Average`).textContent);
    const avg2 = parseFloat(document.getElementById(`semester${semester2}Average`).textContent);
    
    const yearAvg = (avg1 + avg2) / 2;
    const yearNumber = semester1 === 1 ? 1 : (semester1 === 3 ? 2 : 3);
    
    document.getElementById(`year${yearNumber}Average`).textContent = yearAvg.toFixed(2);
    
    // Check compensation eligibility
    const status1 = document.getElementById(`semester${semester1}Status`).textContent;
    const status2 = document.getElementById(`semester${semester2}Status`).textContent;
    
    const compensationElement = document.getElementById(`year${yearNumber}Compensation`);
    
    // Check if both semesters have all courses with grades
    const allGradesEntered = status1 !== 'غير مكتمل' && status2 !== 'غير مكتمل';
    
    // Check if any course in either semester is below 5
    const hasCourseBelowFive = 
        status1 === 'راسب' || 
        status2 === 'راسب';
    
    if (!allGradesEntered) {
        compensationElement.textContent = 'غير متاح';
        compensationElement.className = 'status neutral';
    } else if (hasCourseBelowFive) {
        compensationElement.textContent = 'غير ممكن';
        compensationElement.className = 'status danger';
    } else if (yearAvg >= 10) {
        compensationElement.textContent = 'ممكن';
        compensationElement.className = 'status success';
    } else {
        compensationElement.textContent = 'غير ممكن';
        compensationElement.className = 'status warning';
    }
}

// Calculate DEUG average (first 4 semesters)
function calculateDEUGAverage() {
    const avg1 = parseFloat(document.getElementById('semester1Average').textContent);
    const avg2 = parseFloat(document.getElementById('semester2Average').textContent);
    const avg3 = parseFloat(document.getElementById('semester3Average').textContent);
    const avg4 = parseFloat(document.getElementById('semester4Average').textContent);
    
    const deugAvg = (avg1 + avg2 + avg3 + avg4) / 4;
    
    document.getElementById('deugAverage').textContent = deugAvg.toFixed(2);
    
    const deugStatus = document.getElementById('deugStatus');
    
    // Check if all semesters have grades
    const allSemestersComplete = 
        document.getElementById('semester1Status').textContent !== 'غير مكتمل' &&
        document.getElementById('semester2Status').textContent !== 'غير مكتمل' &&
        document.getElementById('semester3Status').textContent !== 'غير مكتمل' &&
        document.getElementById('semester4Status').textContent !== 'غير مكتمل';
    
    // Check if any semester has a course below 5
    const hasCourseBelowFive = 
        document.getElementById('semester1Status').textContent === 'راسب' ||
        document.getElementById('semester2Status').textContent === 'راسب' ||
        document.getElementById('semester3Status').textContent === 'راسب' ||
        document.getElementById('semester4Status').textContent === 'راسب';
    
    if (!allSemestersComplete) {
        deugStatus.textContent = 'غير مكتمل';
        deugStatus.className = 'status neutral';
    } else if (hasCourseBelowFive) {
        deugStatus.textContent = 'غير ناجح';
        deugStatus.className = 'status danger';
    } else if (deugAvg >= 10) {
        deugStatus.textContent = 'ناجح';
        deugStatus.className = 'status success';
    } else {
        deugStatus.textContent = 'غير ناجح';
        deugStatus.className = 'status warning';
    }
}

// Calculate license average (all 6 semesters)
function calculateLicenseAverage() {
    const avg1 = parseFloat(document.getElementById('semester1Average').textContent);
    const avg2 = parseFloat(document.getElementById('semester2Average').textContent);
    const avg3 = parseFloat(document.getElementById('semester3Average').textContent);
    const avg4 = parseFloat(document.getElementById('semester4Average').textContent);
    const avg5 = parseFloat(document.getElementById('semester5Average').textContent);
    const avg6 = parseFloat(document.getElementById('semester6Average').textContent);
    
    const licenseAvg = (avg1 + avg2 + avg3 + avg4 + avg5 + avg6) / 6;
    
    document.getElementById('licenseAverage').textContent = licenseAvg.toFixed(2);
    document.getElementById('overallAverage').textContent = licenseAvg.toFixed(2);
    
    const licenseStatus = document.getElementById('licenseStatus');
    const licenseGrade = document.getElementById('licenseGrade');
    
    // Check if all semesters have grades
    const allSemestersComplete = 
        document.getElementById('semester1Status').textContent !== 'غير مكتمل' &&
        document.getElementById('semester2Status').textContent !== 'غير مكتمل' &&
        document.getElementById('semester3Status').textContent !== 'غير مكتمل' &&
        document.getElementById('semester4Status').textContent !== 'غير مكتمل' &&
        document.getElementById('semester5Status').textContent !== 'غير مكتمل' &&
        document.getElementById('semester6Status').textContent !== 'غير مكتمل';
    
    // Check if any semester has a course below 5
    const hasCourseBelowFive = 
        document.getElementById('semester1Status').textContent === 'راسب' ||
        document.getElementById('semester2Status').textContent === 'راسب' ||
        document.getElementById('semester3Status').textContent === 'راسب' ||
        document.getElementById('semester4Status').textContent === 'راسب' ||
        document.getElementById('semester5Status').textContent === 'راسب' ||
        document.getElementById('semester6Status').textContent === 'راسب';
    
    if (!allSemestersComplete) {
        licenseStatus.textContent = 'غير مكتمل';
        licenseStatus.className = 'status neutral';
        licenseGrade.textContent = '-';
    } else if (hasCourseBelowFive) {
        licenseStatus.textContent = 'غير ناجح';
        licenseStatus.className = 'status danger';
        licenseGrade.textContent = '-';
    } else if (licenseAvg >= 10) {
        licenseStatus.textContent = 'ناجح';
        licenseStatus.className = 'status success';
        
        // Determine grade
        if (licenseAvg >= 16) {
            licenseGrade.textContent = 'ممتاز';
        } else if (licenseAvg >= 14) {
            licenseGrade.textContent = 'جيد جدا';
        } else if (licenseAvg >= 12) {
            licenseGrade.textContent = 'جيد';
        } else {
            licenseGrade.textContent = 'مقبول';
        }
    } else {
        licenseStatus.textContent = 'غير ناجح';
        licenseStatus.className = 'status warning';
        licenseGrade.textContent = '-';
    }
}

// Calculate locked units and additional units
function calculateLockedUnits() {
    const lockedUnitsList = document.getElementById('lockedUnitsList');
    lockedUnitsList.innerHTML = '';
    
    let lockedUnits = [];
    let additionalUnits = [];
    
    // Check each course in the first 4 semesters
    for (let semester = 1; semester <= 4; semester++) {
        const courseCount = config[activeSystem].semesterCourses[semester];
        
        for (let course = 1; course <= courseCount; course++) {
            const key = `${semester}-${course}`;
            const courseId = calculateCourseId(semester, course);
            
            // If the course has a grade and it's below 10, lock the corresponding course
            if (grades[activeSystem][key] !== undefined && grades[activeSystem][key] < 10) {
                const lockedCourseKey = config[activeSystem].courseLockMap[key];
                
                if (lockedCourseKey) {
                    const [lockedSemester, lockedCourseId] = lockedCourseKey.split('-');
                    const actualLockedCourseId = calculateCourseId(parseInt(lockedSemester), parseInt(lockedCourseId));
                    
                    lockedUnits.push({
                        originalCourse: courseId,
                        lockedCourse: actualLockedCourseId,
                        semester: parseInt(lockedSemester)
                    });
                }
            }
        }
    }
    
    // Count locked units per year
    const year2LockedCount = lockedUnits.filter(unit => unit.semester === 3 || unit.semester === 4).length;
    const year3LockedCount = lockedUnits.filter(unit => unit.semester === 5 || unit.semester === 6).length;
    
    // Determine additional units
    // For year 2 (semesters 3-4)
    if (year2LockedCount <= 4) {
        // Can have up to 4 additional units
        const additionalCount = Math.min(4, 4 - year2LockedCount);
        
        for (let i = 0; i < additionalCount; i++) {
            if (lockedUnits.length > i) {
                const unit = lockedUnits[i];
                additionalUnits.push({
                    course: unit.lockedCourse,
                    semester: unit.semester
                });
                
                // Remove from locked units
                lockedUnits = lockedUnits.filter(u => 
                    u.lockedCourse !== unit.lockedCourse || 
                    u.semester !== unit.semester
                );
            }
        }
    }
    
    // For year 3 (semesters 5-6)
    if (year3LockedCount <= 4) {
        // Can have up to 4 additional units
        const additionalCount = Math.min(4, 4 - year3LockedCount);
        const year3LockedUnits = lockedUnits.filter(unit => unit.semester === 5 || unit.semester === 6);
        
        for (let i = 0; i < additionalCount; i++) {
            if (year3LockedUnits.length > i) {
                const unit = year3LockedUnits[i];
                additionalUnits.push({
                    course: unit.lockedCourse,
                    semester: unit.semester
                });
                
                // Remove from locked units
                lockedUnits = lockedUnits.filter(u => 
                    u.lockedCourse !== unit.lockedCourse || 
                    u.semester !== unit.semester
                );
            }
        }
    }
    
    // Update UI
    document.getElementById('lockedUnits').textContent = lockedUnits.length;
    document.getElementById('additionalUnits').textContent = additionalUnits.length;
    
    // Display locked units
    lockedUnits.forEach(unit => {
        const element = document.createElement('div');
        element.className = 'locked-unit-item locked';
        element.innerHTML = `
            <span>المادة ${unit.lockedCourse} (الفصل ${unit.semester})</span>
            <span>بسبب المادة ${unit.originalCourse}</span>
        `;
        lockedUnitsList.appendChild(element);
    });
    
    // Display additional units
    additionalUnits.forEach(unit => {
        const element = document.createElement('div');
        element.className = 'locked-unit-item additional';
        element.innerHTML = `
            <span>المادة ${unit.course} (الفصل ${unit.semester})</span>
            <span>وحدة إضافية</span>
        `;
        lockedUnitsList.appendChild(element);
    });
}

// Update progress percentage
function updateProgressPercentage() {
    const totalCourses = Object.values(config[activeSystem].semesterCourses).reduce((a, b) => a + b, 0);
    let completedCourses = 0;
    let passedCourses = 0;
    
    // Count completed and passed courses
    for (let semester = 1; semester <= 6; semester++) {
        const courseCount = config[activeSystem].semesterCourses[semester];
        
        for (let course = 1; course <= courseCount; course++) {
            const key = `${semester}-${course}`;
            
            if (grades[activeSystem][key] !== undefined) {
                completedCourses++;
                
                if (grades[activeSystem][key] >= 10) {
                    passedCourses++;
                }
            }
        }
    }
    
    const progressPercentage = Math.round((passedCourses / totalCourses) * 100);
    document.getElementById('progressPercentage').textContent = `${progressPercentage}%`;
    
    // Add a progress bar
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.width = `${progressPercentage}%`;
    
    progressContainer.appendChild(progressBar);
    
    const progressElement = document.getElementById('progressPercentage').parentNode;
    
    // Remove existing progress bar if any
    const existingProgressBar = progressElement.querySelector('.progress-container');
    if (existingProgressBar) {
        progressElement.removeChild(existingProgressBar);
    }
    
    progressElement.appendChild(progressContainer);
}