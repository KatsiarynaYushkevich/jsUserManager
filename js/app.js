let usersArray = [];
const addBtn = document.querySelector(".add_btn");
const modalContent = Array.from(document.querySelectorAll(".modal_content"));
const modal = Array.from(document.querySelectorAll(".modal"));
const usersBlock = document.querySelector(".users");
const searchInput = document.querySelector("#search");

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
        <div class='user_card ${this.getRoleClass()}' >
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

  getRoleClass() {
    return ''; 
  }
}

class AdminUser extends User {
  constructor(id, name, email) {
    super(id, name, email);
    this.role = "admin";
    this.icon = "../img/admin_icon.svg";
  }

  getRoleClass() {
    return 'admin_card'; 
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

  getRoleClass() {
    return 'regular_card'; 
  }
}

class GuestUser extends User {
  constructor(id, name, email) {
    super(id, name, email);
    this.role = "guest";
    this.icon = "../img/guest_icon.svg";
  }

  getRoleClass() {
    return 'guest_card';
  }
}

searchInput.oninput = function () {
  const input = this.value.trim();
  const results = document.querySelectorAll("#name");
  if (input) {
    results.forEach((result) => {
      const userCard = result.parentNode.parentNode.parentNode;
      console.log(input, result.innerText);
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

function createUser(valuesArray) {
  let newUser;
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
  addNewUser(newUser);
}

function addNewUser(newUser) {
  usersArray.push(newUser);
  updateUsers();
}

function changeUserInfo(user, valuesArray) {
  user.name = valuesArray[0];
  user.email = valuesArray[1];
  user.role = valuesArray[2];

  updateUsers();
}

function getNewInfo() {
  const name = document.querySelector("#name").value;
  return [
    name.replace(name[0], name[0].toUpperCase()),
    document.querySelector("#email").value,
    document.querySelector("#role").value,
  ];
}

function deleteUser(userId) {
  usersArray = usersArray.filter((user) => user.id !== +userId);
  updateUsers();
}

function updateUsers() {
  saveUsersInfo(usersArray);
  usersArray = [];
  parseUsers(usersArray);
}

function saveUsersInfo(usersArray) {
  localStorage.clear();
  usersArray.forEach((user) => {
    localStorage.setItem(user.id, JSON.stringify(user));
  });
}

function parseUsers(usersArray) {
  usersBlock.innerHTML = ` `;
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

function showModal(i) {
  modal[i].style.display = "block";
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
  modalContent[i].appendChild(form);
}

modalContent[0].addEventListener("click", (event) => {
  if (event.target.classList.contains("return_btn")) {
    modal[0].style.display = "none";
    modalContent[0].innerHTML = "";
  }
});

modalContent[0].addEventListener("submit", (event) => {
  if (event.target.classList.contains("add_user_form")) {
    event.preventDefault();
    const userInfo = getNewInfo();
    createUser(userInfo);
  }
  event.target.reset();
});

addBtn.addEventListener("click", (event) => {
  showModal(0);
});

usersBlock.addEventListener("click", (event) => {
  if (event.target.classList.contains("change_btn")) {
    showModal(1);

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
    deleteUser(userId);
  }
});

modalContent[1].addEventListener("submit", (event) => {
  event.preventDefault();

  const userId = event.target.dataset.id;
  const user = usersArray.find((user) => user.id == userId);
  const newInfo = getNewInfo();

  changeUserInfo(user, newInfo);
});

modalContent[1].addEventListener("click", (event) => {
  if (event.target.classList.contains("return_btn")) {
    modal[1].style.display = "none";
    modalContent[1].innerHTML = "";
  }
});

parseUsers(usersArray);

