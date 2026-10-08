import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Category_Key {
  id: UUIDString;
  __typename?: 'Category_Key';
}

export interface CreateCategoryData {
  category_insert: Category_Key;
}

export interface CreateInventoryItemData {
  inventoryItem_insert: InventoryItem_Key;
}

export interface CreateInventoryItemVariables {
  pid: UUIDString;
  lid: UUIDString;
}

export interface CreateLocationData {
  location_insert: Location_Key;
}

export interface CreateProductData {
  product_insert: Product_Key;
}

export interface CreateTransactionData {
  transaction_insert: Transaction_Key;
}

export interface CreateTransactionVariables {
  pid: UUIDString;
  lid: UUIDString;
}

export interface DeleteCategoryData {
  category_delete?: Category_Key | null;
}

export interface DeleteCategoryVariables {
  id: UUIDString;
}

export interface DeleteInventoryItemData {
  inventoryItem_delete?: InventoryItem_Key | null;
}

export interface DeleteInventoryItemVariables {
  id: UUIDString;
}

export interface DeleteLocationData {
  location_delete?: Location_Key | null;
}

export interface DeleteLocationVariables {
  id: UUIDString;
}

export interface DeleteProductData {
  product_delete?: Product_Key | null;
}

export interface DeleteProductVariables {
  id: UUIDString;
}

export interface DeleteTransactionData {
  transaction_delete?: Transaction_Key | null;
}

export interface DeleteTransactionVariables {
  id: UUIDString;
}

export interface GetCategoryData {
  category?: {
    name: string;
  };
}

export interface GetCategoryVariables {
  id: UUIDString;
}

export interface GetInventoryItemData {
  inventoryItem?: {
    quantity: number;
    binLocation?: string | null;
  };
}

export interface GetInventoryItemVariables {
  id: UUIDString;
}

export interface GetLocationData {
  location?: {
    name: string;
    address?: string | null;
  };
}

export interface GetLocationVariables {
  id: UUIDString;
}

export interface GetProductData {
  product?: {
    name: string;
    sku: string;
    currentQuantity: number;
  };
}

export interface GetProductVariables {
  id: UUIDString;
}

export interface GetTransactionData {
  transaction?: {
    changeAmount: number;
    transactionType: string;
    timestamp?: TimestampString | null;
  };
}

export interface GetTransactionVariables {
  id: UUIDString;
}

export interface InventoryItem_Key {
  id: UUIDString;
  __typename?: 'InventoryItem_Key';
}

export interface ListCategoriesData {
  categories: ({
    name: string;
  })[];
}

export interface ListInventoryItemsData {
  inventoryItems: ({
    quantity: number;
  })[];
}

export interface ListLocationsData {
  locations: ({
    name: string;
  })[];
}

export interface ListProductsData {
  products: ({
    name: string;
    sku: string;
  })[];
}

export interface ListTransactionsData {
  transactions: ({
    transactionType: string;
    changeAmount: number;
  })[];
}

export interface Location_Key {
  id: UUIDString;
  __typename?: 'Location_Key';
}

export interface Product_Key {
  id: UUIDString;
  __typename?: 'Product_Key';
}

export interface Transaction_Key {
  id: UUIDString;
  __typename?: 'Transaction_Key';
}

export interface UpdateCategoryData {
  category_update?: Category_Key | null;
}

export interface UpdateCategoryVariables {
  id: UUIDString;
  name: string;
}

export interface UpdateInventoryItemData {
  inventoryItem_update?: InventoryItem_Key | null;
}

export interface UpdateInventoryItemVariables {
  id: UUIDString;
  quantity: number;
}

export interface UpdateLocationData {
  location_update?: Location_Key | null;
}

export interface UpdateLocationVariables {
  id: UUIDString;
  address: string;
}

export interface UpdateProductData {
  product_update?: Product_Key | null;
}

export interface UpdateProductVariables {
  id: UUIDString;
  currentQuantity: number;
}

export interface UpdateTransactionData {
  transaction_update?: Transaction_Key | null;
}

export interface UpdateTransactionVariables {
  id: UUIDString;
  changeAmount: number;
}

