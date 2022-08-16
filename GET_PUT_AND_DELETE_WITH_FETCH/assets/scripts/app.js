const ul = document.querySelector(".recipes");
const tmp = document.querySelector("#tmp-id");
const form = document.querySelector('form')
const fetchBtn = document.querySelector("#available-recipes button")

API_URL = "http://127.0.0.1:8000"

const send_http_req = (method, endpoint, body) => {
  return fetch(
    `${API_URL}${endpoint}`,
    {
      method : method,
      body : JSON.stringify(body),
      headers : {
        'Authorization' : "Token d358dc574c37804b178886b13c457aaea8329242",
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'

      }
    }
  )
  .then(res => {
    if (res.status === 204) {
      return res;
    } else if ( res.status >= 200 && res.status < 300) {
      return res.json()
    } else {
      // throw new Error("Something went wrong", res);
      return res.json()
      .then(res => {
        // console.log(res.detail)
        throw new Error(`Error!\n${res.detail}`);
      })
    }
  })
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

const fetch_recipes = async () => {
  send_http_req("GET", "/api/recipes/")
  .then((res) => {
    let recipes = res;
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
  },
  (rej) => console.log(rej.message))
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
    send_http_req("DELETE", recipeEndpoint).catch(reason => console.log(reason.message))
    // console.log(`${API_URL}${recipeEndpoint}/`);
  }
});



