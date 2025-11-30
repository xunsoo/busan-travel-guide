/* =========================================================
   0. 페이지 초기 상태 + 테마(Light/Dark/Ocean)
========================================================= */
const THEME_KEY = "theme";
const THEMES = ["light", "dark", "ocean"];

/* 테마 적용 */
function applyTheme(theme) {
    document.body.classList.remove("dark-mode", "ocean-mode");

    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    } else if (theme === "ocean") {
        document.body.classList.add("ocean-mode");
    }

    const btn = document.getElementById("themeToggle");
    if (btn) {
        if (theme === "light") btn.textContent = "🌙 다크 모드";
        if (theme === "dark") btn.textContent = "🌊 오션 모드";
        if (theme === "ocean") btn.textContent = "☀️ 라이트 모드";
    }
}

/* 테마 순환 버튼 */
function setupThemeToggle() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const current = localStorage.getItem(THEME_KEY) || "light";
        const nextTheme =
            THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];

        localStorage.setItem(THEME_KEY, nextTheme);
        applyTheme(nextTheme);
    });
}

/* DOM 로드시 초기 실행 */
document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.remove("page-fade");

    const savedTheme = localStorage.getItem(THEME_KEY) || "light";
    applyTheme(savedTheme);
    setupThemeToggle();

    setupFavoriteButtons();
    renderFavorites();
    setupSearch();
});


/* =========================================================
   1. 공통 UI (박스 열기/닫기)
========================================================= */
function toggleBox(id) {
    const box = document.getElementById(id);
    if (!box) return;
    box.style.display = box.style.display === "block" ? "none" : "block";
}


/* =========================================================
   2. 로그인 / 회원가입 / 페이지 접근 보호
========================================================= */
const loginUser = JSON.parse(localStorage.getItem("loginUser") || "null");

/* 로그인 상태에서 login/signup 페이지 접근 금지 */
if (loginUser) {
    if (
        location.pathname.includes("login.html") ||
        location.pathname.includes("signup.html")
    ) {
        alert("이미 로그인된 상태입니다.");
        window.location.href = "index.html";
    }
}

/* 로그인 처리 */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const id = document.getElementById("userId").value.trim();
        const pw = document.getElementById("userPw").value.trim();
        let userList = JSON.parse(localStorage.getItem("userList")) || [];

        /* 기본 계정 자동 생성 */
        if (userList.length === 0) {
            userList.push({ id: "user", pw: "1234" });
        }

        const match = userList.find((u) => u.id === id && u.pw === pw);

        if (match) {
            alert("로그인 성공!");
            localStorage.setItem("loginUser", JSON.stringify(match));
            window.location.href = "index.html";
        } else {
            alert("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
    });
}

/* 로그아웃 */
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loginUser");
        alert("로그아웃 되었습니다!");
        window.location.href = "login.html";
    });
}

/* 로그인 필요 페이지 보호 */
const protectedPages = ["index.html", "sub1.html", "sub2.html"];
if (protectedPages.some((page) => location.pathname.includes(page))) {
    if (!loginUser) {
        alert("로그인이 필요합니다.");
        window.location.href = "login.html";
    }
}

/* 회원가입 */
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const newId = document.getElementById("newId").value.trim();
        const newPw = document.getElementById("newPw").value.trim();

        if (!newId || !newPw) {
            alert("아이디와 비밀번호를 모두 입력해주세요.");
            return;
        }

        let userList = JSON.parse(localStorage.getItem("userList")) || [];
        if (userList.some((user) => user.id === newId)) {
            alert("이미 존재하는 아이디입니다.");
            return;
        }

        userList.push({ id: newId, pw: newPw });
        localStorage.setItem("userList", JSON.stringify(userList));

        alert("회원가입 성공! 로그인해주세요.");
        document.getElementById("newId").value = "";
        document.getElementById("newPw").value = "";
    });
}

/* 로그인 사용자 표시 */
const welcomeUser = document.getElementById("welcomeUser");
if (welcomeUser && loginUser) {
    welcomeUser.innerText = `${loginUser.id}님 환영합니다!`;
}


