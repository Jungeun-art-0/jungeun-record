function goHome() {
  window.location.href = 'index.html';
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function enableAdminMode() {
  if (localStorage.getItem("admin") === "true") {
    document.querySelectorAll(".admin-only").forEach(el => {
      el.style.display = "block";
    });
    const imageInput = document.getElementById("main-image-upload");
    const image = document.getElementById("main-image");
    imageInput.addEventListener("change", () => {
      const file = imageInput.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        image.src = e.target.result;
        localStorage.setItem("main-image", e.target.result);
      };
      reader.readAsDataURL(file);
    });

    const title = document.querySelector(".center-title");
    title.addEventListener("input", () => {
      localStorage.setItem("main-title", title.innerText);
    });

    const contact = document.querySelector(".contact");
    contact.addEventListener("input", () => {
      localStorage.setItem("contact-info", contact.innerHTML);
    });
  }
}

function restoreSavedContent() {
  const image = document.getElementById("main-image");
  const savedImg = localStorage.getItem("main-image");
  if (savedImg) image.src = savedImg;

  const title = document.querySelector(".center-title");
  const savedTitle = localStorage.getItem("main-title");
  if (savedTitle) title.innerText = savedTitle;

  const contact = document.querySelector(".contact");
  const savedContact = localStorage.getItem("contact-info");
  if (savedContact) contact.innerHTML = savedContact;
}

window.addEventListener("DOMContentLoaded", () => {
  enableAdminMode();
  restoreSavedContent();
});

  const aboutText = document.querySelector(".about-text");
  if (aboutText) {
    const savedAboutText = localStorage.getItem("about-text");
    if (savedAboutText) aboutText.innerText = savedAboutText;
    aboutText.addEventListener("input", () => {
      localStorage.setItem("about-text", aboutText.innerText);
    });
  }

  const aboutImage = document.getElementById("about-image");
  const savedAboutImg = localStorage.getItem("about-img");
  if (savedAboutImg) aboutImage.src = savedAboutImg;

  const aboutUpload = document.getElementById("about-image-upload");
  if (aboutUpload) {
    aboutUpload.addEventListener("change", () => {
      const file = aboutUpload.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        aboutImage.src = e.target.result;
        localStorage.setItem("about-img", e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

function renderWorkGallery() {
  const gallery = document.getElementById("work-gallery");
  gallery.innerHTML = "";

  const items = JSON.parse(localStorage.getItem("work-items") || "[]");
  items.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "work-item";
    div.onclick = () => {
      if (event.target.tagName !== "BUTTON" && event.target.tagName !== "INPUT")
        location.href = `work-detail.html?id=${index}`;
    };

    const img = document.createElement("img");
    img.src = item.img || "assets/placeholder.jpg";
    div.appendChild(img);

    const title = document.createElement("div");
    title.className = "work-title";
    title.textContent = item.title || "Untitled";
    title.ondblclick = (e) => {
      e.stopPropagation();
      const newTitle = prompt("Edit title:", item.title || "Untitled");
      if (newTitle !== null) {
        items[index].title = newTitle;
        localStorage.setItem("work-items", JSON.stringify(items));
        renderWorkGallery();
      }
    };
    div.appendChild(title);

    if (isAdmin()) {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.className = "work-upload";
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          items[index].img = reader.result;
          localStorage.setItem("work-items", JSON.stringify(items));
          renderWorkGallery();
        };
        reader.readAsDataURL(file);
      };
      const uploadButton = document.createElement("button");
      uploadButton.textContent = "Upload Image";
      uploadButton.onclick = (e) => {
        e.stopPropagation();
        fileInput.click();
      };
      div.appendChild(uploadButton);
      div.appendChild(fileInput);
    }

    gallery.appendChild(div);
  });
}

function addWorkItem() {
  const items = JSON.parse(localStorage.getItem("work-items") || "[]");
  items.push({ title: "", img: "" });
  localStorage.setItem("work-items", JSON.stringify(items));
  renderWorkGallery();
}

