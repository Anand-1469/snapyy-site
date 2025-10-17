// 🧠 Snapyy LocalStorage based mini app

// 🟢 SIGNUP
function signup() {
  const username = document.getElementById("username").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;

  if (!username || !phone || !password) {
    alert("Please fill all fields!");
    return;
  }

  if (password !== confirm) {
    alert("Passwords do not match!");
    return;
  }

  const users = JSON.parse(localStorage.getItem("snapyyUsers")) || [];
  const exists = users.find(u => u.phone === phone);

  if (exists) {
    alert("Account already exists!");
    return;
  }

  users.push({ username, phone, password });
  localStorage.setItem("snapyyUsers", JSON.stringify(users));
  alert("Signup successful!");
  window.location.href = "index.html";
}

// 🟣 LOGIN
function login() {
  const usernameOrPhone = document.getElementById("usernameOrPhone").value;
  const password = document.getElementById("password").value;

  const users = JSON.parse(localStorage.getItem("snapyyUsers")) || [];
  const user = users.find(
    u =>
      (u.username === usernameOrPhone || u.phone === usernameOrPhone) &&
      u.password === password
  );

  if (user) {
    localStorage.setItem("snapyyUser", JSON.stringify(user));
    window.location.href = "home.html";
  } else {
    alert("Invalid username/phone or password!");
  }
}

// 🔴 LOGOUT
function logout() {
  localStorage.removeItem("snapyyUser");
  window.location.href = "index.html";
}

// 🟠 FORGOT PASSWORD (send OTP)
function sendOTP() {
  const phone = document.getElementById("phone").value;
  const users = JSON.parse(localStorage.getItem("snapyyUsers")) || [];
  const user = users.find(u => u.phone === phone);

  if (!user) {
    alert("Phone number not found!");
    return;
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  localStorage.setItem("resetOTP", otp);
  localStorage.setItem("resetPhone", phone);
  alert("Your OTP is: " + otp); // Demo ke liye alert me show kar rahe
  window.location.href = "otp.html";
}

// 🟣 VERIFY OTP
function verifyOTP() {
  const enteredOTP = document.getElementById("otp").value;
  const storedOTP = localStorage.getItem("resetOTP");

  if (enteredOTP === storedOTP) {
    alert("OTP verified!");
    window.location.href = "reset-success.html";
  } else {
    alert("Invalid OTP!");
  }
}

// 🖼️ UPLOAD POST
function uploadPost() {
  const fileInput = document.getElementById("postImage");
  const caption = document.getElementById("caption").value;

  if (!fileInput.files.length) {
    alert("Please select an image first!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageData = e.target.result;
    const posts = JSON.parse(localStorage.getItem("snapyyPosts")) || [];
    const user = JSON.parse(localStorage.getItem("snapyyUser"));

    posts.push({
      username: user.username,
      phone: user.phone,
      image: imageData,
      caption: caption,
      time: new Date().toLocaleString()
    });

    localStorage.setItem("snapyyPosts", JSON.stringify(posts));
    alert("Post uploaded!");
    window.location.href = "home.html";
  };
  reader.readAsDataURL(fileInput.files[0]);
}

// 🏠 SHOW POSTS ON HOME PAGE
window.addEventListener("load", () => {
  const postsContainer = document.getElementById("postsContainer");
  if (postsContainer) {
    const posts = JSON.parse(localStorage.getItem("snapyyPosts")) || [];
    postsContainer.innerHTML = posts.slice().reverse().map(p => `
      <div class="post">
        <h4>@${p.username}</h4>
        <img src="${p.image}" alt="post">
        <p>${p.caption}</p>
        <small>${p.time}</small>
      </div>
    `).join("");
  }

  // PROFILE PAGE DATA
  const user = JSON.parse(localStorage.getItem("snapyyUser"));
  if (document.getElementById("profileName") && user) {
    document.getElementById("profileName").innerText = user.username;
    document.getElementById("profilePhone").innerText = "📱 " + user.phone;

    const posts = JSON.parse(localStorage.getItem("snapyyPosts")) || [];
    const userPosts = posts.filter(p => p.phone === user.phone);
    document.getElementById("usernewPosts").innerHTML = userPosts.length
      ? userPosts.map(p => `<div class='post'><img src="${p.image}"><p>${p.caption}</p></div>`).join("")
      : "<p>No posts yet</p>";
  }

  // Signup form handler (attach only if form exists)
  const form = document.getElementById("signupForm");
  if (form) {
    form.addEventListener("submit", function(event) {
      event.preventDefault(); // form ko actual submit hone se roko
      // optional: add validation here

      // success hone ke baad redirect kar do
      window.location.href = "home.html";
    });
  }
});