/* =========================================================
   3. 기본 데이터(여행지 / 맛집 목록)
========================================================= */
const placeData = [
    { name: "해운대 해수욕장", img: "images/haeundae2.jpg", desc: "부산을 대표하는 해변." },
    { name: "광안리 해변", img: "images/gwangalli2.jpg", desc: "광안대교 야경이 유명." },
    { name: "감천문화마을", img: "images/gamcheon2.jpg", desc: "형형색색 예술 마을." },
    { name: "태종대", img: "images/taejongdae2.jpg", desc: "절벽·숲·바다 조화 명소." },
    { name: "오륙도 스카이워크", img: "images/oryukdo.jpg", desc: "유리 바닥 바다 풍경." },
    { name: "자갈치 시장", img: "images/jagalchi.jpg", desc: "부산 대표 수산 시장." }
];

const foodList = [
    { name: "수변최고돼지국밥", img: "images/porkSoup.jpg", desc: "진하고 구수한 국물." },
    { name: "톤쇼우 돈까스", img: "images/tonshow-hirekatsu-rare.jpg", desc: "레어 히레카츠 전문." },
    { name: "매드독스 피자", img: "images/maddogs-cheese-pull.jpg", desc: "치즈 폭발 딥디시 피자." },
    { name: "이재모피자", img: "images/pizza.jpg", desc: "바삭한 도우 + 풍부한 토핑." }
];


/* =========================================================
   4. 랜덤 추천 기능 (여행지/맛집)
========================================================= */
const randomPlaceBtn = document.getElementById("randomPlaceBtn");
const randomPlaceBox = document.getElementById("randomPlaceBox");

if (randomPlaceBtn && randomPlaceBox) {
    randomPlaceBtn.addEventListener("click", () => {
        const p = placeData[Math.floor(Math.random() * placeData.length)];
        randomPlaceBox.style.display = "block";
        randomPlaceBox.innerHTML = `<strong>오늘의 여행지 : ${p.name}</strong><br>${p.desc}`;
    });
}

const randomFoodBtnSub = document.getElementById("randomFoodBtnSub");
const randomFoodResult = document.getElementById("randomFoodResult");

if (randomFoodBtnSub && randomFoodResult) {
    randomFoodBtnSub.addEventListener("click", () => {
        const f = foodList[Math.floor(Math.random() * foodList.length)];
        randomFoodResult.style.display = "block";
        randomFoodResult.innerHTML = `<strong>오늘의 맛집 : ${f.name}</strong><br>${f.desc}`;
    });
}


/* =========================================================
   5. 이미지 슬라이더
========================================================= */
const slideImages = [
    "images/haeundae2.jpg",
    "images/gwangalli2.jpg",
    "images/gamcheon2.jpg",
    "images/jagalchi.jpg",
    "images/oryukdo.jpg"
];

const mainSlide = document.getElementById("mainSlide");
const prevSlideBtn = document.getElementById("prevSlide");
const nextSlideBtn = document.getElementById("nextSlide");
let slideIndex = 0;

function showSlide(index) {
    if (!mainSlide) return;
    slideIndex = (index + slideImages.length) % slideImages.length;
    mainSlide.src = slideImages[slideIndex];
}

if (mainSlide) {
    showSlide(0);

    if (prevSlideBtn)
        prevSlideBtn.addEventListener("click", () =>
            showSlide(slideIndex - 1)
        );

    if (nextSlideBtn)
        nextSlideBtn.addEventListener("click", () =>
            showSlide(slideIndex + 1)
        );

    setInterval(() => showSlide(slideIndex + 1), 5000);
}


/* =========================================================
   6. 실시간 날씨 API (Open-Meteo)
========================================================= */
const weatherBtn = document.getElementById("weatherBtn");
const weatherBox = document.getElementById("weatherBox");

const weatherCodeText = {
    0: "맑음",
    1: "대체로 맑음",
    2: "부분적으로 흐림",
    3: "흐림",
    61: "약한 비",
    63: "중간 비",
    65: "강한 비",
    71: "눈"
};

