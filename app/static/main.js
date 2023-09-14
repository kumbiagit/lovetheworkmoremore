function updateTable(formType) {
  const searchInput = document.getElementById(`search-input_${formType}`).value;
  const lion = document.getElementById(`lion-filter_${formType}`).value;
  const section = document.getElementById(`section-filter_${formType}`).value;
  const category = document.getElementById(`category-filter_${formType}`).value;
  const year = document.getElementById(`year-filter_${formType}`).value;
  const award = document.getElementById(`award-filter_${formType}`).value;
    // Get selected award values
  const selectedAwards = [];
  const checkboxes = document.getElementsByClassName('award-checkbox');
    
   for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
        selectedAwards.push(checkboxes[i].value);
      }
    }
    
    // Make API request with selected awards as parameters
    const url = `/get-data?awards=${selectedAwards.join(',')}`;
    
    // Rest of your code to update the table using the API response
  }

  fetch(`/get-data?search=${encodeURIComponent(searchInput)}&lion=${encodeURIComponent(lion)}&section=${encodeURIComponent(section)}&category=${encodeURIComponent(category)}&year=${encodeURIComponent(year)}&award=${encodeURIComponent(checkboxValues.join(','))}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const tableBody = document.getElementById("table-body");
      tableBody.innerHTML = "";

      if (data.length === 0) {
        const noResultsRow = document.createElement("tr");
        const noResultsCell = document.createElement("td");
        noResultsCell.textContent = "Nothing to see here! Try something else.";
        noResultsCell.colSpan = 8; // Set the colspan to match the number of columns
        noResultsRow.appendChild(noResultsCell);
        tableBody.appendChild(noResultsRow);
      } else {
        data.forEach((row) => {
          const tableRow = document.createElement("tr");
          const columnHeaders = ["year", "brand", "entrant_company", "title", "lion", "category", "section", "award"];
          columnHeaders.forEach((header) => {
            const tableData = document.createElement("td");
            if (header === "title") {
              if (row.link) {
                const link = document.createElement("a");
                link.href = row.link; 
                link.target = "_blank";
                link.innerHTML = row.title; 
                tableData.appendChild(link);
              } else {
                tableData.textContent = row.title || "";
              }
            } else {
              tableData.textContent = row[header] || ""; 
            }
            tableRow.appendChild(tableData);
          });
          tableBody.appendChild(tableRow);
        });        
      }
    });   



document.addEventListener("DOMContentLoaded", function () {
  // Get the filter values from the URL query string
  var urlParams = new URLSearchParams(window.location.search);
  var lion = urlParams.get("lion");
  var section = urlParams.get("section");
  var category = urlParams.get("category");
  var year = urlParams.get("year");
  var award = urlParams.get("award");

  ["desktop", "mobile"].forEach((formType) => {
    setFilterValues("lion-filter", lion, formType);
    setFilterValues("section-filter", section, formType);
    setFilterValues("category-filter", category, formType);
    setFilterValues("year-filter", year, formType);
    setFilterValues("award-filter", award, formType);
  });

  document.getElementById("filters-form-desktop").addEventListener("submit", function (event) {
    event.preventDefault();
    submitTable("desktop");
  });
  
  document.getElementById("filters-form-mobile").addEventListener("submit", function (event) {
    event.preventDefault();
    submitTable("mobile");
  });
  

  // Add event listeners for search input
  document.getElementById("search-input_desktop").addEventListener("input", function () {
    // Don't update the table immediately, wait for the search button to be clicked
  });

  document.getElementById("search-input_mobile").addEventListener("input", function () {
    // Don't update the table immediately, wait for the search button to be clicked
  });

  // Add event listeners for lion filters
  ["desktop", "mobile"].forEach((formType) => {
    document.getElementById(`lion-filter_${formType}`).addEventListener("change", function () {
      updateSections(formType);
    });

    // Add event listeners for section filters
    document.getElementById(`section-filter_${formType}`).addEventListener("change", function () {
      updateCategories(formType);
    });
  });

  function clearFilters(device) {
    document.getElementById(`lion-filter_${device}`).selectedIndex = 0;
    document.getElementById(`section-filter_${device}`).selectedIndex = 0;
    document.getElementById(`category-filter_${device}`).selectedIndex = 0;
    document.getElementById(`year-filter_${device}`).selectedIndex = 0;
    document.getElementById(`award-filter_${device}`).selectedIndex = 0;
  }
  function toggleMenu() {
    var filters = document.getElementById("filters");
    if (filters.style.display === "none") {
      filters.style.display = "block";
    } else {
      filters.style.display = "none";
    }
    
    var topnav = document.getElementById("myTopnav");
    if (topnav.className === "topnav") {
      topnav.className += " responsive";
    } else {
      topnav.className = "topnav";
    }
  }
  
  function closeMenu() {
    var filters = document.getElementById("filters");
    filters.style.display = "none";
    
    var topnav = document.getElementById("myTopnav");
    topnav.className = "topnav";
  }
  
  
  
  function searchData(device) {
    clearFilters(device);
    submitTable(device);
    if (device === 'mobile') {
      toggleMenu();
    }
  }

  
  document.getElementById("search-button_desktop").addEventListener("click", function (event) {
    event.preventDefault();
    updateTable("desktop");
  });
  
  document.getElementById("search-button_mobile").addEventListener("click", function (event) {
    event.preventDefault();
    updateTable("mobile");
  });

  


  function setFilterValues(elementId, value, formType) {
    const element = document.getElementById(`${elementId}_${formType}`);
    if (element) {
      element.value = value || "";
    } else {
      console.error(`Element with ID "${elementId}_${formType}" not found.`);
    }
  }

  

  function updateSections(formType) {
    console.log(`updateSections called for form type: ${formType}`);
    updateSectionFilter(formType);
  }
  
  function updateCategories(formType) {
    console.log(`updateCategories called for form type: ${formType}`);
    updateCategoryFilter(formType);
  }
  

  function updateSectionFilter(formType) {
    const lion = document.getElementById(`lion-filter_${formType}`).value;
    const currentSection = document.getElementById(`section-filter_${formType}`).value; // Store the current section value

    fetch(`/get-sections?lion=${lion}`)
      .then((response) => response.json())
      .then((data) => {
        const sectionSelect = document.getElementById(`section-filter_${formType}`);
        sectionSelect.innerHTML = `<option value="">All</option>`;
        data.forEach((section) => {
          sectionSelect.innerHTML += `<option value="${section}">${section}</option>`;
        });

        // Set the selected value for the section dropdown
        sectionSelect.value = currentSection;
      });
  }
  
  function updateCategoryFilter(formType) {
    const lion = document.getElementById(`lion-filter_${formType}`).value;
    const section = document.getElementById(`section-filter_${formType}`).value;
    const currentCategory = document.getElementById(`category-filter_${formType}`).value; // Store the current category value
  
    let categoryFetchUrl = '/get-categories';
  
    if (lion && section) {
      categoryFetchUrl += `?section=${section}&lion=${lion}`;
    } else if (lion) {
      categoryFetchUrl += `?lion=${lion}`;
    } else if (section) {
      categoryFetchUrl += `?section=${section}`;
    } else {
      // If neither lion nor section have valid values, clear the category filter
      const categorySelect = document.getElementById(`category-filter_${formType}`);
      categorySelect.innerHTML = `<option value="">All</option>`;
      categorySelect.value = "";
      return; // Don't fetch new categories
    }
  
    fetch(categoryFetchUrl)
      .then((response) => response.json())
      .then((data) => {
        const categorySelect = document.getElementById(`category-filter_${formType}`);
        categorySelect.innerHTML = `<option value="">All</option>`;
        data.forEach((category) => {
          categorySelect.innerHTML += `<option value="${category}">${category}</option>`;
        });
  
        // Set the selected value for the category dropdown
        categorySelect.value = currentCategory;
      });
  }  

  ["desktop", "mobile"].forEach((formType) => {
    document.getElementById(`lion-filter_${formType}`).addEventListener("change", function () {
      updateSections(formType);
      updateCategories(formType);
    });
  
    // Add event listeners for section filters
    const sectionFilter = document.getElementById(`section-filter_${formType}`);
    const categoryFilter = document.getElementById(`category-filter_${formType}`);
  
    sectionFilter.addEventListener("change", function () {
      // Reset category filter to "All"
      categoryFilter.value = "";
  
      updateCategories(formType);
    });


    ["desktop", "mobile"].forEach((formType) => {
      document.querySelectorAll(`input[name="award-checkbox_${formType}"]`).forEach(checkbox => {
          checkbox.addEventListener("change", function () {
            updateTable(formType);
            });
        });
    });
    
  });

  function getSelectedAwards(formType) {
    let awards = [];
    let checkboxes = document.querySelectorAll(`input[name="award-checkbox_${formType}[]"]:checked`);
    checkboxes.forEach((checkbox) => {
        awards.push(checkbox.value);
    });
    return awards;
}

// When you want to get the awards for desktop form:
let selectedDesktopAwards = getSelectedAwards('desktop');

// When you want to get the awards for mobile form:
let selectedMobileAwards = getSelectedAwards('mobile');

  
});

function submitTable(formType) {
  updateTable(formType);
  closeMenu(); // Close the menu after updating the table
}