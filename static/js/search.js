function ingrediantSearch(input) {
	var searchString = input;
	var ingrediantArr = searchString.split(", ");

	var ingrediantString = ingrediantArr.map(ingrediant => ingrediant + '%2C');

	let requestString = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/find" +
	"ByIngredients?number=5&ranking=1&ingredients=";

	requestString = requestString + ingrediantString;

	fetch(requestString, {
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "1c21a777d3msh628208c1292df8fp188f2djsn6a46b7c57061",
			"x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
		}
	})
	.then(response => {
		return response.json();
	}).then(response => {
		console.log(response);
		displayIngredient(response);
	})
	.catch(err => {
		console.error(err);
	});
}

function recipeSearch(input) {
	var recipeString = input;

	let requestString = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search?query=";

	requestString = requestString + recipeString;

	fetch(requestString, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "1c21a777d3msh628208c1292df8fp188f2djsn6a46b7c57061",
		"x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
	}
	})
	.then(response => {
		return response.json();
	}).then(response => {
		console.log(response);
		displayRecipe(response);
	})
	.catch(err => {
		console.error(err);
	});
}

function questionSearch(input) {
	var sentenceString = input;
	var encString = encodeURIComponent(sentenceString);

	let requestString = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/quickAnswer?q=";

	requestString = requestString + encString;

	fetch(requestString, {
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "1c21a777d3msh628208c1292df8fp188f2djsn6a46b7c57061",
			"x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
		}
		})
		.then(response => {
			return response.json();
		}).then(response => {
			console.log(response);
			displayQuestion(response);
		})
		.catch(err => {
			console.error(err);
		});
}

function idSearch(input) {
	var id = input;

	let requestString = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/";

	requestString = requestString + id + "/information";

	fetch(requestString, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "1c21a777d3msh628208c1292df8fp188f2djsn6a46b7c57061",
		"x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
	}
	})
	.then(response => {
		return response.json();
	}).then(response => {
		console.log(response);
		displayInfo(response);
	})
	.catch(err => {
		console.error(err);
	});
}

function search(){
	var searchString = document.getElementById("searchInput").value.toString();
	let value = "";

	for (i = 0; i < document.getElementsByName("customRadio").length; i++) {
		if (document.getElementsByName("customRadio")[i].checked) {
			value = document.getElementsByName("customRadio")[i].value.toString();
		}
	}

	console.log("Radio button value: " + value);
	console.log("Search value: " + searchString);

	if (value === "Ingredient") {
		ingrediantSearch(searchString);
	}
	else if (value === "Recipe") {
		recipeSearch(searchString);
	}
	else if (value === "Question") {
		questionSearch(searchString);
	}
}

function displayIngredient(response){
	let ingredients = [];
	let missedIngredients = [];
	let output = `<table class="table table-hover">
									<thead>
											<th scope="col">Recipes</th>
											<th scope="col">Ingredients</th>
											<th scope="col">Missing Ingredients</th>
											<th scope="col">Likes</th>
									</thead>
								 </table>
								`;

	response.forEach(function(item, i){
		let list = response[i].usedIngredients;
		let missedList = response[i].missedIngredients;
		list.forEach(function(item, j)
		{
			console.log(item.name);
			ingredients.push(item.name);
		});
		missedList.forEach(function(item, j)
		{
			missedIngredients.push(item.name);
		})
			output += `
							<table class="table table-hover">
									<tbody>
											<tr>
												<th scope="row">${item.title}</th>
												<td>${ingredients}</td>
												<td>${missedIngredients}</td>
												<td>${item.likes}</td>
									</tbody>
							 </table>
			`;
	});
	document.getElementById("results").innerHTML = output;

}

function displayRecipe(response){
	let recipes = response.results;
	let output = `<table class="table table-hover">
									<thead>
											<th scope="col">Recipes</th>
											<th scope="col">Ready in (mins)</th>
											<th scope="col">Servings</th>
											<th scope="col">Link</th>
									</thead>
								 </table>
								`;

	recipes.forEach(function(item, i){
			output += `
							<table class="table table-hover">
									<tbody>
											<tr>
												<th scope="row">${item.title}</th>
												<td>${item.readyInMinutes}</td>
												<td>${item.servings}</td>
												<td><a href="${item.sourceUrl}" target="_blank"><button type="button" class="btn btn-primary">View Recipe</button></a></td>
									</tbody>
							 </table>
			`;
	});
	document.getElementById("results").innerHTML = output;

}

function displayQuestion(response){

	let output = `<table class="table table-hover">
									<thead>
											<th scope="col">Answer</th>
									</thead>
								 </table>
								`;

			output += `
							<table class="table table-hover">
									<tbody>
											<tr>
												<td>${response.answer}</th>
									</tbody>
							 </table>
			`;
	document.getElementById("results").innerHTML = output;

}

function displayInfo(response) {
	document.getElementById("recipe_img").src = response.image;
    document.getElementById("servings").innerHTML = response.servings;
	document.getElementById("ready").innerHTML = response.readyInMinutes;
	document.getElementById("type").innerHTML = response.dishTypes;
	document.getElementById("title").innerHTML = response.title;
	document.getElementById("header").innerHTML = response.title;
	document.getElementById("summary").innerHTML = response.summary;
	
	if (response.dairyFree) {
		document.getElementById("dairy").innerHTML = "Yes";
	}
	else {
		document.getElementById("dairy").innerHTML = "No";
	}

	if (response.glutenFree) {
		document.getElementById("gluten").innerHTML = "Yes";
	}
	else {
		document.getElementById("gluten").innerHTML = "No";
	}

    if (response.vegan) {
		document.getElementById("vegan").innerHTML = "Yes";
	}
	else {
		document.getElementById("vegan").innerHTML = "No";
	}

    document.getElementById("url").href = response.sourceUrl;
}

var form = document.getElementById("searchForm");
function handleForm(event){event.preventDefault();}
form.addEventListener('submit', handleForm);
document.getElementById("searchForm").addEventListener("submit", search, true);

/*document.getElementById("btn").addEventListener("click", function(){ ingrediantSearch("chicken, tomato,potatoes"); });
document.getElementById("btn2").addEventListener("click", function(){ recipeSearch("burger"); });
document.getElementById("btn3").addEventListener("click", function(){ questionSearch("calories in burger"); });
document.getElementById("btn4").addEventListener("click", function(){ idSearch(479101)});*/
