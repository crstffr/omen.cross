import 'fontawesome/css/font-awesome.css!';
import './css/vendor.min.css!';
import './css/main.min.css!';

(function() {

    // Burger Menu from Bulma Admin template

    let burger = document.querySelector('.nav-toggle');
    let menu = document.querySelector('.nav-menu');

    burger.addEventListener('click', () => {
        burger.classList.toggle('is-active');
        menu.classList.toggle('is-active');
    });

})();