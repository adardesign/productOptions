facetOptions.forEach(function(facet){
  products.forEach(function(product){
    // are all other facets the same?
    var otherFacets = facets.filter((filterFacet)=>{
      return facet.name !== filterFacet.name
    })
    otherFacets.forEach(function(currentOtherFacet){
      if(currentProduct.attributes.facetsValues.find(j => currentOtherFacet.name).value === )
      if()
    })

  })

});
