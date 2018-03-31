/// <reference path="../typings/globals/jquery/index.d.ts" />

$(function () {

    const DataCtrl = (function () {
        const data = {
            movies: [],
            categories: [],
            directors: [],
            ids: []
        }

        return {
            storeData: function (el) {

                data.movies.push(el);
                data.ids.push(el.id);

                // Make sure that the category isn't already there
                if ($.inArray(el.type, data.categories) === -1) {
                    data.categories.push(el.type);
                }

                // Make sure that the director isn't already there
                if ($.inArray(el.director, data.directors) === -1) {
                    data.directors.push(el.director);
                }

            },

            getStoredData: function () {
                return data;
            }
        }

    })();



    const UICtrl = (function () {
        // Define UI ui.selectors
        const selectors = {
            openFilter: $('.open_filter'),
            filterBtn: $('.open_filter .fa'),
            filterBtnText: $('.btn_text'),
            filterContainer: $('.filter_container'),
            categories: $('#categories'),
            directors: $('#directors'),
            moviesContent: $('.movies_content'),
            image: $('.img')
        }

        return {
            showAndHideFilters: function () {
                selectors.filterContainer.slideToggle(300, function () {
                    selectors.openFilter.toggleClass('active');

                    if (selectors.openFilter.hasClass('active')) {
                        selectors.filterBtnText.text('Close');
                    } else {
                        selectors.filterBtnText.text('Filter By');
                    }
                });
            },

            showCategoriesAndDirectors: function (categories, directors) {
                $.each(categories, function (i, el) {
                    selectors.categories.append(`<option value="${el}">${el}</option>`)

                });

                $.each(directors, function (i, el) {
                    selectors.directors.append(`<option value="${el}">${el}</option>`)
                });
            },

            getSelectionValues: function () {
                return {
                    category: selectors.categories.val(),
                    director: selectors.directors.val()
                }
            },

            clearResults: function () {
                selectors.moviesContent.empty();
            },

            displayResults: function (el) {
                selectors.moviesContent.append(`<div class="movie_item">
                            <div class="header">
                                <div class="left">
                                    <img src="images/movies/${el.id}.jpg">
                                </div>
                                <div class="right">
                                    <h3>${el.title}</h3>
                                    <div class="node">
                                        <span>Year:</span> ${el.year}
                                    </div>
                                    <div class="node">
                                        <span>Director:</span> ${el.director}
                                    </div>
                                    <div class="node">
                                        <span>Type:</span> ${el.type}
                                    </div>
                                </div>
                            </div>
                        </div>`)

            },

            getSelectors: function () {
                return selectors;
            }
        }

    })();




    const App = (function (DataCtrl, UICtrl) {
        // Load event listeners
        function loadEventListeners() {
            const selectors = UICtrl.getSelectors();

            selectors.openFilter.on('click', UICtrl.showAndHideFilters);

            selectors.categories.on('change', getMovies);

            selectors.directors.on('change', getMovies)
        }

        // Create get movies function
        function getMovies() {
            // Get selections values
            const category = UICtrl.getSelectionValues().category;
            const director = UICtrl.getSelectionValues().director;

            // Get all stored movies in DataCtrl
            const data = DataCtrl.getStoredData();

            // Clear previous results
            UICtrl.clearResults();

            // Create an array that contains movies without rebeating
            const unique = [];

            // Make sure there is no repeating
            $.each(data.movies, function (i, el) {
                if (el.type === category || el.director === director) {
                    if ($.inArray(el, unique) === -1) {
                        UICtrl.displayResults(el);
                        unique.push(el);
                    }
                }
            });
        }

        // Create show categories and directors function
        function showCategoriesAndDirectors() {
            const categories = DataCtrl.getStoredData().categories;
            const directors = DataCtrl.getStoredData().directors;

            UICtrl.showCategoriesAndDirectors(categories, directors);

        }

        return {
            init: function () {
                // Fetch data from the JSON file 
                $.getJSON('db/movies.json', function (movies) {
                    $.each(movies, function (i, el) {
                        DataCtrl.storeData(el);

                        // Display all movies in database file
                        UICtrl.displayResults(el);
                    })

                    // Make fetched categories and directors show in UI
                    showCategoriesAndDirectors();

                    loadEventListeners();
                });
            }
        }

    })(DataCtrl, UICtrl);

    App.init();

});