function renderWorkDetail() {
  const id = new URLSearchParams(location.search).get("id");
  const container = document.getElementById("detail-container");
  const items = JSON.parse(localStorage.getItem("work-details") || "{}");

  if (!items[id]) items[id] = [];
  container.innerHTML = "";

  items[id].forEach((block, index) => {
    if (block.type === "text") {
      const p = document.createElement("p");
      p.className = "editable-text";
      p.textContent = block.content;
      if (isAdmin()) {
        p.onclick = () => {
          const newText = prompt("Edit text:", block.content);
          if (newText !== null) {
            items[id][index].content = newText;
            localStorage.setItem("work-details", JSON.stringify(items));
            renderWorkDetail();
          }
        };
      }
      container.appendChild(p);
    } else if (block.type === "image") {
      const img = document.createElement("img");
      img.src = block.src;
      container.appendChild(img);
    }
  });

  localStorage.setItem("work-details", JSON.stringify(items));
}

function addDetailText() {
  const id = new URLSearchParams(location.search).get("id");
  const items = JSON.parse(localStorage.getItem("work-details") || "{}");
  if (!items[id]) items[id] = [];
  items[id].push({ type: "text", content: "New text..." });
  localStorage.setItem("work-details", JSON.stringify(items));
  renderWorkDetail();
}

function addDetailImage() {
  const id = new URLSearchParams(location.search).get("id");
  const items = JSON.parse(localStorage.getItem("work-details") || "{}");
  if (!items[id]) items[id] = [];

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      items[id].push({ type: "image", src: reader.result });
      localStorage.setItem("work-details", JSON.stringify(items));
      renderWorkDetail();
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function goPrev() {
  const id = parseInt(new URLSearchParams(location.search).get("id"));
  if (id > 0) location.href = `work-detail.html?id=${id - 1}`;
}

function goNext() {
  const id = parseInt(new URLSearchParams(location.search).get("id"));
  const items = JSON.parse(localStorage.getItem("work-items") || "[]");
  if (id < items.length - 1) location.href = `work-detail.html?id=${id + 1}`;
}

window.onload = function () {
  if (location.pathname.includes("work-detail.html")) {
    renderWorkDetail();
  }
};

function renderExhibitionDetail() {
  const id = new URLSearchParams(location.search).get("id");
  const container = document.getElementById("exhibition-detail-container");
  const items = JSON.parse(localStorage.getItem("exhibition-details") || "{}");

  if (!items[id]) items[id] = [];
  container.innerHTML = "";

  items[id].forEach((block, index) => {
    if (block.type === "text") {
      const p = document.createElement("p");
      p.className = "editable-text";
      p.textContent = block.content;
      if (isAdmin()) {
        p.onclick = () => {
          const newText = prompt("Edit text:", block.content);
          if (newText !== null) {
            items[id][index].content = newText;
            localStorage.setItem("exhibition-details", JSON.stringify(items));
            renderExhibitionDetail();
          }
        };
      }
      container.appendChild(p);
    } else if (block.type === "image") {
      const img = document.createElement("img");
      img.src = block.src;
      container.appendChild(img);
    }
  });

  localStorage.setItem("exhibition-details", JSON.stringify(items));
}

function addExhibitionText() {
  const id = new URLSearchParams(location.search).get("id");
  const items = JSON.parse(localStorage.getItem("exhibition-details") || "{}");
  if (!items[id]) items[id] = [];
  items[id].push({ type: "text", content: "New exhibition text..." });
  localStorage.setItem("exhibition-details", JSON.stringify(items));
  renderExhibitionDetail();
}

function addExhibitionImage() {
  const id = new URLSearchParams(location.search).get("id");
  const items = JSON.parse(localStorage.getItem("exhibition-details") || "{}");
  if (!items[id]) items[id] = [];

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      items[id].push({ type: "image", src: reader.result });
      localStorage.setItem("exhibition-details", JSON.stringify(items));
      renderExhibitionDetail();
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

window.onload = function () {
  if (location.pathname.includes("exhibition-detail.html")) {
    renderExhibitionDetail();
  }
};