interface CreateCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateCategoryData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateCategoryData, undefined>;
  operationName: string;
}
export const createCategoryRef: CreateCategoryRef;

export function createCategory(): MutationPromise<CreateCategoryData, undefined>;
export function createCategory(dc: DataConnect): MutationPromise<CreateCategoryData, undefined>;

interface UpdateCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCategoryVariables): MutationRef<UpdateCategoryData, UpdateCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateCategoryVariables): MutationRef<UpdateCategoryData, UpdateCategoryVariables>;
  operationName: string;
}
export const updateCategoryRef: UpdateCategoryRef;

export function updateCategory(vars: UpdateCategoryVariables): MutationPromise<UpdateCategoryData, UpdateCategoryVariables>;
export function updateCategory(dc: DataConnect, vars: UpdateCategoryVariables): MutationPromise<UpdateCategoryData, UpdateCategoryVariables>;

interface DeleteCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCategoryVariables): MutationRef<DeleteCategoryData, DeleteCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteCategoryVariables): MutationRef<DeleteCategoryData, DeleteCategoryVariables>;
  operationName: string;
}
export const deleteCategoryRef: DeleteCategoryRef;

export function deleteCategory(vars: DeleteCategoryVariables): MutationPromise<DeleteCategoryData, DeleteCategoryVariables>;
export function deleteCategory(dc: DataConnect, vars: DeleteCategoryVariables): MutationPromise<DeleteCategoryData, DeleteCategoryVariables>;

interface GetCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCategoryVariables): QueryRef<GetCategoryData, GetCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCategoryVariables): QueryRef<GetCategoryData, GetCategoryVariables>;
  operationName: string;
}
export const getCategoryRef: GetCategoryRef;

export function getCategory(vars: GetCategoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetCategoryData, GetCategoryVariables>;
export function getCategory(dc: DataConnect, vars: GetCategoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetCategoryData, GetCategoryVariables>;

interface ListCategoriesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCategoriesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListCategoriesData, undefined>;
  operationName: string;
}
export const listCategoriesRef: ListCategoriesRef;

export function listCategories(options?: ExecuteQueryOptions): QueryPromise<ListCategoriesData, undefined>;
export function listCategories(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListCategoriesData, undefined>;

interface CreateProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateProductData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateProductData, undefined>;
  operationName: string;
}
export const createProductRef: CreateProductRef;

export function createProduct(): MutationPromise<CreateProductData, undefined>;
export function createProduct(dc: DataConnect): MutationPromise<CreateProductData, undefined>;

interface UpdateProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProductVariables): MutationRef<UpdateProductData, UpdateProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProductVariables): MutationRef<UpdateProductData, UpdateProductVariables>;
  operationName: string;
}
export const updateProductRef: UpdateProductRef;

export function updateProduct(vars: UpdateProductVariables): MutationPromise<UpdateProductData, UpdateProductVariables>;
export function updateProduct(dc: DataConnect, vars: UpdateProductVariables): MutationPromise<UpdateProductData, UpdateProductVariables>;

interface DeleteProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProductVariables): MutationRef<DeleteProductData, DeleteProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteProductVariables): MutationRef<DeleteProductData, DeleteProductVariables>;
  operationName: string;
}
export const deleteProductRef: DeleteProductRef;

export function deleteProduct(vars: DeleteProductVariables): MutationPromise<DeleteProductData, DeleteProductVariables>;
export function deleteProduct(dc: DataConnect, vars: DeleteProductVariables): MutationPromise<DeleteProductData, DeleteProductVariables>;

interface GetProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProductVariables): QueryRef<GetProductData, GetProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetProductVariables): QueryRef<GetProductData, GetProductVariables>;
  operationName: string;
}
export const getProductRef: GetProductRef;

export function getProduct(vars: GetProductVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductData, GetProductVariables>;
export function getProduct(dc: DataConnect, vars: GetProductVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductData, GetProductVariables>;

interface ListProductsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProductsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListProductsData, undefined>;
  operationName: string;
}
export const listProductsRef: ListProductsRef;

export function listProducts(options?: ExecuteQueryOptions): QueryPromise<ListProductsData, undefined>;
export function listProducts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListProductsData, undefined>;

interface CreateLocationRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateLocationData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateLocationData, undefined>;
  operationName: string;
}
export const createLocationRef: CreateLocationRef;

