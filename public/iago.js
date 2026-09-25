/* Footer clock in Iago's timezone.
   Dennis' index-new.js keeps writing Amsterdam time into the #timeSpan node it
   grabbed at init (and again after every Barba page swap), so each new node is
   replaced by a clone his interval no longer references. */
(function () {
   var formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Atlantic/Canary',
      timeZoneName: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
   });

   function tick() {
      var span = document.getElementById('timeSpan');
      if (!span) return;
      if (!span.hasAttribute('data-iago')) {
         var clone = span.cloneNode(true);
         clone.setAttribute('data-iago', '');
         span.parentNode.replaceChild(clone, span);
         span = clone;
      }
      span.textContent = formatter.format(new Date());
   }

   setInterval(tick, 500);
   document.addEventListener('DOMContentLoaded', tick);
})();

/* Contact form → Web3Forms. Delegated on document because Barba swaps the page. */
(function () {
   var RESET_DELAY = 4000;

   function setLabel(button, text) {
      button.value = text;
   }

   document.addEventListener('submit', function (event) {
      var form = event.target;
      if (!form.matches('form[data-web3forms]')) return;
      event.preventDefault();

      var button = form.querySelector('input[type="submit"]');
      var idleLabel = button.getAttribute('data-idle') || button.value;
      button.setAttribute('data-idle', idleLabel);

      if (!form.checkValidity()) {
         form.reportValidity();
         return;
      }
      if (form.hasAttribute('data-sending')) return;
      form.setAttribute('data-sending', '');
      setLabel(button, 'Sending...');

      fetch(form.action, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
         body: JSON.stringify(Object.fromEntries(new FormData(form))),
      })
         .then(function (response) {
            return response.json().then(function (data) {
               if (!response.ok || !data.success) throw new Error(data.message || response.status);
            });
         })
         .then(function () {
            setLabel(button, 'Sent!');
            form.reset();
            form.querySelectorAll('.not-empty').forEach(function (el) {
               el.classList.remove('not-empty');
            });
         })
         .catch(function (error) {
            console.error('Contact form:', error);
            setLabel(button, 'Try again');
         })
         .finally(function () {
            form.removeAttribute('data-sending');
            setTimeout(function () { setLabel(button, idleLabel); }, RESET_DELAY);
         });
   });
})();
