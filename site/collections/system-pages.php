<?php

return function ($kirby) {
  $children = $kirby->site()->children();
  return $children->filterBy('slug', 'home')
    ->add($children->filterBy('slug', 'error'));
};
