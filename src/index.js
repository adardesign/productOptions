import data from "./data";

// TODO: refactor as normelize data first so the lookups are lighter and easier
function getUniqueFacetValues(products, facetName) {
  var values = {};

  products.forEach((product) => {
    var currentFacet = product.attributes.facetsValues.find(
      (facet) => facet.name === facetName
    );
    if (!currentFacet) return;
    console.log();
    values[currentFacet.value] = product.id;
  });

  return values;
}

function getSimilarItems(products, currentFacetName, curretItemFacets) {
  // temp - change to reduce
  var otherFacets = curretItemFacets.filter((f) => f.name !== currentFacetName);
  var values = {};
  products.forEach((product) => {
    var productFacets = product.attributes.facetsValues;
    var isMatch = false;
    otherFacets.forEach((otherCurrentFacet) => {
      var currProductFacet = productFacets.find(
        (productCurrentFacet) =>
          productCurrentFacet.name === otherCurrentFacet.name
      );
      if (
        currProductFacet &&
        currProductFacet.value === otherCurrentFacet.value
      ) {
        isMatch = true;
      }
    });
    if (isMatch) {
      var currentProductFacetsValue = productFacets.find(
        (facet) => facet.name === currentFacetName
      );
      if (!currentProductFacetsValue) return;
      values[currentProductFacetsValue.value] = 1; // no need to hold a real value
    }
  });
  return values;
}

function transform(options, currentId) {
  var facets = options.attributes.facets,
    products = options.relationships.products
      .filter((i) => i.id.indexOf("US") !== 0)
      .sort((a, b) => (a.displaySequence > b.displaySequence ? 1 : -1)), // sort once
    // filter used
    currentProduct = products.find(
      (prod) => prod.attributes.productId === currentId
    );
  if (!currentProduct) return;
  var curretItemFacets = currentProduct.attributes.facetsValues;

  var facetOptions = facets
    .sort((a, b) => (a.displaySequence > b.displaySequence ? 1 : -1))
    .map(function (facet) {
      console.log(facet);
      return {
        name: facet.name,
        currentValue: "",
        displayInfo: facet.displayInfo,
        showCompare: facet.showCompare,
        items: []
      };
    });

  // TODO sort by sequence
  //list of facets
  facetOptions.forEach(function (facet) {
    var currentItemFacetValue = curretItemFacets.find(
      (f) => f.name === facet.name
    ).value;
    facet.currentValue = currentItemFacetValue;

    var allUniqueFacetValues = getUniqueFacetValues(products, facet.name);
    var otherFacetsNames = facetOptions
      .filter((f) => f.name !== facet.name)
      .map((f) => f.name);
    if (!otherFacetsNames.length) return;
    var similarItems = getSimilarItems(products, facet.name, curretItemFacets);
    Object.keys(allUniqueFacetValues).forEach((fKey) => {
      facet.items.push({
        sku: allUniqueFacetValues[fKey],
        name: fKey,
        isCurrent: currentItemFacetValue === fKey, // cant check by actual SKU
        isAvailable: !!similarItems[fKey]
      });
    });
  });

  return facetOptions;
}

const result = transform(data.data, "ICA5DM4B");
console.log(data);
console.log(result);
document.querySelector("#app").innerHTML = `<pre>${JSON.stringify(
  result,
  null,
  2
)}</pre>`;
