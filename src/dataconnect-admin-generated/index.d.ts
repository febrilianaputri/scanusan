import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

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

/** Generated Node Admin SDK operation action function for the 'CreateCategory' Mutation. Allow users to execute without passing in DataConnect. */
export function createCategory(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateCategoryData>>;
/** Generated Node Admin SDK operation action function for the 'CreateCategory' Mutation. Allow users to pass in custom DataConnect instances. */
export function createCategory(options?: OperationOptions): Promise<ExecuteOperationResponse<CreateCategoryData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateCategory' Mutation. Allow users to execute without passing in DataConnect. */
export function updateCategory(dc: DataConnect, vars: UpdateCategoryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateCategoryData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateCategory' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateCategory(vars: UpdateCategoryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateCategoryData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteCategory' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteCategory(dc: DataConnect, vars: DeleteCategoryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteCategoryData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteCategory' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteCategory(vars: DeleteCategoryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteCategoryData>>;

/** Generated Node Admin SDK operation action function for the 'GetCategory' Query. Allow users to execute without passing in DataConnect. */
export function getCategory(dc: DataConnect, vars: GetCategoryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetCategoryData>>;
/** Generated Node Admin SDK operation action function for the 'GetCategory' Query. Allow users to pass in custom DataConnect instances. */
export function getCategory(vars: GetCategoryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetCategoryData>>;

/** Generated Node Admin SDK operation action function for the 'ListCategories' Query. Allow users to execute without passing in DataConnect. */
export function listCategories(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListCategoriesData>>;
/** Generated Node Admin SDK operation action function for the 'ListCategories' Query. Allow users to pass in custom DataConnect instances. */
export function listCategories(options?: OperationOptions): Promise<ExecuteOperationResponse<ListCategoriesData>>;

/** Generated Node Admin SDK operation action function for the 'CreateProduct' Mutation. Allow users to execute without passing in DataConnect. */
export function createProduct(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateProductData>>;
/** Generated Node Admin SDK operation action function for the 'CreateProduct' Mutation. Allow users to pass in custom DataConnect instances. */
export function createProduct(options?: OperationOptions): Promise<ExecuteOperationResponse<CreateProductData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateProduct' Mutation. Allow users to execute without passing in DataConnect. */
export function updateProduct(dc: DataConnect, vars: UpdateProductVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateProductData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateProduct' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateProduct(vars: UpdateProductVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateProductData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteProduct' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteProduct(dc: DataConnect, vars: DeleteProductVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteProductData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteProduct' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteProduct(vars: DeleteProductVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteProductData>>;

/** Generated Node Admin SDK operation action function for the 'GetProduct' Query. Allow users to execute without passing in DataConnect. */
export function getProduct(dc: DataConnect, vars: GetProductVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProductData>>;
/** Generated Node Admin SDK operation action function for the 'GetProduct' Query. Allow users to pass in custom DataConnect instances. */
export function getProduct(vars: GetProductVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProductData>>;

/** Generated Node Admin SDK operation action function for the 'ListProducts' Query. Allow users to execute without passing in DataConnect. */
export function listProducts(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListProductsData>>;
/** Generated Node Admin SDK operation action function for the 'ListProducts' Query. Allow users to pass in custom DataConnect instances. */
export function listProducts(options?: OperationOptions): Promise<ExecuteOperationResponse<ListProductsData>>;

/** Generated Node Admin SDK operation action function for the 'CreateLocation' Mutation. Allow users to execute without passing in DataConnect. */
export function createLocation(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateLocationData>>;
/** Generated Node Admin SDK operation action function for the 'CreateLocation' Mutation. Allow users to pass in custom DataConnect instances. */
export function createLocation(options?: OperationOptions): Promise<ExecuteOperationResponse<CreateLocationData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateLocation' Mutation. Allow users to execute without passing in DataConnect. */
export function updateLocation(dc: DataConnect, vars: UpdateLocationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateLocationData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateLocation' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateLocation(vars: UpdateLocationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateLocationData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteLocation' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteLocation(dc: DataConnect, vars: DeleteLocationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteLocationData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteLocation' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteLocation(vars: DeleteLocationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteLocationData>>;

/** Generated Node Admin SDK operation action function for the 'GetLocation' Query. Allow users to execute without passing in DataConnect. */
export function getLocation(dc: DataConnect, vars: GetLocationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetLocationData>>;
/** Generated Node Admin SDK operation action function for the 'GetLocation' Query. Allow users to pass in custom DataConnect instances. */
export function getLocation(vars: GetLocationVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetLocationData>>;

/** Generated Node Admin SDK operation action function for the 'ListLocations' Query. Allow users to execute without passing in DataConnect. */
export function listLocations(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListLocationsData>>;
/** Generated Node Admin SDK operation action function for the 'ListLocations' Query. Allow users to pass in custom DataConnect instances. */
export function listLocations(options?: OperationOptions): Promise<ExecuteOperationResponse<ListLocationsData>>;

/** Generated Node Admin SDK operation action function for the 'CreateInventoryItem' Mutation. Allow users to execute without passing in DataConnect. */
export function createInventoryItem(dc: DataConnect, vars: CreateInventoryItemVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateInventoryItemData>>;
/** Generated Node Admin SDK operation action function for the 'CreateInventoryItem' Mutation. Allow users to pass in custom DataConnect instances. */
export function createInventoryItem(vars: CreateInventoryItemVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateInventoryItemData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateInventoryItem' Mutation. Allow users to execute without passing in DataConnect. */
export function updateInventoryItem(dc: DataConnect, vars: UpdateInventoryItemVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateInventoryItemData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateInventoryItem' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateInventoryItem(vars: UpdateInventoryItemVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateInventoryItemData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteInventoryItem' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteInventoryItem(dc: DataConnect, vars: DeleteInventoryItemVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteInventoryItemData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteInventoryItem' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteInventoryItem(vars: DeleteInventoryItemVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteInventoryItemData>>;

/** Generated Node Admin SDK operation action function for the 'GetInventoryItem' Query. Allow users to execute without passing in DataConnect. */
export function getInventoryItem(dc: DataConnect, vars: GetInventoryItemVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetInventoryItemData>>;
/** Generated Node Admin SDK operation action function for the 'GetInventoryItem' Query. Allow users to pass in custom DataConnect instances. */
export function getInventoryItem(vars: GetInventoryItemVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetInventoryItemData>>;

/** Generated Node Admin SDK operation action function for the 'ListInventoryItems' Query. Allow users to execute without passing in DataConnect. */
export function listInventoryItems(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListInventoryItemsData>>;
/** Generated Node Admin SDK operation action function for the 'ListInventoryItems' Query. Allow users to pass in custom DataConnect instances. */
export function listInventoryItems(options?: OperationOptions): Promise<ExecuteOperationResponse<ListInventoryItemsData>>;

/** Generated Node Admin SDK operation action function for the 'CreateTransaction' Mutation. Allow users to execute without passing in DataConnect. */
export function createTransaction(dc: DataConnect, vars: CreateTransactionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateTransactionData>>;
/** Generated Node Admin SDK operation action function for the 'CreateTransaction' Mutation. Allow users to pass in custom DataConnect instances. */
export function createTransaction(vars: CreateTransactionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateTransactionData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateTransaction' Mutation. Allow users to execute without passing in DataConnect. */
export function updateTransaction(dc: DataConnect, vars: UpdateTransactionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateTransactionData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateTransaction' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateTransaction(vars: UpdateTransactionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateTransactionData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteTransaction' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteTransaction(dc: DataConnect, vars: DeleteTransactionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteTransactionData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteTransaction' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteTransaction(vars: DeleteTransactionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteTransactionData>>;

/** Generated Node Admin SDK operation action function for the 'GetTransaction' Query. Allow users to execute without passing in DataConnect. */
export function getTransaction(dc: DataConnect, vars: GetTransactionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetTransactionData>>;
/** Generated Node Admin SDK operation action function for the 'GetTransaction' Query. Allow users to pass in custom DataConnect instances. */
export function getTransaction(vars: GetTransactionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetTransactionData>>;

/** Generated Node Admin SDK operation action function for the 'ListTransactions' Query. Allow users to execute without passing in DataConnect. */
export function listTransactions(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListTransactionsData>>;
/** Generated Node Admin SDK operation action function for the 'ListTransactions' Query. Allow users to pass in custom DataConnect instances. */
export function listTransactions(options?: OperationOptions): Promise<ExecuteOperationResponse<ListTransactionsData>>;

