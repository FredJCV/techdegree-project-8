let employees = [];
let currentDataIndex;
let currentCards = [];
let newDisplay = [];
let arrIndex;
const urlAPI = `https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=US`
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");
const searchBar = document.querySelector(".search-bar");
const cards = document.getElementsByClassName("card");
const modalPrev = document.querySelector(".modal-prev");
const modalNext = document.querySelector(".modal-next");

fetch(urlAPI)
    .then(response => response.json())
    .then(response => response.results)
    .then(displayEmployees)
    .catch(err => console.log(err))


function displayEmployees(employeeData) {
    employees = employeeData;
    let employeeHTML = '';
    employees.forEach((employee, index) => {
        let name = employee.name;
        let email = employee.email;
        let city = employee.location.city;
        let picture = employee.picture;

        employeeHTML += `
            <div class="card" data-index="${index}">
                <img class="avatar" src="${picture.large}" />
                <div class="text-container">
                    <h2 class="name">${name.first} ${name.last}</h2>
                    <p class="email">${email}</p>
                    <p class="address">${city}</p>
                </div>
            </div>
        `
    });
    gridContainer.innerHTML = employeeHTML;
};

function displayModal(index) {
    let { name, dob, phone, email, location: { city, street, state, postcode }, picture } = employees[index];
    let date = new Date(dob.date);
    let month = ('0' + (date.getMonth()+1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let year = ('' + date.getFullYear().toString().substr(-2));
    let modalHTML = `
        <img class="avatar" src="${picture.large}" />
        <div class="text-container">
            <h2 class="name">${name.first} ${name.last}</h2>
            <p class="email">${email}</p>
            <p class="address">${city}</p>
            <hr />
            <p>${phone}</p>
            <p class="address">${street}, ${state} ${postcode}</p>
            <p>Birthday: ${month}/${day}/${year}</p>
        </div>
    `;
    overlay.classList.remove("hidden");
    modalContainer.innerHTML = modalHTML;
};

gridContainer.addEventListener('click', e => {
    if (e.target !== gridContainer) {
        let i = e.target.closest(".card").getAttribute('data-index');
        currentDataIndex = parseInt(i);
        displayModal(i);
    } 
});

function exitModal() {
    overlay.classList.add("hidden");
    updateDisplay();
};

function modalCloseEscape(e) {
    if(e.key === "Escape") {
        exitModal();
    }
};

function modalCloseAssist(e) {
    if(e.target.classList.value === "overlay") {
        exitModal();
    }
};

function updateDisplay() {
    newDisplay = [];
        for (let i = 0; i < currentCards.length; i++) {
            let cDI = currentCards[i].getAttribute('data-index');
            cDI = parseInt(cDI);
            newDisplay.push(cDI);
        }
        arrIndex = newDisplay.indexOf(currentDataIndex);
};

function nextModal() {
    updateDisplay();
    if (currentCards.length === 0 && currentDataIndex < 11) {
        currentDataIndex += 1;
        displayModal(currentDataIndex);
    } else if (currentCards.length > 0 && arrIndex < newDisplay.length - 1) {
        currentDataIndex = newDisplay[arrIndex + 1];
        displayModal(currentDataIndex);
    }
};

function prevModal() {
    updateDisplay();
    if (currentCards.length === 0 && currentDataIndex > 0) {
        currentDataIndex -= 1;
        displayModal(currentDataIndex);
    } else if (currentCards.length > 0 && arrIndex <= newDisplay.length - 1 && arrIndex !== 0) {
        currentDataIndex = newDisplay[arrIndex - 1];
        displayModal(currentDataIndex);
    }
};

function filterSearch() {
    let filter = searchBar.value;
    let cardsArr = [].slice.call(cards);
    currentCards = [];
    for (let i = 0; i < cardsArr.length; i++) {
        if (cardsArr[i].innerText.search(new RegExp(filter, "i")) < 0) {
            cardsArr[i].style.display = "none";
        } else {
            cardsArr[i].style.display = "";
        }
    };
    for (let i = 0; i < cardsArr.length; i++) {
        if (cardsArr[i].style.display === "") {
            currentCards.push(cardsArr[i]);
        }
    };
};

modalClose.addEventListener('click', exitModal);

modalPrev.addEventListener('click', prevModal);

modalNext.addEventListener('click', nextModal);

overlay.addEventListener('click', modalCloseAssist);

document.addEventListener('keydown', modalCloseEscape);

searchBar.addEventListener('keyup', filterSearch);