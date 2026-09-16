/**
 * OWW UIKit Documentation - Main Global Scripts
 * Handles theme toggling, toast notifications, code block copying, and TOC scrollspy.
 */

// Immediate Theme Initialization (restores saved theme preference immediately)
(function () {
  try {
    const saved = localStorage.getItem("oww-theme") || document.documentElement.getAttribute("data-theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
  } catch (e) {}
})();

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

// =============================================================================
// Theme Management (Dark / Light) with LocalStorage Persistence
// =============================================================================
function applyTheme(theme) {
  const htmlEl = document.documentElement;
  const iconSun = document.getElementById('themeIconSun');
  const iconMoon = document.getElementById('themeIconMoon');
  const themeToggleBtn = document.getElementById('themeToggleBtn');

  htmlEl.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('oww-theme', theme);
  } catch (e) {
    // Graceful fallback
  }

  if (iconSun && iconMoon) {
    if (theme === 'light') {
      iconSun.style.display = 'none';
      iconMoon.style.display = 'block';
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('title', 'Switch to dark theme');
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
      }
    } else {
      iconSun.style.display = 'block';
      iconMoon.style.display = 'none';
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('title', 'Switch to light theme');
        themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
      }
    }
  }
}

function initTheme() {
  const htmlEl = document.documentElement;
  let savedTheme = 'dark';
  try {
    savedTheme = localStorage.getItem('oww-theme') || htmlEl.getAttribute('data-theme') || 'dark';
  } catch (e) {
    savedTheme = htmlEl.getAttribute('data-theme') || 'dark';
  }

  applyTheme(savedTheme);

  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn && !themeToggleBtn.dataset.themeBound) {
    themeToggleBtn.dataset.themeBound = 'true';
    themeToggleBtn.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }
}

