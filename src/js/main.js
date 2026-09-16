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


  // ---------------------------------------------------------------------------
  // Dropdown Component Logic: Selection, Checkmark, Live Search, Range Slider
  // ---------------------------------------------------------------------------
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest(".oww-dropdown__trigger");
    const allDropdowns = document.querySelectorAll(".oww-dropdown");

    if (trigger) {
      const dropdown = trigger.closest(".oww-dropdown");
      if (!dropdown) return;
      const isOpen = dropdown.classList.contains("is-open");
      allDropdowns.forEach(d => {
        d.classList.remove("is-open");
        const t = d.querySelector(".oww-dropdown__trigger");
        if (t) t.classList.remove("is-open");
      });
      if (!isOpen) {
        dropdown.classList.add("is-open");
        trigger.classList.add("is-open");
      }
      return;
    }

    const item = e.target.closest(".oww-dropdown__item");
    if (item) {
      const isActionItem = item.classList.contains("oww-dropdown__item--danger") || 
                           item.querySelector(".oww-dropdown__item-icon");

      if (!isActionItem) {
        // Selection handling with checkmark toggle
        const menuContainer = item.closest(".oww-dropdown__menu, .oww-dropdown__menu--scrollable");
        if (menuContainer) {
          const siblingItems = menuContainer.querySelectorAll(".oww-dropdown__item");
          siblingItems.forEach(sib => {
            sib.classList.remove("is-selected");
            sib.removeAttribute("aria-selected");
          });
          item.classList.add("is-selected");
          item.setAttribute("aria-selected", "true");

          // Ensure checkmark icon exists on selected item if not already present
          if (!item.querySelector(".oww-dropdown__item-check")) {
            const checkSpan = document.createElement("span");
            checkSpan.className = "oww-dropdown__item-check";
            checkSpan.innerHTML = '<img src="./dist/assets/icons/check.svg" alt="Selected" width="16" height="16">';
            item.appendChild(checkSpan);
          }
        }
      }

      // If inside an active trigger dropdown, update trigger and close
      const dropdown = item.closest(".oww-dropdown");
      if (dropdown && !item.classList.contains("oww-dropdown__item--no-close")) {
        const triggerText = dropdown.querySelector(".oww-dropdown__trigger-text");
        const itemText = item.querySelector(".oww-dropdown__item-text");
        if (triggerText && itemText) {
          triggerText.textContent = itemText.textContent.trim();
        }
        dropdown.classList.remove("is-open");
        const t = dropdown.querySelector(".oww-dropdown__trigger");
        if (t) t.classList.remove("is-open");
      }
      return;
    }

    // Radio item selection in filter dropdown
    const radioItem = e.target.closest(".oww-dropdown__radio-item");
    if (radioItem) {
      const radioGroup = radioItem.closest(".oww-dropdown__radio-group");
      if (radioGroup) {
        radioGroup.querySelectorAll(".oww-dropdown__radio-item").forEach(r => {
          r.classList.remove("is-checked");
          r.classList.remove("is-active");
        });
        radioItem.classList.add("is-checked");
        radioItem.classList.add("is-active");
      }
      return;
    }

    // If clicking inside menu (e.g. search input, range slider), do not close
    if (e.target.closest(".oww-dropdown__menu")) {
      return;
    }

    // Close all dropdowns when clicking outside
    allDropdowns.forEach(d => {
      d.classList.remove("is-open");
      const t = d.querySelector(".oww-dropdown__trigger");
      if (t) t.classList.remove("is-open");
    });
  });

  // Country Code Live Search Filter
  document.addEventListener("input", (e) => {
    const searchInput = e.target.closest(".oww-dropdown__search input");
    if (!searchInput) return;
    const menu = searchInput.closest(".oww-dropdown__menu");
    if (!menu) return;
    const query = searchInput.value.toLowerCase().trim();
    const items = menu.querySelectorAll(".oww-dropdown__item");
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!query || text.includes(query)) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  });

  // Price Range Slider Controller (Dual-Point Rail Slider: Min & Max Adjusters)
  function initRangeSliders() {
    const sliders = document.querySelectorAll(".oww-dropdown__range-slider");
    sliders.forEach(slider => {
      const track = slider.querySelector(".oww-dropdown__range-slider-track");
      const minThumb = slider.querySelector(".oww-dropdown__range-slider-thumb--min");
      const maxThumb = slider.querySelector(".oww-dropdown__range-slider-thumb--max");
      const minLabel = slider.querySelector(".oww-dropdown__range-val-min");
      const maxLabel = slider.querySelector(".oww-dropdown__range-val-max");

      if (!track || !minThumb || !maxThumb) return;

      const minLimit = parseFloat(slider.getAttribute("data-min") || "0");
      const maxLimit = parseFloat(slider.getAttribute("data-max") || "300000");
      const step = parseFloat(slider.getAttribute("data-step") || "5000");

      let currentMin = parseFloat(slider.getAttribute("data-val-min") || "20000");
      let currentMax = parseFloat(slider.getAttribute("data-val-max") || "150000");

      function render() {
        const minPct = ((currentMin - minLimit) / (maxLimit - minLimit)) * 100;
        const maxPct = ((currentMax - minLimit) / (maxLimit - minLimit)) * 100;

        slider.style.setProperty("--range-left", minPct + "%");
        slider.style.setProperty("--range-width", (maxPct - minPct) + "%");
        slider.style.setProperty("--thumb-min-left", minPct + "%");
        slider.style.setProperty("--thumb-max-left", maxPct + "%");

        minThumb.setAttribute("aria-valuenow", currentMin);
        maxThumb.setAttribute("aria-valuenow", currentMax);

        slider.setAttribute("data-val-min", currentMin);
        slider.setAttribute("data-val-max", currentMax);

        if (minLabel) minLabel.textContent = "Min (" + Math.round(currentMin).toLocaleString("en-US") + ")";
        if (maxLabel) maxLabel.textContent = "Max (" + Math.round(currentMax).toLocaleString("en-US") + ")";
      }

      function valueFromClientX(clientX) {
        const rect = track.getBoundingClientRect();
        const ratio = Math.min(Math.max(0, (clientX - rect.left) / rect.width), 1);
        const rawVal = minLimit + ratio * (maxLimit - minLimit);
        const steppedVal = Math.round(rawVal / step) * step;
        return Math.min(Math.max(minLimit, steppedVal), maxLimit);
      }

      function setupThumb(thumb, isMin) {
        let isDragging = false;

        function onPointerDown(e) {
          e.preventDefault();
          e.stopPropagation();
          isDragging = true;
          thumb.classList.add("is-dragging");
          thumb.focus();
          try {
            thumb.setPointerCapture(e.pointerId);
          } catch (_) {}

          function onPointerMove(moveEvent) {
            if (!isDragging) return;
            const val = valueFromClientX(moveEvent.clientX);
            if (isMin) {
              currentMin = Math.min(val, currentMax - step);
            } else {
              currentMax = Math.max(val, currentMin + step);
            }
            render();
          }

          function onPointerUp(upEvent) {
            if (!isDragging) return;
            isDragging = false;
            thumb.classList.remove("is-dragging");
            try {
              thumb.releasePointerCapture(upEvent.pointerId);
            } catch (_) {}
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
            window.removeEventListener("pointercancel", onPointerUp);
          }

          window.addEventListener("pointermove", onPointerMove);
          window.addEventListener("pointerup", onPointerUp);
          window.addEventListener("pointercancel", onPointerUp);
        }

        thumb.addEventListener("pointerdown", onPointerDown);

        // Keyboard navigation (arrows)
        thumb.addEventListener("keydown", (e) => {
          let delta = 0;
          if (e.key === "ArrowLeft" || e.key === "ArrowDown") delta = -step;
          else if (e.key === "ArrowRight" || e.key === "ArrowUp") delta = step;
          else if (e.key === "Home") delta = -Infinity;
          else if (e.key === "End") delta = Infinity;

          if (delta !== 0) {
            e.preventDefault();
            if (isMin) {
              if (delta === -Infinity) currentMin = minLimit;
              else if (delta === Infinity) currentMin = currentMax - step;
              else currentMin = Math.min(Math.max(minLimit, currentMin + delta), currentMax - step);
            } else {
              if (delta === -Infinity) currentMax = currentMin + step;
              else if (delta === Infinity) currentMax = maxLimit;
              else currentMax = Math.max(Math.min(maxLimit, currentMax + delta), currentMin + step);
            }
            render();
          }
        });
      }

      setupThumb(minThumb, true);
      setupThumb(maxThumb, false);

      // Clicking on track moves closest point and initiates dragging
      track.addEventListener("pointerdown", (e) => {
        if (e.target === minThumb || e.target === maxThumb) return;
        const clickVal = valueFromClientX(e.clientX);
        const distToMin = Math.abs(clickVal - currentMin);
        const distToMax = Math.abs(clickVal - currentMax);

        if (distToMin <= distToMax) {
          currentMin = Math.min(clickVal, currentMax - step);
          render();
          minThumb.dispatchEvent(new PointerEvent("pointerdown", e));
        } else {
          currentMax = Math.max(clickVal, currentMin + step);
          render();
          maxThumb.dispatchEvent(new PointerEvent("pointerdown", e));
        }
      });

      // Mouse wheel adjustment
      slider.addEventListener("wheel", (e) => {
        e.preventDefault();
        const rect = track.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const midPct = ((currentMin + currentMax) / (2 * (maxLimit - minLimit)));
        const isCloserToMin = (mouseX / rect.width) < midPct;
        const delta = e.deltaY < 0 ? step : -step;

        if (isCloserToMin) {
          currentMin = Math.min(Math.max(minLimit, currentMin + delta), currentMax - step);
        } else {
          currentMax = Math.max(Math.min(maxLimit, currentMax + delta), currentMin + step);
        }
        render();
      }, { passive: false });

      // Initial render
      render();

      slider._resetRange = function() {
        currentMin = 20000;
        currentMax = 150000;
        render();
      };
    });
  }

  initRangeSliders();

  // Sidebar Active Component / Page Sync based on current page URL
  const currentPath = window.location.pathname.split('/').pop() || 'introduction.html';
  const effectivePath = (currentPath === 'index.html' || currentPath === '') ? 'introduction.html' : currentPath;
  const sidebarLinks = document.querySelectorAll('.doc-sidebar__link');
  sidebarLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    // Only exact page/component link (no hash anchors) should be active
    if (href === effectivePath) {
      link.classList.add('is-active');
    } else {
      link.classList.remove('is-active');
    }
  });
}

