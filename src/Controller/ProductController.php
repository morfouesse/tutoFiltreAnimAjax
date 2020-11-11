<?php

namespace App\Controller;

use App\Data\SearchData;
use App\Form\SearchForm;
use App\Repository\ProductRepository;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class ProductController extends AbstractController
{//cette héritage permet de restreinde certain acces
    //utilisé que pour les forms
    /**
     * @Route("/", name="product")
     */
    public function index(ProductRepository $repository,Request $request)
    {
       
        $data = new SearchData();
        // page = la requete qui correspond à page sinon équivaut à 1 si vide.
        $data->page = $request->get('page',1);
        //data correspond aux valeurs retourné par le formulaire
        $form = $this->createForm(SearchForm::class, $data);
        $form->handleRequest($request);
        [$min, $max] = $repository->findMinMax($data);
         //l'ensemble des products lié a une recherche
        $products = $repository->findSearch($data);
        //si on fait du AJAX alors on retourne un format JSON
        if($request->get('ajax'))
        {
            return new JsonResponse([
                //permet que les changement fait avec ajax soit changer aussi dans la vue
                'content' => $this->renderView('product/_products.html.twig',['products' => $products]),
                'sorting' => $this->renderView('product/_sorting.html.twig',['products' => $products]),
                'pagination' => $this->renderView('product/_pagination.html.twig',['products' => $products]),
                //nous donnes le nombre de pages par produits affichés
                'pages' => ceil($products->getTotalItemCount()/ $products->getItemNumberPerPage()),
                'min' => $min,
                'max' => $max
            ]);
        }
        return $this->render('product/index.html.twig', [
            'products' => $products,
            'form' => $form->createView(),
            'min' => $min,
            'max' => $max
        ]);
    }
    

}
