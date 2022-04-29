import { IDataService, TFilter, TSort } from '@kickass-admin'
import { Query } from 'appwrite'
import { EFilterOperators } from 'types'

import { appwriteService } from './appwriteService'

const generateAppwriteFilter = (filter: TFilter) => {
    switch (filter?.operator) {
        case EFilterOperators.Eq:
            return Query.equal(filter.field, filter.value)
        case EFilterOperators.Ne:
            return Query.notEqual(filter.field, filter.value)
        case EFilterOperators.Gt:
            return Query.greater(filter.field, filter.value)
        case EFilterOperators.Gte:
            return Query.greaterEqual(filter.field, filter.value)
        case EFilterOperators.Lt:
            return Query.lesser(filter.field, filter.value)
        case EFilterOperators.Lte:
            return Query.lesserEqual(filter.field, filter.value)
        case EFilterOperators.Contains:
            return Query.search(filter.field, `%${filter.value}%`)
        default:
            throw new Error(`Operator ${filter.operator} is not supported`)
    }
}

const generateAppwriteFilters = (filters?: TFilter[]) => {
    if (!filters?.length) {
        return undefined
    }

    const appwriteFilters: string[] = []

    filters.forEach(filter => {
        const filterField = filter?.field === 'id' ? '$id' : filter.field

        appwriteFilters.push(
            generateAppwriteFilter({
                ...filter,
                field: filterField
            })
        )
    })

    return appwriteFilters
}

const createAppwriteSort = (sort?: TSort[]) => {
    if (!sort?.length) {
        return {
            orderField: undefined,
            orderType: undefined
        }
    }

    return sort.reduce(
        (acc, sortItem) => {
            acc.orderField.push(sortItem.field)
            acc.orderType.push(sortItem.order.toUpperCase())

            return acc
        },
        { orderField: [] as string[], orderType: [] as string[] }
    )
}

const createPaginationOffset = (page?: number, perPage?: number) => {
    if (!page || !perPage) {
        return undefined
    }

    return (page - 1) * perPage
}

const dataService: IDataService = {
    async getOne(resource, params) {
        const { $id, ...restResponse } = await appwriteService.database.getDocument(resource, params.id.toString())

        return {
            id: $id,
            ...restResponse
        } as any
    },
    async getMany(resource, params) {
        const responseData = await Promise.all(
            params.ids.map(id => appwriteService.database.getDocument(resource, id.toString()))
        )

        return responseData.map(({ $id, ...restResponseData }) => ({ id: $id, ...restResponseData })) as any
    },
    async getList(resource, params) {
        const appwriteFilters = generateAppwriteFilters(params?.filter)
        const perPage = params?.pagination?.perPage
        const page = params?.pagination?.page
        const paginationOffset = createPaginationOffset(page, perPage)
        const cursor = params?.pagination?.nextCursor?.toString()
        const { orderField, orderType } = createAppwriteSort(params?.sort)

        const { total, documents } = await appwriteService.database.listDocuments(
            resource,
            appwriteFilters,
            perPage,
            paginationOffset,
            cursor,
            undefined, //cursor direction
            orderField,
            orderType
        )

        return {
            data: documents.map(({ $id, ...restData }) => ({
                id: $id,
                ...restData
            })),
            total
        } as any
    },
    async createOne(resource, params) {
        const { $id, ...restResponseData } = await appwriteService.database.createDocument(
            resource,
            'unique()',
            params.payload
        )

        return {
            id: $id,
            ...restResponseData
        } as any
    },
    async createMany(resource, params) {
        const responseData = await Promise.all(
            params.payload.map(item => appwriteService.database.createDocument(resource, 'unique()', item))
        )

        return responseData.map(({ $id, ...restResponseData }) => ({
            id: $id,
            ...restResponseData
        })) as any
    },
    async updateOne(resource, params) {
        const { $id, ...restResponseData } = await appwriteService.database.updateDocument(
            resource,
            params.id.toString(),
            params.payload
        )

        return {
            id: $id,
            ...restResponseData
        } as any
    },
    async updateMany(resource, params) {
        const responseData = await Promise.all(
            params.ids.map(id => appwriteService.database.updateDocument(resource, id.toString(), params.payload))
        )

        return responseData.map(({ $id, ...restResponseData }) => ({
            id: $id,
            ...restResponseData
        })) as any
    },
    async deleteOne(resource, params) {
        await appwriteService.database.deleteDocument(resource, params.id.toString())

        return { id: params.id } as any
    },
    async deleteMany(resource, params) {
        await Promise.all(params.ids.map(id => appwriteService.database.deleteDocument(resource, id.toString())))

        return params.ids.map(id => ({ id })) as any
    }
}

export { dataService }
