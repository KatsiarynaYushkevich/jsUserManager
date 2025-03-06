let usersArray = [];

class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = "role";
    this.container = document.querySelector(".users");
    this.icon = "";
    this.class = "";
    this.modal = Array.from(document.querySelectorAll(".modal"));
    this.modalContent = Array.from(document.querySelectorAll(".modal_content"));
    this.searchInput = document.querySelector("#search");
    this.addBtn = document.querySelector(".add_btn");

    this.modalContent[0].addEventListener("click", (event) => {
      if (event.target.classList.contains("return_btn")) {
        this.modal[0].style.display = "none";
        this.modalContent[0].innerHTML = "";
      }
    });

    this.modalContent[0].addEventListener("submit", (event) => {
      if (event.target.classList.contains("add_user_form")) {
        event.preventDefault();
        const userInfo = this.getNewInfo();
        this.createUser(userInfo);
      }
      event.target.reset();
    });
    
    this.addBtn.addEventListener("click", (event) => {
      this.showModal(0);
    });
    
    this.modalContent[1].addEventListener("submit", (event) => {
      event.preventDefault();
      const userId = event.target.dataset.id;
      const user = usersArray.find((user) => user.id == userId);
      const newInfo = this.getNewInfo();
    
      this.changeUserInfo(user, newInfo);
    });
    
    this.modalContent[1].addEventListener("click", (event) => {
      if (event.target.classList.contains("return_btn")) {
        this.modal[1].style.display = "none";
        this.modalContent[1].innerHTML = "";
      }
    });

    this.searchInput.oninput = function () {
      const input = this.value.trim();
      const results = document.querySelectorAll("#name");
      if (input) {
        results.forEach((result) => {
          const userCard = result.parentNode.parentNode.parentNode;
          (result.innerText.search(RegExp(input,'gi')) == -1) ? userCard.classList.add("hide") : userCard.classList.remove("hide");
          }
        );
      } else {
        results.forEach((result) => {
          const userCard = result.parentNode.parentNode.parentNode;
          userCard.classList.remove("hide");
        });
      }
    };
  }

  init(){
    this.parseUsers(usersArray);
    this.container.addEventListener("click", (event) => {
        if (event.target.classList.contains("change_btn")) {
          this.showModal(1);
      
          const userId = event.target.dataset.id;
          const user = usersArray.find((user) => user.id == userId);
      
          document.querySelector(".add_user_form").dataset.id = userId;
      
          const userName = document.querySelector("#name");
          const userEmail = document.querySelector("#email");
          const userRole = document.querySelector("#role");
      
          userName.value = user.name;
          userEmail.value = user.email;
          userRole.value = user.role;
  
        } else if (event.target.classList.contains("delete_btn")) {
          const userId = event.target.dataset.id;
          this.deleteUser(userId);
        }
      });
  }

  renderRow() {
    this.container.innerHTML += `
        <div class='user_card ${this.class}' >
         <div class='user_info'>
           <img src='${this.icon}'>
          <div class='user_text'>
           <p id='name'>Имя: ${this.name}</p>
           <p>Роль: ${this.role}</p>
           <p>email: ${this.email}</p>
          </div>
         </div>
         <div class='buttons'>
          <button data-id='${usersArray.length + 1}' class='change_btn'></button>
          <button data-id='${usersArray.length + 1}' class='delete_btn'></button>
         </div>
        </div>
        `;
  }

  createUser(valuesArray) {
    let newUser;
    if((valuesArray[0] && valuesArray[1]) !== '') {
    switch (valuesArray[2]) {
      case "admin":
        newUser = new AdminUser(usersArray.length + 1, valuesArray[0], valuesArray[1]);
        break;
      case "guest":
        newUser = new GuestUser(usersArray.length + 1, valuesArray[0], valuesArray[1]);
        break;
      case "user":
        newUser = new RegularUser(usersArray.length + 1, valuesArray[0], valuesArray[1]);
        break;
    }
    this.addNewUser(newUser)
   }
  }
  
  addNewUser(newUser) {
    usersArray.push(newUser);
    this.updateUsers();
  }

  changeUserInfo(user, valuesArray) {
    user.name = valuesArray[0];
    user.email = valuesArray[1];
    user.role = valuesArray[2];
  
    this.updateUsers();
  }
  
  getNewInfo() {
    return [
      document.querySelector("#name").value,
      document.querySelector("#email").value,
      document.querySelector("#role").value,
    ];
  }
  
  deleteUser(userId) {
    usersArray = usersArray.filter((user) => user.id !== +userId); 
    this.updateUsers();
}
  
  updateUsers() {
    this.saveUsersInfo(usersArray);
    usersArray = [];
    this.parseUsers(usersArray);
  }
  
  saveUsersInfo(usersArray) {
    localStorage.clear();
    usersArray.forEach((user) => {
      localStorage.setItem(user.id, JSON.stringify(user));
    });
  }
  
  parseUsers(usersArray) {
    this.container.innerHTML = ``;
    for (let i = 0; i <= localStorage.length; i++) {
      const user = JSON.parse(localStorage.getItem(i + 1));
      if (user) {
        let userInstance;
        switch (user.role) {
          case "admin":
            userInstance = new AdminUser(usersArray.length + 1, user.name, user.email, user.role);
            userInstance.renderRow();
            usersArray.push(userInstance);
            break;
          case "guest":
            userInstance = new GuestUser(usersArray.length + 1, user.name, user.email, user.role);
            userInstance.renderRow();
            usersArray.push(userInstance);
            break;
          case "user":
            userInstance = new RegularUser(usersArray.length + 1, user.name, user.email, user.role);
            userInstance.renderRow();
            usersArray.push(userInstance);
            break;
        }
      }
    }
  }

  showModal(i) {
    this.modal[i].style.display = "block";    
    if(!document.querySelector('.add_user_form')){
    const form = document.createElement("form");
    form.classList.add("add_user_form");
    form.innerHTML = `<p>Информация пользователя:</p>
    <input id='name' type='text' placeholder='Имя пользователя' required>
    <input id='email' type='text' placeholder='Email пользователя' required>
    <select id='role' required>
    <option label='Администратор'>admin</option>
    <option label='Пользователь'>user</option>
    <option label='Гость'>guest</option> 
    </select>
    <div>
    <input type='submit' value='Сохранить'>
    <input type='button' class='return_btn' value='Назад'>
    </div>`;
    this.modalContent[i].appendChild(form);
  }
  }
  
}

class AdminUser extends User {
  constructor(id, name, email) {
    super(id, name, email);
    this.role = "admin";
    this.icon = "../img/admin_icon.svg";
    this.class = 'admin_card';
  }
}

class RegularUser extends User {
  constructor(id, name, email) {
    super(id, name, email);
    this.role = "user";
    this.postsNumber = 0;
    this.password = "password";
    this.icon = "../img/user_icon.svg";
    this.class = 'regular_card';
  }
}

class GuestUser extends User {
  constructor(id, name, email) {
    super(id, name, email);
    this.role = "guest";
    this.icon = "../img/guest_icon.svg";
    this.class = 'guest_card';
  }
}

const userController = new User(1, 'a', 'a@a');
userController.init();
// localStorage.clear();
