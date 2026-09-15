/**
 * OWW UIKit Documentation - Main Global Scripts
 * Handles theme toggling, toast notifications, code block copying, and TOC scrollspy.
 */

// Toast notification helper
function showToast(message, duration = 2000) {
  const toast = document.getElementById('copyToast');
  if (!toast) return;
  
  if (message) {
    toast.textContent = message;
  }
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
    // Reset to default text after fade out
    setTimeout(() => {
      toast.textContent = 'Copied to clipboard!';
    }, 300);
  }, duration);
}

// Copy Code Snippet function
function copyCode(btn) {
  const pre = btn.nextElementSibling;
  if (!pre) return;
  const code = pre.innerText;
  navigator.clipboard.writeText(code).then(() => {
    showToast('Copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy code: ', err);
  });
}

// Initialize Global UI Components
function initGlobal() {
  // Theme Toggle (Dark / Light)
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const iconSun = document.getElementById('themeIconSun');
  const iconMoon = document.getElementById('themeIconMoon');
  const htmlEl = document.documentElement;

  if (themeToggleBtn && iconSun && iconMoon) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', newTheme);
      
      if (newTheme === 'light') {
        iconSun.style.display = 'none';
        iconMoon.style.display = 'block';
      } else {
        iconSun.style.display = 'block';
        iconMoon.style.display = 'none';
      }
    });
  }

  // TOC Active ScrollSpy
  const sections = document.querySelectorAll('.doc-content__section');
  const tocLinks = document.querySelectorAll('.doc-toc__link');

  if (sections.length > 0 && tocLinks.length > 0) {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.pageYOffset >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      tocLinks.forEach(link => {
        link.classList.remove('is-active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('is-active');
        }
      });
    });
  }

  // Sidebar Active Component / Page Sync based on current page URL
  const currentPath = window.location.pathname.split('/').pop() || 'introduction.html';
  const effectivePath = (currentPath === 'index.html' || currentPath === '') ? 'introduction.html' : currentPath;
  const sidebarLinks = document.querySelectorAll('.doc-sidebar__link');
  sidebarLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const targetFile = href.split('#')[0];
    if (targetFile === effectivePath) {
      link.classList.add('is-active');
    } else if (targetFile && targetFile !== effectivePath) {
      link.classList.remove('is-active');
    }
  });
}

// Expose functions globally for inline HTML event handlers
window.copyCode = copyCode;
window.showToast = showToast;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobal);
} else {
  initGlobal();
}
