/* By disablig debug some stuff will not appear in-app */
debug = false;

xhr = "";
url = "";
title = "";
description = "";
link = "";
img = "";
first = false;
start = 0;
stop = 10;

$(document).ready(function() {
	var db = new DB();
	if(db.get().length == 0)
		first = true;
	else
		first = false;

	isDebug(debug, db, document);
	populatingDB(db);
	if(first) {
		alert("Benvenuto! Essendo il primo avvio, l'app si riavvierà automaticamente per leggere correttamente il database. Premi 'OK' per continuare.");
		/* 1st method */
		first = false;
		if(!window.location.hash) {
			window.location = window.location + '#loaded';
			window.location.reload(true);
		}
		/* 2nd method
		first = false;
		location.reload(true);*/
	}
	fetchData(start, stop, db);
	
	/* 
	 * Redundant scraping... used to correctly show
	 * new articles while app opens
	 */
	$('#navigation_toolbar').attr('class', 'hidden');
	$('#res').empty();
	fetchData(0, 10, db);
	
	/* Appending a counter for unread posts on the header */
	if(db.countUnread() == 0)
		$('#count_unread').attr('class', 'hidden');
	else {
		$('#count_unread').attr('class', '');
		$('#count_unread').append(db.countUnread());
	}
	
	/* Using jQuery to block unanmanaged clicks on imgs */
	$(document).on('click', 'a img', function() {
		return false;
	});	
	
	$(document).on('click','#admin', function() {
		new MozActivity({
			name: "view",
			data: {
				type: "url",
				url: "http://aro94.altervista.org/blog/wp-admin/"
			}
		});
	});
	
	$(document).on('click', '#contacts', function() {
		$('#contacts_dialog').attr('class', '');
	});
	
	$(document).on('click', '#close_dialog', function() {
		$('#contacts_dialog').attr('class', 'hidden');
	});
	
	$(document).on('click','#facebook', function() {
		$('#contacts_dialog').attr('class', 'hidden');
		new MozActivity({
			name: "view",
			data: {
				type: "url",
				url: "https://www.facebook.com/pages/Aro94s-blog/180813335288867"
			}
		});
	});
	
	$(document).on('click','#twitter', function() {
		$('#contacts_dialog').attr('class', 'hidden');
		new MozActivity({
			name: "view",
			data: {
				type: "url",
				url: "https://twitter.com/aro94"
			}
		});
	});
	
	$(document).on('click','#gplus', function() {
		$('#contacts_dialog').attr('class', 'hidden');
		new MozActivity({
			name: "view",
			data: {
				type: "url",
				url: "https://plus.google.com/u/0/+AronneBrivio"
			}
		});
	});
	
	$(document).on('click','#src', function() {
		new MozActivity({
			name: "view",
			data: {
				type: "url",
				url: "https://github.com/aroblu94/aro94-s-blog"
			}
		});
	});
	
	$(document).on('click', '#mailme', function() {
		new MozActivity({
			name: "new",
			data: {
        	    type: "mail",
            	url: "mailto:aroblu94@gmail.com"
            }
        });
	});
	
	$(document).on('click','.link', function() {
		document.querySelector('#article-page').className = 'skin-dark current';
		document.querySelector('[data-position="current"]').className = 'skin-dark left';
		db.read(this.id);
		fetchArticle(this.id);
	});
	
	$(document).on('click','#btn_back', function() {
		$('#res_article').empty();
		$('#title').empty();
		$('#url').empty();
		$("[data-position='current']").attr('class', 'skin-dark current');
		$("[data-position='right']").attr('class', 'skin-dark right');
		$('#navigation_toolbar').attr('class', 'hidden');
		$('#res').empty();
		if($('#res').attr('class') == '1')
			fetchData(0, 10, db);
		else if($('#res').attr('class') == '2')
			fetchData(10, 20, db);
		else if($('#res').attr('class') == '3')
			fetchData(20, 30, db);
		else if($('#res').attr('class') == '4')
			fetchData(30, 40, db);
		else if($('#res').attr('class') == '5')
			fetchData(40, 50, db);
		else if($('#res').attr('class') == '6')
			fetchData(50, 60, db);
		else if($('#res').attr('class') == '7')
			fetchData(60, 70, db);
		else if($('#res').attr('class') == '8')
			fetchData(70, 80, db);
		else if($('#res').attr('class') == '9')
			fetchData(80, 90, db);
		else
			fetchData(90, 100, db);
		/* refreshing unread counter */
		$('#count_unread').empty();
		if(db.countUnread() == 0)
			$('#count_unread').attr('class', 'hidden');
		else {
			$('#count_unread').attr('class', '');
			$('#count_unread').append(db.countUnread());
		}
	});
	
	$(document).on('click','#reload_home', function() {
		$('#navigation_toolbar').attr('class', 'hidden');
		$('#res').empty();
		if($('#res').attr('class') == '1')
			fetchData(0, 10, db);
		else if($('#res').attr('class') == '2')
			fetchData(10, 20, db);
		else if($('#res').attr('class') == '3')
			fetchData(20, 30, db);
		else if($('#res').attr('class') == '4')
			fetchData(30, 40, db);
		else if($('#res').attr('class') == '5')
			fetchData(40, 50, db);
		else if($('#res').attr('class') == '6')
			fetchData(50, 60, db);
		else if($('#res').attr('class') == '7')
			fetchData(60, 70, db);
		else if($('#res').attr('class') == '8')
			fetchData(70, 80, db);
		else if($('#res').attr('class') == '9')
			fetchData(80, 90, db);
		else
			fetchData(90, 100, db);
		utils.status.show('Feed ricaricato');
		if(db.countUnread() == 0)
			$('#count_unread').attr('class', 'hidden');
		else {
			$('#count_unread').attr('class', '');
			$('#count_unread').append(db.countUnread());
		}
	});
	
	$(document).on('click','#reload_article', function() {
		$('#res_article').empty();
		$('#title').empty();
		url = $('#url').text();
		$('#url').empty();
		fetchArticle(url);
		utils.status.show('Articolo ricaricato');
	});
	
	$(document).on('click', '#menu', function() {
		$("#home").hide();
		$("#menu-page").show();
	});
	
	$(document).on('click', '#close', function() {
		$("#menu-page").hide();
		$("#home").show();
	});
	
	$(document).on('click', '#navigation_back', function() {
		start = start - 10;
		stop = stop - 10;
		$('#navigation_toolbar').attr('class', 'hidden');
		$('#res').empty();
		fetchData(start, stop, db);
	});
	
	$(document).on('click', '#navigation_forward', function() {
		start = start + 10;
		stop = stop + 10;
		$('#navigation_toolbar').attr('class', 'hidden');
		$('#res').empty();
		fetchData(start, stop, db);
	});
	
	$(document).on('click', '#go_home', function() {
		start = 0;
		stop = 10;
		$('#navigation_toolbar').attr('class', 'hidden');
		$('#res').empty();
		fetchData(start, stop, db);
		$("#menu-page").hide();
		$("#home").show();
		utils.status.show('Torno alla Home');
		/* refreshing unread counter */
		if(db.countUnread() == 0)
			$('#count_unread').attr('class', 'hidden');
		else {
			$('#count_unread').attr('class', '');
			$('#count_unread').append(db.countUnread());
		}
	});
	
	$(document).on('click', '#mark_all_read', function() {
		db.readAll();
		$('#navigation_toolbar').attr('class', 'hidden');
		$('#res').empty();
		if($('#res').attr('class') == '1')
			fetchData(0, 10, db);
		else if($('#res').attr('class') == '2')
			fetchData(10, 20, db);
		else if($('#res').attr('class') == '3')
			fetchData(20, 30, db);
		else if($('#res').attr('class') == '4')
			fetchData(30, 40, db);
		else if($('#res').attr('class') == '5')
			fetchData(40, 50, db);
		else if($('#res').attr('class') == '6')
			fetchData(50, 60, db);
		else if($('#res').attr('class') == '7')
			fetchData(60, 70, db);
		else if($('#res').attr('class') == '8')
			fetchData(70, 80, db);
		else if($('#res').attr('class') == '9')
			fetchData(80, 90, db);
		else
			fetchData(90, 100, db);
		$("#menu-page").hide();
		$("#home").show();
		utils.status.show('Hai letto tutti gli articoli');
		/* hiding unread counter */
		$('#count_unread').attr('class', 'hidden');
	});
});
