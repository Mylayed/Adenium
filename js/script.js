"use strict";

const cookieEl = document.querySelector('.coockie');
const okEl = document.querySelector('.coockie__btn');

okEl.addEventListener('click', () => {
	cookieEl.style.display = 'none';
});

let cookies = () => {
	if (!Cookies.get('hide-cookie')) {
		setTimeout(() => {
			cookieEl.style.display = 'block';
		}, 1000);
	}

	Cookies.set('hide-cookie', 'true', {
		expires: 30
	});
}

cookies();

function testWebP(callback) {

	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else {
		document.querySelector('body').classList.add('no-webp');
	}
});


(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];
	//Заполняем массивы
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');
			if (daMove != '') {
				const daArray = daMove.split(',');
				const daPlace = daArray[1] ? daArray[1].trim() : 'last';
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
				const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
				const daDestination = document.querySelector('.' + daArray[0].trim())
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);
					//Заполняем массив первоначальных позиций
					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};
					//Заполняем массив элементов 
					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);

		//Создаем события в точке брейкпоинта
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;

			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}
	//Основная функция
	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {
				//Перебрасываем элементы
				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				//Возвращаем на место
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
		customAdapt();
	}

	//Вызов основной функции
	dynamicAdapt();

	//Функция возврата на место
	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace['parent'];
		const indexPlace = originalPlace['index'];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}
	//Функция получения индекса внутри родителя
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	//Функция получения массива индексов элементов внутри родителя 
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				//Исключая перенесенный элемент
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}
	//Сортировка объекта
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) { return 1 } else { return -1 }
		});
	}
	//Дополнительные сценарии адаптации
	function customAdapt() {
		//const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
}());

//POPUP
const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll(".lock-padding");

let unlock = true;

const timeout = 800;

if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++) {
		const popupLink = popupLinks[index];
		popupLink.addEventListener("click", function (e) {
			const popupName = popupLink.getAttribute('href').replace('#', '');
			const curentPopup = document.getElementById(popupName);
			popupOpen(curentPopup);
			e.preventDefault();
		});
	}
}
const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener('click', function (e) {
			popupClose(el.closest('.popup'));
			e.preventDefault();
		});
	}
}

function popupOpen(curentPopup) {
	if (curentPopup && unlock) {
		const popupActive = document.querySelector('.popup.open');
		if (popupActive) {
			popupClose(popupActive, false);
		} else {
			bodyLock();
		}
		curentPopup.classList.add('open');
		curentPopup.addEventListener("click", function (e) {
			if (!e.target.closest('.popup__content')) {
				popupClose(e.target.closest('.popup'));
			}
		});
	}
}

function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('open');
		if (doUnlock) {
			bodyUnLock();
		}
	}
}

function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

	if (lockPadding.length > 0) {
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = lockPaddingValue;
		}
	}
	body.style.paddingRight = lockPaddingValue;
	body.classList.add('lock');

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

