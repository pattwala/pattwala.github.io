'use strict'

const contentful = require('contentful')
const chalk = require('chalk')
const Table = require('cli-table2')

const SPACE_ID = 'k7w2q9r6o1jp'
const ACCESS_TOKEN = '63f7200892fe8c001dab204ea3d2520334b95d9e6e2a22d537f125278663afdd'

const client = contentful.createClient({
	space: SPACE_ID,
	accessToken: ACCESS_TOKEN
})

const rootElem = document.getElementById('app');

var granimInstance = new Granim({
	element: '#granim-canvas',
	name: 'background',
	direction: 'diagonal',
	opacity: [1, 1],
	isPausedWhenNotInView: true,
	stateTransitionSpeed: 300,
	states : {
		"default-state" : {
			gradients: [ 
				['#FF93B4', '#FFA6C1'],
				['#658DB5', '#395D82'],
				['#65B589', '#478261'],
			],
            transitionSpeed: 20000,
       	},
       	"home-page" : {
			// gradients: [ ['#FF93B4', '#FFA6C1'] ],
			// loop: false
			gradients: [ 
				['#FF93B4', '#FFA6C1'],
				['#658DB5', '#395D82'],
				['#65B589', '#478261'],
			],
            transitionSpeed: 20000,
       	},
       	"portfolio" : {
			gradients: [ 
				['#F9F2F2', '#DCD5D8']
			],
			loop: false
       	},
       	"about" : {
			gradients: [ 
				['#F9F2F2', '#DCD5D8']
			],
			loop: false
       	}

   }
});

var App = {
	// Load all entries for a given Content Type from Contentful
	fetchEntriesForContentType : function (contentType) {
		return client.getEntries({
			content_type: contentType
		})
		.then((response) => response.items)
		.catch((error) => {
			console.log(chalk.red(`\nError occurred while fetching Entries for ${chalk.cyan(contentType.name)}:`))
			console.error(error)
		})
	},

	getRoute : function() {
		var path = window.location.pathname + window.location.hash;
		var name = "";
		
		console.log("path: " + path);
		
		switch(path) {
			case "/" :
			case "/#" :
			case "/index.html" :
	  			name = "home-page";
			break;
		  
			case "/#/portfolio" :
				name = "portfolio";
				break;

			case "/#/about" :
				name = "about";
				break;


			default :
				name = "home-page";
	   }

	   return name;
	},

	getView : function(name) {
		return 'views/' + name + '.html';
	},

	goToRoute : function(route) {
		console.log("route: " + route);

		var scope = this;
		var xhttp = new XMLHttpRequest();
		var url = this.getView(route);

		xhttp.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				//TAG THE OLD PAGE
				$('.main-content').addClass('to-remove').removeClass('visible');

				//INJECT THE NEW DOM ELEMENTS (hidden)
				var $view = $(this.responseText);
				$(rootElem).append($view);
				granimInstance.changeState(route);
				
				//INJECT THE NEW CONTENT
				scope.injectContent(route);

				setTimeout(function() {
					// $('.to-remove').remove();
					$view.addClass('visible');
				},100);
				
				//Animate out the old content
				// $('.to-remove').fadeOut(200);
				setTimeout(function() {
					$('.to-remove').remove();
				},100);

				//Animate in the new content

				//UPDATE THE DOM
				// rootElem.innerHTML = this.responseText;

			}
		};

		xhttp.open('GET', url, true);
		xhttp.send();
	},

	getPageContent : function() {
		return this.pageContent = this.fetchEntriesForContentType("page");
	},

	injectContent : function(route) {
		this.pageContent.then((entries) => {
			var entry = entries.filter(entry => entry.fields.slug == route).pop();

			for(var field in entry.fields) {
				if(field == "slug") {
					$('body').removeClass().addClass(entry.fields[field]);
				}
				
				// var content = (field === 'content') ? md.render(entry.fields[field]) : entry.fields[field];
				var content = entry.fields[field];

				$("#" + route + " ."+field).html(content);
			}
		})
	},

	init : function() {
		var scope = this;

		this.getPageContent().then(() => {
			this.goToRoute(this.getRoute()); 
			window.onhashchange = function() {
				scope.goToRoute(scope.getRoute());
			};
		})
	}
}

// Start the boilerplate code
App.init();
