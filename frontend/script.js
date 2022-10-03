import HttpClient from "./utils/http-client.js";
import Member from "./model/member.js";
const baseUrl = "http://localhost:3000"
const headers = {
    'Content-Type': 'application/json;charset=utf-8'
};

let members = null;
const client = new HttpClient({
    baseUrl,
    headers
});

function displayMembers(members) {
    const container = document.getElementById("members-container");
    container.innerHTML = "";
    members.forEach(member => {
        const {
            id,
            firstName,
            lastName,
            address
        } = member;
        if (id && firstName && lastName && address) {
            const fullName = firstName + " " + lastName;
            container.innerHTML += `<div class="card" data-id=${id} data-fullname="${fullName}">
                <div class="card__content member">
                    <div class="member__avatar">${Array.from(lastName)[0]}</div>
                    <div class="member__info">
                        <h4 class="member__name">${fullName}</h4>
                        <p class="member__id">ID: ${id}</p>
                        <p class="member__city">${address.city}</p>
                    </div>
                </div>
                <div class="card__actions actions">
                    <button class="actions__edit btn">Edit</button>
                    <button class="actions__delete btn">Delete</button>
                </div>
                </div>`;
        }
    });

    const delBtns = document.getElementsByClassName("actions__delete");
    for (let i = 0; i < delBtns.length; i++) {
        delBtns[i].addEventListener("click", (event) => handleDelete(event));
    }

    const editBtns = document.getElementsByClassName("actions__edit");
    for (let i = 0; i < editBtns.length; i++) {
        editBtns[i].addEventListener("click", (event) => handleEdit(event));
    }
}

const changeSpinnerState = (state) => {
    const spinner = document.querySelector(".spinner");
    if(state == 'active'){
        spinner.classList.add("spinner--active");
    }else if(state == 'inactive'){
        spinner.classList.remove("spinner--active");
    }
}

