// 스크롤바
let scrollTop = 0;
let bar = document.getElementsByClassName("bar-ing")[0];

window.addEventListener(
    "scroll",
    () => {
        scrollTop = document.documentElement.scrollTop;
        let per = Math.ceil(
            (scrollTop / (document.body.scrollHeight - window.outerHeight)) * 100
        );
        bar.style.width = per + "%";
    },
    false
);



/*
  const box = document.querySelector("#box");

  box. addEventListener("mouseenter", ()=>{
    box.style.backgroundColor = "hotpink";
  });

  box. addEventListener("mouseleave", ()=>{
    box.style.backgroundColor = "aqua";
  });
*/