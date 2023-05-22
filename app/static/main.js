function updateTable(formType) {
  console.log('updateTable called with formType:', formType);
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

      const tableBody = document.getElementById("table-body");
      tableBody.innerHTML = "";

      data.forEach((row) => {
        const tableRow = document.createElement("tr");

        Object.entries(row).forEach(([key, value]) => {
          const tableData = document.createElement("td");
          if (key === "entrant_company") {
            tableData.textContent = value;
          } else {
            tableData.textContent = value || "";
          }
          tableRow.appendChild(tableData);
        });
        tableBody.appendChild(tableRow);
      });
    });
}

document.addEventListener("DOMContentLoaded", function () {
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

    document.getElementById(`lion-filter_${formType}`).addEventListener("change", function () {
      updateSections(formType);
    });

    document.getElementById(`section-filter_${formType}`).addEventListener("change", function () {
      updateCategories(formType);
    });
    
    document.getElementById(`category-filter_${formType}`).addEventListener("change", function () {
      console.log('change event fired');
      updateTable(formType);
    });    
  });

  document.getElementById("filters-form-desktop").addEventListener("submit", function (event) {
    event.preventDefault();
    updateTable("desktop");
  });

  document.getElementById("filters-form-mobile").addEventListener("submit", function (event) {
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
    console.log('updateSections called with formType:', formType);
    updateSectionFilter(formType);
  }
  
  function updateCategories(formType) {
    console.log('updateCategories called with formType:', formType);
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

  function updateCategoryFilter(formType) {
    const section = document.getElementById(`section-filter_${formType}`).value;
    const currentCategory = document.getElementById(`category-filter_${formType}`).value;

    fetch(`/get-categories?section=${section}`)
      .then((response) => response.json())
      .then((data) => {
        const categorySelect = document.getElementById(`category-filter_${formType}`);
        categorySelect.innerHTML = `<option value="">All</option>`;
        data.forEach((category) => {
          categorySelect.innerHTML += `<option value="${category}">${category}</option>`;
        });

        categorySelect.value = currentCategory;
      });
  }
});
