function updateTable(formType) {
  const lion = document.getElementById(`lion-filter_${formType}`).value; // Define the lion variable here
  const searchInput = document.getElementById(`search-input_${formType}`).value;
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
}

document.addEventListener("DOMContentLoaded", function () {
  // Get the filter values from the URL query string
  var urlParams = new URLSearchParams(window.location.search);
  var lion = urlParams.get("lion");
  var section = urlParams.get("section");
  var category = urlParams.get("category");
  var year = urlParams.get("year");
  var award = urlParams.get("award");
});

  ["desktop", "mobile"].forEach((formType) => {
    setFilterValues("lion-filter", lion, formType);
    setFilterValues("section-filter", section, formType);
    setFilterValues("category-filter", category, formType);
    setFilterValues("year-filter", year, formType);
    setFilterValues("award-filter", award, formType);
  });

  document.getElementById("filters-form-desktop").addEventListener("submit", function (event) {
    event.preventDefault();
    submitTable("desktop", event);
  });
  
  document.getElementById("filters-form-mobile").addEventListener("submit", function (event) {
    event.preventDefault();
    submitTable("mobile", event);
  });
  
  

 // Remove the "input" event listeners for search input
document.getElementById("search-input_desktop").removeEventListener("input", function () {});
document.getElementById("search-input_mobile").removeEventListener("input", function () {});


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
  

  function updateSections(formType) {
    updateSectionFilter(formType);
    updateCategoryFilter(formType);
  }
  

  function updateSectionFilter(formType) {
    const lion = document.getElementById(`lion-filter_${formType}`).value;
    const currentSection = document.getElementById(`section-filter_${formType}`).value;
  
    fetch(`/get-sections?lion=${lion}`)
      .then((response) => response.json())
      .then((data) => {
        const sectionSelect = document.getElementById(`section-filter_${formType}`);
        sectionSelect.innerHTML = `<option value="">All</option>`;
        data.forEach((section) => {
          sectionSelect.innerHTML += `<option value="${section}">${section}</option>`;
        });
  
        sectionSelect.value = currentSection;
      });
  }

  function updateCategories(formType) {
    // Placeholder function, implement as needed
  }


  function updateCategoryFilter(formType) {
    const lion = document.getElementById(`lion-filter_${formType}`).value;
    const section = document.getElementById(`section-filter_${formType}`).value;
    const currentCategory = document.getElementById(`category-filter_${formType}`).value;
  
    const params = new URLSearchParams();
    params.append("lion", lion);
    params.append("section", section);
  
    fetch(`/get-categories?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        const categorySelect = document.getElementById(`category-filter_${formType}`);
        const selectedCategory = categorySelect.value; // Get the selected category before clearing the options
        categorySelect.innerHTML = ""; // Clear the options
  
        // Add "All" as the first option
        const allOption = document.createElement("option");
        allOption.value = "";
        allOption.textContent = "All";
        categorySelect.appendChild(allOption);
  
        data.forEach((category) => {
          const option = document.createElement("option");
          option.value = category;
          option.textContent = category;
          categorySelect.appendChild(option);
        });
  
        categorySelect.value = selectedCategory || ""; // Set the selected category
      })
      .then(() => {
        updateTable(formType); // Update the table after the categories are fetched
      });
  }
  

function submitTable(formType, event) {
  event.preventDefault();
  updateTable(formType);
};
