document.addEventListener("DOMContentLoaded", () => {
    /* 1. TERMINAL PRELOADER */
    const preloader = document.getElementById("preloader");
    const bootLog = document.getElementById("terminal-boot-log");
    const bootSequence = [
        "[OK] Mounting OMNI-TECH-HUB kernel modules...",
        "[OK] Initializing Mechatronics & Digital Logic arrays...",
        "[OK] Loading Alphacodes security perimeter...",
        "[READY] System online. Awaiting operator authentication."
    ];

    let lineIndex = 0;
    const bootTimer = setInterval(() => {
        if (lineIndex < bootSequence.length && bootLog) {
            const logDiv = document.createElement("div");
            logDiv.className = "log-line";
            logDiv.textContent = bootSequence[lineIndex];
            bootLog.appendChild(logDiv);
            lineIndex++;
        } else {
            clearInterval(bootTimer);
            if (preloader) {
                setTimeout(() => {
                    preloader.style.opacity = "0";
                    setTimeout(() => preloader.classList.add("hidden"), 450);
                }, 400);
            }
        }
    }, 300);

    /* 2. ALPHACODES LOGIN GATE & OPT-OUT CONTROLS */
    const loginScreen = document.getElementById("login-screen");
    const portfolioContent = document.getElementById("portfolio-content");
    const loginForm = document.getElementById("login-form");
    const passwordInput = document.getElementById("password-input");
    const errorMessage = document.getElementById("error-message");
    const optoutBtn = document.getElementById("optout-btn");
    const ACCESS_TOKEN = "Alpha-codes";

    function unlockPortfolio() {
        if (loginScreen) loginScreen.classList.add("hidden");
        if (portfolioContent) portfolioContent.classList.remove("hidden");
        if (errorMessage) errorMessage.textContent = "";
    }

    function lockPortfolio() {
        sessionStorage.removeItem("omni_auth_granted");
        if (portfolioContent) portfolioContent.classList.add("hidden");
        if (loginScreen) loginScreen.classList.remove("hidden");
        if (passwordInput) passwordInput.value = "";
        if (errorMessage) errorMessage.textContent = "";
    }

    if (sessionStorage.getItem("omni_auth_granted") === "true") {
        unlockPortfolio();
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (passwordInput.value.trim() === ACCESS_TOKEN) {
                errorMessage.style.color = "var(--success-color)";
                errorMessage.textContent = "ACCESS GRANTED — Initializing Workspace...";
                sessionStorage.setItem("omni_auth_granted", "true");
                setTimeout(unlockPortfolio, 450);
            } else {
                errorMessage.style.color = "var(--danger-color)";
                errorMessage.textContent = "ACCESS DENIED — Invalid Security Token.";
                passwordInput.value = "";
                passwordInput.focus();
            }
        });
    }

    if (optoutBtn) {
        optoutBtn.addEventListener("click", lockPortfolio);
    }

    /* 3. REAL VECTOR SVG SOCIAL ICONS (Locked to 22x22px) */
    const SOCIAL_SVGS = {
        github: `<svg width="22" height="22" style="width:22px;height:22px;" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
        youtube: `<svg width="22" height="22" style="width:22px;height:22px;" viewBox="0 0 24 24" fill="#ff0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
        facebook: `<svg width="22" height="22" style="width:22px;height:22px;" viewBox="0 0 24 24" fill="#1877f2"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>`,
        instagram: `<svg width="22" height="22" style="width:22px;height:22px;" viewBox="0 0 24 24" fill="#e1306c"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`
    };

    function renderSocialIcons(links) {
        const container = document.getElementById("social-badges-container") || document.querySelector(".social-badges");
        if (!container) return;
        container.innerHTML = `
            ${links.github ? `<a href="${links.github}" target="_blank" class="social-icon-link github" aria-label="GitHub" title="GitHub">${SOCIAL_SVGS.github}</a>` : ""}
            ${links.youtube ? `<a href="${links.youtube}" target="_blank" class="social-icon-link youtube" aria-label="YouTube" title="YouTube">${SOCIAL_SVGS.youtube}</a>` : ""}
            ${links.facebook ? `<a href="${links.facebook}" target="_blank" class="social-icon-link facebook" aria-label="Facebook" title="Facebook">${SOCIAL_SVGS.facebook}</a>` : ""}
            ${links.instagram ? `<a href="${links.instagram}" target="_blank" class="social-icon-link instagram" aria-label="Instagram" title="Instagram">${SOCIAL_SVGS.instagram}</a>` : ""}
        `;
    }

    renderSocialIcons({
        github: "https://github.com",
        youtube: "https://youtube.com",
        facebook: "https://facebook.com",
        instagram: "https://instagram.com"
    });

    /* 4. DARK / LIGHT THEME TOGGLE */
    const themeToggle = document.getElementById("theme-toggle");
    if (localStorage.getItem("omni_theme") === "light") {
        document.body.classList.add("light-mode");
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            const isLight = document.body.classList.contains("light-mode");
            localStorage.setItem("omni_theme", isLight ? "light" : "dark");
            themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    /* 5. HERO TYPING ANIMATION */
    const typingElement = document.getElementById("typing-animation");
    const specialties = [
        "Robotics & Mechatronics Engineering",
        "Python & Automation Logic",
        "Excel Macros & Data Modeling",
        "Cybersecurity Defense Arrays",
        "3D Printing & Rapid Prototyping"
    ];
    let wordIdx = 0, charIdx = 0, isDeleting = false;

    function runTypingEffect() {
        if (!typingElement) return;
        const currentWord = specialties[wordIdx];
        typingElement.textContent = isDeleting
            ? currentWord.substring(0, --charIdx)
            : currentWord.substring(0, ++charIdx);

        let speed = isDeleting ? 40 : 80;
        if (!isDeleting && charIdx === currentWord.length) {
            speed = 1600;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % specialties.length;
            speed = 350;
        }
        setTimeout(runTypingEffect, speed);
    }
    runTypingEffect();

    /* 6. PDF & VIDEO UPLOAD HANDLER (Projects & Certificates) */
    function setupMediaUploader(titleInputId, fileInputId, btnId, gridId, cardClass) {
        const titleInput = document.getElementById(titleInputId);
        const fileInput = document.getElementById(fileInputId);
        const addBtn = document.getElementById(btnId);
        const grid = document.getElementById(gridId);

        if (!addBtn || !fileInput || !grid) return;

        addBtn.addEventListener("click", () => {
            const selectedFile = fileInput.files && fileInput.files[0];
            if (!selectedFile) {
                alert("Please select a PDF or Video file first.");
                return;
            }

            const isPdf = selectedFile.type === "application/pdf";
            const isVideo = selectedFile.type.startsWith("video/");
            if (!isPdf && !isVideo) {
                alert("Please select a PDF or Video file.");
                return;
            }

            const card = document.createElement("div");
            card.className = cardClass;
            const heading = document.createElement("h3");
            heading.textContent = titleInput && titleInput.value.trim()
                ? titleInput.value.trim()
                : selectedFile.name;

            const mediaUrl = URL.createObjectURL(selectedFile);
            let mediaElement;
            if (isPdf) {
                mediaElement = document.createElement("a");
                mediaElement.href = mediaUrl;
                mediaElement.target = "_blank";
                mediaElement.rel = "noopener noreferrer";
                mediaElement.textContent = "View PDF";
            } else {
                mediaElement = document.createElement("video");
                mediaElement.src = mediaUrl;
                mediaElement.controls = true;
                mediaElement.preload = "metadata";
            }

            card.append(heading, mediaElement);
            grid.appendChild(card);
            if (titleInput) titleInput.value = "";
            fileInput.value = "";
        });
    }

    setupMediaUploader("project-title", "project-file", "add-project-btn", "projects-grid", "project-card");
    setupMediaUploader("certificate-title", "certificate-file", "add-certificate-btn", "certificates-grid", "certificate-card");
});

