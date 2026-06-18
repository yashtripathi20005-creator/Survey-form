// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('surveyForm');
    const messageContainer = document.getElementById('messageContainer');
    
    // Handle form submission with AJAX
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous messages
        messageContainer.style.display = 'none';
        messageContainer.className = '';
        
        // Get form data
        const formData = new FormData(form);
        
        // Show loading state
        const submitBtn = document.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        // Send data to server
        fetch('/submit', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Display message
            messageContainer.textContent = data.message;
            
            if (data.success) {
                messageContainer.className = 'success';
                form.reset(); // Clear the form
            } else {
                messageContainer.className = 'error';
            }
            
            messageContainer.style.display = 'block';
            
            // Scroll to message
            messageContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch(error => {
            messageContainer.textContent = 'An error occurred. Please try again.';
            messageContainer.className = 'error';
            messageContainer.style.display = 'block';
        })
        .finally(() => {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
    
    // Real-time validation for email
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        const email = this.value;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailPattern.test(email)) {
            this.style.borderColor = '#dc3545';
            showTemporaryMessage('Please enter a valid email address', 'error');
        } else {
            this.style.borderColor = '#28a745';
        }
    });
    
    // Real-time validation for age
    const ageInput = document.getElementById('age');
    ageInput.addEventListener('blur', function() {
        const age = parseInt(this.value);
        
        if (this.value && (isNaN(age) || age < 1 || age > 120)) {
            this.style.borderColor = '#dc3545';
            showTemporaryMessage('Please enter a valid age (1-120)', 'error');
        } else if (this.value) {
            this.style.borderColor = '#28a745';
        }
    });
    
    // Real-time validation for name
    const nameInput = document.getElementById('name');
    nameInput.addEventListener('blur', function() {
        if (this.value && this.value.trim().length < 2) {
            this.style.borderColor = '#dc3545';
            showTemporaryMessage('Name must be at least 2 characters', 'error');
        } else if (this.value) {
            this.style.borderColor = '#28a745';
        }
    });
    
    // Show temporary message
    function showTemporaryMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.className = type;
        messageContainer.style.display = 'block';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 3000);
    }
    
    // Clear validation styles on input
    document.querySelectorAll('input, select, textarea').forEach(element => {
        element.addEventListener('input', function() {
            this.style.borderColor = '#e0e0e0';
        });
    });
});
