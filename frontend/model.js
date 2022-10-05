import Member from "./models/member.js";

class Model {
    constructor() {
        this.members = [];
    }

    resetMemberList() {
        this.members = [];
    }

    set memberList(arr) {
        arr.forEach(element => {
            this.members.push(new Member(element));
        });
        console.log(this.members);
    }

    get memberList(){
        return this.members;
    }

    getMember(id){
        return this.members.find(member => member.id === id)
    }

    equalsTo (first, second){

        if (first.firstName !== second.firstName) return false;
        if (first.lastName !== second.lastName) return false;
        if (first.activity_class !== second.activity_class) return false;
        if (first.age !== second.age) return false;
        if (first.gender !== second.gender) return false;
        if (JSON.stringify(first.address) !== JSON.stringify(second.address)) return false;
        if (JSON.stringify(first.sports) !== JSON.stringify(second.sports)) return false;

        return true;
    }

    isValidElement(element) {
        return element.name && element.value;
    };

    isValidValue(element) {
        return (!['checkbox', 'radio'].includes(element.type) || element.checked);
    };

    //TODO this should be moved elsewhere. Perhaps in controller
    proccessFormData(entries) {
        const obj = {};
        
        Array.from(entries).forEach(element => {
            if (this.isValidElement(element) && this.isValidValue(element)) {
                if (element.type === 'checkbox') {
                    obj[element.name] = (obj[element.name] || []).concat(element.value);
                } else if (element.name === 'age') {
                    obj[element.name] = +(element.value);
                } else {
                    obj[element.name] = element.value;
                }
            }
        });

        console.log(obj);

        const jsonFormat = {
            firstName: obj.firstName,
            lastName: obj.lastName,
            address: {
                streetAndNumber: obj.streetAndNumber,
                postalCode: obj.postalCode,
                city: obj.city,
                country: obj.country
            },
            sports: obj.sports,
            gender: obj.gender,
            age: obj.age,
            activity_class: obj.activity_class
        };

        return jsonFormat;
    }
}

export default Model;