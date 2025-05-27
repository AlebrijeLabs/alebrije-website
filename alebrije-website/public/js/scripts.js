document.addEventListener('DOMContentLoaded', function() {
  // Countdown timer
  const launchDate = new Date('May 5, 2025 11:00:00').getTime();
  
  const countdownTimer = setInterval(function() {
    const now = new Date().getTime();
    const distance = launchDate - now;
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Update countdown if element exists
    const countdownElement = document.querySelector('.launch-countdown');
    if (countdownElement) {
      if (distance < 0) {
        clearInterval(countdownTimer);
        countdownElement.innerHTML = "Alebrije Token is LIVE!";
      } else {
        countdownElement.innerHTML = `Launching in: ${days}d ${hours}h ${minutes}m ${seconds}s`;
      }
    }
  }, 1000);
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Navbar color change on scroll
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  });
}); 