## TODO-LIST in Javascript

![todo-list](https://user-images.githubusercontent.com/33679192/172362269-1e468086-65ca-4854-8096-e6250d47b584.gif)

## 설명

데이터 베이스(로컬)와  
통신하여 데이터를 받고 보내어 입력, 수정, 삭제 등을 구현.

src/js/main.js

## API

restful api, axios, http 통신, es6, javascript, css3, bootstrap

## 기능

### 1. GET - 서버 데이터 받아서 브라우져에 표현

![get](https://user-images.githubusercontent.com/33679192/172369680-2e046816-d4e6-4141-8b86-ec0afb08cc11.gif)

```javascript
const promiseGetTodo = () =>
  axios.get("http://localhost:9000/todos").then((res) => res.data);

const ajaxGetTodo = async () => {
  try {
    todos = await promiseGetTodo();
    renderTodos();
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
```

### 2. POST - 데이터를 서버로 전송, 추가 후 받아서 브라우져에 표현

![post](https://user-images.githubusercontent.com/33679192/172371510-8f7969ec-6542-492d-bc57-a85d8e6b8cf2.gif)

```javascript
const promisePostTodo = (content) =>
  axios.post("http://localhost:9000/todos", {
    id: maxId(todos),
    content,
    completed: false,
    date: dateTodo(),
    alarm: "-1",
  });

const ajaxPostTodo = async (content) => {
  try {
    await promisePostTodo(content);
  } catch (e) {
    console.log(new Error("Error"));
  }
};

const inputTodo = (target) => {
  const content = $inputTodo.value.trim();
  if (content === "") return;
  $inputTodo.value = "";
  ajaxPostTodo(content);
  ajaxGetTodo();
};

$inputTodo.addEventListener("keyup", ({ target, keyCode }) => {
  if (keyCode !== 13 || !target.classList.contains("form-control")) return;
  inputTodo();
});

$saveTodo.addEventListener("click", () => {
  inputTodo();
});
```

### 3. FATCH - 수정한 데이터를 서버로 전송, 변경된 데이터를 받아서 브라우져에 표현

![fetch](https://user-images.githubusercontent.com/33679192/172373231-a22e27cd-65bb-4df5-a350-2c5afb08e0f0.gif)

```javascript
const promisePatchTodoCheck = (id, checked) =>
  axios.patch(`http://localhost:9000/todos/${id}`, { completed: checked });

const promisePatchTodoContent = (target, content) =>
  axios.patch(`http://localhost:9000/todos/${thisId(target.parentNode)}`, {
    content,
  });

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

const checkedTodo = (target) => {
  if (!target.classList.contains("custom-control-input")) return;
  const { checked } = target;
  const $id = +target.parentNode.parentNode.parentNode.id;
  ajaxPatchTodoCheck($id, checked);
  ajaxGetTodo();
};

const modifyTodo = (target, keyCode, event) => {
  if (!target.classList.contains("label-modify")) return;
  const content = target.value;
  ajaxPatchTodoContent(target, content);
  modifyTodoEvent(target, keyCode, event);
};

$todos.addEventListener("keyup", ({ target, keyCode }) => {
  modifyTodo(target, keyCode, "keyup");
});

$todos.addEventListener("focusout", ({ target, keyCode }) => {
  modifyTodo(target, keyCode, "focusout");
});
```

### 4. DELETE - 삭제한 데이터 정보를 서버에 전송, 변경된 데이터를 받아서 브라우져에 표현

![delete](https://user-images.githubusercontent.com/33679192/172374238-3b016e42-6c92-487d-83e0-4c1f734c6dde.gif)

```javascript
const promiseDeleteTodo = (target) =>
  axios.delete(`http://localhost:9000/todos/${thisId(target)}`);

const ajaxDeleteTodo = async (target) => {
  try {
    await promiseDeleteTodo(target);
  } catch (e) {
    console.log(new Error("Error"));
  }
};

const deleteTodo = async (target) => {
  if (!target.classList.contains("removeTodo")) return;
  ajaxDeleteTodo(target);
  ajaxGetTodo();
};

$todos.addEventListener("click", ({ target }) => {
  deleteTodo(target);
  btnModifyTodo(target);
  btnAlramTodo(target);
});
```

### 5. 외부 Weather api - 외부 날씨 api를 받아서 적용

![weather](https://user-images.githubusercontent.com/33679192/172366524-993615ab-73d4-4f23-8b97-23e06597e37f.jpg)

```javascript
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

  weatherBackground(nowWeather);
};
const weatherBackground = (nowWeather) => {
  const $weaterIcon = document.querySelector(".image > .fas");

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
```
