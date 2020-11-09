<?php

namespace App\Repository;

use App\Entity\Product;
use App\Data\SearchData;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Knp\Component\Pager\PaginatorInterface;
use Knp\Component\Pager\Pagination\PaginationInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @method Product|null find($id, $lockMode = null, $lockVersion = null)
 * @method Product|null findOneBy(array $criteria, array $orderBy = null)
 * @method Product[]    findAll()
 * @method Product[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProductRepository extends ServiceEntityRepository
{
    // paginator 
    public function __construct(ManagerRegistry $registry, PaginatorInterface $paginator)
    {
        parent::__construct($registry, Product::class);
        $this->paginator = $paginator;
    }

    /**
     * Retourne les produits enfonction des catégories ou de la recherche
     * @return PaginationInterface
     */ 
    public function findSearch(SearchData $search): PaginationInterface
    {
       
        $query = $this->getSearchQuery($search)->getQuery();
        // le query en premier parametre, le nombre de page, et le nombre de produit
        return $this->paginator->paginate(
            $query,
            $search->page,
            9
        );
    }

    //récupere le prix minimum et max correspondant à une recherche
    /**
     * @return integer[]
     */
    public function findMinMax(SearchData $search): array
    {
        $result = $this->getSearchQuery($search, true)
            ->select('MIN(p.price) as min', 'MAX(p.price) as max')
            ->getQuery()
            ->getScalarResult();
        
        return [(int)$result[0]['min'],(int)$result[0]['max']];
    }

    // ingorePrice permet d'empecher qu'apres une recherche de prix 
    // que le min et max de la recherche suivante empe
    private function getSearchQuery(SearchData $search, $ignorePrice = false): QueryBuilder
    {
        $query = $this
        ->createQueryBuilder('p')
        ->select('c','p')
        ->join('p.categories','c');
        if(!empty($search->q))
        {// q est un alias du nom du produit
        // q équivaut au nom de la recherche partielle <= %{}%
            $query = $query
                ->andWhere('p.name LIKE :q')
                ->setParameter('q', "%{$search->q}%");
        }

        if(!empty($search->min) && $ignorePrice === false)
        {
            $query = $query
            ->andWhere('p.price >= :min')
            ->setParameter('min', $search->min);
        }

        if(!empty($search->max) && $ignorePrice === false)
        {
            $query = $query
            ->andWhere('p.price <= :max')
            ->setParameter('max', $search->max);
        }

        if(!empty($search->promo))
        {//la promo est vrai
            $query = $query
            ->andWhere('p.promo = 1');
        
        }

        if(!empty($search->categories))
        {
            $query = $query
            ->andWhere('c.id IN (:categories)')
            ->setParameter('categories', $search->categories);
        }
        return $query;
    }
}
