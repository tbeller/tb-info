document.addEventListener('DOMContentLoaded', () => {

    // Fetch visitor count from Azure Function
    async function fetchVisitorCount() {
        try {
            const response = await fetch('/api/visitorCounter');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const count = await response.text();
            document.getElementById('visitorCount').textContent = count;
        } catch (error) {
            document.getElementById('visitorCount').textContent = 'Visitor count: unavailable';
        }
    }
    fetchVisitorCount();

    // Update the current year in the footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Dark theme auto-detection and manual toggle
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    function setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggles.forEach(btn => btn.innerHTML = '<i class="fas fa-sun"></i>');
        } else {
            document.body.classList.remove('dark-mode');
            themeToggles.forEach(btn => btn.innerHTML = '<i class="fas fa-moon"></i>');
        }
    }

    if (currentTheme) {
        setTheme(currentTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    }

    themeToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            if (document.body.classList.contains('dark-mode')) {
                setTheme('light');
                localStorage.setItem('theme', 'light');
            } else {
                setTheme('dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    });

    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }

                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle resume download button
    const downloadResumeBtn = document.getElementById('downloadResume');
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', function (e) {
            e.preventDefault();

            const resumeUrl = 'assets/documents/Tom Beller - Resume.pdf';
            const link = document.createElement('a');
            link.href = resumeUrl;
            link.download = 'Tom Beller - Resume.pdf';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // Hide scroll indicator on scroll and enable smooth scroll on click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        });
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.querySelector('#about');
            if (nextSection) {
                window.scrollTo({
                    top: nextSection.offsetTop - 70, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    }
});