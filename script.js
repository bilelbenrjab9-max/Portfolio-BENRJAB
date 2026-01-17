/**
 * Engineering Portfolio - JavaScript
 * Handles navigation, animations, and interactive features
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all modules
  initNavigation()
  initScrollAnimations()
  initSkillBars()
  initCounters()
  initLightbox()
  initContactForm()
})

/**
 * Navigation Module
 * Handles sticky nav, mobile menu, and smooth scrolling
 */
function initNavigation() {
  const navbar = document.querySelector(".navbar")
  const navToggle = document.querySelector(".nav-toggle")
  const navMenu = document.querySelector(".nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")

  // Sticky navbar on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // Mobile menu toggle
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active")
    navMenu.classList.toggle("active")
    document.body.style.overflow = navMenu.classList.contains("active") ? "hidden" : ""
  })

  // Close mobile menu on link click
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active")
      navMenu.classList.remove("active")
      document.body.style.overflow = ""
    })
  })

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        const headerOffset = 80
        const elementPosition = target.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })
      }
    })
  })

  // Active link highlighting based on scroll position
  const sections = document.querySelectorAll("section[id]")

  function highlightNavLink() {
    const scrollY = window.pageYOffset

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight
      const sectionTop = section.offsetTop - 150
      const sectionId = section.getAttribute("id")
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`)

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach((link) => link.classList.remove("active"))
          navLink.classList.add("active")
        }
      }
    })
  }

  window.addEventListener("scroll", highlightNavLink)
}

/**
 * Scroll Animations Module
 * Handles reveal animations on scroll using Intersection Observer
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right")

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active")
        // Optional: unobserve after animation
        // observer.unobserve(entry.target);
      }
    })
  }, observerOptions)

  revealElements.forEach((element) => {
    observer.observe(element)
  })
}

/**
 * Skill Bars Animation Module
 * Animates progress bars when they come into view
 */
function initSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress")

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute("data-width")
        entry.target.style.width = `${width}%`
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  skillBars.forEach((bar) => {
    observer.observe(bar)
  })
}

/**
 * Counter Animation Module
 * Animates statistics numbers counting up
 */
function initCounters() {
  const counters = document.querySelectorAll(".stat-number")

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = Number.parseInt(entry.target.getAttribute("data-count"))
        animateCounter(entry.target, target)
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  counters.forEach((counter) => {
    observer.observe(counter)
  })
}

/**
 * Animate counter from 0 to target value
 * @param {HTMLElement} element - The counter element
 * @param {number} target - Target number to count to
 */
function animateCounter(element, target) {
  const duration = 2000 // Animation duration in ms
  const frameDuration = 1000 / 60 // 60fps
  const totalFrames = Math.round(duration / frameDuration)
  const easeOutQuad = (t) => t * (2 - t) // Easing function

  let frame = 0
  const countUp = () => {
    frame++
    const progress = easeOutQuad(frame / totalFrames)
    const current = Math.round(target * progress)

    element.textContent = current + "+"

    if (frame < totalFrames) {
      requestAnimationFrame(countUp)
    }
  }

  countUp()
}

/**
 * Lightbox Module
 * Handles image gallery lightbox functionality
 */
function initLightbox() {
  const lightbox = document.getElementById("lightbox")
  const lightboxImage = lightbox.querySelector(".lightbox-image")
  const lightboxClose = lightbox.querySelector(".lightbox-close")
  const lightboxPrev = lightbox.querySelector(".lightbox-prev")
  const lightboxNext = lightbox.querySelector(".lightbox-next")
  const galleryItems = document.querySelectorAll(".gallery-item")

  let currentIndex = 0
  const images = []

  // Collect all gallery images
  galleryItems.forEach((item, index) => {
    const img = item.querySelector("img")
    images.push(img.src)

    item.addEventListener("click", () => {
      currentIndex = index
      openLightbox(images[currentIndex])
    })
  })

  // Open lightbox
  function openLightbox(src) {
    lightboxImage.src = src
    lightbox.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove("active")
    document.body.style.overflow = ""
  }

  // Navigate to previous image
  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length
    lightboxImage.src = images[currentIndex]
  }

  // Navigate to next image
  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length
    lightboxImage.src = images[currentIndex]
  }

  // Event listeners
  lightboxClose.addEventListener("click", closeLightbox)
  lightboxPrev.addEventListener("click", prevImage)
  lightboxNext.addEventListener("click", nextImage)

  // Close on background click
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox()
    }
  })

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return

    switch (e.key) {
      case "Escape":
        closeLightbox()
        break
      case "ArrowLeft":
        prevImage()
        break
      case "ArrowRight":
        nextImage()
        break
    }
  })
}

/**
 * Contact Form Module
 * Handles form validation and submission
 */
function initContactForm() {
  const form = document.getElementById("contactForm")

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form values
    const formData = {
      name: form.querySelector("#name").value,
      email: form.querySelector("#email").value,
      subject: form.querySelector("#subject").value,
      message: form.querySelector("#message").value,
    }

    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showNotification("Please fill in all fields", "error")
      return
    }

    if (!isValidEmail(formData.email)) {
      showNotification("Please enter a valid email address", "error")
      return
    }

    // Simulate form submission (replace with actual API call)
    const submitBtn = form.querySelector(".btn-submit")
    const originalText = submitBtn.innerHTML
    submitBtn.innerHTML = "<span>Sending...</span>"
    submitBtn.disabled = true

    setTimeout(() => {
      // Reset form
      form.reset()
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false
      showNotification("Message sent successfully!", "success")
    }, 1500)
  })
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - Whether email is valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification ('success' or 'error')
 */
function showNotification(message, type) {
  // Remove existing notification
  const existingNotification = document.querySelector(".notification")
  if (existingNotification) {
    existingNotification.remove()
  }

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
    <span>${message}</span>
    <button class="notification-close">&times;</button>
  `

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 15px 40px 15px 20px;
    background: ${type === "success" ? "#00d4ff" : "#ff4757"};
    color: ${type === "success" ? "#0a192f" : "#fff"};
    border-radius: 8px;
    font-weight: 500;
    z-index: 3000;
    animation: slideInRight 0.4s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  `

  // Add animation keyframes if not exists
  if (!document.querySelector("#notification-styles")) {
    const style = document.createElement("style")
    style.id = "notification-styles"
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `
    document.head.appendChild(style)
  }

  document.body.appendChild(notification)

  // Close button
  const closeBtn = notification.querySelector(".notification-close")
  closeBtn.style.cssText = `
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: inherit;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 5px;
  `
  closeBtn.addEventListener("click", () => notification.remove())

  // Auto remove after 4 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = "slideInRight 0.4s ease reverse"
      setTimeout(() => notification.remove(), 400)
    }
  }, 4000)
}

/**
 * Parallax effect for background elements (optional enhancement)
 */
window.addEventListener("scroll", () => {
  const scrollY = window.pageYOffset
  const bgGrid = document.querySelector(".bg-grid")
  const bgDots = document.querySelector(".bg-dots")

  if (bgGrid) {
    bgGrid.style.transform = `translateY(${scrollY * 0.1}px)`
  }
  if (bgDots) {
    bgDots.style.transform = `translateY(${scrollY * 0.05}px)`
  }
})