async function fetchBusanWeather() {
    if (!weatherBox) return;

    weatherBox.style.display = "block";
    weatherBox.textContent = "날씨 정보를 불러오는 중입니다...";

    const url =
        "https://api.open-meteo.com/v1/forecast" +
        "?latitude=35.1796&longitude=129.0756" +
        "&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code" +
        "&timezone=Asia%2FSeoul";

    try {
        const res = await fetch(url);
        const data = await res.json();

        const cur = data.current;
        const desc = weatherCodeText[cur.weather_code] || "날씨 정보 없음";

        weatherBox.innerHTML = `
            <strong>현재 기온:</strong> ${cur.temperature_2m}°C<br>
            <strong>체감 온도:</strong> ${cur.apparent_temperature}°C<br>
            <strong>습도:</strong> ${cur.relative_humidity_2m}%<br>
            <strong>하늘 상태:</strong> ${desc}
        `;
    } catch {
        weatherBox.innerHTML = "날씨 정보를 가져오지 못했습니다.";
    }
}

if (weatherBtn) {
    weatherBtn.addEventListener("click", fetchBusanWeather);
}


/* =========================================================
   7. 일정 기능 (추가/삭제)
========================================================= */
let scheduleList = JSON.parse(localStorage.getItem("scheduleList")) || [];
const scheduleTable = document.getElementById("scheduleTable");
const addScheduleBtn = document.getElementById("addScheduleBtn");

function saveSchedule() {
    localStorage.setItem("scheduleList", JSON.stringify(scheduleList));
}

function loadSchedule() {
    if (!scheduleTable) return;

    scheduleTable.innerHTML = `<tr><th>시간</th><th>내용</th><th>삭제</th></tr>`;

    scheduleList.forEach((item, index) => {
        const row = scheduleTable.insertRow();
        row.insertCell(0).innerText = item.time;
        row.insertCell(1).innerText = item.text;
        row.insertCell(2).innerHTML = `<button onclick="deleteSchedule(${index})">X</button>`;
    });
}

function deleteSchedule(index) {
    scheduleList.splice(index, 1);
    saveSchedule();
    loadSchedule();
}

if (addScheduleBtn) {
    addScheduleBtn.addEventListener("click", () => {
        const time = document.getElementById("scheduleTime").value;
        const text = document.getElementById("scheduleText").value.trim();

        if (!time || !text) {
            alert("시간과 내용을 모두 입력하세요!");
            return;
        }

        scheduleList.push({ time, text });
        saveSchedule();
        loadSchedule();

        document.getElementById("scheduleTime").value = "";
        document.getElementById("scheduleText").value = "";
    });
}

loadSchedule();


/* =========================================================
   8. 찜 기능(여행지/맛집)
========================================================= */
let favorites = JSON.parse(localStorage.getItem("favorites") || "null");

if (!favorites || typeof favorites !== "object") {
    favorites = { places: [], foods: [] };
}

if (!Array.isArray(favorites.places)) favorites.places = [];
if (!Array.isArray(favorites.foods)) favorites.foods = [];

function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function isFavorite(type, name) {
    return favorites[type + "s"].includes(name);
}

function toggleFavorite(type, name) {
    const list = favorites[type + "s"];

    if (list.includes(name)) {
        favorites[type + "s"] = list.filter((n) => n !== name);
    } else {
        favorites[type + "s"].push(name);
    }

    saveFavorites();
    updateFavoriteButtons();
    renderFavorites();
}

function updateFavoriteButtons() {
    document.querySelectorAll(".fav-btn").forEach((btn) => {
        const type = btn.dataset.favType;
        const name = btn.dataset.favName;

        if (isFavorite(type, name)) {
            btn.classList.add("on");
            btn.textContent = "♥ 찜 취소";
        } else {
            btn.classList.remove("on");
            btn.textContent = "♡ 찜하기";
        }
    });
}

function setupFavoriteButtons() {
    document.querySelectorAll(".fav-btn").forEach((btn) => {
        btn.addEventListener("click", () =>
            toggleFavorite(btn.dataset.favType, btn.dataset.favName)
        );
    });

    updateFavoriteButtons();
}

