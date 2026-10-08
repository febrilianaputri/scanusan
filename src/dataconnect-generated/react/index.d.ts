import { CreateCategoryData, UpdateCategoryData, UpdateCategoryVariables, DeleteCategoryData, DeleteCategoryVariables, GetCategoryData, GetCategoryVariables, ListCategoriesData, CreateProductData, UpdateProductData, UpdateProductVariables, DeleteProductData, DeleteProductVariables, GetProductData, GetProductVariables, ListProductsData, CreateLocationData, UpdateLocationData, UpdateLocationVariables, DeleteLocationData, DeleteLocationVariables, GetLocationData, GetLocationVariables, ListLocationsData, CreateInventoryItemData, CreateInventoryItemVariables, UpdateInventoryItemData, UpdateInventoryItemVariables, DeleteInventoryItemData, DeleteInventoryItemVariables, GetInventoryItemData, GetInventoryItemVariables, ListInventoryItemsData, CreateTransactionData, CreateTransactionVariables, UpdateTransactionData, UpdateTransactionVariables, DeleteTransactionData, DeleteTransactionVariables, GetTransactionData, GetTransactionVariables, ListTransactionsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateCategory(options?: useDataConnectMutationOptions<CreateCategoryData, FirebaseError, void>): UseDataConnectMutationResult<CreateCategoryData, undefined>;
export function useCreateCategory(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCategoryData, FirebaseError, void>): UseDataConnectMutationResult<CreateCategoryData, undefined>;

export function useUpdateCategory(options?: useDataConnectMutationOptions<UpdateCategoryData, FirebaseError, UpdateCategoryVariables>): UseDataConnectMutationResult<UpdateCategoryData, UpdateCategoryVariables>;
export function useUpdateCategory(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateCategoryData, FirebaseError, UpdateCategoryVariables>): UseDataConnectMutationResult<UpdateCategoryData, UpdateCategoryVariables>;

export function useDeleteCategory(options?: useDataConnectMutationOptions<DeleteCategoryData, FirebaseError, DeleteCategoryVariables>): UseDataConnectMutationResult<DeleteCategoryData, DeleteCategoryVariables>;
export function useDeleteCategory(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteCategoryData, FirebaseError, DeleteCategoryVariables>): UseDataConnectMutationResult<DeleteCategoryData, DeleteCategoryVariables>;

export function useGetCategory(vars: GetCategoryVariables, options?: useDataConnectQueryOptions<GetCategoryData>): UseDataConnectQueryResult<GetCategoryData, GetCategoryVariables>;
export function useGetCategory(dc: DataConnect, vars: GetCategoryVariables, options?: useDataConnectQueryOptions<GetCategoryData>): UseDataConnectQueryResult<GetCategoryData, GetCategoryVariables>;

export function useListCategories(options?: useDataConnectQueryOptions<ListCategoriesData>): UseDataConnectQueryResult<ListCategoriesData, undefined>;
export function useListCategories(dc: DataConnect, options?: useDataConnectQueryOptions<ListCategoriesData>): UseDataConnectQueryResult<ListCategoriesData, undefined>;

export function useCreateProduct(options?: useDataConnectMutationOptions<CreateProductData, FirebaseError, void>): UseDataConnectMutationResult<CreateProductData, undefined>;
export function useCreateProduct(dc: DataConnect, options?: useDataConnectMutationOptions<CreateProductData, FirebaseError, void>): UseDataConnectMutationResult<CreateProductData, undefined>;

export function useUpdateProduct(options?: useDataConnectMutationOptions<UpdateProductData, FirebaseError, UpdateProductVariables>): UseDataConnectMutationResult<UpdateProductData, UpdateProductVariables>;
export function useUpdateProduct(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateProductData, FirebaseError, UpdateProductVariables>): UseDataConnectMutationResult<UpdateProductData, UpdateProductVariables>;

export function useDeleteProduct(options?: useDataConnectMutationOptions<DeleteProductData, FirebaseError, DeleteProductVariables>): UseDataConnectMutationResult<DeleteProductData, DeleteProductVariables>;
export function useDeleteProduct(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteProductData, FirebaseError, DeleteProductVariables>): UseDataConnectMutationResult<DeleteProductData, DeleteProductVariables>;

export function useGetProduct(vars: GetProductVariables, options?: useDataConnectQueryOptions<GetProductData>): UseDataConnectQueryResult<GetProductData, GetProductVariables>;
export function useGetProduct(dc: DataConnect, vars: GetProductVariables, options?: useDataConnectQueryOptions<GetProductData>): UseDataConnectQueryResult<GetProductData, GetProductVariables>;

export function useListProducts(options?: useDataConnectQueryOptions<ListProductsData>): UseDataConnectQueryResult<ListProductsData, undefined>;
export function useListProducts(dc: DataConnect, options?: useDataConnectQueryOptions<ListProductsData>): UseDataConnectQueryResult<ListProductsData, undefined>;

export function useCreateLocation(options?: useDataConnectMutationOptions<CreateLocationData, FirebaseError, void>): UseDataConnectMutationResult<CreateLocationData, undefined>;
export function useCreateLocation(dc: DataConnect, options?: useDataConnectMutationOptions<CreateLocationData, FirebaseError, void>): UseDataConnectMutationResult<CreateLocationData, undefined>;

export function useUpdateLocation(options?: useDataConnectMutationOptions<UpdateLocationData, FirebaseError, UpdateLocationVariables>): UseDataConnectMutationResult<UpdateLocationData, UpdateLocationVariables>;
export function useUpdateLocation(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateLocationData, FirebaseError, UpdateLocationVariables>): UseDataConnectMutationResult<UpdateLocationData, UpdateLocationVariables>;

export function useDeleteLocation(options?: useDataConnectMutationOptions<DeleteLocationData, FirebaseError, DeleteLocationVariables>): UseDataConnectMutationResult<DeleteLocationData, DeleteLocationVariables>;
export function useDeleteLocation(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteLocationData, FirebaseError, DeleteLocationVariables>): UseDataConnectMutationResult<DeleteLocationData, DeleteLocationVariables>;

export function useGetLocation(vars: GetLocationVariables, options?: useDataConnectQueryOptions<GetLocationData>): UseDataConnectQueryResult<GetLocationData, GetLocationVariables>;
export function useGetLocation(dc: DataConnect, vars: GetLocationVariables, options?: useDataConnectQueryOptions<GetLocationData>): UseDataConnectQueryResult<GetLocationData, GetLocationVariables>;

export function useListLocations(options?: useDataConnectQueryOptions<ListLocationsData>): UseDataConnectQueryResult<ListLocationsData, undefined>;
export function useListLocations(dc: DataConnect, options?: useDataConnectQueryOptions<ListLocationsData>): UseDataConnectQueryResult<ListLocationsData, undefined>;

export function useCreateInventoryItem(options?: useDataConnectMutationOptions<CreateInventoryItemData, FirebaseError, CreateInventoryItemVariables>): UseDataConnectMutationResult<CreateInventoryItemData, CreateInventoryItemVariables>;
export function useCreateInventoryItem(dc: DataConnect, options?: useDataConnectMutationOptions<CreateInventoryItemData, FirebaseError, CreateInventoryItemVariables>): UseDataConnectMutationResult<CreateInventoryItemData, CreateInventoryItemVariables>;

export function useUpdateInventoryItem(options?: useDataConnectMutationOptions<UpdateInventoryItemData, FirebaseError, UpdateInventoryItemVariables>): UseDataConnectMutationResult<UpdateInventoryItemData, UpdateInventoryItemVariables>;
export function useUpdateInventoryItem(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateInventoryItemData, FirebaseError, UpdateInventoryItemVariables>): UseDataConnectMutationResult<UpdateInventoryItemData, UpdateInventoryItemVariables>;

export function useDeleteInventoryItem(options?: useDataConnectMutationOptions<DeleteInventoryItemData, FirebaseError, DeleteInventoryItemVariables>): UseDataConnectMutationResult<DeleteInventoryItemData, DeleteInventoryItemVariables>;
export function useDeleteInventoryItem(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteInventoryItemData, FirebaseError, DeleteInventoryItemVariables>): UseDataConnectMutationResult<DeleteInventoryItemData, DeleteInventoryItemVariables>;

export function useGetInventoryItem(vars: GetInventoryItemVariables, options?: useDataConnectQueryOptions<GetInventoryItemData>): UseDataConnectQueryResult<GetInventoryItemData, GetInventoryItemVariables>;
export function useGetInventoryItem(dc: DataConnect, vars: GetInventoryItemVariables, options?: useDataConnectQueryOptions<GetInventoryItemData>): UseDataConnectQueryResult<GetInventoryItemData, GetInventoryItemVariables>;

export function useListInventoryItems(options?: useDataConnectQueryOptions<ListInventoryItemsData>): UseDataConnectQueryResult<ListInventoryItemsData, undefined>;
export function useListInventoryItems(dc: DataConnect, options?: useDataConnectQueryOptions<ListInventoryItemsData>): UseDataConnectQueryResult<ListInventoryItemsData, undefined>;

export function useCreateTransaction(options?: useDataConnectMutationOptions<CreateTransactionData, FirebaseError, CreateTransactionVariables>): UseDataConnectMutationResult<CreateTransactionData, CreateTransactionVariables>;
export function useCreateTransaction(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTransactionData, FirebaseError, CreateTransactionVariables>): UseDataConnectMutationResult<CreateTransactionData, CreateTransactionVariables>;

export function useUpdateTransaction(options?: useDataConnectMutationOptions<UpdateTransactionData, FirebaseError, UpdateTransactionVariables>): UseDataConnectMutationResult<UpdateTransactionData, UpdateTransactionVariables>;
export function useUpdateTransaction(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTransactionData, FirebaseError, UpdateTransactionVariables>): UseDataConnectMutationResult<UpdateTransactionData, UpdateTransactionVariables>;

export function useDeleteTransaction(options?: useDataConnectMutationOptions<DeleteTransactionData, FirebaseError, DeleteTransactionVariables>): UseDataConnectMutationResult<DeleteTransactionData, DeleteTransactionVariables>;
export function useDeleteTransaction(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteTransactionData, FirebaseError, DeleteTransactionVariables>): UseDataConnectMutationResult<DeleteTransactionData, DeleteTransactionVariables>;

export function useGetTransaction(vars: GetTransactionVariables, options?: useDataConnectQueryOptions<GetTransactionData>): UseDataConnectQueryResult<GetTransactionData, GetTransactionVariables>;
export function useGetTransaction(dc: DataConnect, vars: GetTransactionVariables, options?: useDataConnectQueryOptions<GetTransactionData>): UseDataConnectQueryResult<GetTransactionData, GetTransactionVariables>;

export function useListTransactions(options?: useDataConnectQueryOptions<ListTransactionsData>): UseDataConnectQueryResult<ListTransactionsData, undefined>;
export function useListTransactions(dc: DataConnect, options?: useDataConnectQueryOptions<ListTransactionsData>): UseDataConnectQueryResult<ListTransactionsData, undefined>;