function bodyUnLock() {
	setTimeout(function () {
		if (lockPadding.length > 0) {
			for (let index = 0; index < lockPadding.length; index++) {
				const el = lockPadding[index];
				el.style.paddingRight = '0px';
			}
		}
		body.style.paddingRight = '0px';
		body.classList.remove('lock');
	}, timeout);

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

document.addEventListener('keydown', function (e) {
	if (e.which === 27) {
		const popupActive = document.querySelector('.popup.open');
		popupClose(popupActive);
	}
});

(function () {
	// проверяем поддержку
	if (!Element.prototype.closest) {
		// реализуем
		Element.prototype.closest = function (css) {
			var node = this;
			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}
})();
(function () {
	// проверяем поддержку
	if (!Element.prototype.matches) {
		// определяем свойство
		Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector;
	}
})();

$('<div class="quantity-button quantity-up plus">+</div><div class="quantity-button quantity-down minus">-</div>').insertAfter('.quantity input');
$('.quantity').each(function () {
	var spinner = $(this),
		input = spinner.find('input[type="number"]'),
		btnUp = spinner.find('.quantity-up'),
		btnDown = spinner.find('.quantity-down'),
		min = input.attr('min'),
		max = input.attr('max');

	btnUp.click(function () {
		var oldValue = parseFloat(input.val());
		if (oldValue >= max) {
			var newVal = oldValue;
		} else {
			var newVal = oldValue + 1;
		}
		spinner.find("input").val(newVal);
		spinner.find("input").trigger("change");
	});

	btnDown.click(function () {
		var oldValue = parseFloat(input.val());
		if (oldValue <= min) {
			var newVal = oldValue;
		} else {
			var newVal = oldValue - 1;
		}
		spinner.find("input").val(newVal);
		spinner.find("input").trigger("change");
	});

});





$(document).ready(function () {
	$(document).on('click', '.header__burger', function (event) {
		$('.header__burger,.header__menu').toggleClass('active');
		$('body').toggleClass('lock');
	});

	$('.arrow-1').click(function () {
		$('.header__sublist').slideToggle();
		$('.arrow-1').toggleClass('drop');
	});

	$('.arrow-2').click(function () {
		$('.subheader__sublist').slideToggle();
		$('.arrow-2').toggleClass('drop');
	});

	$('.arrow-3').click(function () {
		$('.subheader__sub-sublist').slideToggle();
		$('.arrow-3').toggleClass('drop');
	});

	$(document).click(function (event) {
		if ($(event.target).closest(".header__language-box").length)
			return;
		$(".header__language-box").removeClass("open");
		$('.link-language').removeClass('open');
		event.stopPropagation();
	});
	$('.link-language').click(function () {
		$('.link-language').toggleClass('open');
		$(this).siblings(".header__language-box").toggleClass("open");
		return false;
	});


	$(document).click(function (event) {
		if ($(event.target).closest(".header__inner-form").length)
			return;
		$(".header__inner-form").removeClass("active");
		$('.search-link').removeClass('active');
		event.stopPropagation();
	});
	$('.search-link').click(function () {
		$('.search-link').toggleClass('active');
		$(this).siblings(".header__inner-form").toggleClass("active");
		return false;
	});

	if ($(".avalaible").hasClass("hide")) {
		$(".main, .adeniums").addClass('top');
	} else {
		$(".main, .adeniums").removeClass('top');
	}

	$('.about__slider').slick({
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		speed: 500,
		autoplay: true,
		autoplaySpeed: 2000,
		fade: true,
		cssEase: 'linear',
		prevArrow: '<button type="button" class="slider-arrow slick-prev"><svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path d="M40.9985 20.099C37.4122 22.6425 33.6627 24.2146 29.408 24.7464C33.7882 20.2413 29.6571 13.007 23.7904 11.8239C14.3421 9.91862 9.37579 19.8001 1.05994 21.5493C0.699389 21.6257 0.673763 22.1289 0.967102 22.2997C7.9714 26.3801 14.0479 34.5693 22.6423 35.3082C25.6746 35.5685 29.0591 34.4254 30.31 31.4142C31.1704 29.3433 30.6162 27.1348 28.9187 25.89C33.6097 25.5498 38.0832 24.0533 41.5333 20.7914C41.8888 20.4562 41.4103 19.8064 40.9985 20.099ZM28.256 32.5307C26.9073 33.876 24.9175 34.3815 23.0676 34.3545C19.9436 34.309 16.8491 32.7626 14.2905 31.1015C10.0763 28.3665 6.49384 24.7985 2.24224 22.121C7.37355 20.7695 10.7789 16.3411 15.5156 14.1075C18.8715 12.5252 22.8839 11.9245 26.2616 13.8187C30.3706 16.1236 31.7415 21.8033 27.6986 24.9006C27.5875 24.9071 27.4784 24.9164 27.3668 24.9216C22.3578 25.1504 17.5328 23.893 12.6767 22.8691C12.4622 22.8235 12.3985 23.1161 12.5946 23.1918C17.1517 24.949 22.6359 26.1465 27.919 25.9462C29.9789 27.595 30.1213 30.6706 28.256 32.5307Z" fill="#1D1D1B"/></g><defs><clipPath id="clip0"><rect width="30" height="30" fill="white" transform="translate(0 21.3633) rotate(-45.4083)"/></clipPath></defs></svg></button>',
		nextArrow: '<button type="button" class="slider-arrow slick-next"><svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path d="M1.41993 22.1852C5.0243 19.6674 8.78487 18.122 13.0433 17.6206C8.6311 22.0944 12.7106 29.3579 18.5687 30.5827C28.0032 32.5553 33.0397 22.7094 41.3678 21.0196C41.7289 20.9458 41.7581 20.4427 41.466 20.2699C34.491 16.1397 28.473 7.90734 19.884 7.10727C16.8537 6.82529 13.4611 7.94425 12.1888 10.9465C11.3137 13.0112 11.8521 15.2236 13.5407 16.4805C8.84735 16.7872 4.36339 18.2518 0.890068 21.489C0.532226 21.8217 1.0061 22.4749 1.41993 22.1852ZM14.2507 9.84462C15.609 8.50901 17.6023 8.01769 19.4519 8.05785C22.5755 8.12561 25.659 9.6941 28.2056 11.3734C32.4003 14.1383 35.9572 17.7317 40.1896 20.4395C35.0488 21.7544 31.612 26.1584 26.8595 28.3582C23.4924 29.9165 19.4759 30.4886 16.1117 28.5704C12.0192 26.2363 10.6889 20.547 14.7537 17.4786C14.8649 17.4729 14.974 17.4644 15.0856 17.4599C20.0962 17.2668 24.912 18.5586 29.7607 19.6171C29.9749 19.6641 30.0407 19.372 29.8451 19.2949C25.3007 17.5053 19.8252 16.2687 14.5407 16.4314C12.4927 14.768 12.3722 11.6914 14.2507 9.84462Z" fill="#1D1D1B"/></g><defs><clipPath id="clip0"><rect width="30" height="30" fill="white" transform="translate(42.4263 21.2129) rotate(135)"/></clipPath></defs></svg></button>'
	});

	$('.js-tab-trigger').on('click', function () {
		var tabName = $(this).data('tab'),
			tab = $('.js-tab-content[data-tab="' + tabName + '"]');

		$('.js-tab-trigger.active').removeClass('active');
		$(this).addClass('active');


		$('.js-tab-content.active').removeClass('active');
		tab.addClass('active');
	});

	$('.js-tab-trigger2').on('click', function () {
		var tabName = $(this).data('tab'),
			tab = $('.js-tab-content2[data-tab="' + tabName + '"]');

		$('.js-tab-trigger2.active').removeClass('active');
		$(this).addClass('active');


		$('.js-tab-content2.active').removeClass('active');
		tab.addClass('active');
	});

	$('.js-tab-trigger2').click(function () {
		$(".purchase__slider").slick('slickSetOption', 'adaptiveHeight', true, true);
	});

	$('.catalog__like').on('click', function () {
		$(this).toggleClass('catalog__like-check');
	});

	$('.js-tab-trigger3').on('click', function () {
		var tabName = $(this).data('tab'),
			tab = $('.js-tab-content3[data-tab="' + tabName + '"]');

		$('.js-tab-trigger3.active').removeClass('active');
		$(this).addClass('active');


		$('.js-tab-content3.active').removeClass('active');
		tab.addClass('active');
	});

	$('.js-tab-trigger3').click(function () {
		$(".purchase__slider").slick('slickSetOption', 'adaptiveHeight', true, true);
	});

	$('.js-tab-trigger4').on('click', function () {
		var tabName = $(this).data('tab'),
			tab = $('.js-tab-content4[data-tab="' + tabName + '"]');

		$('.js-tab-trigger4.active').removeClass('active');
		$(this).addClass('active');


		$('.js-tab-content4.active').removeClass('active');
		tab.addClass('active');
	});

	$('.reviews__slider').slick({
		infinite: true,
		slidesToShow: 3,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 2000,
		prevArrow: '<button type="button" class="reviews-arrow reviews-prev"><svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.83922 13.4963L4.34256 7.99966L9.83922 2.50299C9.97038 2.37183 10.0744 2.21613 10.1454 2.04476C10.2164 1.8734 10.2529 1.68973 10.2529 1.50424C10.2529 1.31876 10.2164 1.13509 10.1454 0.963723C10.0744 0.792358 9.97038 0.636651 9.83922 0.505493C9.70806 0.374335 9.55236 0.270295 9.38099 0.199313C9.20963 0.128331 9.02596 0.0917969 8.84047 0.0917969C8.65499 0.0917969 8.47132 0.128331 8.29995 0.199313C8.12859 0.270295 7.97288 0.374335 7.84172 0.505493L1.33922 7.00799C1.20789 7.13905 1.1037 7.29473 1.03261 7.46611C0.96152 7.63749 0.924927 7.8212 0.924927 8.00674C0.924927 8.19228 0.96152 8.376 1.03261 8.54738C1.1037 8.71876 1.20789 8.87443 1.33922 9.00549L7.84172 15.508C8.39422 16.0605 9.28672 16.0605 9.83922 15.508C10.3776 14.9555 10.3917 14.0488 9.83922 13.4963Z" fill="black"/></svg></button>',
		nextArrow: '<button type="button" class="reviews-arrow reviews-next"><svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.1609 2.50367L6.65757 8.00034L1.1609 13.497C1.02974 13.6282 0.925704 13.7839 0.854722 13.9552C0.78374 14.1266 0.747205 14.3103 0.747205 14.4958C0.747205 14.6812 0.78374 14.8649 0.854722 15.0363C0.925704 15.2076 1.02974 15.3634 1.1609 15.4945C1.29206 15.6257 1.44777 15.7297 1.61913 15.8007C1.7905 15.8717 1.97417 15.9082 2.15965 15.9082C2.34514 15.9082 2.5288 15.8717 2.70017 15.8007C2.87154 15.7297 3.02724 15.6257 3.1584 15.4945L9.6609 8.99201C9.79223 8.86095 9.89642 8.70527 9.96751 8.53389C10.0386 8.36251 10.0752 8.1788 10.0752 7.99326C10.0752 7.80772 10.0386 7.624 9.96751 7.45262C9.89642 7.28124 9.79223 7.12557 9.6609 6.99451L3.1584 0.492009C2.6059 -0.0604909 1.7134 -0.0604908 1.1609 0.492009C0.622567 1.04451 0.6084 1.95117 1.1609 2.50367Z" fill="black"/></svg></button>',
		dots: true,
		responsive: [
			{
				breakpoint: 931,
				settings: {
					slidesToShow: 2
				}
			},
			{
				breakpoint: 601,
				settings: {
					slidesToShow: 1
				}
			}
		]
	});

	$('.card__slider-main').slick({
		asNavFor: '.card__sub-slider',
		speed: 500,
		fade: true,
		cssEase: 'linear',
		prevArrow: '<button type="button" class="slider-arrow slick-prev"><svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path d="M40.9985 20.099C37.4122 22.6425 33.6627 24.2146 29.408 24.7464C33.7882 20.2413 29.6571 13.007 23.7904 11.8239C14.3421 9.91862 9.37579 19.8001 1.05994 21.5493C0.699389 21.6257 0.673763 22.1289 0.967102 22.2997C7.9714 26.3801 14.0479 34.5693 22.6423 35.3082C25.6746 35.5685 29.0591 34.4254 30.31 31.4142C31.1704 29.3433 30.6162 27.1348 28.9187 25.89C33.6097 25.5498 38.0832 24.0533 41.5333 20.7914C41.8888 20.4562 41.4103 19.8064 40.9985 20.099ZM28.256 32.5307C26.9073 33.876 24.9175 34.3815 23.0676 34.3545C19.9436 34.309 16.8491 32.7626 14.2905 31.1015C10.0763 28.3665 6.49384 24.7985 2.24224 22.121C7.37355 20.7695 10.7789 16.3411 15.5156 14.1075C18.8715 12.5252 22.8839 11.9245 26.2616 13.8187C30.3706 16.1236 31.7415 21.8033 27.6986 24.9006C27.5875 24.9071 27.4784 24.9164 27.3668 24.9216C22.3578 25.1504 17.5328 23.893 12.6767 22.8691C12.4622 22.8235 12.3985 23.1161 12.5946 23.1918C17.1517 24.949 22.6359 26.1465 27.919 25.9462C29.9789 27.595 30.1213 30.6706 28.256 32.5307Z" fill="#1D1D1B"/></g><defs><clipPath id="clip0"><rect width="30" height="30" fill="white" transform="translate(0 21.3633) rotate(-45.4083)"/></clipPath></defs></svg></button>',
		nextArrow: '<button type="button" class="slider-arrow slick-next"><svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path d="M1.41993 22.1852C5.0243 19.6674 8.78487 18.122 13.0433 17.6206C8.6311 22.0944 12.7106 29.3579 18.5687 30.5827C28.0032 32.5553 33.0397 22.7094 41.3678 21.0196C41.7289 20.9458 41.7581 20.4427 41.466 20.2699C34.491 16.1397 28.473 7.90734 19.884 7.10727C16.8537 6.82529 13.4611 7.94425 12.1888 10.9465C11.3137 13.0112 11.8521 15.2236 13.5407 16.4805C8.84735 16.7872 4.36339 18.2518 0.890068 21.489C0.532226 21.8217 1.0061 22.4749 1.41993 22.1852ZM14.2507 9.84462C15.609 8.50901 17.6023 8.01769 19.4519 8.05785C22.5755 8.12561 25.659 9.6941 28.2056 11.3734C32.4003 14.1383 35.9572 17.7317 40.1896 20.4395C35.0488 21.7544 31.612 26.1584 26.8595 28.3582C23.4924 29.9165 19.4759 30.4886 16.1117 28.5704C12.0192 26.2363 10.6889 20.547 14.7537 17.4786C14.8649 17.4729 14.974 17.4644 15.0856 17.4599C20.0962 17.2668 24.912 18.5586 29.7607 19.6171C29.9749 19.6641 30.0407 19.372 29.8451 19.2949C25.3007 17.5053 19.8252 16.2687 14.5407 16.4314C12.4927 14.768 12.3722 11.6914 14.2507 9.84462Z" fill="#1D1D1B"/></g><defs><clipPath id="clip0"><rect width="30" height="30" fill="white" transform="translate(42.4263 21.2129) rotate(135)"/></clipPath></defs></svg></button>'
	});

	$('.card__sub-slider').slick({
		slidesToShow: 4,
		slidesToScroll: 4,
		asNavFor: '.card__slider-main',
		focusOnSelect: true,
		speed: 500,
		arrows: false
	});

	$('.purchase__slider').slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		prevArrow: '<button type="button" class="purchase-arrow purchase-prev"><svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.83922 13.4963L4.34256 7.99966L9.83922 2.50299C9.97038 2.37183 10.0744 2.21613 10.1454 2.04476C10.2164 1.8734 10.2529 1.68973 10.2529 1.50424C10.2529 1.31876 10.2164 1.13509 10.1454 0.963723C10.0744 0.792358 9.97038 0.636651 9.83922 0.505493C9.70806 0.374335 9.55236 0.270295 9.38099 0.199313C9.20963 0.128331 9.02596 0.0917969 8.84047 0.0917969C8.65499 0.0917969 8.47132 0.128331 8.29995 0.199313C8.12859 0.270295 7.97288 0.374335 7.84172 0.505493L1.33922 7.00799C1.20789 7.13905 1.1037 7.29473 1.03261 7.46611C0.96152 7.63749 0.924927 7.8212 0.924927 8.00674C0.924927 8.19228 0.96152 8.376 1.03261 8.54738C1.1037 8.71876 1.20789 8.87443 1.33922 9.00549L7.84172 15.508C8.39422 16.0605 9.28672 16.0605 9.83922 15.508C10.3776 14.9555 10.3917 14.0488 9.83922 13.4963Z" fill="black"/></svg></button>',
		nextArrow: '<button type="button" class="purchase-arrow purchase-next"><svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.1609 2.50367L6.65757 8.00034L1.1609 13.497C1.02974 13.6282 0.925704 13.7839 0.854722 13.9552C0.78374 14.1266 0.747205 14.3103 0.747205 14.4958C0.747205 14.6812 0.78374 14.8649 0.854722 15.0363C0.925704 15.2076 1.02974 15.3634 1.1609 15.4945C1.29206 15.6257 1.44777 15.7297 1.61913 15.8007C1.7905 15.8717 1.97417 15.9082 2.15965 15.9082C2.34514 15.9082 2.5288 15.8717 2.70017 15.8007C2.87154 15.7297 3.02724 15.6257 3.1584 15.4945L9.6609 8.99201C9.79223 8.86095 9.89642 8.70527 9.96751 8.53389C10.0386 8.36251 10.0752 8.1788 10.0752 7.99326C10.0752 7.80772 10.0386 7.624 9.96751 7.45262C9.89642 7.28124 9.79223 7.12557 9.6609 6.99451L3.1584 0.492009C2.6059 -0.0604909 1.7134 -0.0604908 1.1609 0.492009C0.622567 1.04451 0.6084 1.95117 1.1609 2.50367Z" fill="black"/></svg></button>',
		responsive: [
			{
				breakpoint: 1241,
				settings: {
					slidesToShow: 3,
					arrows: false
				}
			},
			{
				breakpoint: 886,
				settings: {
					slidesToShow: 2,
					arrows: false
				}
			}
		]
	});

	$('.adeniums__content-filter-btn').click(function () {
		$(this).toggleClass('drop');
	});

	$('.filter-style').styler();

	$('.adeniums__aside-item-name').click(function () {
		$(this).next().slideToggle();
		$(this).toggleClass('drop');
	});

	$('.filter__button').click(function () {
		$('.adeniums__aside-box').toggleClass('active');
	});

	$(".basket__product-box").mCustomScrollbar({

	});

	$(".card .jq-selectbox__dropdown").mCustomScrollbar({

	});

	$(".blog .jq-selectbox__dropdown").mCustomScrollbar({

	});

	$(".popup-city__adress-box").mCustomScrollbar({

	});

	$("#progressbar").progressbar({
		value: 0
	})
		.data("value", "20");

	// $(".plus").click(function () {
	// 	var currValue = $("#progressbar").data("value");
	// 	currValue = parseInt(currValue) ? parseInt(currValue) : 0;
	// 	if (currValue <= 100) {
	// 		$("#progressbar").progressbar({
	// 			value: currValue + 20
	// 		}).data("value", currValue + 20);
	// 		$("#progressLabel").html((currValue + 20) + "%");
	// 	}
	// });

	// $(".minus").click(function () {
	// 	var currValue = $("#progressbar").data("value");
	// 	currValue = parseInt(currValue) ? parseInt(currValue) : 0;
	// 	if (currValue > 0) {
	// 		$("#progressbar").progressbar({
	// 			value: currValue - 20
	// 		}).data("value", currValue - 20);
	// 		$("#progressLabel").html((currValue - 20) + "%");
	// 	}
	// });

	let input = document.querySelector('.number');
	let plus = document.querySelector('.plus');
	let number = input.getAttribute('value');
	let progress = document.querySelector('.progress-bar__item');
	// function totalNumber () {

	// }
	console.log(number);
	plus.addEventListener('click', function () {
		number = number + 1;
	});
	number.addEventListener('change', function () {
		if (inputValue == 1) {
			progress.classList.add('one-adenium');
		}
	});








	$('.mail-btn').on('click', function () {
		$('.mail-input').each(function () {
			if ($(this).val() != '') {
				console.log(32);
				$(this).removeClass('empty_field');
			} else {
				console.log(33);
				$(this).addClass('empty_field');
			}
		});
	});

	$('.pickup-btn').on('click', function () {
		$('.pickup-input').each(function () {
			if ($(this).val() != '') {
				console.log(32);
				$(this).removeClass('empty_field');
			} else {
				console.log(33);
				$(this).addClass('empty_field');
			}
		});
	});

	$('.courier-btn').on('click', function () {
		$('.courier-input').each(function () {
			if ($(this).val() != '') {
				console.log(32);
				$(this).removeClass('empty_field');
			} else {
				console.log(33);
				$(this).addClass('empty_field');
			}
		});
	});

	$('.card__btn-send').on('click', function () {
		$('.card__input').each(function () {
			if ($(this).val() != '') {
				console.log(32);
				$(this).removeClass('empty_field');
			} else {
				console.log(33);
				$(this).addClass('empty_field');
			}
		});
	});

	$('.btn-data').on('click', function () {
		$('.input-data').each(function () {
			if ($(this).val() != '') {
				console.log(32);
				$(this).removeClass('empty_field');
			} else {
				console.log(33);
				$(this).addClass('empty_field');
			}
		});
	});

	$('.btn-password').on('click', function () {
		$('.input-password').each(function () {
			if ($(this).val() != '') {
				console.log(32);
				$(this).removeClass('empty_field');
			} else {
				console.log(33);
				$(this).addClass('empty_field');
			}
		});
	});

	$('.certificate__btn').on('click', function () {
		$('.certificate__input').each(function () {
			if ($(this).val() != '') {
				console.log(32);
				$(this).removeClass('empty_field');
			} else {
				console.log(33);
				$(this).addClass('empty_field');
			}
		});
	});

	$('.popup-order__btn').on('click', function () {
		$('.popup-order__input').each(function () {
			if ($(this).val() != '') {
				console.log(32);
				$(this).removeClass('empty_field');
			} else {
				console.log(33);
				$(this).addClass('empty_field');
			}
		});
	});

	$('.question__btn').on('click', function () {
		$('.question__input').each(function () {
			if ($(this).val() != '') {
				console.log(32);
				$(this).removeClass('empty_field');
				$('.question-required').removeClass('empty_field');
			} else {
				console.log(33);
				$(this).addClass('empty_field');
				$('.question-required').addClass('empty_field');
			}
		});
	});

	$('.slide-click').click(function () {
		$(this).next().slideToggle();
		$(this).toggleClass('drop');
	});

	$('.adeniums__btn-category').click(function () {
		$(this).toggleClass('active');
	});

	$('.delete-basket__close').click(function () {
		$('.delete-basket').removeClass('show');
		$('.delete-basket').addClass('close');
	});

	$('.delete-basket__close').click(function () {
		$(this).toggleClass('active');
	});

	$('.spoiler__item-box').click(function () {
		if ($('.spoiler').hasClass('one')) {
			$('.spoiler__item-box').not($(this)).removeClass('active');
			$('.spoiler__item-content').not($(this).next()).slideUp(300);
		}
		$(this).toggleClass('active').next().slideToggle(300);
	});

	$('.recall__box').masonry({
		itemSelector: '.recall__item-container',
		columnWidth: 200,
		percentPosition: true
	});
});

DG.then(function () {
	var map,
		myIcon,
		myDivIcon;

	map = DG.map('map', {
		center: [51.680012, 39.225813],
		zoom: 17
	});

	myIcon = DG.icon({
		iconUrl: 'img/icons/marker.svg',
		iconSize: [35, 50]
	});
	DG.marker([51.680100, 39.225813], {
		icon: myIcon
	}).addTo(map);
});

DG.then(function () {
	var mapMobile,
		myIconMobile,
		myDivIconMobile;

	mapMobile = DG.map('map2', {
		center: [51.680012, 39.225813],
		zoom: 17
	});

	myIconMobile = DG.icon({
		iconUrl: 'img/icons/marker.svg',
		iconSize: [35, 50]
	});
	DG.marker([51.680100, 39.225813], {
		icon: myIconMobile
	}).addTo(map);
});