// Initialize Global UI Components
function initGlobal() {
  // Theme Manager
  initTheme();

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

  // ---------------------------------------------------------------------------
  // File Upload Component Controller (Interactive Drag & Drop, Simulated Progress)
  // ---------------------------------------------------------------------------
  function initFileUploads() {
    const uploadContainers = document.querySelectorAll(".oww-file-upload");

    uploadContainers.forEach(container => {
      const dropzone = container.querySelector(".oww-file-upload__dropzone");
      const fileInput = container.querySelector("input[type='file']");
      const bodyDefault = container.querySelector(".oww-file-upload__body--default");
      const bodyUploading = container.querySelector(".oww-file-upload__body--uploading");
      const bodyApplied = container.querySelector(".oww-file-upload__body--applied");
      const bodyError = container.querySelector(".oww-file-upload__body--error");
      const progressText = container.querySelector(".oww-file-upload__progress-text");
      const progressBar = container.querySelector(".oww-file-upload__progress-bar");
      const errorTextEl = container.querySelector(".oww-file-upload__error-text");

      if (!dropzone) return;

      let uploadTimer = null;

      function setDropzoneState(state, customErrorMsg) {
        dropzone.classList.remove("is-dragover", "is-uploading", "is-applied", "is-error");
        if (bodyDefault) bodyDefault.style.display = "none";
        if (bodyUploading) bodyUploading.style.display = "none";
        if (bodyApplied) bodyApplied.style.display = "none";
        if (bodyError) bodyError.style.display = "none";
        if (errorTextEl) errorTextEl.style.display = "none";

        if (state === "default") {
          dropzone.style.backgroundImage = "";
          if (bodyDefault) bodyDefault.style.display = "flex";
          if (fileInput) fileInput.value = "";
        } else if (state === "dragover") {
          dropzone.classList.add("is-dragover");
          if (bodyDefault) bodyDefault.style.display = "flex";
        } else if (state === "uploading") {
          dropzone.classList.add("is-uploading");
          if (bodyUploading) bodyUploading.style.display = "flex";
        } else if (state === "applied") {
          dropzone.classList.add("is-applied");
          if (bodyApplied) bodyApplied.style.display = "flex";
        } else if (state === "error") {
          dropzone.classList.add("is-error");
          if (bodyError) bodyError.style.display = "flex";
          if (errorTextEl) {
            errorTextEl.style.display = "block";
            if (customErrorMsg) errorTextEl.textContent = customErrorMsg;
          }
        }
      }

      function startUpload(file) {
        // Validate file size: max 2MB (2 * 1024 * 1024 = 2097152 bytes)
        if (file && file.size > 2 * 1024 * 1024) {
          setDropzoneState("error", "File size exceeds 2 MB. Please upload a smaller image.");
          showToast("Upload failed: File exceeds 2 MB limit");
          return;
        }

        // Validate format
        if (file && !file.type.match(/^image\/(jpeg|png|webp)$/i)) {
          setDropzoneState("error", "Unsupported file format. Only JPG and PNG are accepted.");
          showToast("Upload failed: Invalid format");
          return;
        }

        setDropzoneState("uploading");
        let progress = 0;
        if (progressText) progressText.textContent = "0%";
        if (progressBar) progressBar.style.width = "0%";

        clearInterval(uploadTimer);
        uploadTimer = setInterval(() => {
          progress += Math.floor(Math.random() * 20) + 15;
          if (progress >= 100) {
            progress = 100;
            clearInterval(uploadTimer);
            if (progressText) progressText.textContent = "100%";
            if (progressBar) progressBar.style.width = "100%";

            setTimeout(() => {
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  dropzone.style.backgroundImage = "url(" + e.target.result + ")";
                  setDropzoneState("applied");
                  showToast("File uploaded successfully: " + file.name);
                };
                reader.readAsDataURL(file);
              } else {
                dropzone.style.backgroundImage = "url(./dist/assets/images/product-sample.png)";
                setDropzoneState("applied");
                showToast("File uploaded successfully!");
              }
            }, 300);
          } else {
            if (progressText) progressText.textContent = progress + "%";
            if (progressBar) progressBar.style.width = progress + "%";
          }
        }, 150);
      }

      // Drag and Drop events
      dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!dropzone.classList.contains("is-uploading") && !dropzone.classList.contains("is-applied")) {
          dropzone.classList.add("is-dragover");
        }
      });

      dropzone.addEventListener("dragleave", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove("is-dragover");
      });

      dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove("is-dragover");
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
          startUpload(e.dataTransfer.files[0]);
        }
      });

      // File input change
      if (fileInput) {
        fileInput.addEventListener("change", (e) => {
          if (e.target.files && e.target.files.length) {
            startUpload(e.target.files[0]);
          }
        });
      }

      // Cancel button during upload
      const cancelBtn = container.querySelector(".oww-file-upload__cancel-btn");
      if (cancelBtn) {
        cancelBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          clearInterval(uploadTimer);
          setDropzoneState("default");
          showToast("Upload cancelled");
        });
      }

      // Remove button on applied state
      const removeBtn = container.querySelector(".oww-file-upload__remove-btn");
      if (removeBtn) {
        removeBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          setDropzoneState("default");
          showToast("Cover removed");
        });
      }

      // Change Cover button on applied state
      const changeBtn = container.querySelector(".oww-file-upload__change-btn");
      if (changeBtn && fileInput) {
        changeBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          fileInput.click();
        });
      }

      // Store simulation helpers on DOM container
      container._simulateUpload = () => startUpload(null);
      container._simulateError = () => setDropzoneState("error", "Simulated error: Upload failed due to network timeout.");
      container._resetUpload = () => setDropzoneState("default");
    });
  }

  initFileUploads();


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

function removeMiniUpload(btn) {
  const item = btn.closest(".oww-file-upload-mini");
  if (item) {
    item.style.transition = "opacity 0.2s ease, transform 0.2s ease";
    item.style.opacity = "0";
    item.style.transform = "scale(0.8)";
    setTimeout(() => {
      item.style.display = "none";
    }, 200);
    showToast("Media item removed");
  }
}

window.removeMiniUpload = removeMiniUpload;
window.applyTheme = applyTheme;
window.initTheme = initTheme;


window.copyCode = copyCode;
window.showToast = showToast;

// Auto-initialize when DOM is ready
initTheme();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobal);
} else {
  initGlobal();
}
