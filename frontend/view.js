class View {
    constructor() {
        this.addForm = document.querySelector('#add-member-form');
        this.editForm = document.querySelector('#edit-member-form');
        this.editSection = document.getElementById("edit-member-section");
        this.addSection = document.getElementById("add-member-section");
        this.editBackBtn = document.querySelector(".section__back-btn");
        this.backBtnListener();
    }

    backBtnListener() {
        this.editBackBtn.addEventListener('click', () => {
            this.editForm.reset();
            this.showAddSection();
        })
    }

    showAddSection() {
        this.addSection.classList.remove('hide');
        this.editSection.classList.add('hide');
    }

    showEditSection() {
        this.addSection.classList.add('hide');
        this.editSection.classList.remove('hide');
    }

    resetEditForm(){
        this.editForm.reset();
        this.editForm.querySelector(".form__submit-btn").setAttribute('disabled','');
    }

    enableEditForm(){
        this.editForm.querySelector(".form__submit-btn").removeAttribute('disabled');
    }

    resetAddForm(){
        this.addForm.reset();
    }

    displayMembers(members, deleteCallback, getOneCallback) {
        const container = document.getElementById("members-container");
        container.innerHTML = "";

        members.forEach(member => {
            const {id,firstName,lastName,  address} = member;
            if (id && firstName && lastName && address.city) {
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
            delBtns[i].addEventListener("click", (event) => this.handleDelete(event, deleteCallback));
        }

        const editBtns = document.getElementsByClassName("actions__edit");
        for (let i = 0; i < editBtns.length; i++) {
            editBtns[i].addEventListener("click", (event) => this.handleEdit(event, getOneCallback));
        }
    }

    changeSpinnerState(state) {
        const spinner = document.querySelector(".spinner");
        if (state == 'active') {
            spinner.classList.add("spinner--active");
        } else if (state == 'inactive') {
            spinner.classList.remove("spinner--active");
        }
    }

    showDeleteModal(name) {
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

    generateToast(type, message, parentId) {
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

    bindAddMember(handleAddCallback) {
        this.addForm.addEventListener('submit', event => {
            event.preventDefault();
            handleAddCallback(this.addForm.elements)
        })
    }

    bindUpdate(handleUpdateCallback) {
        this.editForm.addEventListener('submit', event => {
            event.preventDefault();
            handleUpdateCallback(this.editForm.elements);
        })
    }

    async handleDelete(e, deleteCallback) {
        const id = e.target.parentElement.parentElement.dataset.id;
        const fullname = e.target.parentElement.parentElement.dataset.fullname;
        const isConfirmed = await this.showDeleteModal(fullname);
        if(isConfirmed){
            deleteCallback(id);
            this.resetEditForm();
        }
    }

    async handleEdit(e, getOneCallback) {
        try {
            this.showEditSection();
    
            const memberToBeEdited = await getOneCallback(e.target.parentElement.parentElement.dataset.id);
            this.editForm.reset();
    
            for (const key in memberToBeEdited) {
                if (key === 'address') {
                    for (const key2 in memberToBeEdited[key]) {
                        this.editForm.elements[key2].value = memberToBeEdited[key][key2];
                    }
                } else if (key === 'sports') {
                    this.editForm.elements[key].forEach(checkbox => {
                        if (memberToBeEdited[key].indexOf(checkbox.value) > -1) {
                            checkbox.checked = 'true';
                        }
                    });
                } else {
                    this.editForm.elements[key].value = memberToBeEdited[key];
                }
            }
        this.enableEditForm();
        } catch (err) {
            console.log(`Error: ${err.message}`);
        }
    }

}

export default View;