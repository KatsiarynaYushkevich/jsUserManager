const usersArray = [];
const addBtn = document.querySelector(".add_btn");
const modalContent = document.querySelector(".modal_content");
const modal = document.querySelector(".modal");

class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = "role";
    this.container = document.querySelector(".users");
    this.icon = "";
  }

  renderRow() {
    this.container.innerHTML += `
        <div class='user_card'>
         <div class='user_info'>
           <img src='${this.icon}'>
          <div>
           <p>Имя: ${this.name}</p>
           <p>Роль: ${this.role}</p>
           <p>email: ${this.email}</p>
          </div>
         </div>
         <div class='buttons'>
          <button class='change_btn'></button>
          <button class='delete_btn'></button>
         </div>
        </div>
        `;
  }
}

class AdminUser extends User {
  constructor(id, name, email) {
    super(id, name, email);
    this.role = "admin";
    this.icon = "../img/admin_icon.svg";
  }

  removeUser(userId) {}
}

class RegularUser extends User {
  constructor(id, name, email) {
    super(id, name, email);
    this.role = "user";
    this.postsNumber = 0;
    this.password = "password";
    this.icon = "../img/user_icon.svg";
  }

  createPost(postInfo) {
    this.postsNumber += 1;
  }

  changePassword(newPassword) {
    this.password !== newPassword
      ? (this.password = newPassword)
      : console.log("новый и старый пароли совпадают");
  }
}

class GuestUser extends User {
  constructor(id, name, email) {
    super(id, name, email);
    this.role = "guest";
    this.icon = "../img/guest_icon.svg";
  }
}

function createUser(name, email, status) {
  let newUser;
  switch (status) {
    case "admin":
      newUser = new AdminUser(usersArray.length + 1, name, email, status);
      newUser.renderRow();
      break;
    case "guest":
      newUser = new GuestUser(usersArray.length + 1, name, email, status);
      newUser.renderRow();
      break;
    case "user":
      newUser = new RegularUser(usersArray.length + 1, name, email, status);
      newUser.renderRow();
      break;
      usersArray.push(newUser);
  }
}

function changeUserInfo(user) {
  modal.style.display = "block";
}

addBtn.addEventListener("click", (event) => {
  modal.style.display = "block";
  modalContent.innerHTML = `
  <form class='add_user_form'>
  <p>Данные нового пользователя:</p>
  <input id='name' type='text' placeholder='Имя пользователя' required>
  <input id='email' type='text' placeholder='Email пользователя' required>
  <select id='role' required>
  <option>admin</option>
  <option>user</option>
  <option>guest</option> 
  </select>
  <div>
  <input type='submit' value='Добавить'>
  <input type='button' class='return_btn' value='Назад'>
  </div>
  </form>
  `;
});

modalContent.addEventListener("click", (event) => {
  if (event.target.classList.contains("return_btn")) {
    modal.style.display = "none";
  }
});

modalContent.addEventListener("submit", (event) => {
  if (event.target.classList.contains("add_user_form")) {
    event.preventDefault();
    const userName = document.querySelector("#name").value.trim();
    const userEmail = document.querySelector("#email").value.trim();
    const userStatus = document.querySelector("#role").value.trim();
    createUser(userName, userEmail, userStatus);
    saveUsersInfo(usersArray);
  }
});

function saveUsersInfo(usersArray) {
  localStorage.clear();
  usersArray.forEach((user) => {
    localStorage.setItem(user.id, JSON.stringify(user));
  });
}

function getUsersInfo(usersArray) {
  parseUsers(usersArray);
  showUsersInfo(usersArray);
}

function parseUsers(usersArray){
  for (let i = 1; i <= localStorage.length; i++) {
    const user = JSON.parse(localStorage.getItem(i));
    let userInstance;
    switch (user.role) {
      case "admin":
        userInstance = new AdminUser(user.id, user.name, user.email, user.role);
        usersArray.push(userInstance);
        break;
      case "guest":
        userInstance = new GuestUser(user.id, user.name, user.email, user.role);
        usersArray.push(userInstance);
        break;
      case "user":
        userInstance = new RegularUser(
          user.id,
          user.name,
          user.email,
          user.role
        );
        usersArray.push(userInstance);
        break;
    }
  }
}

function showUsersInfo(usersArray) {
  usersArray.forEach((user) => {
    user.renderRow();
  });
}

getUsersInfo(usersArray);
console.log(localStorage);
console.log(usersArray);
