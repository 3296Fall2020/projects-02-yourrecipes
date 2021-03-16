function ingrediantSearch(input) {
	var searchString = input;
	var ingrediantArr = searchString.split(", ");

	var ingrediantString = ingrediantArr.map(ingrediant => ingrediant + '%2C');

	let requestString = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/find" +
	"ByIngredients?number=100&rank=1&ingredients=";

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

	let requestString = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search?number=100&rank=1&query=";

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

	requestString = requestString + id + "/information?includeNutrition=true";

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

function idSaved(input) {
	var id = input;

	let requestString = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/";

	requestString = requestString + id + "/information?includeNutrition=true";

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
		displaySaved(response);
	})
	.catch(err => {
		console.error(err);
	});
}

var output1 = `<table class="table table-hover">
		<thead>
				<th scope="col">Name</th>
				<th scope="col">Link</th>
				<th scope="col">Delete</th>
		</thead>
	 </table>
	`;
function displaySaved(response){

		output1 += `
								<table class="table table-hover">
										<tbody>
												<tr>
													<th scope="row">${response.title}</th>
													<td><a href="/recipe?recipe=${response.id}" target="_blank"><button type="button" class="btn btn-primary">View Recipe</button></a></td>
													<td><button name="delete" onclick="deleteRecipe(${response.id})" class="btn btn-primary">Delete</button></td>
												</tr>
										</tbody>
								 </table>
				`;

		document.getElementById('results').innerHTML = output1;
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

function saveRecipe(id) {
	var recipeData = {
		recipe: id
	}

	// post data to server
	console.log("Saved Recipe ID: " + recipeData.recipe)
	$.post("/api/saverecipe", recipeData, function(res){
		if(res.success === true){
			alert("Success!")
		}
		else {
			if(res.reason) alert(res.reason)
			else alert("Unknown error")
		}
	})
}

function deleteRecipe(id) {
	var recipeData = {
		recipe: id
	}

	// post data to server
	console.log("ID: " + recipeData.recipe)
	$.post("/api/deleterecipe", recipeData, function(res){
		if(res.success === true){
			alert("Success!")
		}
		else {
			if(res.reason) alert(res.reason)
			else alert("Unknown error")
		}
	})

	window.location.reload()
}

function displayIngredient(response){
	let ingredients = [];
	let missedIngredients = [];
	let output = `<table class="table table-hover">
									<thead>
											<th scope="col">Recipes</th>
											<th scope="col">Link</th>
											<th scope="col">Save</th>
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
												<td><a href="/recipe?recipe=${item.id}" target="_blank"><button type="button" class="btn btn-primary">View Recipe</button></a></td>
												<td><button name="save" onclick="saveRecipe(${item.id})" class="btn btn-primary">Save</button></td>
											</tr>
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
											<th scope="col">Link</th>
											<th scope="col">Save</th>
									</thead>
								 </table>
								`;


	recipes.forEach(function(item, i){
		//console.log("Display ID:" +` ${item.id}`);
		output += `
							<table class="table table-hover">
									<tbody>
											<tr>
												<th scope="row">${item.title}</th>
												<td><a href="/recipe?recipe=${item.id}" target="_blank"><button type="button" class="btn btn-primary">View Recipe</button></a></td>
												<td><button name="save" onclick="saveRecipe(${item.id})" class="btn btn-primary">Save</button></td>
											</tr>
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

	document.getElementById("type").innerHTML = response.dishTypes.join(', ');
	document.getElementById("type").style.textTransform = "capitalize";

	document.getElementById("title").innerHTML = response.title;
	document.getElementById("header").innerHTML = response.title;
	document.getElementById("summary").innerHTML = response.summary;
	document.getElementById("calories").innerHTML = response.nutrition.nutrients[0].amount;
	document.getElementById("fat").innerHTML = response.nutrition.nutrients[1].amount;
	document.getElementById("protein").innerHTML = response.nutrition.nutrients[8].amount;
	document.getElementById("instructions").innerHTML = response.instructions;

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
