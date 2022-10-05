class Controller {

    constructor(view, model, client) {
        this.view = view;
        this.model = model;
        this.client = client;

        this.view.bindAddMember(this.handleAdd);
        this.view.bindUpdate(this.handleUpdate);

        this.getMembers();
    }

    getMembers = async () => {
        try {
            this.view.changeSpinnerState('active');
            this.model.resetMemberList();
            const data = await this.client.get("/users");
            this.model.memberList = data;
            this.view.displayMembers(this.model.memberList, this.handleDelete, this.getMember);
            this.view.changeSpinnerState('inactive');
        } catch (err) {
            console.log(`Error: ${err.message}`);
        }
    }

    getMember = async (id) => {
        try {
            this.view.changeSpinnerState('active');
            const member = await this.client.get(`/users/${id}`);
            this.view.changeSpinnerState('inactive');
            return member;
        } catch (err) {
            console.log(`Error: ${err.message}`);
        }
    }

    addMember = async (newMember) => {
        this.view.changeSpinnerState('active');
        await this.client.post("/users", newMember);
        this.view.changeSpinnerState('inactive');
    }

    deleteMember = async (id) => {
        try {
            this.view.changeSpinnerState('active');
            await this.client.delete(`/users/${id}`);
        } catch (err) {
            console.log(`Error: ${err.message}`);
        }
    }

    editMember = async (updatedUser, id) => {
        updatedUser.id = id;
        this.view.changeSpinnerState('active');
        await this.client.put(`/users/${id}`, updatedUser);
        this.view.changeSpinnerState('inactive');
    }


    handleUpdate = async (formData) => {
        const id = formData.id.value;
        const data = this.model.proccessFormData(formData);
        const actualData = this.model.getMember(id);
        if (this.model.equalsTo(data, actualData)) {
            this.view.generateToast('error', 'You must update something', 'edit-member-section');
        } else {
            try {
                await this.editMember(data, id);
                this.view.resetEditForm();
                this.getMembers();
                this.view.generateToast('success', 'User updated successfully', 'edit-member-section');
            } catch (err) {
                this.view.generateToast('error', 'Error while updating a member', 'edit-member-section');
                console.log(err);
            }
        }
    }

    handleAdd = async (formData) => {
        try {
            const data = this.model.proccessFormData(formData);
            this.addMember(data);
            this.view.resetAddForm();
            this.view.generateToast('success', 'User saved successfully', 'add-member-section');
            this.getMembers();
        } catch (err) {
            this.view.generateToast('error', 'Error while adding a new member', 'add-member-section');
            console.log(err);
        }
    }

    handleDelete = async (id) => {
        await this.deleteMember(id);
        this.getMembers();
    }

}

export default Controller;