export function createLocation(): MutationPromise<CreateLocationData, undefined>;
export function createLocation(dc: DataConnect): MutationPromise<CreateLocationData, undefined>;

interface UpdateLocationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateLocationVariables): MutationRef<UpdateLocationData, UpdateLocationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateLocationVariables): MutationRef<UpdateLocationData, UpdateLocationVariables>;
  operationName: string;
}
export const updateLocationRef: UpdateLocationRef;

export function updateLocation(vars: UpdateLocationVariables): MutationPromise<UpdateLocationData, UpdateLocationVariables>;
export function updateLocation(dc: DataConnect, vars: UpdateLocationVariables): MutationPromise<UpdateLocationData, UpdateLocationVariables>;

interface DeleteLocationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteLocationVariables): MutationRef<DeleteLocationData, DeleteLocationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteLocationVariables): MutationRef<DeleteLocationData, DeleteLocationVariables>;
  operationName: string;
}
export const deleteLocationRef: DeleteLocationRef;

export function deleteLocation(vars: DeleteLocationVariables): MutationPromise<DeleteLocationData, DeleteLocationVariables>;
export function deleteLocation(dc: DataConnect, vars: DeleteLocationVariables): MutationPromise<DeleteLocationData, DeleteLocationVariables>;

interface GetLocationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetLocationVariables): QueryRef<GetLocationData, GetLocationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetLocationVariables): QueryRef<GetLocationData, GetLocationVariables>;
  operationName: string;
}
export const getLocationRef: GetLocationRef;

export function getLocation(vars: GetLocationVariables, options?: ExecuteQueryOptions): QueryPromise<GetLocationData, GetLocationVariables>;
export function getLocation(dc: DataConnect, vars: GetLocationVariables, options?: ExecuteQueryOptions): QueryPromise<GetLocationData, GetLocationVariables>;

interface ListLocationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListLocationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListLocationsData, undefined>;
  operationName: string;
}
export const listLocationsRef: ListLocationsRef;

export function listLocations(options?: ExecuteQueryOptions): QueryPromise<ListLocationsData, undefined>;
export function listLocations(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListLocationsData, undefined>;

interface CreateInventoryItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateInventoryItemVariables): MutationRef<CreateInventoryItemData, CreateInventoryItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateInventoryItemVariables): MutationRef<CreateInventoryItemData, CreateInventoryItemVariables>;
  operationName: string;
}
export const createInventoryItemRef: CreateInventoryItemRef;

export function createInventoryItem(vars: CreateInventoryItemVariables): MutationPromise<CreateInventoryItemData, CreateInventoryItemVariables>;
export function createInventoryItem(dc: DataConnect, vars: CreateInventoryItemVariables): MutationPromise<CreateInventoryItemData, CreateInventoryItemVariables>;

interface UpdateInventoryItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateInventoryItemVariables): MutationRef<UpdateInventoryItemData, UpdateInventoryItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateInventoryItemVariables): MutationRef<UpdateInventoryItemData, UpdateInventoryItemVariables>;
  operationName: string;
}
export const updateInventoryItemRef: UpdateInventoryItemRef;

export function updateInventoryItem(vars: UpdateInventoryItemVariables): MutationPromise<UpdateInventoryItemData, UpdateInventoryItemVariables>;
export function updateInventoryItem(dc: DataConnect, vars: UpdateInventoryItemVariables): MutationPromise<UpdateInventoryItemData, UpdateInventoryItemVariables>;

interface DeleteInventoryItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteInventoryItemVariables): MutationRef<DeleteInventoryItemData, DeleteInventoryItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteInventoryItemVariables): MutationRef<DeleteInventoryItemData, DeleteInventoryItemVariables>;
  operationName: string;
}
export const deleteInventoryItemRef: DeleteInventoryItemRef;

