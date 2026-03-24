// The Nomad Wealth Atlas - JavaScript

(function() {
  'use strict';

  // ===== NAVIGATION SCROLL EFFECT =====
  const navbar = document.getElementById('navbar');
  
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ===== TAX CALCULATOR =====
  const incomeInput = document.getElementById('income');
  const incomeSlider = document.getElementById('incomeSlider');
  const incomeDisplay = document.getElementById('incomeDisplay');
  const currentCountry = document.getElementById('currentCountry');
  const targetCountry = document.getElementById('targetCountry');

  // Tax rates database
  const taxRates = {
    us: 0.33, uk: 0.45, ca: 0.535, au: 0.47, de: 0.45, fr: 0.50,
    jp: 0.559, nl: 0.495, es: 0.47, it: 0.43, se: 0.529, dk: 0.559,
    be: 0.50, at: 0.55, fi: 0.569, other: 0.35
  };

  const targetRates = {
    uae: 0, singapore: 0.15, hongkong: 0.15, switzerland: 0.20,
    malta: 0.05, cyprus: 0, portugal: 0.10, panama: 0, costarica: 0,
    paraguay: 0.10, bulgaria: 0.10, romania: 0.10, hungary: 0.15,
    estonia: 0.20, georgia: 0.01, thailand: 0.15, malaysia: 0.15,
    bahamas: 0, cayman: 0, bermuda: 0
  };

  // Format currency
  function formatCurrency(amount) {
    if (amount >= 1000000) return '$' + (amount / 1000000).toFixed(2) + 'M';
    if (amount >= 1000) return '$' + (amount / 1000).toFixed(0) + 'K';
    return '$' + amount.toFixed(0);
  }

  function formatFullCurrency(amount) {
    return '$' + amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  // Calculate and display results
  function calculateTax() {
    if (!incomeInput) return;

    const income = parseFloat(incomeInput.value) || 0;
    const currentRate = taxRates[currentCountry?.value] || 0.35;
    const targetRate = targetRates[targetCountry?.value] || 0;

    const currentTax = income * currentRate;
    const optimizedTax = income * targetRate;
    const savings = currentTax - optimizedTax;

    // Update display elements
    const currentTaxEl = document.getElementById('currentTax');
    const optimizedTaxEl = document.getElementById('optimizedTax');
    const currentRateEl = document.getElementById('currentRate');
    const optimizedRateEl = document.getElementById('optimizedRate');
    const annualSavingsEl = document.getElementById('annualSavings');
    const fiveYearEl = document.getElementById('fiveYearSavings');
    const tenYearEl = document.getElementById('tenYearSavings');
    const twentyYearEl = document.getElementById('twentyYearSavings');
    const thirtyYearEl = document.getElementById('thirtyYearSavings');

    if (currentTaxEl) currentTaxEl.textContent = formatFullCurrency(currentTax);
    if (optimizedTaxEl) optimizedTaxEl.textContent = formatFullCurrency(optimizedTax);
    if (currentRateEl) currentRateEl.textContent = (currentRate * 100).toFixed(1) + '%';
    if (optimizedRateEl) optimizedRateEl.textContent = (targetRate * 100).toFixed(1) + '%';
    if (annualSavingsEl) annualSavingsEl.textContent = formatFullCurrency(savings);
    if (fiveYearEl) fiveYearEl.textContent = formatFullCurrency(savings * 5);
    if (tenYearEl) tenYearEl.textContent = formatFullCurrency(savings * 10);
    if (twentyYearEl) twentyYearEl.textContent = formatFullCurrency(savings * 20);
    if (thirtyYearEl) thirtyYearEl.textContent = formatFullCurrency(savings * 30);
  }

  // Calculator event listeners
  if (incomeInput && incomeSlider) {
    incomeInput.addEventListener('input', function() {
      incomeSlider.value = this.value;
      if (incomeDisplay) incomeDisplay.textContent = formatFullCurrency(parseFloat(this.value) || 0);
      calculateTax();
    });

    incomeSlider.addEventListener('input', function() {
      incomeInput.value = this.value;
      if (incomeDisplay) incomeDisplay.textContent = formatFullCurrency(parseFloat(this.value) || 0);
      calculateTax();
    });

    if (currentCountry) currentCountry.addEventListener('change', calculateTax);
    if (targetCountry) targetCountry.addEventListener('change', calculateTax);

    // Initial calculation
    calculateTax();
  }

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== BUTTON RIPPLE EFFECT =====
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        left: ${x}px;
        top: ${y}px;
        width: 100px;
        height: 100px;
        margin-left: -50px;
        margin-top: -50px;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to { transform: scale(4); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // ===== SCROLL REVEAL =====
  const revealElements = document.querySelectorAll('.card, .strategy-card');
  
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
      revealObserver.observe(el);
    });
  }

  // ===== CONSOLE MESSAGE =====
  console.log('%c🌍 The Nomad Wealth Atlas', 'font-size: 24px; font-weight: bold; color: #0A84FF;');
  console.log('%cYour map to financial freedom', 'font-size: 14px; color: #737373;');

})();
