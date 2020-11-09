/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

// any CSS you import will output into a single css file (app.css in this case)
require('../styles/app.css');

import noUiSlider from 'nouislider'
import 'nouislider/distribute/nouislider.css'
import Filter from './modules/Filter'


new Filter(document.querySelector('.js-filter'))

// <div id="slider"></div>
const slider = document.getElementById('priceSlider');

if(slider)
{
    const min = document.getElementById('min');
    const max = document.getElementById('max');
    //pour faire des nombres ronds
    //math.floor = on arrondit à la vergule inférieur
    const minValue = Math.floor(parseInt(slider.dataset.min, 10) / 10) * 10;
    const maxValue = Math.ceil(parseInt(slider.dataset.max, 10) / 10 ) * 10;
    const range = noUiSlider.create(slider, {
        start: [min.value || minValue, max.value || maxValue],
        connect: true,
        step: 10,
        range: {
            'min': minValue,
            'max': maxValue
        }
    })
   
    //quand tu bouge appelle une function qui récupère
    // les valeurs et le handle (le numero du curseur qu'on bouge)
    range.on('slide',function(values, handle)
    {//  si on bouge le curseur minimum
        if(handle === 0)
        {
            //valeur en entier
            min.value = Math.round(values[0]);
        }

        if(handle === 1)
        {
            //valeur en entier
            max.value = Math.round(values[1]);
        }console.log(values,handle);
    })
    // quand on a fini de bouger le curseur, tu récupere values et handle,
    // puis on met un event de changement sur min et/ou mmax
    range.on('end', function(values, handle)
    {
        min.dispatchEvent(new Event('change'));
    });
}
