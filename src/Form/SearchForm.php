<?php

namespace App\Form;

use App\Data\SearchData;
use App\Entity\Category;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SearchForm extends AbstractType // pour dire qu'on est en présence d'un formulaire
{ 
    //on utilise pas le CLI form car on n'utilise pas d'entité ici
    
    public function buildForm(FormBuilderInterface $builder, array $options)
    {//contruire le form
        
        $builder
            ->add('q',TextType::class,
            [
                'label' => false,
                'required' => false, //champs pas obligatoire pour une recherche
                'attr' =>
                [
                    'placeholder' => 'Rechercher'
                ]
            ])
            ->add('categories', EntityType::class,
            [//pour les filtres
                'label' => true,
                'required' => false,
                'class' => Category::class,
                'expanded' => true,
                'multiple' => true,
                'label_attr' => ['class' => 'checkbox-custom']
            ])
            ->add('min',NumberType::class,
            [
                'label' => false,
                'required' => false,
                'attr' =>
                [
                    'placeholder' => 'min'
                ]
            ])
            ->add('max',NumberType::class,
            [
                'label' => false,
                'required' => false,
                'attr' =>
                [
                    'placeholder' => 'max'
                ]
            ])
            ->add('promo',CheckboxType::class,
            [
                'label' => 'En promotion',
                'required' => false,
                'label_attr' => ['class' => 'checkbox-custom']
            ])
        ;
    }
    
    
    public function configureOptions(OptionsResolver $resolver)
    {//cette function permet de configurer un formulaire
       
        $resolver->setDefaults(
            [
                'data_class' => SearchData::class,  //on précise la class
                'method' => 'GET',  // on met GET pour dire qu'on va utiliser des parametre dans l'url
                'csrf_protection' => false //il s'agit d'un form de recherche donc pas besoin de cette protection
            ]
            );
    }

    public function getBlockPrefix()
    {
        return ''; //pas de prefix pour l'url
    }
}