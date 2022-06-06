const $inputTodo = document.querySelector("#inputTodo");
const $saveTodo = document.querySelector("#saveTodo");
const $todos = document.querySelector("#todos");
const $modalClose = document.querySelector(".btn-modal-close");
const $inputAlramMinutes = document.querySelector(".alarm-minutes");
const $inputAlramSeconds = document.querySelector(".alarm-seconds");
const $saveAlarm = document.querySelector("#save-alarm");

let todos = [];

const promiseGetTodo = () =>
  axios.get("http://localhost:9000/todos").then((res) => res.data);

const promisePostTodo = (content) =>
  axios.post("http://localhost:9000/todos", {
    id: maxId(todos),
    content,
    completed: false,
    date: dateTodo(),
    alarm: "-1",
  });

const promisePatchTodoCheck = (id, checked) =>
  axios.patch(`http://localhost:9000/todos/${id}`, { completed: checked });

const promisePatchTodoContent = (target, content) =>
  axios.patch(`http://localhost:9000/todos/${thisId(target.parentNode)}`, {
    content,
  });

const promisePatchTodoAlarm = (target, alarm) =>
  axios.patch(`http://localhost:9000/todos/${thisId(target)}`, { alarm });

const promiseDeleteTodo = (target) =>
  axios.delete(`http://localhost:9000/todos/${thisId(target)}`);

const ajaxGetTodo = async () => {
  try {
    todos = await promiseGetTodo();
    renderTodos();
  } catch (e) {
    console.log(new Error("Error"));
  }
};

const ajaxGetCheck = async () => {
  try {
    todos = await promiseGetTodo();
  } catch (e) {
    console.log(new Error("Error"));
  }
};

const ajaxPostTodo = async (content) => {
  try {
    await promisePostTodo(content);
  } catch (e) {
    console.log(new Error("Error"));
  }
};

const ajaxPatchTodoCheck = async (id, checked) => {
  try {
    await promisePatchTodoCheck(id, checked);
  } catch (e) {
    console.log(new Error("Error"));
  }
};

const ajaxPatchTodoContent = async (target, content) => {
  try {
    await promisePatchTodoContent(target, content);
  } catch (e) {
    console.log(new Error("Error"));
  }
};

const ajaxPatchAlarmData = async (target, alarm) => {
  try {
    await promisePatchTodoAlarm(target, alarm);
  } catch (e) {
    console.log(new Error("Error"));
  }
};

const ajaxDeleteTodo = async (target) => {
  try {
    await promiseDeleteTodo(target);
  } catch (e) {
    console.log(new Error("Error"));
  }
};

const renderTodos = () => {
  let html = "";

  todos.sort((a, b) => b.id - a.id);
  todos.forEach(({ id, content, completed, date, alarm }) => {
    html += `
    <li id="${id}">
      <div class="row todos-inner">
        <div class="col-12 col-md-12 col-lg-8 custom-control custom-checkbox chk-type">
          <input type="checkbox" class="custom-control-input" id="inputCheck-${id}" ${
      completed ? "checked" : ""
    }>
          <label class="custom-control-label" for="inputCheck-${id}">${content}</label>
          <div class="label-modify-wrap"></div>
        </div>
        <div class="col-6 col-md-8 col-lg-2 text-right">
          <span id="dateTodo" class="date">${date}</span>
        </div>
        <div class="col-6 col-md-4 col-lg-2 text-right">
          <button type="button" class="btn btn-outline-light modifyTodo"><i class="fas fa-pencil-alt fa-xs"></i></button>
          <button type="button" class="btn btn-outline-light alramTodo" data-toggle="modal" data-target="#exampleModalCenter"><i class="far fa-clock fa-xs"></i><span class="alarm-time">${
            alarm !== ("-1" || "-")
              ? alarm.split("-")[0] + " 분" + alarm.split("-")[1] + "초"
              : ""
          }</span></button>
          <button type="button" class="btn btn-outline-light removeTodo">x</button>
        </div>
      </div>
    </li>
  `;
  });
  $todos.innerHTML = html;
};

const maxId = (list) =>
  list.length ? Math.max(...list.map((todo) => todo.id)) + 1 : 1;

const thisId = (target) => +target.parentNode.parentNode.parentNode.id;

const inputTodo = (target) => {
  const content = $inputTodo.value.trim();
  if (content === "") return;
  $inputTodo.value = "";
  ajaxPostTodo(content);
  ajaxGetTodo();
};

