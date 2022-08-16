const ul = document.querySelector(".recipes");
const tmp = document.querySelector("#tmp-id");
const form = document.querySelector('form')
const fetchBtn = document.querySelector("#available-recipes button")

API_URL = "http://127.0.0.1:8000"

const send_http_req = (method, endpoint, body) => {
  const promise = new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, `${API_URL}${endpoint}`);
    xhr.setRequestHeader(
      "Authorization",
      "Token d358dc574c37804b178886b13c457aaea8329242"
    );

    xhr.setRequestHeader(
      "Accept",
      "application/json"
    );

    xhr.setRequestHeader(
      "Content-Type",
      "application/json"
    );

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        res(xhr.response);
      } else {
        rej(
          Error(`${xhr.response}\nStatus Code: ${xhr.status}\n------------ERROR HANDLING-----------`)
        )
      }
    };

    xhr.onerror = () => {
      rej(
        Error(`Failed to send request!`)
      )
    };


    if (method == "POST") {
      xhr.send(
        JSON.stringify(body)
      );
    } else { xhr.send(); }
  });
  return promise;
};

const post_recipes = async (
  title,
  time_minutes,
  price,
  description
  ) => {
    const recipe = {
      title : title,
      time_minutes: time_minutes,
      price : price,
      description : description
    }
    send_http_req(
      method = "POST",
      endpoint = "/api/recipes/",
      body = recipe
    )
  }
;

const fetch_recipes = () => {
  send_http_req("GET", "/api/recipes/")
  .then((res) => {
    let recipes = JSON.parse(res);
    for (let recipe of recipes) {
      const tmpNode = document.importNode(tmp.content, true);
      li = tmpNode.querySelector("li")
      li.id = recipe.self
      li.querySelector("h2").textContent = `Title: ${recipe.title}`;
      li.querySelector("p").textContent = `
      Cooking time: ${recipe.time_minutes} minutes ---------------
      Price: \$${recipe.price}`;
      ul.append(li);
    }
  }, (rej) => console.log(rej))
};

fetchBtn.addEventListener("click", fetch_recipes)
form.addEventListener("submit", event => {
  event.preventDefault();
  const title = event.currentTarget.querySelector("#title").value;
  const time_minutes = event.currentTarget.querySelector("#time-minutes").value;
  const price = event.currentTarget.querySelector("#price").value;
  const description = event.currentTarget.querySelector("#description").value;

  post_recipes(
    title,
    time_minutes,
    price,
    description
  );
})

ul.addEventListener("click", event => {
  if (event.target.tagName === "BUTTON") {
    const recipeEndpoint = event.target.closest("li").id;
    send_http_req("DELETE", recipeEndpoint)
    // console.log(`${API_URL}${recipeEndpoint}/`);
  }
});



