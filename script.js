function goHome() {
  location.reload();
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function navigateTo(page) {
  fetch(`${page}.html`)
    .then(response => response.text())
    .then(html => {
      document.getElementById('main-content').innerHTML = html;
      if (page === "work") loadWorkData();
      else if (page === "exhibition") loadExhibitionData();
    });
}

function uploadImage(container) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = event => {
      container.innerHTML = `<img src="${event.target.result}" />`;
      localStorage.setItem(container.id || "homeImage", event.target.result);
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

window.onload = function () {
  const homeImage = localStorage.getItem("homeImage");
  if (homeImage) {
    const container = document.querySelector(".editable-image");
    container.innerHTML = `<img src="${homeImage}" />`;
  }

  window.addEventListener("scroll", () => {
    document.querySelector(".scroll-top").style.display =
      window.scrollY > 200 ? "block" : "none";
  });
};

let currentPage = 1;
const itemsPerPage = 15;

function loadWorkData() {
  const grid = document.getElementById('work-grid');
  grid.innerHTML = '';
  for (let i = 0; i < itemsPerPage; i++) {
    const id = `work-${(currentPage - 1) * itemsPerPage + i}`;
    const box = document.createElement('div');
    box.className = 'work-box';
    box.setAttribute('draggable', true);
    box.dataset.id = id;

    const savedImg = localStorage.getItem(`${id}-img`);
    const savedTitle = localStorage.getItem(`${id}-title`) || "제목 없음";

    if (savedImg) {
      const img = document.createElement('img');
      img.src = savedImg;
      box.appendChild(img);
    }

    const title = document.createElement('div');
    title.className = 'work-title';
    title.contentEditable = true;
    title.innerText = savedTitle;
    title.onblur = () => {
      localStorage.setItem(`${id}-title`, title.innerText);
    };

    box.onclick = () => uploadWorkImage(box, id);
    box.ondblclick = e => e.stopPropagation(); // 제목 수정 중 클릭 방지

    box.appendChild(title);
    box.addEventListener("dragstart", dragStart);
    box.addEventListener("drop", drop);
    grid.appendChild(box);
  }
}

function uploadWorkImage(container, id) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*,video/*";
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = event => {
      const isVideo = file.type.includes("video");
      container.innerHTML = '';
      const media = document.createElement(isVideo ? "video" : "img");
      media.src = event.target.result;
      if (isVideo) media.controls = true;
      container.appendChild(media);

      const title = document.createElement('div');
      title.className = 'work-title';
      title.contentEditable = true;
      title.innerText = "제목 없음";
      title.onblur = () => {
        localStorage.setItem(`${id}-title`, title.innerText);
      };
      container.appendChild(title);

      localStorage.setItem(`${id}-img`, event.target.result);
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function nextPage() {
  currentPage++;
  document.getElementById('page-num').innerText = currentPage;
  loadWorkData();
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    document.getElementById('page-num').innerText = currentPage;
    loadWorkData();
  }
}

function loadExhibition(year = '2024') {
  const grid = document.getElementById('exhibition-grid');
  const items = 9;
  grid.innerHTML = '';

  const yearItems = document.querySelectorAll('.year-item');
  yearItems.forEach(item => item.classList.remove('active'));
  const activeYear = Array.from(yearItems).find(i => i.textContent === year);
  if (activeYear) activeYear.classList.add('active');

  for (let i = 0; i < items; i++) {
    const id = `exhibition-${year}-${i}`;
    const box = document.createElement('div');
    box.className = 'poster-box';
    box.dataset.id = id;

    const savedImg = localStorage.getItem(`${id}-img`);
    const savedTitle = localStorage.getItem(`${id}-title`) || '전시 이름';

    if (savedImg) {
      const img = document.createElement('img');
      img.src = savedImg;
      box.appendChild(img);
    }

    const title = document.createElement('div');
    title.className = 'poster-title';
    title.contentEditable = true;
    title.innerText = savedTitle;
    title.onblur = () => {
      localStorage.setItem(`${id}-title`, title.innerText);
    };

    box.onclick = () => uploadPoster(box, id);
    box.ondblclick = e => e.stopPropagation();
    box.appendChild(title);
    grid.appendChild(box);
  }
}

function uploadPoster(container, id) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = event => {
      container.innerHTML = '';
      const img = document.createElement("img");
      img.src = event.target.result;
      container.appendChild(img);

      const title = document.createElement('div');
      title.className = 'poster-title';
      title.contentEditable = true;
      title.innerText = "전시 이름";
      title.onblur = () => {
        localStorage.setItem(`${id}-title`, title.innerText);
      };
      container.appendChild(title);

      localStorage.setItem(`${id}-img`, event.target.result);
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function loadAbout() {
  const bio = localStorage.getItem('about-bio');
  const insta = localStorage.getItem('about-insta');
  const email = localStorage.getItem('about-email');
  const img = localStorage.getItem('about-img');

  if (bio) document.getElementById('about-bio').innerText = bio;
  if (insta) document.getElementById('insta-link').href = `https://instagram.com/${insta}`;
  if (insta) document.getElementById('insta-link').innerText = `@${insta}`;
  if (email) document.getElementById('email-link').innerText = email;
  if (email) document.getElementById('email-link').href = `mailto:${email}`;
  if (img) document.getElementById('about-img').src = img;

  // Save on blur
  document.getElementById('about-bio').onblur = () => {
    localStorage.setItem('about-bio', document.getElementById('about-bio').innerText);
  };
}

function uploadAboutImage() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = event => {
      const img = document.getElementById('about-img');
      img.src = event.target.result;
      localStorage.setItem('about-img', event.target.result);
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function loadProject() {
  const container = document.getElementById('project-content');
  container.innerHTML = '';

  const saved = JSON.parse(localStorage.getItem('project-items') || '[]');
  saved.forEach((data, i) => {
    const div = document.createElement('div');
    div.className = 'project-item';

    if (data.type === 'image') {
      const img = document.createElement('img');
      img.src = data.src;
      div.appendChild(img);
    } else {
      const p = document.createElement('div');
      p.contentEditable = true;
      p.innerText = data.text;
      p.onblur = () => saveProjectItems();
      div.appendChild(p);
    }

    container.appendChild(div);
  });
}

function addProjectItem() {
  const type = prompt("추가할 항목? (image 또는 text)").trim().toLowerCase();
  if (type === 'image') {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = e => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = event => {
        const container = document.getElementById('project-content');
        const div = document.createElement('div');
        div.className = 'project-item';
        const img = document.createElement('img');
        img.src = event.target.result;
        div.appendChild(img);
        container.appendChild(div);
        saveProjectItems();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  } else if (type === 'text') {
    const container = document.getElementById('project-content');
    const div = document.createElement('div');
    div.className = 'project-item';
    const p = document.createElement('div');
    p.contentEditable = true;
    p.innerText = '텍스트 입력';
    p.onblur = () => saveProjectItems();
    div.appendChild(p);
    container.appendChild(div);
    saveProjectItems();
  }
}

function saveProjectItems() {
  const items = [];
  const container = document.getElementById('project-content');
  const children = container.children;
  for (let child of children) {
    if (child.querySelector('img')) {
      items.push({ type: 'image', src: child.querySelector('img').src });
    } else {
      items.push({ type: 'text', text: child.innerText });
    }
  }
  localStorage.setItem('project-items', JSON.stringify(items));
}

function navigateProject(dir) {
  alert("이전/다음 프로젝트로 이동하는 기능은 나중에 구현할 수 있어요 :)");
}
