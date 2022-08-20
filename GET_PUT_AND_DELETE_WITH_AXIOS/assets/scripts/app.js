const ul = document.querySelector(".recipes");
const tmp = document.querySelector("#tmp-id");
const form = document.querySelector('form')
const fetchBtn = document.querySelector("#available-recipes button")

API_URL = "http://127.0.0.1:8000"
TOKEN = "d358dc574c37804b178886b13c457aaea8329242"

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
    axios.post(
      "http://localhost:8000/api/recipes/",
      recipe,
      {
        headers: {
          Authorization: `Token ${TOKEN}`
        }
      }
    )
  }
;

const fetch_recipes = async () => {
  try {
    // const res = await send_http_req("GET", "/api/recipes/");
    const res = await axios.get(
      "http://localhost:8000/api/recipes/",
      {
        headers: {
          Authorization: `Token ${TOKEN}`
        },
      });
    console.log(res)
    let recipes = res.data;
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
  } catch (err) {
    alert(err.message);
  }
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
    axios.delete(
      `${API_URL}${recipeEndpoint}/`,
      {
        headers: {
          "Authorization" : `Token ${TOKEN}`
        }
      })
      .catch(reason => console.log(reason.message))
  }
});



