const usersArray = [];

class User{
    constructor(id, name, email){
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = "role";
        this.container = document.querySelector('.users');
    }

    renderRow(){
        this.container.innerHTML += `
        <div class='user_card'>
        <p>Имя: ${this.name}</p>
        <p>Роль: ${this.role}</p>
        <p>ID: ${this.id}</p>
        </div>
        `
    }
}

class AdminUser extends User{
    constructor(id, name, email, role){
        super(id, name, email, role);
        this.adminIcon = '../img/admin_icon.svg';
    }

    removeUser(userId){

    }
}

class RegularUser extends User{
    constructor(id, name, email, role, postsNumber, password){
        super(id, name, email, role);
        this.postsNumber = postsNumber;
        this.userIcon = '../img/user_icon.svg';
    }

    createPost(postInfo){
        this.postsNumber += 1;
    }

    changePassword(newPassword){
        (this.password !== newPassword) ? this.password = newPassword : console.log('новый и старый пароли совпадают');
    }
}

class GuestUser extends User{
    constructor(id, name, email, role){
        super(id, name, email, role);
        this.guestIcon = '../img/guest_icon.svg';
    }
}

const user1 = new User(1, 'name', 'a@gmail.com');
const user2 = new User(2, 'name1', 'a1@gmail.com');
user1.renderRow();
user2.renderRow();