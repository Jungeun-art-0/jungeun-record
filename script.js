// 관리자 모드
let isAdmin = false;

// 개발자 도구에서 실행: localStorage.setItem("admin", "true");
if (localStorage.getItem("admin") === "true") {
  document.body.classList.add("admin-mode");
  isAdmin = true;
}

// 이미지 업로드
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("editable-image") && isAdmin) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        e.target.src = reader.result;
        saveState();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }
});

// 텍스트 수정
document.addEventListener("dblclick", function (e) {
  if (e.target.classList.contains("editable-text") && isAdmin) {
    const newText = prompt("수정할 내용을 입력하세요", e.target.innerText);
    if (newText !== null) {
      e.target.innerText = newText;
      saveState();
    }
  }
});

// 콘텐츠 추가
function addContentBlock() {
  if (!isAdmin) return;
  const container = document.getElementById("content-container");
  const block = document.createElement("div");
  block.className = "editable-text";
  block.innerText = "새 텍스트 또는 설명을 입력하세요.";
  container.appendChild(block);
  saveState();
}

// 저장/불러오기
function saveState() {
  if (!isAdmin) return;
  localStorage.setItem("pageData", document.body.innerHTML);
}

function loadState() {
  const saved = localStorage.getItem("pageData");
  if (saved) {
    document.body.innerHTML = saved;
  }
}

// 페이지 상단 이동
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 초기화
window.onload = function () {
  loadState();
};
