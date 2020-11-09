import {Flipper, spring} from 'flip-toolkit'
/**
 * @property {HTMLElement} pagination
 * @property {HTMLElement} content
 * @property {HTMLElement} sorting
 * @property {HTMLFormElement} form
 */
export default class Filter {

    /**
     * 
     * @param {HTMLElement|null} element 
     */
    constructor(element)
    {
        if(element === null)
        {
            return;
        }
        //en lien avec la vue principale index
        this.pagination = element.querySelector('.js-filter-pagination');
        this.content = element.querySelector('.js-filter-content');
        this.sorting = element.querySelector('.js-filter-sorting');
        this.form = element.querySelector('.js-filter-form');
        this.bindEvents()
    }

    /**
     * Ajoute les comportements aux différents éléments
     */
    bindEvents()
    {
    // on parcourt les requetes qu'il y a dans sorting,
    // quand on click sur un élément(comme l'ordre des prix) on récuprere l'url
     // addEventListener, on écoute un changement, parametre 1: un évenement,
     // 2: un écouteur( un objet)

        const aClickListener = e =>
        {
        // si le nom de l'étiquette de la cible est un lien(A = lien en tagName) 
            if(e.target.tagName === 'A')
            {// on enleve le comportement par default
                    e.preventDefault();
                    this.loadUrl(e.target.getAttribute('href'));
            }
                       
        };
        this.sorting.addEventListener('click', aClickListener);
        
        this.pagination.addEventListener('click', aClickListener);
        //on gere les catégories avec les checkbox et le  prix avec un event qui ecoute le changement
        this.form.querySelectorAll('input').forEach( input =>
        {
            input.addEventListener('change', this.loadForm.bind(this))    
        });

        //on gere la recherche avec un event qui ecoute le caractere taper
         this.form.querySelectorAll('input[type=text]').forEach( input =>
        {
            input.addEventListener('keyup', this.loadForm.bind(this))    
        });
                       
    }


    //permet de charger ce que l'on  veut faire dans le form
    async loadForm()
    {// on convertit les données avec formData
        const data = new FormData(this.form);
        // on convertit ces données en URL en prenant l'attribut action du form en html
        // ou on prend l'url courant
        const url = new URL(this.form.getAttribute('action') ||
        window.location.href);
        //objet qui construit des paramètre d'url dynamiquement
        const params =  new URLSearchParams();
        
        data.forEach((value, key) =>
        {
            params.append(key, value);
        })
        // retourne le chemin donc pas apres ce quil y a le '?'
       return this.loadUrl(url.pathname + '?'+ params.toString());
    }

    //permet de charger les url
    async loadUrl(url)
    {
        //on fait apparaitre un chargement
        this.showLoader();
        //fetch methode async
        //permet différencier l'url en fonction d'une requete ajax ou autre
        const ajaxUrl = url + '&ajax=1';
        const response = await fetch( ajaxUrl,
            {//permet d'expliquer au framework que l'on fait un appel en ajax
                headers:
                {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            //si tout se passe bien pour la requete
            if(response.status >= 200 && response.status < 300)
            {//on récupere les données au format JSON
                const data = await response.json();
                //on met les données dans nos variables locales
                // permet de mettre à jour les url
                //on appel flip content pour les animations de chargements
                this.flipContent(data.content);
                this.sorting.innerHTML = data.sorting;
                this.pagination.innerHTML = data.pagination;
                //permet de changer l'url normalement apres une requete ajax
                history.replaceState({},'',url);
            }else{
                console.error(response);
            }
            //on enleve le chargement
            this.hideLoader();
    }

    /**
     * remplace les éléments de la grille avec un effet d'animation flip
     * @param {string} content
     */
    flipContent(content)
    {
        const springOptions = 'gentle'
        //anim pour donner un coté transparent et de mouvement au élément enlevé
        const exitSpring = function(element, index, onComplete)
        {
             spring({
            config: 'stiff',
            values: {
              translateY: [0, -20],
              opacity: [1, 0]
            },
            onUpdate: ({ translateY, opacity }) => {
              element.style.opacity = opacity;
              element.style.transform = `translateY(${translateY}px)`;
            },//pour dire que c'est fini
            onComplete
          });
        }
        //pareil que au dessus mais pour les éléments qui apparaissent
        const appearSpring = function(element, index)
        {
             spring({
            config: 'stiff',
            values: {
              translateY: [20, 0],
              opacity: [0, 1]
            },
            onUpdate: ({ translateY, opacity }) => {
              element.style.opacity = opacity;
              element.style.transform = `translateY(${translateY}px)`;
            },
            delay: index * 20
          });
        }
       
        // on inisialise le flipper
        const flipper = new Flipper({
            //les produits
            element: this.content
        })
        //on cible le contenu que l'on veut charger avec flip
        this.content.children.forEach(element => {
            flipper.addFlipped({
                element,
                spring: springOptions,
                //l'id des produits
                flipId: element.id,
                //on ne bouge pas éléments présent avant le chargement
                shouldFlip: false,
            // unne anim de transparence quand un élément n'es pas recherché
                onExit: exitSpring
        })
    })
        //on enregiste la pposition des element positionés
        flipper.recordBeforeUpdate();
        this.content.innerHTML = content;

        this.content.children.forEach(element => {
            flipper.addFlipped({
                element,
                spring: springOptions,
                //l'id des produits
                flipId: element.id,
                //on appel la methode pour les anims de nouveaux éléments
                onAppear: appearSpring
            })
        })
        //on met à jour les changements de positions des nouveaux éléments
        flipper.update();
    }

    // montrer un chargement
    showLoader()
    {
        this.form.classList.add('is-loading');
        const loader = this.form.querySelector('.js-loading');
        if(loader === null) return;
        //si il existe alors le chargement est visible
        loader.setAttribute('aria-hidden', 'false');
        loader.style.display = null;
    }
    //masquer le chargement
    hideLoader()
    {
        this.form.classList.remove('is-loading');
        const loader = this.form.querySelector('.js-loading');
        if(loader === null) return;
        loader.setAttribute('aria-hidden', 'true');
        loader.style.display = 'none';
    }
}