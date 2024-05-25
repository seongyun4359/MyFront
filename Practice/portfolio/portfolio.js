// 스크롤바
let scrollTop = 0;
let bar = document.getElementsByClassName("bar-ing")[0];
let header = document.querySelector("header");

window.addEventListener(
  "scroll",
  () => {
    scrollTop = document.documentElement.scrollTop;
    let per = Math.ceil(
      (scrollTop / (document.body.scrollHeight - window.outerHeight)) * 100
    );
    bar.style.width = per + "%";

    // 헤더 배경 변경
    if (scrollTop > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  },
  false
);

// 포트폴리오 나열 기능
const details = {
  activity1: {
    image: 'img/activity1.jpg',
    link: 'https://burnt-jackrabbit-281.notion.site/IT-227bf93dbc004fdfb847523a0df76d4c?pvs=4',
    description: '웅진씽크빅 AI 문해력교육서비스 기획캠프 수료(UX 기획)'
  },
  activity2: {
    image: 'img/activity2.jpg',
    link: 'https://conference.hcikorea.org/hcik2024/programs/thesis_program.asp',
    description: '2024 HCI KOREA 학회 방문'
  },
  activity3: {
    image: 'img/activity3.jpg',
    link: 'https://burnt-jackrabbit-281.notion.site/7518afffa9954214a80eb0329df0a006?pvs=4',
    description: '빅데이터 활용 미래 사회문제 해결 아이디어 해커톤 참가: 고령자를 위한 자습어플'
  },
  activity4: {
    image: 'img/activity4.png',
    link: 'https://burnt-jackrabbit-281.notion.site/AI-a67172c52a204e499e7324bd922b45f1?pvs=4',
    description: '사회문제 해결 해커톤 참가: 생성형 AI 맞춤형 병원 안내 서비스'
  },
  activity5: {
    image: 'img/activity5.png',
    link: 'https://burnt-jackrabbit-281.notion.site/d36e016a19e14d8eba21ddc2bc4b8ade?pvs=4',
    description: '2024 미래도서관 정책 아이디어 해커톤 대회 참가: 시니어를 위한 폐교활용 도서관'
  },
  activity6: {
    image: 'img/activity6.jpg',
    link: 'https://www.instagram.com/chic_stg/?hl=ko',
    description: '광운대학교 정보융합학부 전공 동아리 CHIC 임원진 (2023.7~)'
  },
  activity7: {
    image: 'img/activity7.jpg',
    link: 'https://www.daddyslab.com/dlab_jeongja',
    description: '디랩 프로그래밍 학원 튜터 - 앱인벤터, 로블록스 스튜디오, 파이썬 교육(2023.07~)'
  },
  activity8: {
    image: 'img/activity8.png',
    link: 'https://www.instagram.com/kw_sowon/?hl=ko',
    description: '소원 소프트웨어 서포터즈 교육 봉사 활동 (2024.3~)'
  },
  activity9: {
    image: 'img/activity9.jpg',
    link: 'https://www.notion.so/0314aaa0574c4326814ed6d54b367b11',
    description: '마이캡스톤: 역류성식도염 예방 어플 - UXUI 및 앱 구현 담당 (2024.3~)'
  },
};

function showDetails(activityId) {
  const detail = details[activityId];
  const detailsDiv = document.getElementById('details');
  detailsDiv.innerHTML = `
    <h3>${detail.description}</h3>
    <img src="${detail.image}" alt="${detail.description}" style="width:100%;height:auto;border-radius:10px;">
    <p><a href="${detail.link}" target="_blank">더 알아보기</a></p>
  `;
}



// 방명록 기능 구현
let cnt = 1;
function a() {
  let writer = f.writer.value;
  let pwd = f.pwd.value;
  let content = f.content.value;
  let currentTime = new Date().toLocaleString(); // 작성 시간 추가
  let el = mkDiv(writer, pwd, content, currentTime);
  let list = document.getElementById("list");
  list.appendChild(el);
  f.writer.value = "";
  f.pwd.value = "";
  f.content.value = "";
}

function mkDiv(writer, pwd, content, time) {
  let newDiv = document.createElement("div"); // 새 div 태그 생성
  newDiv.id = "d_" + cnt; // 생성한 div에 id 지정. d_cnt
  newDiv.pwd = pwd;
  let html = ""; // 생성된 div에 출력될 내용
  html += "작성자: <span id='w_" + cnt + "'>" + writer + "</span><br/>";
  html += "내용: <span id='c_" + cnt + "'>" + content + "</span><br/>";
  html += "작성 시간: <span id='t_" + cnt + "'>" + time + "</span><br/>";
  html += "<input type='button' value='수정' onclick=editForm(" + cnt + ")>"; // editForm(2)
  html += "<input type='button' value='삭제' onclick=del(" + cnt + ")>";
  newDiv.innerHTML = html;
  cnt++;
  return newDiv;
}

function editForm(cnt) {
  let editDiv = document.getElementById("d_" + cnt); // 수정할 글의 div
  let editForm = document.getElementById("editf");
  editDiv.appendChild(editForm);
  let writer = document.getElementById("w_" + cnt).innerHTML;
  let content = document.getElementById("c_" + cnt).innerHTML;
  document.getElementById("editwriter").value = writer;
  document.getElementById("editcontent").value = content;
  document.getElementById("editbtn").cnt = cnt; // 버튼에 cnt 속성을 추가해서, 수정 글 번호를 저장
  editForm.style.display = '';
}

function cancel() {
  let editForm = document.getElementById("editf");
  editForm.style.display = 'none';
  document.getElementsByTagName("body")[0].appendChild(editForm);
}

function edit() {
  let cnt = document.getElementById("editbtn").cnt;
  let editDiv = document.getElementById("d_" + cnt);
  let pwd2 = document.getElementById("editpwd").value; // 수정폼에 입력한 글 비밀번호
  if (editDiv.pwd != pwd2) {
    alert("글 비밀번호 불일치. 수정불가");
  } else {
    let newWriter = document.getElementById("editwriter").value;
    let newContent = document.getElementById("editcontent").value;
    document.getElementById("w_" + cnt).innerHTML = newWriter;
    document.getElementById("c_" + cnt).innerHTML = newContent;
  }
  document.getElementById("editwriter").value = "";
  document.getElementById("editcontent").value = "";
  document.getElementById("editpwd").value = "";
  cancel();
}

function del(cnt) {
  let pwd = prompt("글 비밀번호");
  let delDiv = document.getElementById("d_" + cnt);
  if (pwd == delDiv.pwd) {
    document.getElementById("list").removeChild(delDiv);
  } else {
    alert("글 비밀번호 불일치. 삭제취소");
  }
}