function renderFavorites() {
    const favPlacesBox = document.getElementById("favPlacesBox");
    const favFoodsBox = document.getElementById("favFoodsBox");

    if (favPlacesBox) {
        favPlacesBox.style.display = "block";
        favPlacesBox.innerHTML =
            favorites.places.length
                ? "<strong>찜한 여행지</strong><ul>" +
                  favorites.places.map((n) => `<li>${n}</li>`).join("") +
                  "</ul>"
                : "찜한 여행지가 없습니다.";
    }

    if (favFoodsBox) {
        favFoodsBox.style.display = "block";
        favFoodsBox.innerHTML =
            favorites.foods.length
                ? "<strong>찜한 맛집</strong><ul>" +
                  favorites.foods.map((n) => `<li>${n}</li>`).join("") +
                  "</ul>"
                : "찜한 맛집이 없습니다.";
    }
}


/* =========================================================
   9. 검색 기능(여행지/맛집 필터)
========================================================= */
function setupSearch() {
    const placeSearch = document.getElementById("placeSearch");
    if (placeSearch) {
        placeSearch.addEventListener("input", () => {
            const keyword = placeSearch.value.trim().toLowerCase();
            document.querySelectorAll(".place-card").forEach((card) => {
                card.style.display = card.innerText
                    .toLowerCase()
                    .includes(keyword)
                    ? ""
                    : "none";
            });
        });
    }

    const foodSearch = document.getElementById("foodSearch");
    if (foodSearch) {
        foodSearch.addEventListener("input", () => {
            const keyword = foodSearch.value.trim().toLowerCase();
            document.querySelectorAll(".food-card").forEach((card) => {
                card.style.display = card.innerText
                    .toLowerCase()
                    .includes(keyword)
                    ? ""
                    : "none";
            });
        });
    }
}


/* =========================================================
   10. 맨 위로 버튼
========================================================= */
const topBtn = document.getElementById("topBtn");

if (topBtn) {
    topBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}


/* =========================================================
   11. 부산 축제 API (XML)
========================================================= */
const eventBtn = document.getElementById("eventBtn");
const eventBox = document.getElementById("eventBox");

async function fetchBusanEventsXML() {
    const API_KEY =
        "oj2HX7hTdn2qJEEy9x%2BQMkugurRyLfm4jkizKsyChjGC5%2BYkvZW%2FYhIEc%2FdT1wDb4IJ2PvLGet5OjN%2Fd%2BjtS7w%3D%3D";

    const url =
        `https://apis.data.go.kr/6260000/FestivalService/getFestivalKr` +
        `?serviceKey=${API_KEY}` +
        `&numOfRows=20&pageNo=1`;

    eventBox.style.display = "block";
    eventBox.innerHTML = "축제 정보를 불러오는 중입니다...";

    try {
        const res = await fetch(url);
        const xmlText = await res.text();

        console.log("📌 XML 원본 데이터 ↓↓↓↓↓");
        console.log(xmlText);

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        const items = xmlDoc.getElementsByTagName("item");

        if (items.length === 0) {
            eventBox.innerHTML = "현재 예정된 축제/행사가 없습니다.";
            return;
        }

        let html = "<ul>";

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            let rawTitle =
                item.getElementsByTagName("MAIN_TITLE")[0]?.textContent ||
                "제목 없음";

            /* (한,영,중…) 제외 처리 */
            const title = rawTitle.replace(/\([^)]*\)/g, "").trim();

            const place =
                item.getElementsByTagName("PLACE")[0]?.textContent ||
                "정보 없음";

            const date =
                item.getElementsByTagName("USAGE_DAY_WEEK_AND_TIME")[0]
                    ?.textContent ||
                item.getElementsByTagName("USAGE_DAY")[0]?.textContent ||
                "날짜 정보 없음";

            html += `
                <li style="margin-bottom:20px;">
                    <strong>${title}</strong><br>
                    📍 장소: ${place}<br>
                    기간: ${date}<br><br>
                </li>
            `;
        }

        html += "</ul>";
        eventBox.innerHTML = html;
    } catch (err) {
        console.error("❌ API 호출 오류:", err);
        eventBox.innerHTML = "행사 정보를 가져오는 도중 오류가 발생했습니다.";
    }
}

eventBtn.addEventListener("click", fetchBusanEventsXML);
