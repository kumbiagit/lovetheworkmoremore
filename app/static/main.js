function updateTable(formType) {
  const searchInput = document.getElementById(`search-input_${formType}`).value;
  const lion = document.getElementById(`lion-filter_${formType}`).value;
  const section = document.getElementById(`section-filter_${formType}`).value;
  const category = document.getElementById(`category-filter_${formType}`).value;
  const year = document.getElementById(`year-filter_${formType}`).value;
  const award = document.getElementById(`award-filter_${formType}`).value;

  fetch(`/get-data?search=${searchInput}&lion=${lion}&section=${section}&category=${category}&year=${year}&award=${award}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Update the table with the fetched data here

      const tableBody = document.getElementById("table-body");
      tableBody.innerHTML = "";

      data.forEach((row) => {
        const tableRow = document.createElement("tr");
        const columnHeaders = ["year", "brand", "entrant_company", "title", "lion", "category", "section", "award"];
        columnHeaders.forEach((header) => {
          const tableData = document.createElement("td");
          if (header === "entrant_company") {
            tableData.setAttribute("data-order", row[header]); // set data-order attribute
            tableData.textContent = row[header];
          } else {
            tableData.textContent = row[header] || "";
          }
          tableRow.appendChild(tableData);
        });
        tableBody.appendChild(tableRow);
      });
    });
    // PREVIOUS VERSION
}




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
  

  function searchData(device) {
    clearFilters(device);
    submitTable(device);
    if (device === 'mobile') {
      toggleMenu();
    }
  }
  
  
  
  document.getElementById("search-button_desktop").addEventListener("click", function () {
    updateTable("desktop");
  });
  
  document.getElementById("search-button_mobile").addEventListener("click", function () {
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
  

  

  function updateTable(formType) {
    const searchInput = document.getElementById(`search-input_${formType}`).value;
    const lion = document.getElementById(`lion-filter_${formType}`).value;
    const section = document.getElementById(`section-filter_${formType}`).value;
    const category = document.getElementById(`category-filter_${formType}`).value;
    const year = document.getElementById(`year-filter_${formType}`).value;
    const award = document.getElementById(`award-filter_${formType}`).value;
  
    fetch(`/get-data?search=${searchInput}&lion=${lion}&section=${section}&category=${category}&year=${year}&award=${award}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Update the table with the fetched data here
  
        const tableBody = document.getElementById("table-body");
        tableBody.innerHTML = "";
  
        data.forEach((row) => {
          const tableRow = document.createElement("tr");
  
          Object.entries(row).forEach(([key, value]) => {
            const tableData = document.createElement("td");
            if (key === "entrant_company") { // Changed to snake_case
              tableData.textContent = value;
            } else {
              tableData.textContent = value || "";
            }
            tableRow.appendChild(tableData);
            tableBody.appendChild(tableRow);
          });          
        });
      });
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
  });
  
  
});

function submitTable(formType) {
  updateTable(formType);
}



