const dateTodo = () => {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const checkedTodo = (target) => {
  if (!target.classList.contains("custom-control-input")) return;
  const { checked } = target;
  const $id = +target.parentNode.parentNode.parentNode.id;
  ajaxPatchTodoCheck($id, checked);
  ajaxGetTodo();
};

const alarmCheck = () => {
  setInterval(() => {
    ajaxGetCheck();
    alarmWork();
  }, 1000);
};

const alarmWork = () => {
  const timeDate = new Date();
  const timeMinute = timeDate.getMinutes();
  const timeSecond = timeDate.getSeconds();
  todos.forEach(({ alarm, content }) => {
    const _alarmMinute = alarm.split("-")[0];
    const _alarmSecond = alarm.split("-")[1];
    console.log(+_alarmMinute, +_alarmSecond);
    console.log(timeMinute, timeSecond);
    if (+_alarmMinute === timeMinute && +_alarmSecond === timeSecond)
      alert(content);
  });
};

const buttonCondition = (btnTarget, target, fn) => {
  if (
    btnTarget.classList.contains(target) ||
    (btnTarget.tagName === "svg" &&
      btnTarget.parentNode.classList.contains(target)) ||
    (btnTarget.tagName === "path" &&
      btnTarget.parentNode.parentNode.classList.contains(target))
  ) {
    if (btnTarget.tagName === "svg") btnTarget = btnTarget.parentNode;
    else if (btnTarget.tagName === "path")
      btnTarget = btnTarget.parentNode.parentNode;
    fn(btnTarget);
  }
};

const btnModifyTodo = (btnTarget) => {
  buttonCondition(btnTarget, "modifyTodo", (value) => createModifyInput(value));
};

const btnAlramTodo = (btnTarget) => {
  buttonCondition(btnTarget, "alramTodo", (value) => saveAlramTodo(value));
};

const createModifyInput = (target) => {
  const $createInput = document.createElement("input");
  todos.forEach(({ id, content }) => {
    if (id === thisId(target)) {
      $createInput.setAttribute("type", "text");
      $createInput.setAttribute("class", "label-modify");
      $createInput.setAttribute("value", content);
    }
  });
  renderUiInput(target, $createInput);
};

const saveAlramTodo = (btnTarget) => {
  $inputAlramMinutes.id = `alarmMinutes-${thisId(btnTarget)}`;
  $inputAlramSeconds.id = `alarmSeconds-${thisId(btnTarget)}`;
  $saveAlarm.addEventListener("click", () => {
    if (
      $inputAlramMinutes.id === `alarmMinutes-${thisId(btnTarget)}` &&
      $inputAlramSeconds.id === `alarmSeconds-${thisId(btnTarget)}`
    ) {
      const alarmMinutes = $inputAlramMinutes.value;
      const alarmSeconds = $inputAlramSeconds.value;
      ajaxPatchAlarmData(btnTarget, `${alarmMinutes}-${alarmSeconds}`);
      alarmDataClear();
      alarmTimeAdded(alarmMinutes, alarmSeconds, btnTarget);
      // renderTodos();
    }
  });
};

const alarmDataClear = () => {
  $inputAlramMinutes.value = "";
  $inputAlramSeconds.value = "";
  $modalClose.click();
};

const alarmTimeAdded = (alarmMinutes, alarmSeconds, btnTarget) => {
  const $alarmTime = document.querySelector(".alarm-time");
  todos.forEach((todo) => {
    if (
      todo.id === +$alarmTime.parentNode.parentNode.parentNode.parentNode.id
    ) {
      btnTarget.children[1].innerHTML = `${alarmMinutes}분 ${alarmSeconds}초`;
    }
  });
};

const renderUiInput = (target, $createInput) => {
  [...$todos.children].forEach((list) => {
    const labelModifyWrap = list.children[0].children[0].children[2];
    if (+list.id === thisId(target)) {
      labelModifyWrap.innerHTML = "";
      labelModifyWrap.appendChild($createInput);
    } else {
      labelModifyWrap.innerHTML = "";
    }
  });
};

const modifyTodoEvent = (target, keyCode, event) => {
  if (event === "keyup" || event === "focusout") {
    if (event === "keyup" && keyCode !== 13) return;
    target.parentNode.removeChild(target);
    ajaxGetTodo();
  }
};

const modifyTodo = (target, keyCode, event) => {
  if (!target.classList.contains("label-modify")) return;
  const content = target.value;
  ajaxPatchTodoContent(target, content);
  modifyTodoEvent(target, keyCode, event);
};

const deleteTodo = async (target) => {
  if (!target.classList.contains("removeTodo")) return;
  ajaxDeleteTodo(target);
  ajaxGetTodo();
};

window.addEventListener("load", () => {
  ajaxGetTodo();
  alarmCheck();
});

$inputTodo.addEventListener("keyup", ({ target, keyCode }) => {
  if (keyCode !== 13 || !target.classList.contains("form-control")) return;
  inputTodo();
});

$saveTodo.addEventListener("click", () => {
  inputTodo();
});

$todos.addEventListener("keyup", ({ target, keyCode }) => {
  modifyTodo(target, keyCode, "keyup");
});

$todos.addEventListener("focusout", ({ target, keyCode }) => {
  modifyTodo(target, keyCode, "focusout");
});

$todos.addEventListener("change", ({ target }) => {
  checkedTodo(target);
});

$todos.addEventListener("click", ({ target }) => {
  deleteTodo(target);
  btnModifyTodo(target);
  btnAlramTodo(target);
});

const $memoEditor = document.querySelector("#memoEditor");
const $memoCreate = document.querySelector("#createMemo");
const $memoBox = document.querySelector("#memoBox");
const $memoTextArea = document.querySelector("#memoTextArea");

let $textArea;
let memo = [];

const promiseGetMemo = () =>
  axios.get("http://localhost:9000/memo").then((res) => res.data);

const promisePostMemo = () =>
  axios.post("http://localhost:9000/memo", memoData());

const promiseDeleteMemo = (id) =>
  axios.delete(`http://localhost:9000/memo/${id}`);

const ajaxGetMemo = async () => {
  try {
    memo = await promiseGetMemo();
    renderMemo();
  } catch (e) {
    console.log(e);
  }
};

const ajaxPostMemo = async () => {
  try {
    await promisePostMemo();
  } catch (e) {
    console.log(e);
  }
};

const ajaxDeleteMemo = async (id) => {
  try {
    await promiseDeleteMemo(id);
  } catch (e) {
    console.log(e);
  }
};

const renderEditor = () => {
  let html = "";
  html += `
   <div class="memo-box">
      <div class="row">
        <div class="col-8 col-md-10 col-lg-10 btn-area">
          <div id="memoFontWeight" class="dropdown">
            <button class="btn btn btn-outline-light dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              font-weight
            </button>
            <div class="dropdown-menu fontWeight" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item fontWeight-400" href="#">400</a>
              <a class="dropdown-item fontWeight-700" href="#">700</a>
            </div>
          </div>
          <div id="memoFontSize" class="dropdown">
            <button class="btn btn-outline-light dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              font-size
            </button>
            <div class="dropdown-menu fontSize" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item fontSize-14" href="#">14</a>
              <a class="dropdown-item fontSize-16" href="#">16</a>
              <a class="dropdown-item fontSize-20" href="#">20</a>
              <a class="dropdown-item fontSize-26" href="#">26</a>
              <a class="dropdown-item fontSize-40" href="#">40</a>
              <a class="dropdown-item fontSize-70" href="#">70</a>
            </div>
          </div>
          <div class="fontColor"><input type="text" id="memoFontColor" class="form-control" value="#" placeholder="" maxlength="7"></div>
          <div class="fontItalic"><button type="button" id="memoFontItalic" class="btn btn-outline-light memoItalic">italic</button></div>
        </div>
        <div class="col-4 col-md-2 col-lg-2 text-right">
          <div id="memoBgc" class="dropdown">
            <button class="btn btn-danger btn-palete" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-palette"></i>
            </button>
            <div class="dropdown-menu type2 border-0 row bg-color" aria-labelledby="dropdownMenuButton">
              <a class="drop-circle cir-skyBlue col" href="#">#64ccda</a>
              <a class="drop-circle cir-brown col" href="#">#de6b35</a>
              <a class="drop-circle cir-pink col" href="#">#e78fb3</a>
              <a class="drop-circle cir-green col" href="#">#6b591d</a>
              <a class="drop-circle cir-red col" href="#">#df0054</a>
            </div>
          </div>
        </div>
      </div>
      <div class="writer">
        <textarea id="memoTextArea" class="memoTextArea" cols="30" rows="10" style="font-style:normal;"></textarea>
      </div>
      <div class="memo-btn text-right">
        <button type="button" id="saveMemo" class="btn btn-danger saveMemo">Save</button>
        <button type="button" id="cancelMemo" class="btn btn-secondary cancelMemo">Cancel</button>
      </div>
    </div>
    `;

  $memoEditor.innerHTML = html;
  $memoEditor.classList.add("active");
  $textArea = document.querySelector(".memoTextArea");
};

const createMemo = () => {
  $memoEditor.className !== "active" ? renderEditor() : removeEditor();
};

const removeEditor = () => {
  $memoEditor.innerHTML = "";
  $memoEditor.classList.remove("active");
};

const renderMemo = () => {
  let html = "";
  memo.sort((a, b) => b.id - a.id);
  memo.forEach(
    ({ id, content, fontWeight, fontSize, fontColor, fontItalic, bgColor }) => {
      html += `<li class="col-sm-12 col-md-6" id="memo-${id}">
      <div class="sticker-memo" style="font-weight:${fontWeight};font-size:${fontSize};color:${fontColor};font-style:${fontItalic};background-color:${bgColor};">${content}</div>
      <button type="button" class="memoRemove">X</button>
    </li>`;
    }
  );
  $memoBox.innerHTML = html;
};

const memoData = () => ({
  id: maxId(memo),
  content: $textArea.value,
  fontWeight: $textArea.style.fontWeight || 400,
  fontSize: $textArea.style.fontSize || 20,
  fontColor: $textArea.style.color || "#fff",
  fontItalic: $textArea.style.fontStyle || "normal",
  bgColor: $textArea.style.backgroundColor || "black",
});

const font = (() => {
  const style = (fontStyle, target, fn) => {
    const $el = document.querySelector(`.${fontStyle}`);
    [...$el.children].forEach((list) => {
      if (list === target) {
        if (list.classList.contains("memoItalic")) {
          list.classList.toggle("active");
          const italic = list.classList.contains("active")
            ? "italic"
            : "normal";
          fn(italic, $textArea.style);
        } else {
          fn($textArea.style, target);
        }
      }
    });
  };

  return {
    weight(target) {
      style(
        "fontWeight",
        target,
        (textarea) => (textarea.fontWeight = target.textContent)
      );
    },
    size(target) {
      style(
        "fontSize",
        target,
        (textarea) => (textarea.fontSize = `${target.textContent}px`)
      );
    },
    color(target) {
      style("fontColor", target, (textarea) => (textarea.color = target.value));
    },
    italic(target) {
      style(
        "fontItalic",
        target,
        (italic, textarea) => (textarea.fontStyle = italic)
      );
    },
  };
})();

const bgColor = (target) => {
  const $el = document.querySelector(".bg-color");
  [...$el.children].forEach((list) => {
    if (list === target)
      $textArea.style.backgroundColor = `${target.textContent}`;
  });
};

const memoSave = (target) => {
  if (!target.classList.contains("saveMemo")) return;
  ajaxPostMemo();
  ajaxGetMemo();
  renderMemo();
  removeEditor();
};

const memoCancel = (target) => {
  if (!target.classList.contains("cancelMemo")) return;
  removeEditor();
};

window.addEventListener("load", () => {
  ajaxGetMemo();
});

$memoCreate.addEventListener("click", () => {
  createMemo();
});

$memoEditor.addEventListener("click", (e) => {
  e.preventDefault();
  const { target } = e;

  font.weight(target);
  font.size(target);
  font.italic(target);
  bgColor(target);
  memoSave(target);
  memoCancel(target);
});

$memoEditor.addEventListener("keyup", ({ target, keyCode }) => {
  if (
    !target.classList.contains("form-control") ||
    keyCode !== 13 ||
    target.value.trim() === "#"
  )
    return;
  font.color(target);
  target.value = "#";
});

$memoBox.addEventListener("click", ({ target }) => {
  if (!target.classList.contains("memoRemove")) return;
  const $id = +target.parentNode.id.split("-")[1];
  ajaxDeleteMemo($id);
  ajaxGetMemo();
});

const $weater = document.querySelector(".weather");

let weathers = {};

const promiseGetWeather = () =>
  axios.get(
    "http://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=96e89700e66c96b74824ca79ab7e64f8"
  );

const ajaxWeather = async () => {
  try {
    weathers = await promiseGetWeather();
    renderWeather();
  } catch (e) {
    console.log(new Error("Error"));
  }
};

const renderWeather = () => {
  const dataWeather = {
    nowWeather: weathers.data.weather[0].main,
    icon: weathers.data.weather[0].icon,
    country: weathers.data.sys.country,
    cityName: weathers.data.name,
  };

  const { nowWeather, icon, country, cityName } = dataWeather;

  let html = "";
  html = `
  <div class="image"><i class="fas fa-5x"></i></div>
  <div class="description">
    <p class="country">${country} - <span class="country-name">${cityName}</span></p>
    <h3 class="now-weather">${nowWeather}</h3>
  </div>
  `;
  $weater.innerHTML = html;
  // console.log('현재 날씨' + weathers.data.weather[0].main);
  // console.log('아이콘' + weathers.data.weather[0].icon);
  // console.log('상세 날씨 설명' + weathers.data.weather[0].description);
  // console.log('나라' + weathers.data.sys.country);
  // console.log('도시이름' + weathers.data.name);

  weatherBackground(nowWeather);
};
// https://user-images.githubusercontent.com/33679192/69259163-24325380-0c01-11ea-914c-928b26fa04dd.jpg
const weatherBackground = (nowWeather) => {
  const $weaterIcon = document.querySelector(".image > .fas");
  //  fa-cloud
  console.log($weaterIcon);
  switch (nowWeather) {
    case "Clear":
      $weaterIcon.classList.add("fa-cloud");
      break;
    case "Clouds":
      $weaterIcon.classList.add("fa-cloud");
      break;
    default:
      $weaterIcon.classList.add("fa-cloud");
      break;
  }
};

window.addEventListener("load", () => {
  ajaxWeather();
});
