# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateCategory, useUpdateCategory, useDeleteCategory, useGetCategory, useListCategories, useCreateProduct, useUpdateProduct, useDeleteProduct, useGetProduct, useListProducts } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateCategory();

const { data, isPending, isSuccess, isError, error } = useUpdateCategory(updateCategoryVars);

const { data, isPending, isSuccess, isError, error } = useDeleteCategory(deleteCategoryVars);

const { data, isPending, isSuccess, isError, error } = useGetCategory(getCategoryVars);

const { data, isPending, isSuccess, isError, error } = useListCategories();

const { data, isPending, isSuccess, isError, error } = useCreateProduct();

const { data, isPending, isSuccess, isError, error } = useUpdateProduct(updateProductVars);

const { data, isPending, isSuccess, isError, error } = useDeleteProduct(deleteProductVars);

const { data, isPending, isSuccess, isError, error } = useGetProduct(getProductVars);

const { data, isPending, isSuccess, isError, error } = useListProducts();

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createCategory, updateCategory, deleteCategory, getCategory, listCategories, createProduct, updateProduct, deleteProduct, getProduct, listProducts } from '@dataconnect/generated';


// Operation CreateCategory: 
const { data } = await CreateCategory(dataConnect);

// Operation UpdateCategory:  For variables, look at type UpdateCategoryVars in ../index.d.ts
const { data } = await UpdateCategory(dataConnect, updateCategoryVars);

// Operation DeleteCategory:  For variables, look at type DeleteCategoryVars in ../index.d.ts
const { data } = await DeleteCategory(dataConnect, deleteCategoryVars);

// Operation GetCategory:  For variables, look at type GetCategoryVars in ../index.d.ts
const { data } = await GetCategory(dataConnect, getCategoryVars);

// Operation ListCategories: 
const { data } = await ListCategories(dataConnect);

// Operation CreateProduct: 
const { data } = await CreateProduct(dataConnect);

// Operation UpdateProduct:  For variables, look at type UpdateProductVars in ../index.d.ts
const { data } = await UpdateProduct(dataConnect, updateProductVars);

// Operation DeleteProduct:  For variables, look at type DeleteProductVars in ../index.d.ts
const { data } = await DeleteProduct(dataConnect, deleteProductVars);

// Operation GetProduct:  For variables, look at type GetProductVars in ../index.d.ts
const { data } = await GetProduct(dataConnect, getProductVars);

// Operation ListProducts: 
const { data } = await ListProducts(dataConnect);


```