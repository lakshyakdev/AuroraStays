// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false);
  });
})();

let searchBar = document.querySelector(".searchBarInput");
let searchTimeout;

searchBar.addEventListener("input", (e) => {
  const query = e.target.value.trim();
  if (!query) {
    document.querySelector(".resultBox").innerHTML = "";
    return;
  }
  
  clearTimeout(searchTimeout);

  const encodedQuery = encodeURIComponent(query);
  
  searchTimeout = setTimeout(() => {
    fetch(`/stays/search?q=${encodedQuery}`)
      .then(res => res.json())
      .then(data => {
      const resultBox = document.querySelector(".resultBox");
        
        if (data.length === 0) {
          resultBox.innerHTML = "<div>No results found</div>";
        } else {
          resultBox.innerHTML = data.map(item => 
            `<a href="/stays/${item._id}" class="search-result-link">
                <div class="search-result">${item.title || 'No title'}</div>
              </a>`
          ).join("");
        }
      })
      .catch(error => {
        console.error('Search failed:', error);
        document.querySelector(".resultBox").innerHTML = 
          "<div>Search failed. Please try again.</div>";
      });
  },200);
});