async function getMembers() {
    try {
        changeSpinnerState('active');
        members = await client.get("/users");
        displayMembers(members);
        changeSpinnerState('inactive');
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
}

async function getMember(id) {
    try {
        changeSpinnerState('active');
        const member = await client.get(`/users/${id}`);
        changeSpinnerState('inactive');
        return member;
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
}

async function addMember(newMember) {
    changeSpinnerState('active');
    await client.post("/users", newMember);
    changeSpinnerState('inactive');
}

async function deleteMember(id) {
    try {
        changeSpinnerState('active');
        await client.delete(`/users/${id}`);
        changeSpinnerState('inactive');
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
}

async function editMember(updatedUser) {
    changeSpinnerState('active');
    await client.put(`/users/${updatedUser.id}`, updatedUser);
    changeSpinnerState('inactive');
}

getMembers();

// ------------------------------

const isValidElement = element => {
    return element.name && element.value;
};

const isValidValue = element => {
    return (!['checkbox', 'radio'].includes(element.type) || element.checked);
};

const isCheckbox = element => element.type === 'checkbox';

const isPartOfAddress = element => element.name === 'streetAndNumber' || element.name === 'postalCode' || element.name === 'country' || element.name === 'city';

function formToJSON(elements) {
    const initialObj = {
        address: {}
    };
    Array.from(elements).forEach(element => {
        if (isValidElement(element) && isValidValue(element)) {

            if (isCheckbox(element)) {
                initialObj[element.name] = (initialObj[element.name] || []).concat(element.value);
            } else if (isPartOfAddress(element)) {
                initialObj.address[element.name] = element.value;
            } else if (element.name === 'age') {
                initialObj[element.name] = +(element.value);
            } else {
                initialObj[element.name] = element.value;
            }
        }
    });
    return initialObj;
}

// --------------------------
let addMemberForm = document.querySelector('#add-member-form');
let editMemberForm = document.querySelector('#edit-member-form');
const editSection = document.getElementById("edit-member-section");
const addSection = document.getElementById("add-member-section");
let editBackBtn = document.querySelector(".section__back-btn");

addMemberForm.addEventListener('submit', (event) => handleAddMemberSubmit(event));
editMemberForm.addEventListener('submit', (event) => handleMemberUpdate(event));
editBackBtn.addEventListener('click', () => {editMemberForm.reset(); addSection.classList.remove('hide'); editSection.classList.add('hide');})

async function handleAddMemberSubmit(e) {
    e.preventDefault();
    //todo sports validation
    const data = formToJSON(addMemberForm.elements);
    try {
        await addMember(data);
        addMemberForm.reset();
        generateToast('success', 'User saved successfully', 'add-member-section');
        getMembers();
    } catch (err) {
        generateToast('error', 'Error while adding a new member', 'add-member-section');
        console.log(err);
    }
}

const equalsTo = (first, second) => {
    console.log(JSON.stringify(first));
    console.log(JSON.stringify(second));
    if (first.id !== second.id) return false;
    if (first.firstName !== second.firstName) return false;
    if (first.lastName !== second.lastName) return false;
    if (first.activity_class !== second.activity_class) return false;
    if (first.age !== second.age) return false;
    if (first.gender !== second.gender) return false;
    if (JSON.stringify(first.address) !== JSON.stringify(second.address)) return false;
    if (JSON.stringify(first.sports) !== JSON.stringify(second.sports)) return false;

    return true;
}

async function handleMemberUpdate(e) {

    e.preventDefault();
    const data = formToJSON(editMemberForm.elements);

    const actualData = members.find(member => member.id === data.id);

    if (equalsTo(data, actualData)) {
        generateToast('error', 'You must update something', 'edit-member-section');
    } else {
        try {
            await editMember(data);
            editMemberForm.reset();
            getMembers();
            generateToast('success', 'User updated successfully', 'edit-member-section');
            editMemberForm.querySelector(".form__submit-btn").setAttribute('disabled','');
        } catch (err) {
            generateToast('error', 'Error while updating a member', 'edit-member-section');
            console.log(err);
        }
    }
}

function showDeleteModal(name) {
    document.querySelector('.modal__text').innerHTML = `Are you sure you want to delete member: ${name}`;
    document.querySelector('.modal').classList.add("modal--active");

    let modalNoBtn = document.querySelector('.modal__no-btn');
    let modalYesBtn = document.querySelector('.modal__yes-btn');

    const hideModal = () => {
        document.querySelector('.modal').classList.remove("modal--active");
    };

    return new Promise((resolve) => {
        const yesHandler = () => {
            resolve(true);
            hideModal();
        };

        const noHandler = () => {
            resolve(false);
            hideModal();
        };

        modalNoBtn.addEventListener('click', noHandler, {
            once: true
        });
        modalYesBtn.addEventListener('click', yesHandler, {
            once: true
        });
    })
}

async function handleDelete(e) {
    const isConfirmed = await showDeleteModal(e.target.parentElement.parentElement.dataset.fullname);
    if (isConfirmed) {
        deleteMember(e.target.parentElement.parentElement.dataset.id);
        getMembers();
    }
}

async function handleEdit(e) {
    try {
        const form = document.getElementById("edit-member-form");

        addSection.classList.add('hide');
        editSection.classList.remove('hide');

        const memberToBeEdited = await getMember(e.target.parentElement.parentElement.dataset.id);
        form.reset();

        for (const key in memberToBeEdited) {
            if (key === 'address') {
                for (const key2 in memberToBeEdited[key]) {
                    form.elements[key2].value = memberToBeEdited[key][key2];
                }
            } else if (key === 'sports') {
                form.elements[key].forEach(checkbox => {
                    if (memberToBeEdited[key].indexOf(checkbox.value) > -1) {
                        checkbox.checked = 'true';
                    }
                });
            } else {
                form.elements[key].value = memberToBeEdited[key];
            }

        }
        form.querySelector(".form__submit-btn").removeAttribute('disabled');
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
}

const generateToast = (type, message, parentId) => {
    const parentEl = document.querySelector(`#${parentId}`);
    const toastContainer = parentEl.querySelector('.toast__container');

    const toast = document.createElement('div');
    toast.classList.add(`toast--${type}`, 'toast');
    toast.innerHTML = `<img src="assets/images/${type}.svg" class="toast__icon" alt=${type}><p class="toast__message">${message}</p>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toastContainer.removeChild(toast);
    }, 5000);

}