class User {
    constructor(username, id) {
        this.name = username;
        this.id = id;
    }
}

function displayUser(user) {
    var item = document.createElement('li');
    item.textContent = user.name;
    item.id = user.id;
    window.scrollTo(0, document.body.scrollHeight);
}

function deleteUser(user) {
    var item = document.getElementById(user.id);
    item.remove();
}