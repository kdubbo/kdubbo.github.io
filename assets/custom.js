// Custom JavaScript for DSM Documentation

document.addEventListener('DOMContentLoaded', function() {
  // Add smooth scroll behavior
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add copy button functionality enhancement
  const codeBlocks = document.querySelectorAll('pre code');
  codeBlocks.forEach(block => {
    block.style.backgroundColor = '#000000';
    block.style.color = '#ffffff';
  });
});