// Expose functions globally for inline HTML event handlers

function resetFilters(btn) {
  const menu = btn.closest(".oww-dropdown__menu");
  if (!menu) return;
  const slider = menu.querySelector(".oww-dropdown__range-slider");
  if (slider && typeof slider._resetRange === "function") {
    slider._resetRange();
  }
  const radioGroup = menu.querySelector(".oww-dropdown__radio-group");
  if (radioGroup) {
    const radios = radioGroup.querySelectorAll(".oww-dropdown__radio-item");
    radios.forEach((r, idx) => {
      if (idx === 0) {
        r.classList.add("is-checked", "is-active");
      } else {
        r.classList.remove("is-checked", "is-active");
      }
    });
  }
  showToast("Filters reset to default");
}

function applyFilters(btn) {
  const menu = btn.closest(".oww-dropdown__menu");
  let minText = "20,000", maxText = "150,000", sortText = "Newest First";
  if (menu) {
    const minLabel = menu.querySelector(".oww-dropdown__range-val-min");
    const maxLabel = menu.querySelector(".oww-dropdown__range-val-max");
    const checkedRadio = menu.querySelector(".oww-dropdown__radio-item.is-checked");
    if (minLabel) minText = minLabel.textContent.replace("Min (", "").replace(")", "").trim();
    if (maxLabel) maxText = maxLabel.textContent.replace("Max (", "").replace(")", "").trim();
    if (checkedRadio) sortText = checkedRadio.textContent.trim();
  }
  showToast("Filters applied: Min (" + minText + ") - Max (" + maxText + "), " + sortText);
}

window.resetFilters = resetFilters;
window.applyFilters = applyFilters;

window.copyCode = copyCode;
window.showToast = showToast;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobal);
} else {
  initGlobal();
}