export function deleteInventoryItem(vars: DeleteInventoryItemVariables): MutationPromise<DeleteInventoryItemData, DeleteInventoryItemVariables>;
export function deleteInventoryItem(dc: DataConnect, vars: DeleteInventoryItemVariables): MutationPromise<DeleteInventoryItemData, DeleteInventoryItemVariables>;

interface GetInventoryItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetInventoryItemVariables): QueryRef<GetInventoryItemData, GetInventoryItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetInventoryItemVariables): QueryRef<GetInventoryItemData, GetInventoryItemVariables>;
  operationName: string;
}
export const getInventoryItemRef: GetInventoryItemRef;

export function getInventoryItem(vars: GetInventoryItemVariables, options?: ExecuteQueryOptions): QueryPromise<GetInventoryItemData, GetInventoryItemVariables>;
export function getInventoryItem(dc: DataConnect, vars: GetInventoryItemVariables, options?: ExecuteQueryOptions): QueryPromise<GetInventoryItemData, GetInventoryItemVariables>;

interface ListInventoryItemsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListInventoryItemsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListInventoryItemsData, undefined>;
  operationName: string;
}
export const listInventoryItemsRef: ListInventoryItemsRef;

export function listInventoryItems(options?: ExecuteQueryOptions): QueryPromise<ListInventoryItemsData, undefined>;
export function listInventoryItems(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListInventoryItemsData, undefined>;

interface CreateTransactionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTransactionVariables): MutationRef<CreateTransactionData, CreateTransactionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTransactionVariables): MutationRef<CreateTransactionData, CreateTransactionVariables>;
  operationName: string;
}
export const createTransactionRef: CreateTransactionRef;

export function createTransaction(vars: CreateTransactionVariables): MutationPromise<CreateTransactionData, CreateTransactionVariables>;
export function createTransaction(dc: DataConnect, vars: CreateTransactionVariables): MutationPromise<CreateTransactionData, CreateTransactionVariables>;

interface UpdateTransactionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTransactionVariables): MutationRef<UpdateTransactionData, UpdateTransactionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTransactionVariables): MutationRef<UpdateTransactionData, UpdateTransactionVariables>;
  operationName: string;
}
export const updateTransactionRef: UpdateTransactionRef;

export function updateTransaction(vars: UpdateTransactionVariables): MutationPromise<UpdateTransactionData, UpdateTransactionVariables>;
export function updateTransaction(dc: DataConnect, vars: UpdateTransactionVariables): MutationPromise<UpdateTransactionData, UpdateTransactionVariables>;

interface DeleteTransactionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTransactionVariables): MutationRef<DeleteTransactionData, DeleteTransactionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteTransactionVariables): MutationRef<DeleteTransactionData, DeleteTransactionVariables>;
  operationName: string;
}
export const deleteTransactionRef: DeleteTransactionRef;

export function deleteTransaction(vars: DeleteTransactionVariables): MutationPromise<DeleteTransactionData, DeleteTransactionVariables>;
export function deleteTransaction(dc: DataConnect, vars: DeleteTransactionVariables): MutationPromise<DeleteTransactionData, DeleteTransactionVariables>;

interface GetTransactionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTransactionVariables): QueryRef<GetTransactionData, GetTransactionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetTransactionVariables): QueryRef<GetTransactionData, GetTransactionVariables>;
  operationName: string;
}
export const getTransactionRef: GetTransactionRef;

export function getTransaction(vars: GetTransactionVariables, options?: ExecuteQueryOptions): QueryPromise<GetTransactionData, GetTransactionVariables>;
export function getTransaction(dc: DataConnect, vars: GetTransactionVariables, options?: ExecuteQueryOptions): QueryPromise<GetTransactionData, GetTransactionVariables>;

interface ListTransactionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListTransactionsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListTransactionsData, undefined>;
  operationName: string;
}
export const listTransactionsRef: ListTransactionsRef;

export function listTransactions(options?: ExecuteQueryOptions): QueryPromise<ListTransactionsData, undefined>;
export function listTransactions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListTransactionsData, undefined>;

